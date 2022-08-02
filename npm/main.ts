const getValuesRegex = /^(?<indentation>\s*)(?<char>[-*+])?/;
// from https://stackoverflow.com/a/12643073/, doesn't support more complex floats
// like 2.3e23, I'm not too experienced with those floats so I'll hold off for now
export const floatRegex = /[+-]?([0-9]*[.])?[0-9]+/;

const isBlankLineRegexTest = /^\s*$/;

export interface Options {
    recursive?: boolean;
    reverse?: boolean;
    unique?: boolean;
    caseInsensitive?: boolean;
    sortNumerically?: boolean;
    sortRandomly?: boolean;
    sortNaturally?: boolean;
    sortByFloat?: boolean;
    sortByLength?: boolean;
    markdown?: boolean;
    useMatchedRegex?: boolean;
    regexFilter?: RegExp;
    sectionSeperator?: RegExp;
    reportErrors?: boolean;
}

function calculateSpaceLength(str: string) {
    return str.replace('\t', '    ').length;
}

function validateOptions(options: Options) {
    const errors: string[] = [];

    if (options.regexFilter) {
        if (options.sortRandomly) {
            errors.push("You can't sort by random and use a regex pattern");
        }

        if (options.sortNaturally) {
            errors.push("You can't sort naturally and use a regex pattern");
        }
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

function generateSortByRegex(regex: RegExp, options: Options) {
    return function (a: string, b: string) {
        const matchedA = a.match(regex);
        const matchedB = b.match(regex);

        if (!matchedB || typeof matchedB.index === 'undefined') {
            return 1;
        }

        if (!matchedA || typeof matchedA.index === 'undefined') {
            return -1;
        }

        let compareA = matchedA[0];
        let compareB = matchedB[0];

        if (!options.useMatchedRegex) {
            compareA = a.slice(matchedA.index + compareA.length);
            compareB = b.slice(matchedB.index + compareB.length);
        }

        if (options.caseInsensitive) {
            compareA = compareA.toLowerCase();
            compareB = compareB.toLowerCase();
        }

        if (options.sortNumerically) {
            return parseInt(compareA) - parseInt(compareB);
        }

        if (options.sortByFloat) {
            return parseFloat(compareA) - parseFloat(compareB);
        }

        if (options.sortByLength) {
            return [...compareA].length - [...compareB].length;
        }

        if (compareA > compareB) {
            return 1;
        } else if (compareB > compareA) {
            return -1;
        }

        return 0;
    };
}

function getModifiedSections(sections: string[], options: Options) {
    if (options.regexFilter) {
        sections.sort(generateSortByRegex(options.regexFilter, options));
    } else if (options.sortNaturally) {
        sections.sort((a, b) =>
            a.localeCompare(b, 'en', { sensitivity: 'base', numeric: true })
        );
    } else if (options.sortNumerically) {
        sections.sort(
            generateSortByRegex(/-?\d+/, { ...options, useMatchedRegex: true })
        );
    } else if (options.sortByFloat) {
        sections.sort(
            generateSortByRegex(floatRegex, {
                ...options,
                useMatchedRegex: true,
            })
        );
    } else if (options.sortByLength) {
        sections.sort((a, b) => [...a].length - [...b].length);
    } else if (options.sortRandomly) {
        //  Fisher Yates Shuffle from https://stackoverflow.com/a/2450976/
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
    } else if (options.caseInsensitive) {
        // faster: https://stackoverflow.com/a/52369951/15021883
        const collator = new Intl.Collator('en', { sensitivity: 'base' });
        sections.sort((a, b) => collator.compare(a, b));
    } else {
        sections.sort();
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
