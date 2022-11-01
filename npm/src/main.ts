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
    | 'month'
    | 'day'
    | 'none'
    | 'random';

type UniqueOptions = 'exact' | 'case-insensitive';

export interface SortGroup {
    /** the group to sort on. (1-index based) */
    group: number;
    /** View `Options['sorter']` */
    sorter?: Exclude<Sorter, 'random'>;
    /** View `Options['unique']` */
    unique?: UniqueOptions;
    /** View `Options['attachNonMatchingToBottom']` */
    attachNonMatchingToBottom?: boolean;
    /** View `Options['reverse']` */
    reverse?: boolean;
    /** View `Options['sortOrder']` */
    sortOrder?: SortOrder;
}

export interface SortOrder {
    /** An array of strings to determine what comes before and after. */
    values: string[];
    /**
     * Compare the results case insensitively. This does not modify `.values[]` in anyway.
     * So if this is set to true, make sure all your elements in `.values[]` are all lowercase.
     */
    caseInsensitive?: boolean;
    /**
     * Take part of the start of the captured result before comparing. For example
     * a looseness of 3 will take "january" and convert it to "jan" before comparing.
     *
     * ```js
     * {
     *      sortOrder: {
     *          values: ["jan", "feb", "mar", ...],
     *          caseInsenitive: true,
     *          looseness: 3
     *      },
     *      regexFilter: /january|february|march|april|may|june|july.../i
     * }
     * ```
     *
     * This will only match full matching month names, but will compare the first 3 letters to `.values[]`.
     * This does not modify `.values[]` in any way, so make sure all your elements in `.values[]` have
     * the same length as `looseness`.
     */
    looseness?: number;
}

