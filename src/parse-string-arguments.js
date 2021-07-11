// @ts-check
/** @param {string} args */
module.exports = function (args) {
    /** @type {import("./sort.js").Options} */
    const options = {};
    const letters = args.split('');

    for (const letter of letters) {
        switch (letter) {
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
            default:
                throw new Error(`Could not understand argument: "${letter}"`);
        }
    }

    return options;
};
