import { parseArgsIntoOptions, tokenizeArgString } from './parser';
import {
    commentRegexs,
    floatRegex,
    getValuesRegex,
    isBlankLineRegexTest,
} from './utils';

export { parseArgsIntoOptions, tokenizeArgString };

export interface Options {
    /**
     * case-insensitive: sorts case insensitively
     *
     * natural: sorts based on the [natural sort](https://en.wikipedia.org/wiki/Natural_sort_order)
     *
     * numerical: sorts based on the number in each line
     *
     * float: sorts based on the float in each line
     *
     * length: sorts based on the length of each item, short to long
     *
     * random: sorts randomly (psuedo)
     */
    sorter?:
        | 'case-insensitive'
        | 'natural'
        | 'numerical'
        | 'float'
        | 'length'
        | 'random';
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
    /** A regex to match text in each item/line, the sorter will sort based on the text after the match. text that do no match will be left in place, and will be at the top. The regex language is javascript */
    regexFilter?: RegExp;
    /** Combined with .regex, this will instead sort using the matched text rather than the text afer. */
    useMatchedRegex?: boolean;
    /** This is a way to tell the program when to start a new section as opposed to just comparing indentations. */
    sectionSeperator?: RegExp;
    /**
     * By default items that do not match a sorter (numerical, float, ...) or
     * don't match the specified `.regexFilter` will stay in place but be at the
     * top. If this is set to true, it will be at the bottom
     */
    nonMatchingToBottom?: boolean;
    /** if true, checks for option errors and throws if one or more is found */
    reportErrors?: boolean;
}

function calculateSpaceLength(str: string) {
    return str.replace('\t', '    ').length;
}

function validateOptions(options: Options) {
    const errors: string[] = [];

    if (options.regexFilter && options.sorter === 'random') {
        errors.push("You can't sort by random and use a regex pattern");
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

    if (options.sorter === 'numerical' || options.sorter === 'float') {
        options.useMatchedRegex = true;
    }

    if (!options.regexFilter) {
        if (options.sorter === 'numerical') {
            options.regexFilter = /-?\d+/;
        }

        if (options.sorter === 'float') {
            options.regexFilter = floatRegex;
        }
    }

    //  Fisher Yates Shuffle from https://stackoverflow.com/a/2450976/
    if (options.sorter === 'random') {
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
                    return options.nonMatchingToBottom ? 1 : -1;
                }

                if (!matchedB || typeof matchedB.index === 'undefined') {
                    return options.nonMatchingToBottom ? -1 : 1;
                }

                if (options.useMatchedRegex) {
                    compareA = matchedA[0];
                    compareB = matchedB[0];
                } else {
                    compareA = a.slice(matchedA.index + matchedA[0].length);
                    compareB = b.slice(matchedB.index + matchedB[0].length);
                }
            }

            switch (options.sorter) {
                case 'case-insensitive':
                    return collators.caseInsensitive.compare(
                        compareA,
                        compareB
                    );
                case 'natural':
                    return collators.natural.compare(compareA, compareB);
                case 'numerical':
                    return parseInt(compareA) - parseInt(compareB);
                case 'float':
                    return parseFloat(compareA) - parseFloat(compareB);
                case 'length':
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
            const adjustedSection =
                options.sorter === 'case-insensitive'
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

        // in the main function, it doesn't check if the indentation is empty,
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

/**
 * Main functionality of package, sorts text and takes in options.
 *
 * ```js
 * const result = sort(`Naruto
 * Bleach
 * Goku`);
 *
 * result;
 * // Bleach
 * // Goku
 * // Naruto
 * ```
 */
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

interface CommentSection {
    startLine: number;
    endLine: number | null;
    hasChanged: boolean;
}

/**
 * Sorts [sort-comments](https://scopedsort.netlify.app/docs#sort-comments) inside of the provided content.
 *
 * ```js
 * const result = sortComments(`// { sort-start --numerical-sort }
 * there are 200 people here
 * very much indeed, compared to our 20 back home
 * // { sort-end }`);
 *
 * result;
 * // // { sort-start --numerical-sort }
 * // very much indeed, compared to our 20 back home
 * // there are 200 people here
 * // // { sort-end }`
 * ```
 */
export function sortComments(content: string): {
    commentSections: CommentSection[];
    errors: string[];
    result: string;
} {
    const lines = content.split('\n');
    const commentSections: CommentSection[] = [];
    const errors: string[] = [];
    let result = content;

    let currentStartLine: number | undefined = undefined;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.includes('{ sort-ignore-file }')) {
            return { commentSections, errors, result };
        }

        if (commentRegexs.sortStart.test(line)) {
            if (typeof currentStartLine !== 'undefined') {
                errors.push(
                    `Recieved sort-start comment at line: ${
                        i + 1
                    } but didn't finish the one at ${currentStartLine}`
                );

                return { commentSections, errors, result };
            }

            currentStartLine = i;

            commentSections.push({
                startLine: i,
                endLine: null,
                hasChanged: false,
            });
        } else if (commentRegexs.sortEnd.test(line)) {
            if (typeof currentStartLine === 'undefined') {
                errors.push(
                    `Recieved sort-end comment at line: ${
                        i + 1
                    } but didn't receive any sort-start`
                );

                return { commentSections, errors, result };
            }

            commentSections[commentSections.length - 1].endLine = i;

            const section = lines.slice(currentStartLine + 1, i).join('\n');
            const sortArgs =
                lines[currentStartLine].match(commentRegexs.sortStart)?.groups
                    ?.args || '';
            let options: Options = {};

            if (sortArgs !== '') {
                const optionsResult = parseArgsIntoOptions(
                    tokenizeArgString(sortArgs)
                );

                if (optionsResult.errors.length > 0) {
                    errors.push(
                        ...optionsResult.errors.map(
                            (e) => e + ' at line ' + (currentStartLine! + 1)
                        )
                    );
                }

                if (optionsResult.positionals.length > 0) {
                    errors.push(
                        'Recieved unknown positional arguments: ' +
                            optionsResult.positionals.join(', ')
                    );
                }

                if (
                    optionsResult.positionals.length > 0 ||
                    optionsResult.errors.length > 0
                ) {
                    currentStartLine = undefined;
                    continue;
                }

                options = optionsResult.options;
            }

            try {
                const sortedSection = sort(section, options);

                if (sortedSection !== section) {
                    commentSections[commentSections.length - 1].hasChanged =
                        true;

                    const deleteCount = i - currentStartLine - 1;
                    const itemsToAdd = sortedSection.split(/\r?\n/);

                    lines.splice(
                        currentStartLine + 1,
                        deleteCount,
                        ...itemsToAdd
                    );
                    i -= deleteCount - itemsToAdd.length;
                }
            } catch (err: any) {
                errors.push(err);
            }

            currentStartLine = undefined;
        }
    }

    if (typeof currentStartLine !== 'undefined') {
        errors.push(
            'Did not finish sort-start comment at line: ' +
                (currentStartLine + 1)
        );
    }
    return {
        errors,
        commentSections: commentSections,
        result: lines.join('\n'),
    };
}
