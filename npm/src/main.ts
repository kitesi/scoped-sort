import { parseArgsIntoOptions, tokenizeArgString } from './parser';
import {
    commentRegexs,
    floatRegex,
    getIndentationAndCharRegex,
    isBlankLineRegexTest,
} from './utils';

export { parseArgsIntoOptions, tokenizeArgString };

export type Sorter =
    | 'case-insensitive'
    | 'natural'
    | 'numerical'
    | 'float'
    | 'length'
    | 'none'
    | 'random';

type UniqueOptions = 'exact' | 'case-insensitive';

export interface SortGroup {
    /** the group to sort on */
    group: number;
    sorter?: Exclude<Sorter, 'random'>;
    unique?: UniqueOptions;
    /**
     * By default items that do not match a sorter (numerical, float, ...) or
     * don't match the specified `.regexFilter` will stay in place but be at the
     * top. If this is set to true, it will be at the bottom. Vise versa if `reverse` is set to true.
     */
    attachNonMatchingToBottom?: boolean;
    reverse?: boolean;
}

export interface Options {
    /**
     * case-insensitive: sorts case insensitively
     *
     * natural: sorts based on the [natural sort](https://en.wikipedia.org/wiki/Natural_sort_order)
     *
     * numerical: sorts based on the number of the captured result. if no regex is specified,
     * it will sort by the first number in the line
     *
     * float: sorts based on the float of the captured result. if no regex is specified
     * it will sort by the first float in the line
     *
     * length: sorts based on the length of captured result, short to long
     *
     * none: don't sort, mainly used the unique option
     *
     * random: sorts randomly (psuedo)
     */
    sorter?: Sorter;
    /**
     * This project takes scope/indentation into account. Most sorters just read line by line, so when you have nested lists you end up with undesired sorts.

     * This program by default keeps nested content in place and does not sort the inner items, but setting this option to true will sort the inner items.
     */
    recursive?: boolean;
    /** Reverses the sort after completely finishing. */
    reverse?: boolean;
    /** Removes duplicate items. A value of 'exact' will only remove exact matches, 'case-insensitive' will remove without regard to casing. */
    unique?: UniqueOptions;
    /** Treats the text as a markdown list. You won’t need this option for most markdown lists but in certain instances you will. */
    markdown?: boolean;
    /**
     * A regex to match text in each item/line. By default the sorter will sort based on
     * the text after the match. Text that do no match will be left in place,
     * and will be at the top. The regex language is javascript.
     *
     * A global flag can be used, which will alter the way `.sortGroups` works.
     */
    regexFilter?: RegExp;
    /**
     * Combined with `.regex`, this will instead sort using the matched text rather than the text after.
     *
     * This is short hand for:
     *
     * ```
     * {
     *      sortGroups: [{
     *          group: 1,
     *      }]
     * }
     * ```
     */
    useMatchedRegex?: boolean;
    /** This tells the program how to seperate sections as opposed to lines & identation. */
    sectionSeperator?: RegExp;
    /** This is a way to tell the program when to start a new section as opposed to just comparing indentations. */
    sectionStarter?: RegExp;
    /** Tells the program how to rejoin sections, defaults to "\n" */
    sectionRejoiner?: string;
    /**
     * The seperator to determine columns, defaults to `/\s+/`.
     * Used in combination with `.sortGroups`
     */
    fieldSeperator?: string | RegExp;
    /**
     * Determines what group to use when sorting,
     * used with `.regexFilter` or `.fieldSeperator`.
     *
     * An input of the following:
     *
     * ```js
     * {
     *      sortGroups: [{
     *          group: 2,
     *          sorter: 'length'
     *      }]
     * }
     * ```
     *
     * Would mean to sort lines by the second group's length.
     */
    sortGroups?: SortGroup[];
    /**
     * By default items that do not match a sorter (numerical, float, ...) or
     * don't match the specified `.regexFilter` will stay in place but be at the
     * top. If this is set to true, it will be at the bottom. Vise versa if
     * `reverse` is set to true.
     */
    attachNonMatchingToBottom?: boolean;
    /**
     * Checks for option errors and throws if one or more is found.
     *
     * It's off by default, but recommended to turn on, otherwise you might get
     * unexpected sort results.
     */
    reportErrors?: boolean;
}

