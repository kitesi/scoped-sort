import type { Options, Sorter, SortGroup } from './main';

const isRegexTest = /^\/.+\/\w*$/;

// tests entire string/line
export const isValidSortGroupTest =
    /^(\{\d+(,\d+|\.\.\d+)*\}(_?(?<![a-zA-Z])[a-zA-Z]=[a-zA-Z0-9]+(_|$|{)|[a-zA-Z])*,?)*$/;

// Since there is a big check upfront, the following regex(s) can be simplified
// and just be things like {.+} instead of \{\d+(,\d+|\.\.\d+)*\}. Can also use the i flag
// might be a future task

// example: {34}abc,{1..2}cx_u=i, matches ["{3}abc", "{1..2}xc_u=i"]
export const sortGroupMatchRegex =
    /\{\d+(,\d+|\.\.\d+)*\}(_?(?<![a-zA-Z])[a-zA-Z]=[a-zA-Z0-9]+(_|$|{)|[a-zA-Z])*/g;

// example: {34}abc, matches ["{34}abc", "34", "abc"]
export const sortGroupInnerValuesMatchRegex = /\{(.+)\}(.*)/;
// example: abc, matches ["a", "b", "c"]
export const sortGroupArgsMatchRegex = /[a-zA-Z](=[^_$]+)?/g;

/**
 * Parses a string into regex.
 */
function parseStringAsRegex(arg: string, allowsGlobal: boolean) {
    const matches = arg.match(/^\/(.+)\/(\w*)$/);

    if (!matches || !matches[1]) {
        throw new Error(`Expected regex, got: '${arg}'`);
    }

    const { 1: source, 2: flags } = matches;

    if (flags) {
        for (let i = 0; i < flags.length; i++) {
            if (flags[i] === 'g') {
                if (!allowsGlobal) {
                    throw new Error('The g flag is not allowed here');
                }

                continue;
            }

            if (flags[i] !== 'i') {
                throw new Error(
                    `The only regex flag allowed is 'i'. Recieved: '${flags}'`
                );
            }
        }
    }

    try {
        return new RegExp(source, flags);
    } catch (e) {
        throw new Error(
            `Tried to parse "${arg}" as a regex, failed with: ` +
                (e as Error)?.message
        );
    }
}

/**
 * Takes in a string of arguments and outputs an array for `parseArgsIntoOptions()`.
 *
 * ```js
 * tokenizeArgString('--random --hi there you -su');
 * // => ['--random', '--hi', 'there', 'you', '-su']
 * ```
 */
export function tokenizeArgString(argString: string): string[] {
    const args: string[] = [];

    let opening = '';
    let currentArgIndex = 0;

    for (let i = 0; i < argString.length; i++) {
        const char = argString[i];

        if (typeof args[currentArgIndex] === 'undefined') {
            args[currentArgIndex] = '';
        }

        if (/\s/.test(char) && !opening) {
            if (args[currentArgIndex]) {
                currentArgIndex++;
            }

            continue;
        }

        if ((char === '"' || char === "'") && argString[i - 1] !== '\\') {
            if (!opening) {
                opening = char;
                continue;
            } else if (opening === char) {
                currentArgIndex++;
                opening = '';
                continue;
            }
        }

        if (
            char === '\\' &&
            (argString[i + 1] === "'" || argString[i + 1] === '"') &&
            argString[i + 1] === opening
        ) {
            args[currentArgIndex] += argString[i + 1];
            i++;
            continue;
        }

        args[currentArgIndex] += char;
    }

    return args;
}

export function parseSortGroupKeys(groupKeysString: string) {
    const errors: string[] = [];

    if (!isValidSortGroupTest.test(groupKeysString)) {
        errors.push('Sort group key did not pass the regex test.');
        return { errors };
    }

    const groupKeys = groupKeysString.match(sortGroupMatchRegex);

    if (!groupKeys) {
        errors.push('No sort groups found.');
        return { errors };
    }

    type SortGroupArgsOnly = Omit<SortGroup, 'group'>;

    const sortGroups: {
        forNumbers: number[];
        sortGroupArgs: SortGroupArgsOnly;
    }[] = [];

    function setSorter(
        sortGroupArgs: SortGroupArgsOnly,
        sorter: Exclude<Sorter, 'random'>
    ) {
        if (sortGroupArgs.sorter) {
            errors.push("Can't have more than one sorter in sort group");
            return true;
        }

        sortGroupArgs.sorter = sorter;
        return true;
    }

    function addGroup(forGroups: number[], group: number) {
        if (currentGroups.includes(group)) {
            errors.push('Conflicting sort group numbers');
            return false;
        }

        forGroups.push(group);
        currentGroups.push(group);
        return true;
    }

    const currentGroups: number[] = [];

    groupKeyForLoop: for (let i = 0; i < groupKeys.length; i++) {
        const groupKey = groupKeys[i];
        const innerValueMatches = groupKey.match(
            sortGroupInnerValuesMatchRegex
        );

        // should not ever happen but better to check ig
        if (!innerValueMatches) {
            errors.push(
                'Could not determine the values for sort group index: ' +
                    (i + 1)
            );
            continue;
        }

        const [, forGroupsString, argString] = innerValueMatches;
        const forGroups: number[] = [];
        const sortGroupArgs: SortGroupArgsOnly = {};

        sortGroups.push({ forNumbers: forGroups, sortGroupArgs });

        for (const forGroupsStringFrag of forGroupsString.split(',')) {
            // means its a range {x..y}
            if (forGroupsStringFrag.includes('.')) {
                const range = forGroupsStringFrag.split('..');
                const start = parseInt(range[0]);
                const end = parseInt(range[1]);

                if (end <= start) {
                    errors.push(
                        `End range must be higher than the starting range for sort group: {${forGroupsString}}`
                    );
                    continue;
                }

                for (let j = start; j <= end; j++) {
                    if (!addGroup(forGroups, j)) {
                        continue groupKeyForLoop;
                    }
                }
            } else {
                const group = parseInt(forGroupsStringFrag);

                if (!addGroup(forGroups, group)) {
                    continue groupKeyForLoop;
                }
            }
        }

        const args = argString.match(sortGroupArgsMatchRegex);

        if (!args) {
            continue;
        }

        for (const arg of args) {
            const [key, value] = arg.split('=');
            let usedValue = false;

            switch (key) {
                case 'i':
                    setSorter(sortGroupArgs, 'case-insensitive');
                    break;
                case 'e':
                    setSorter(sortGroupArgs, 'natural');
                    break;
                case 'n':
                    setSorter(sortGroupArgs, 'numerical');
                    break;
                case 'f':
                    setSorter(sortGroupArgs, 'float');
                    break;
                case 'l':
                    setSorter(sortGroupArgs, 'length');
                    break;
                case 'x':
                    setSorter(sortGroupArgs, 'none');
                    break;
                case 's':
                    sortGroupArgs.reverse = true;
                    break;
                case 'a':
                    sortGroupArgs.attachNonMatchingToBottom = true;
                    break;
                case 'u':
                    sortGroupArgs.unique =
                        value === 'i' ? 'case-insensitive' : 'exact';
                    usedValue = true;
                    break;
            }

            if (!usedValue && value) {
                errors.push(
                    `Recieved argument for an option that does not take an argument (${key}).`
                );
            }
        }
    }

    return { errors, sortGroups };
}

/**
 * Takes in an array of arguments and parses it into options for `sort()`.
 */
export function parseArgsIntoOptions(
    args: string[],
    unknownArgCallback?: (
        args: string[],
        index: number,
        options: Options
    ) => void
) {
    const options: Options = {};
    const positionals: string[] = [];
    const errors: string[] = [];

    // from https://stackoverflow.com/a/67243723/
    const kebabize = (str: string) =>
        str.replace(
            /[A-Z]+(?![a-z])|[A-Z]/g,
            ($, ofs) => (ofs ? '-' : '') + $.toLowerCase()
        );

    function setSorter(sorter: Sorter) {
        if (options.sorter) {
            errors.push("Can't have more than one sorter");
            return false;
        }

        options.sorter = sorter;
    }

    function requireNextArg(currentIndex: number) {
        if (args.length <= currentIndex + 1) {
            errors.push(args[currentIndex] + ' requires an argument');
            return false;
        }

        if (args[currentIndex + 1].startsWith('-')) {
            errors.push(
                `The next argument after ${args[currentIndex]} can't be an option`
            );
            return false;
        }

        return true;
    }

    for (let i = 0; i < args.length; i++) {
        let arg = args[i];

        if (!arg.startsWith('--') && !arg.startsWith('-')) {
            positionals.push(arg);
            continue;
        }

        // parses short hand option groups like -su or -s3u
        if (arg.length !== 2 && /^-[a-zA-Z]/.test(arg)) {
            const shortHandOptions = arg.match(/\{.+|[a-zA-Z]|[^a-zA-Z-]+/g);

            if (shortHandOptions && shortHandOptions.length > 0) {
                args.splice(
                    i,
                    1,
                    ...shortHandOptions.map((e) => {
                        if (/[^a-zA-Z]/.test(e)) {
                            return e;
                        }

                        return e.length === 1 ? '-' + e : '--' + e;
                    })
                );
                i--;
                continue;
            }
        }

        if (arg.length > 2) {
            arg = kebabize(arg);
        }

        let assumedBoolValue = true;
        let consumedBool = false;
        let matchedCase = true;

        if (arg.startsWith('--no-')) {
            assumedBoolValue = false;
            arg = arg.replace('--no-', '--');

            if (arg.length === 3) {
                arg = arg.slice(1);
            }
        }

        switch (arg) {
            case '--case-insensitive':
            case '-i':
                setSorter('case-insensitive');
                break;
            case '--natural-sort':
            case '-e':
                setSorter('natural');
                break;
            case '--numerical-sort':
            case '-n':
                setSorter('numerical');
                break;
            case '--float-sort':
            case '-f':
                setSorter('float');
                break;
            case '--length-sort':
            case '-l':
                setSorter('length');
                break;
            case '--none-sort':
            case '-x':
                setSorter('none');
                break;
            case '--random-sort':
            case '-z':
                setSorter('random');
                break;
            case '--recursive':
            case '-r':
                options.recursive = assumedBoolValue;
                consumedBool = true;
                break;
            case '--reverse':
            case '-s':
                options.reverse = assumedBoolValue;
                consumedBool = true;
                break;
            case '--unique':
            case '-u': {
                const nextArg = args[i + 1];

                if (!nextArg || nextArg.startsWith('-')) {
                    options.unique = 'exact';
                } else {
                    i++;

                    if (nextArg !== 'i') {
                        errors.push(
                            'Invalid value for --unique, only "i" is allowed.'
                        );
                        continue;
                    }

                    options.unique = 'case-insensitive';
                }

                break;
            }
            case '--markdown':
            case '-m':
                options.markdown = assumedBoolValue;
                consumedBool = true;
                break;
            case '--regex':
                if (!requireNextArg(i)) {
                    continue;
                }

                try {
                    options.regexFilter = parseStringAsRegex(args[i + 1], true);
                } catch (err: any) {
                    errors.push(err.message);
                }

                i++;

                break;
            case '--use-matched-regex':
            case '-p':
                options.useMatchedRegex = assumedBoolValue;
                consumedBool = true;
                break;
            case '--section-seperator':
                if (!requireNextArg(i)) {
                    continue;
                }

                try {
                    options.sectionSeperator = parseStringAsRegex(
                        args[i + 1],
                        false
                    );
                } catch (err: any) {
                    errors.push(err.message);
                }

                i++;

                break;
            case '--section-starter':
                if (!requireNextArg(i)) {
                    continue;
                }

                try {
                    options.sectionStarter = parseStringAsRegex(
                        args[i + 1],
                        false
                    );
                } catch (err: any) {
                    errors.push(err.message);
                }

                i++;

                break;
            case '--section-rejoiner':
                if (!requireNextArg(i)) {
                    continue;
                }

                // prob need to do more parsing on this
                options.sectionRejoiner = args[i + 1].replace(/\\n/g, '\n');
                i++;

                break;
            case '--attach-non-matching-to-bottom':
            case '-a':
                options.attachNonMatchingToBottom = assumedBoolValue;
                consumedBool = true;
                break;
            case '--use-sort-group':
            case '-k': {
                if (!requireNextArg(i)) {
                    continue;
                }

                const resultFromSortGroupParse = parseSortGroupKeys(
                    args[i + 1]
                );

                if (resultFromSortGroupParse.errors.length) {
                    errors.push(...resultFromSortGroupParse.errors);
                } else if (resultFromSortGroupParse.sortGroups) {
                    options.sortGroups = [];

                    for (const {
                        forNumbers,
                        sortGroupArgs,
                    } of resultFromSortGroupParse.sortGroups) {
                        for (const group of forNumbers) {
                            options.sortGroups.push({
                                group,
                                ...sortGroupArgs,
                            });
                        }
                    }
                }

                i++;

                break;
            }
            case '--field-seperator':
            case '-F':
                if (!requireNextArg(i)) {
                    continue;
                }

                try {
                    options.fieldSeperator = isRegexTest.test(args[i + 1])
                        ? parseStringAsRegex(args[i + 1], false)
                        : args[i + 1];
                } catch (err: any) {
                    errors.push(err.message);
                }

                i++;

                break;
            default:
                matchedCase = false;

                if (unknownArgCallback) {
                    unknownArgCallback(args, i, options);
                } else {
                    errors.push('Unknown option: ' + arg);
                }
        }

        // kinda weird but this is how I'll check
        // if --no- prefix has been used on a non boolean param
        // prob a better way to do this, and this is error prone
        if (!assumedBoolValue && !consumedBool && matchedCase) {
            errors.push(
                'Used --no- prefix on property that does not expect booleans'
            );
        }
    }

    return { errors, positionals, options };
}
