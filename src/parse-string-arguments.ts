import type { Options } from './sort.js';

export const argumentParserRegex = /\/[^\/]+\/|[^\s]/g;

export function parseStringArguments(args: string) {
    const options: Options = {};
    const parsedArgs = args.match(argumentParserRegex);

    if (!parsedArgs) {
        return options;
    }

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
            case 'n':
                options.sortNumerically = true;
                break;
            case 'p':
                options.useMatchedRegex = true;
                break;
            case 'm':
                options.markdown = true;
                break;
            case 'l':
                options.sortByLength = true;
                break;
            default:
                if (arg.startsWith('/') && arg.endsWith('/')) {
                    try {
                        const regex = new RegExp(arg.slice(1, arg.length - 1));
                        options.regex = regex;
                    } catch (e) {
                        throw new Error(
                            `Tried to parse "${arg}" as a regex, failed with: ` +
                                e?.message
                        );
                    }
                } else {
                    throw new Error(`Could not understand argument: ${arg}`);
                }
        }
    }

    if (options.sortByLength && options.sortNumerically) {
        throw new Error(
            "You can't use sort by length and sort numerically together"
        );
    }

    if (options.caseInsensitive && !options.regex && !options.unique) {
        if (options.sortNumerically) {
            throw new Error(
                "You can't use sort case insensitively with sort numerically"
            );
        }

        if (options.sortByLength) {
            throw new Error(
                "You can't use sort case insensitively with sort by length"
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
