import * as yargs from 'yargs';

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

export function parseStringArguments(args: string) {
    const parsedArgs = genericSortYargsBuilder(yargs)
        .help(false)
        .fail((msg, err) => {
            throw new Error(msg);
        })
        .strict(true)
        .parse(args);

    // prob a better way to do this
    const options: Options = {
        sortNaturally: parsedArgs.sortNaturally,
        sortByFloat: parsedArgs.sortByFloat,
        sortByLength: parsedArgs.sortByLength,
        sortNumerically: parsedArgs.sortNumerically,
        sortRandomly: parsedArgs.sortRandomly,
        reverse: parsedArgs.reverse,
        recursive: parsedArgs.recursive,
        unique: parsedArgs.unique,
        caseInsensitive: parsedArgs.caseInsensitive,
        useMatchedRegex: parsedArgs.useMatchedRegex,
        markdown: parsedArgs.markdown,
        regexFilter: parseStringAsRegex(parsedArgs.regex),
        sectionSeperator: parseStringAsRegex(parsedArgs.sectionSeperator),
    };

    const argumentDescriptions = {
        e: 'naturally',
        f: 'by float',
        l: 'by length',
        n: 'numerically',
        z: 'randomly',
    };

    type SortAlias = 'e' | 'f' | 'l' | 'n' | 'z';
    const sorters: Set<SortAlias> = new Set();

    for (const sortAlias of ['e', 'f', 'l', 'n', 'z']) {
        if (parsedArgs[sortAlias]) {
            sorters.add(sortAlias as SortAlias);
        }
    }

    if (options.regexFilter && options.sortRandomly) {
        throw new Error("You can't sort by random and use a regex pattern");
    }

    if (options.regexFilter && options.sortNaturally) {
        throw new Error("You can't sort naturally and use a regex pattern");
    }

    if (sorters.size > 1) {
        const [firstSorter, secondSorter] = sorters.values();

        throw new Error(
            `You can't use sort ${argumentDescriptions[firstSorter]} and sort ${argumentDescriptions[secondSorter]} together`
        );
    }

    if (options.caseInsensitive && !options.unique) {
        for (const sorter of sorters) {
            throw new Error(
                `You can't use sort case insensitively with sort ${argumentDescriptions[sorter]} without the unique argument`
            );
        }
    }

    /* 
        commented it out because there is a valid use case,
        when users by default want to use the matched regex,
        but of course they won't always be using regexs,
        if this threw an error, they would have to manunally 
        type 'm' each time.
    */
    // if (options.useMatchedRegex && !options.regex) {
    //     throw new Error("You can't use the m argument without a regex pattern");
    // }

    // need to do all this to remove the undefined properties, maybe a bit slow on runtime though
    const regexFilter = options.regexFilter;
    const sectionSeperator = options.sectionSeperator;
    const cleanOptions: Options = JSON.parse(JSON.stringify(options));

    if (regexFilter) {
        cleanOptions.regexFilter = regexFilter;
    }

    if (sectionSeperator) {
        cleanOptions.sectionSeperator = sectionSeperator;
    }

    return cleanOptions;
}
