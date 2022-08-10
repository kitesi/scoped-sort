import yargs, { options } from 'yargs';

import type { Argv } from 'yargs';
import type { Options } from 'string-content-sort';

function parseStringAsRegex(arg?: string) {
    if (typeof arg === 'undefined') {
        return undefined;
    }

    if (arg.startsWith('/') && arg.endsWith('/')) {
        try {
            return new RegExp(arg.slice(1, arg.length - 1));
        } catch (e) {
            throw new Error(
                `Tried to parse "${arg}" as a regex, failed with: ` +
                    (e as Error)?.message
            );
        }
    } else {
        throw new Error(`Could not understand argument: '${arg}'`);
    }
}

export function genericSortYargsBuilder(y: Argv) {
    return y.options({
        reverse: {
            alias: 's',
            type: 'boolean',
        },
        recursive: {
            alias: 'r',
            type: 'boolean',
        },
        sortNaturally: {
            alias: 'e',
            type: 'boolean',
        },
        unique: {
            alias: 'u',
            type: 'boolean',
        },
        caseInsensitive: {
            alias: 'i',
            type: 'boolean',
        },
        sortNumerically: {
            alias: 'n',
            type: 'boolean',
        },
        sortByFloat: {
            alias: 'f',
            type: 'boolean',
        },
        sortByLength: {
            alias: 'l',
            type: 'boolean',
        },
        sortRandomly: {
            alias: 'z',
            type: 'boolean',
        },
        markdown: {
            alias: 'm',
            type: 'boolean',
        },
        useMatchedRegex: {
            alias: 'p',
            type: 'boolean',
        },
        sectionSeperator: {
            type: 'string',
        },
        regex: {
            type: 'string',
        },
    });
}

type YargsBaseArgumentsReturn = ReturnType<
    ReturnType<typeof genericSortYargsBuilder>['parseSync']
>;

export type YargsCliArgumentsReturn = YargsBaseArgumentsReturn & {
    files?: string[];
    modify?: boolean;
    useSortComments?: boolean;
};

export function parseStringArguments(args: string) {
    const parsedArgs = genericSortYargsBuilder(yargs([]))
        .help(false)
        .fail((msg, err) => {
            throw new Error(msg);
        })
        .strict(true)
        .parseSync(args);

    return getCleanOptions(parsedArgs);
}

export function getCleanOptions(args: YargsBaseArgumentsReturn) {
    const options: Options = {
        sortNaturally: args.sortNaturally,
        sortByFloat: args.sortByFloat,
        sortByLength: args.sortByLength,
        sortNumerically: args.sortNumerically,
        sortRandomly: args.sortRandomly,
        reverse: args.reverse,
        recursive: args.recursive,
        unique: args.unique,
        caseInsensitive: args.caseInsensitive,
        useMatchedRegex: args.useMatchedRegex,
        markdown: args.markdown,
        regexFilter: parseStringAsRegex(args.regex),
        sectionSeperator: parseStringAsRegex(args.sectionSeperator),
    };

    return options;
}
