import * as yargs from 'yargs';
import type { Options } from './sort.js';

function parseStringAsRegex(arg: string) {
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

export function parseStringArguments(args: string) {
    const parsedArgs = yargs
        .options({
            e: {
                alias: 'sort-naturally',
                type: 'boolean',
            },
            f: {
                alias: 'sort-by-float',
                type: 'boolean',
            },
            l: {
                alias: 'sort-by-length',
                type: 'boolean',
            },
            n: {
                alias: 'sort-numerically',
                type: 'boolean',
            },
            z: {
                alias: 'sort-randomly',
                type: 'boolean',
            },
            s: {
                alias: 'reverse',
                type: 'boolean',
            },
            r: {
                alias: 'recursive',
                type: 'boolean',
            },
            u: {
                alias: 'unique',
                type: 'boolean',
            },
            i: {
                alias: 'case-insensitive',
                type: 'boolean',
            },
            p: {
                alias: 'use-matched-regex',
                type: 'boolean',
            },
            m: {
                alias: 'markdown',
                type: 'boolean',
            },
            'section-seperator': {
                type: 'string',
            },
        })
        .help(false)
        .fail((msg, err) => {
            throw new Error(msg);
        })
        .strictOptions(true)
        .parse(args);

    const options: Options = {
        sortNaturally: parsedArgs.e,
        sortByFloat: parsedArgs.f,
        sortByLength: parsedArgs.l,
        sortNumerically: parsedArgs.n,
        sortRandomly: parsedArgs.z,
        reverse: parsedArgs.s,
        recursive: parsedArgs.r,
        unique: parsedArgs.u,
        caseInsensitive: parsedArgs.i,
        useMatchedRegex: parsedArgs.p,
        markdown: parsedArgs.m,
    };

    const argumentDescriptions = {
        e: 'naturally',
        f: 'by float',
        l: 'by length',
        n: 'numerically',
        z: 'randomly',
    };

    for (let arg of parsedArgs._) {
        if (typeof arg === 'number') {
            arg = arg.toString();
        }

        options.regexFilter = parseStringAsRegex(arg);
    }

    if (parsedArgs['section-seperator']) {
        options.sectionSeperator = parseStringAsRegex(
            parsedArgs['section-seperator']
        );
    }

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