const collators = {
    caseInsensitive: new Intl.Collator('en', { sensitivity: 'base' }),
    natural: new Intl.Collator('en', {
        sensitivity: 'base',
        numeric: true,
    }),
};

function calculateSpaceLength(str: string) {
    return str.replace('\t', '    ').length;
}

function validateOptions(options: Options) {
    const errors: string[] = [];

    if (options.regexFilter && options.sorter === 'random') {
        errors.push("Can't use sort-by-random and a regex pattern");
    }

    if (options.useMatchedRegex && options.sorter === 'random') {
        errors.push("Can't use use-matched-regex and sort-by-random");
    }

    if (options.regexFilter && options.fieldSeperator) {
        errors.push("Can't use regex and field-seperator");
    }

    if (options.useMatchedRegex && options.sortGroups) {
        errors.push("Can't use use-matched-regex and sort-groups");
    }

    return errors;
}

function compareSections(
    compareA: string,
    compareB: string,
    options: {
        sorter?: Exclude<Sorter, 'random'>;
        reverse?: boolean;
        attachNonMatchingToBottom?: boolean;
        [k: string]: any;
    }
) {
    if (typeof compareA === 'undefined' && typeof compareB === 'undefined') {
        return 0;
    }

    if (typeof compareA === 'undefined') {
        return options.attachNonMatchingToBottom ? 1 : -1;
    }

    if (typeof compareB === 'undefined') {
        return options.attachNonMatchingToBottom ? -1 : 1;
    }

    let numberA: number | undefined;
    let numberB: number | undefined;

    switch (options.sorter) {
        case 'case-insensitive':
            return collators.caseInsensitive.compare(compareA, compareB);
        case 'natural':
            return collators.natural.compare(compareA, compareB);
        case 'length':
            return [...compareA].length - [...compareB].length;
        case 'numerical':
            numberA = parseInt(compareA);
            numberB = parseInt(compareB);
            break;
        case 'float':
            numberA = parseFloat(compareA);
            numberB = parseFloat(compareB);
            break;
    }

    if (typeof numberA !== 'undefined' && typeof numberB !== 'undefined') {
        if (Number.isNaN(numberA) && Number.isNaN(numberB)) {
            return 0;
        }

        if (Number.isNaN(numberA)) {
            return options.attachNonMatchingToBottom ? 1 : -1;
        }

        if (Number.isNaN(numberB)) {
            return options.attachNonMatchingToBottom ? -1 : 1;
        }

        return numberA - numberB;
    }

    if (compareA > compareB) {
        return 1;
    } else if (compareB > compareA) {
        return -1;
    }

    return 0;
}

function removeDuplicates(
    sections: string[],
    caseInsensitive: boolean,
    sectionCallback?: (section: string) => string
) {
    const haveSeen: Set<string> = new Set();

    for (let i = 0; i < sections.length; i++) {
        let adjustedSection = sections[i];

        if (sectionCallback) {
            adjustedSection = sectionCallback(adjustedSection);
        }

        if (caseInsensitive) {
            adjustedSection = adjustedSection.toLowerCase();
        }

        if (!haveSeen.has(adjustedSection)) {
            haveSeen.add(adjustedSection);
        } else {
            sections.splice(i, 1);
            i--;
        }
    }
}

function getComparasionFromSortGroup(
    columnsA: string[],
    columnsB: string[],
    sortGroup: SortGroup
) {
    return compareSections(
        columnsA[sortGroup.group - 1],
        columnsB[sortGroup.group - 1],
        {
            sorter: sortGroup.sorter,
            attachNonMatchingToBottom: sortGroup.attachNonMatchingToBottom,
        }
    );
}