export interface Options {
    /**
     * Sets the sorter used. Some of these sorters have side-effects and sets values to other options.
     * If no sorter is specified, it will sort using the default `.sort()`.
     *
     * case-insensitive: sort case insensitively on the captured result.
     *
     * natural: sort [naturally](https://en.wikipedia.org/wiki/Natural_sort_order) based on the captured result.
     *
     * numerical: sort based on the number of the captured result. If no regex is
     * specified, it will sort by the first number in the line.
     *
     * float: sort based on the float of the captured result. If no regex is
     * specified, it will sort by the first float in the line.
     *
     * length: sort based on the length of the captured result, short to long.
     *
     * month: sort by the month of the captured result (jan, feb, mar, ..). If
     * no regex or field-separator is specified, it will sort by the first text
     * that matches /jan|feb|mar|../.
     *
     * day: sort by the day of the captured result (mon, tue, wed,..). If no
     * regex or field-separator is specified, it will sort by the first text
     * that matches /mon|tue|wed|../.
     *
     * none: don't sort; mainly used the unique option
     *
     * random: sort randomly (psuedo)
     */
    sorter?: Sorter;
    /**
     * This project takes scope/indentation into consideration and does not just
     * sort line by line.
     *
     * By default, nested content (indented) will be left in place and not sorted.
     * If set to true (no number argument), will sort inner sections recursively.
     * Otherwise, will only sort sections up to the provided depth.
     */
    recursive?: boolean | number;
    /** Reverse the sort comparasion. */
    reverse?: boolean;
    /**
     * Remove duplicate lines. If “case-insensitive” is provided, duplicates
     * will be removed without regard to casing.
     */
    unique?: UniqueOptions;
    /** 
     * Treat the text as a markdown list. You won’t need this option for most
     * markdown lists but in certain instances you will.
     
     * Usually the program starts a new section if the indentation changes, but
     * with this, it’ll wait for ”*”, ”-”, or ”+“.
     */
    markdown?: boolean;
    /**
     * A regex to match text in each item. By default, the sorter will use the
     * text after the match. Text that do no match will be left in place, and
     * will be at the top. The regex language is JavaScript.
     
     * A global flag (g) can be used, which will alter the way #sort-groups
     * works.  An “i” flag can also be used
     */
    regexFilter?: RegExp;
    /**
     * Combined with `.regexFilter`, this will sort using the first matched text rather than the text after.
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
    /**
     * Tell the program when to separate sections as opposed to lines &
     * indentation. Lines are not read at all, and the text is split on every
     * instance of the given value.
     */
    sectionSeparator?: RegExp;
    /**
     * Tell the program when to start a new section as opposed to lines &
     * indentation. The difference it has with `.sectionSeparator` is that lines
     * are still read through, and whenever a line tested against this regex
     * passes, a new section is started.
     */
    sectionStarter?: RegExp;
    /** Tell the program how to rejoin sections, defaults to "\n". */
    sectionRejoiner?: string;
    /**
     * The separator used to determine columns, defaults to /\s+/ if no regex is specified.
     * Use in combination with `.sortGroups`
     */
    fieldSeparator?: string | RegExp;
    /**
     * Determines what group(s) to use when sorting.
     * Used with `.regexFilter` or `.fieldseparator`.
     *
     * If no regex or field-separator is provided, field-separator will default to `/\s+/`,
     * and groups will be split by whitespace.
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
     * Would tell the program to sort lines by the second group's length.
     * The first sort-group will inherit the uppermost option values
     * (reverse, unique, sorter, attachNonMatchingToBottom, sortOrder).
     */
    sortGroups?: SortGroup[];
    /**
     * By default, items that do not match a sorter (numerical, float, …) or
     * regex will stay in place and be set at the top. If this is set to true,
     * it will be at the bottom. Vise versa if `.reverse` is set to true.
     */
    attachNonMatchingToBottom?: boolean;
    /**
     * Determine the sort order of the captured results. You
     * list the values you want to validate in the `.values[]` property,
     * and the program sorts based on the position of the captured result
     * in that list.
     *
     * The list is strict (except for case-insensitivity & looseness if specified),
     * and the captured result will need to match exactly.
     *
     * This does not command the program to search for anything, so
     * usually you will need to have a `regexFilter` or a sort-group.
     *
     * For example, `sorter: "month"` is just syntactic sugar for:
     *
     * ```js
     * {
     *      sortOrder: {
     *          values: ["jan", "feb", "mar", ...],
     *          caseInsenitive: true,
     *          looseness: 3
     *      },
     *      regexFilter: /jan|feb|mar|apr|may|jun|jul.../i
     * }
     * ```
     *
     */
    sortOrder?: SortOrder;
    /**
     * Checks for option errors and throws if one or more is found.
     * On by default, not recommended to turn off.
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
    // if it's undefined, that's fine, since it should default to true
    if (options.reportErrors === false) {
        return;
    }

    const errors: string[] = [];

    if (options.regexFilter && options.sorter === 'random') {
        errors.push("Can't use random-sort and regex");
    }

    if (options.useMatchedRegex && options.sorter === 'random') {
        errors.push("Can't use use-matched-regex and random-sort");
    }

    if (options.regexFilter && options.fieldSeparator) {
        errors.push("Can't use regex and field-separator");
    }

    if (options.useMatchedRegex && options.sortGroups) {
        errors.push("Can't use use-matched-regex and sort-groups");
    }

    if (
        (options.sorter === 'month' || options.sorter === 'day') &&
        options.sortOrder
    ) {
        errors.push("Can't use month-sort or day-sort with sort-order");
    }

    if (errors.length > 0) {
        throw new Error(errors.join('\n'));
    }
}

function compareSections(
    compareA: string,
    compareB: string,
    options: {
        sorter?: Exclude<Sorter, 'random'>;
        reverse?: boolean;
        attachNonMatchingToBottom?: boolean;
        sortOrder?: SortOrder;
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

    if (options.sortOrder) {
        if (options.sortOrder.looseness) {
            compareA = compareA.slice(0, options.sortOrder.looseness);
            compareB = compareB.slice(0, options.sortOrder.looseness);
        }

        if (options.sortOrder.caseInsensitive) {
            compareA = compareA.toLowerCase();
            compareB = compareB.toLowerCase();
        }

        const indexOfA = options.sortOrder.values.indexOf(compareA);
        const indexOfB = options.sortOrder.values.indexOf(compareB);

        if (indexOfA === -1 && indexOfB === -1) {
            return 0;
        }

        if (indexOfA === -1) {
            return options.attachNonMatchingToBottom ? 1 : -1;
        }

        if (indexOfB === -1) {
            return options.attachNonMatchingToBottom ? -1 : 1;
        }

        return (
            options.sortOrder.values.indexOf(compareA) -
            options.sortOrder.values.indexOf(compareB)
        );
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
            sortOrder: sortGroup.sortOrder,
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
                    : section.split(options.fieldSeparator!)
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

    if (options.sorter === 'random') {
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

function sortInnerSection(
    lines: string[],
    index: number,
    level: number,
    options: Options
) {
    let sections: string[] = [];
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
            const child = sortInnerSection(lines, i, level + 1, options);
            sections[sections.length - 1] += '\n' + child.content;
            i += child.amountAdded - 1;
            amountAdded += child.amountAdded;
        } else {
            break;
        }
    }

    // either number>0 or true, since this function is only called then
    if (typeof options.recursive !== 'number' || level <= options.recursive) {
        sections = getModifiedSections(sections, options);
    }

    return {
        content: sections.join(options.sectionRejoiner),
        amountAdded,
    };
}

/**
 * Main functionality of package, sorts text and takes in options.
 * This will mutate the options object, as a lot of the properties
 * are shorthand for other properties.
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
    validateOptions(options);

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

    if (options.sorter === 'month') {
        options.sortOrder = {
            values: [
                'jan',
                'feb',
                'mar',
                'apr',
                'may',
                'jun',
                'jul',
                'aug',
                'sep',
                'oct',
                'nov',
                'dec',
            ],
            caseInsensitive: true,
            looseness: 3,
        };

        if (!options.regexFilter && !options.fieldSeparator) {
            options.regexFilter =
                /jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i;
        }

        if (!options.sortGroups || options.sortGroups.length === 0) {
            options.useMatchedRegex = true;
        }

        options.sorter = undefined;
    }

    if (options.sorter === 'day') {
        options.sortOrder = {
            values: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
            caseInsensitive: true,
            looseness: 3,
        };

        if (!options.regexFilter && !options.fieldSeparator) {
            options.regexFilter = /mon|tue|wed|thu|fri|sat|sun/i;
        }

        if (!options.sortGroups || options.sortGroups.length === 0) {
            options.useMatchedRegex = true;
        }

        options.sorter = undefined;
    }

    if (options.useMatchedRegex) {
        options.sortGroups = [
            {
                group: 1,
            },
        ];

        options.useMatchedRegex = false;
    }

    if (options.sortGroups && !options.fieldSeparator && !options.regexFilter) {
        options.fieldSeparator = /\s+/;
    }

    if (!options.sectionRejoiner) {
        options.sectionRejoiner = '\n';
    }

    // set first sort group to default to uppermost options values
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

        if (typeof firstSortGroup.sortOrder === 'undefined') {
            firstSortGroup.sortOrder = options.sortOrder;
        }
    }

    // end of defaulting options

    validateOptions(options);

    if (options.sectionSeparator) {
        return getModifiedSections(
            text.split(options.sectionSeparator),
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
                const child = sortInnerSection(lines, i, 0, options);
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
 * const { result } = sortComments(`// { sort-start --numerical-sort }
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
