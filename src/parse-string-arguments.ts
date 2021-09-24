import type { Options } from './sort.js';

export const argumentParserRegex = /\/[^\/]+\/|[^\s]/g;

export function parseStringArguments(args: string) {
    const options: Options = {};
    const parsedArgs = args.match(argumentParserRegex);

    if (!parsedArgs) {
        return options;
    }

    const argumentDescriptions = {
        e: 'naturally',
        f: 'by float',
        l: 'by length',
        n: 'numerically',
        z: 'randomlly',
    };

    const sorters: Set<'e' | 'f' | 'l' | 'n' | 'z'> = new Set();

    for (const arg of parsedArgs) {
        switch (arg) {
            case 's':
                options.reverse = true;
                break;
            case 'r':
                options.recursive = true;
                break;
            case 'u':
                options.unique = true;
                break;
            case 'i':
                options.caseInsensitive = true;
                break;
            case 'p':
                options.useMatchedRegex = true;
                break;
            case 'm':
                options.markdown = true;
                break;
            case 'e':
                sorters.add('e');
                options.sortNaturally = true;
                break;
            case 'n':
                sorters.add('n');
                options.sortNumerically = true;
                break;
            case 'l':
                sorters.add('l');
                options.sortByLength = true;
                break;
            case 'f':
                sorters.add('f');
                options.sortByFloat = true;
                break;
            case 'z':
                sorters.add('z');
                options.sortRandomly = true;
                break;
            default:
                if (arg.startsWith('/') && arg.endsWith('/')) {
                    try {
                        const regex = new RegExp(arg.slice(1, arg.length - 1));
                        options.regex = regex;
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
    }

    if (options.regex && options.sortRandomly) {
        throw new Error("You can't sort by random and use a regex pattern");
    }

    if (options.regex && options.sortNaturally) {
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
                `You can't use sort case insensitively with ${argumentDescriptions[sorter]} without a regex pattern or without the unique argument`
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

    return options;
}