function getModifiedSections(sections: string[], options: Options) {
    const columnCache: Map<string, string[]> = new Map();

    function getColumns(section: string) {
        if (!columnCache.has(section)) {
            columnCache.set(
                section,
                options.regexFilter
                    ? section.match(options.regexFilter) || []
                    : section.split(options.fieldSeperator!)
            );
        }

        return columnCache.get(section)!;
    }

    if (options.sortGroups) {
        let usedSorterOnce = false;

        for (let i = 0; i < options.sortGroups.length; i++) {
            const sortGroup = options.sortGroups[i];

            if (sortGroup.sorter !== 'none') {
                sections.sort((a, b) => {
                    // just for typing
                    if (!options.sortGroups) return 0;

                    const columnsA = getColumns(a);
                    const columnsB = getColumns(b);

                    const lastSortGroup = options.sortGroups[i - 1];

                    if (usedSorterOnce && lastSortGroup) {
                        const lastResult = getComparasionFromSortGroup(
                            columnsA,
                            columnsB,
                            lastSortGroup
                        );

                        if (lastResult !== 0) {
                            return lastResult;
                        }
                    }

                    const result = getComparasionFromSortGroup(
                        columnsA,
                        columnsB,
                        sortGroup
                    );

                    return sortGroup.reverse ? -result : result;
                });

                usedSorterOnce = true;
            }

            if (sortGroup.unique) {
                removeDuplicates(
                    sections,
                    sortGroup.unique === 'case-insensitive',
                    (section) => getColumns(section)[sortGroup.group - 1]
                );
            }
        }

        return sections;
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
    } else if (options.sorter !== 'none') {
        sections.sort((a, b) => {
            let compareA = a;
            let compareB = b;

            if (options.regexFilter) {
                const matchedA = a.match(options.regexFilter);
                const matchedB = b.match(options.regexFilter);

                if (
                    (!matchedA || typeof matchedA.index === 'undefined') &&
                    (!matchedB || typeof matchedB.index === 'undefined')
                ) {
                    return 0;
                }

                if (!matchedA || typeof matchedA.index === 'undefined') {
                    return options.attachNonMatchingToBottom ? 1 : -1;
                }

                if (!matchedB || typeof matchedB.index === 'undefined') {
                    return options.attachNonMatchingToBottom ? -1 : 1;
                }

                compareA = a.slice(matchedA.index + matchedA[0].length);
                compareB = b.slice(matchedB.index + matchedB[0].length);
            }

            // @ts-ignore
            const result = compareSections(compareA, compareB, options);
            return options.reverse ? -result : result;
        });
    }

    if (options.unique) {
        removeDuplicates(sections, options.unique === 'case-insensitive');
    }

    return sections;
}

function sortInnerSection(lines: string[], index: number, options: Options) {
    const sections: string[] = [];
    let currentIndentation = '';
    let amountAdded = 0;

    for (let i = index; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(getIndentationAndCharRegex);
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

    // start of defaulting options

    if (!options.regexFilter) {
        if (options.sorter === 'numerical') {
            options.useMatchedRegex = true;
            options.regexFilter = /-?\d+/g;
        } else if (options.sorter === 'float') {
            options.useMatchedRegex = true;
            options.regexFilter = floatRegex;
        }
    }

    if (options.useMatchedRegex) {
        options.sortGroups = [
            {
                group: 1,
            },
        ];
    }

    if (options.sortGroups && !options.fieldSeperator && !options.regexFilter) {
        options.fieldSeperator = /\s+/;
    }

    if (!options.sectionRejoiner) {
        options.sectionRejoiner = '\n';
    }

    // set fisrt sort group to default to uppermost options values
    if (options.sortGroups && options.sortGroups[0]) {
        const firstSortGroup = options.sortGroups[0];

        if (
            typeof firstSortGroup.sorter === 'undefined' &&
            options.sorter !== 'random'
        ) {
            firstSortGroup.sorter = options.sorter;
        }

        if (typeof firstSortGroup.reverse === 'undefined') {
            firstSortGroup.reverse = options.reverse;
        }

        if (typeof firstSortGroup.unique === 'undefined') {
            firstSortGroup.unique = options.unique;
        }

        if (typeof firstSortGroup.attachNonMatchingToBottom === 'undefined') {
            firstSortGroup.attachNonMatchingToBottom =
                options.attachNonMatchingToBottom;
        }
    }

    // end of defaulting options

    if (options.sectionSeperator) {
        return getModifiedSections(
            text.split(options.sectionSeperator),
            options
        ).join(options.sectionRejoiner);
    }

    const lines = text.trimEnd().split(/\r?\n/);
    const sections: string[] = [];

    let currentSection: string[] = [];
    let currentIndentation: string | undefined;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(getIndentationAndCharRegex);
        const indentation = match?.groups?.indentation || '';
        const listChar = match?.groups?.char;

        if (typeof currentIndentation === 'undefined') {
            currentIndentation = indentation;
        }

        if (currentSection.length && (!options.markdown || listChar)) {
            if (
                options.sectionStarter
                    ? options.sectionStarter.test(line)
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
    const result = content;

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
