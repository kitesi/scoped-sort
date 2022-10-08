const getValuesRegex = /^(?<indentation>\s*)(?<char>[-*+])?/;
// from https://stackoverflow.com/a/12643073/, doesn't support more complex floats
// like 2.3e23, I'm not too experienced with those floats so I'll hold off for now
export const floatRegex = /[+-]?([0-9]*[.])?[0-9]+/;

const isBlankLineRegexTest = /^\s*$/;

export interface Options {
    /** Makes the sort case insensitively. */
    caseInsensitive?: boolean;
    /**
     * This project takes scope/indentation into account. Most sorters just read line by line, so when you have nested lists you end up with undesired sorts.

     * This program by default keeps nested content in place and does not sort the inner items, but setting this option to true will sort the inner items.
     */
    recursive?: boolean;
    /** Reverses the sort after completely finishing. */
    reverse?: boolean;
    /** Removes duplicate items. */
    unique?: boolean;
    /** Treats the text as a markdown list. You won’t need this option for most markdown lists but in certain instances you will. */
    markdown?: boolean;
    /** Sorts based on the number in each line. All the lines which do not have a number will be left in place. */
    sortNumerically?: boolean;
    /** Sorts randomly (psuedo). */
    sortRandomly?: boolean;
    /** Sorts based on the [natural sort](https://en.wikipedia.org/wiki/Natural_sort_order). */
    sortNaturally?: boolean;
    /** Sorts based on the float in each line. All the lines which do not have a float will be left in place. */
    sortByFloat?: boolean;
    /** Sorts based on the length of each line, short to long. */
    sortByLength?: boolean;
    /** Combined with .regex, this will instead sort using the matched text rather than the text afer. */
    useMatchedRegex?: boolean;
    /** A regex to match text in each item/line, the sorter will sort based on the text after the match. text that do no match will be left in place, and will be at the top. The regex language is javascript */
    regexFilter?: RegExp;
    /** This is a way to tell the program when to start a new section as opposed to just comparing indentations. */
    sectionSeperator?: RegExp;
    /** if true, checks for option errors and throws if one or more is found */
    reportErrors?: boolean;
}

function calculateSpaceLength(str: string) {
    return str.replace('\t', '    ').length;
}

function validateOptions(options: Options) {
    const errors: string[] = [];

    if (options.regexFilter && options.sortRandomly) {
        errors.push("You can't sort by random and use a regex pattern");
    }

    const sorterDescriptions: {
        [Key in keyof Options]: string;
    } = {
        sortNaturally: 'naturally',
        sortByFloat: 'by float',
        sortByLength: 'by length',
        sortNumerically: 'numerically',
        sortRandomly: 'randomly',
    };

    const possibleSorters = Object.keys(
        sorterDescriptions
    ) as (keyof Options)[];
    const usedSorters: (keyof Options)[] = [];

    for (const sorter of possibleSorters) {
        if (options[sorter]) {
            usedSorters.push(sorter);
        }
    }

    if (usedSorters.length > 1) {
        errors.push(
            "You can't use more than one sorter: " +
                usedSorters.map((s) => sorterDescriptions[s]).join(', ')
        );
    }

    if (usedSorters.length >= 1 && options.caseInsensitive && !options.unique) {
        errors.push(
            "You can't use sort case-insensitive and a sorter without the unique option"
        );
    }

    return errors;
}

function getModifiedSections(sections: string[], options: Options) {
    const collators = {
        caseInsensitive: new Intl.Collator('en', { sensitivity: 'base' }),
        natural: new Intl.Collator('en', {
            sensitivity: 'base',
            numeric: true,
        }),
    };

    if (options.sortNumerically || options.sortByFloat) {
        options.useMatchedRegex = true;
    }

    if (!options.regexFilter) {
        if (options.sortNumerically) {
            options.regexFilter = /-?\d+/;
        }

        if (options.sortByFloat) {
            options.regexFilter = floatRegex;
        }
    }

    //  Fisher Yates Shuffle from https://stackoverflow.com/a/2450976/
    if (options.sortRandomly) {
        let currentIndex = sections.length;
        let randomIndex: number;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [sections[currentIndex], sections[randomIndex]] = [
                sections[randomIndex],
                sections[currentIndex],
            ];
        }
    } else {
        sections.sort((a, b) => {
            let compareA = a;
            let compareB = b;

            if (options.regexFilter) {
                let matchedA = a.match(options.regexFilter);
                let matchedB = b.match(options.regexFilter);

                if (!matchedA || typeof matchedA.index === 'undefined') {
                    return -1;
                }

                if (!matchedB || typeof matchedB.index === 'undefined') {
                    return 1;
                }

                if (options.useMatchedRegex) {
                    compareA = matchedA[0];
                    compareB = matchedB[0];
                } else {
                    compareA = a.slice(matchedA.index + matchedA[0].length);
                    compareB = b.slice(matchedB.index + matchedB[0].length);
                }
            }

            if (options.caseInsensitive) {
                return collators.caseInsensitive.compare(compareA, compareB);
            } else if (options.sortNumerically) {
                return parseInt(compareA) - parseInt(compareB);
            } else if (options.sortNaturally) {
                return collators.natural.compare(compareA, compareB);
            } else if (options.sortByFloat) {
                return parseFloat(compareA) - parseFloat(compareB);
            } else if (options.sortByLength) {
                return [...compareA].length - [...compareB].length;
            }

            if (compareA > compareB) {
                return 1;
            } else if (compareB > compareA) {
                return -1;
            }

            return 0;
        });
    }

    if (options.reverse) {
        sections.reverse();
    }

    if (options.unique) {
        const haveSeen: Set<string> = new Set();
        const unique = [];

        for (const section of sections) {
            const adjustedSection = options.caseInsensitive
                ? section.toLowerCase()
                : section;

            if (!haveSeen.has(adjustedSection)) {
                unique.push(section);
                haveSeen.add(adjustedSection);
            }
        }

        return unique;
    }

    return sections;
}

function sortInnerSection(lines: string[], index: number, options: Options) {
    const sections: string[] = [];
    let currentIndentation = '';
    let amountAdded = 0;

    for (let i = index; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(getValuesRegex);
        const indentation = match?.groups?.indentation || '';
        const listChar = match?.groups?.char;

        // in the main function doesn't check if the indentation is empty,
        // because that's fine for the outermost level, since this is an innerSection
        // sort, it can't be just an empty indentation or ''
        if (!currentIndentation && indentation !== '') {
            currentIndentation = indentation;
        }

        const indentationLength = calculateSpaceLength(indentation);
        const currentIndentationLength =
            calculateSpaceLength(currentIndentation);

        if (
            (options.markdown && !listChar) ||
            isBlankLineRegexTest.test(line)
        ) {
            amountAdded++;
            sections[sections.length - 1] += '\n' + line;
        } else if (indentationLength === currentIndentationLength) {
            amountAdded++;
            sections.push(line);
        } else if (indentationLength > currentIndentationLength) {
            const child = sortInnerSection(lines, i, options);
            sections[sections.length - 1] += '\n' + child.content;
            i += child.amountAdded - 1;
            amountAdded += child.amountAdded;
        } else {
            break;
        }
    }

    return {
        content: getModifiedSections(sections, options).join('\n'),
        amountAdded,
    };
}

export function sort(text: string, options: Options = {}) {
    if (options.reportErrors) {
        const errors = validateOptions(options);

        if (errors.length) {
            throw new Error(errors.join('\n'));
        }
    }

    const lines = text.trimEnd().split(/\r?\n/);
    let sections = [];
    let currentSection: string[] = [];
    let currentIndentation: string | undefined;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(getValuesRegex);
        const indentation = match?.groups?.indentation || '';
        const listChar = match?.groups?.char;

        if (typeof currentIndentation === 'undefined') {
            currentIndentation = indentation;
        }

        if (currentSection.length && (!options.markdown || listChar)) {
            if (
                options.sectionSeperator
                    ? options.sectionSeperator.test(line)
                    : !isBlankLineRegexTest.test(line) &&
                      indentation === currentIndentation
            ) {
                sections.push(currentSection.join('\n'));
                currentSection = [line];
            } else if (options.recursive) {
                const child = sortInnerSection(lines, i, options);
                currentSection.push(child.content);
                i += child.amountAdded - 1;
            } else {
                currentSection.push(line);
            }
        } else {
            currentSection.push(line);
        }
    }

    if (currentSection.length) {
        sections.push(currentSection.join('\n'));
    }

    return getModifiedSections(sections, options).join('\n');
}
