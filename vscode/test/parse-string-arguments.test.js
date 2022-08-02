// @ts-check

const test = require('tape');

const { parseStringArguments } = require('../dist/parse-string-arguments.js');
const { possibleArguments } = require('../../test-utils.js');
const { sort } = require('string-content-sort');

test('main parse-string-arguments', (t) => {
    /** @param {string} args */
    function helper(args) {
        const options = parseStringArguments(args);
        sort('', options);

        const sectionSeperator = options.sectionSeperator;
        const regex = options.regexFilter;
        options.reportErrors = undefined;

        const cleanOptions = JSON.parse(JSON.stringify(options));

        if (regex) {
            cleanOptions.regexFilter = regex;
        }

        if (sectionSeperator) {
            cleanOptions.sectionSeperator = sectionSeperator;
        }

        return cleanOptions;
    }

    for (const stringArguments of possibleArguments) {
        t.doesNotThrow(() => helper(stringArguments));
    }

    t.deepEquals(helper('-s'), {
        reverse: true,
    });

    t.deepEquals(helper('--reverse'), {
        reverse: true,
    });

    t.deepEquals(helper('-r'), {
        recursive: true,
    });

    t.deepEquals(helper('--recursive'), {
        recursive: true,
    });

    t.deepEquals(helper('-n'), {
        sortNumerically: true,
    });

    t.deepEquals(helper('--sort-numerically'), {
        sortNumerically: true,
    });

    t.deepEquals(helper('-i'), {
        caseInsensitive: true,
    });

    t.deepEquals(helper('--case-insensitive'), {
        caseInsensitive: true,
    });

    t.deepEquals(helper('-m'), {
        markdown: true,
    });

    t.deepEquals(helper('--markdown'), {
        markdown: true,
    });

    t.deepEquals(helper('-l'), {
        sortByLength: true,
    });

    t.deepEquals(helper('--sort-by-length'), {
        sortByLength: true,
    });

    t.deepEquals(helper('-u'), {
        unique: true,
    });

    t.deepEquals(helper('--unique'), {
        unique: true,
    });

    t.deepEquals(helper('-f'), {
        sortByFloat: true,
    });

    t.deepEquals(helper('--sort-by-float'), {
        sortByFloat: true,
    });

    t.deepEquals(helper('-z'), {
        sortRandomly: true,
    });

    t.deepEquals(helper('--sort-randomly'), {
        sortRandomly: true,
    });

    t.deepEquals(helper('-su'), {
        reverse: true,
        unique: true,
    });

    t.deepEquals(helper('-nu'), {
        sortNumerically: true,
        unique: true,
    });

    t.deepEquals(helper('-s --regex /\\w/'), {
        reverse: true,
        regexFilter: /\w/,
    });

    t.deepEquals(helper('-sp --regex /\\w/'), {
        reverse: true,
        regexFilter: /\w/,
        useMatchedRegex: true,
    });

    t.deepEquals(helper('-s --regex /\\w/ -p'), {
        reverse: true,
        regexFilter: /\w/,
        useMatchedRegex: true,
    });

    t.deepEquals(helper('--sectionSeperator /^Title/'), {
        sectionSeperator: /^Title/,
    });

    t.deepEquals(helper('--section-seperator "/^  <div/"'), {
        sectionSeperator: /^  <div/,
    });

    t.doesNotThrow(() => helper(''));

    t.doesNotThrow(
        () => helper('-p'),
        'does not throw error on m with no regex'
    );

    t.throws(() => helper('alskjdLKASJDLK'), 'throws error on random mess');

    t.throws(
        () => helper('{'),
        'throws error on random non alphanumerical character'
    );

    t.throws(() => helper('/[.++/'), 'throws error on invalid regex');

    t.throws(() => helper('/\\d+/'), 'throws on positional regex');

    t.throws(() => helper('-fl'), 'throws on fl');
    t.throws(() => helper('-fn'), 'throws on fn');
    t.throws(() => helper('-fz'), 'throws on fz');
    t.throws(() => helper('-fe'), 'throws on fe');

    t.throws(() => helper('-ln'), 'throws on ln');
    t.throws(() => helper('-lz'), 'throws on lz');
    t.throws(() => helper('-le'), 'throws on le');

    t.throws(() => helper('-nz'), 'throws on nz');
    t.throws(() => helper('-ne'), 'throws on ne');

    t.throws(() => helper('-ze'), 'throws on ze');

    t.throws(() => helper('-ie'), 'throws on ie');
    t.throws(() => helper('-in'), 'throws on in');
    t.throws(() => helper('-if'), 'throws on if');
    t.throws(() => helper('-il'), 'throws on il');
    t.throws(() => helper('-iz'), 'throws on iz');

    t.throws(() => helper('-z --regex /me/'), 'throws on random + pattern');
    t.throws(() => helper('-e --regex /me/'), 'throws on natural + pattern');

    t.throws(
        () => helper('-in --regex /\\d+/'),
        'still throws on in when pattern is specified'
    );

    t.doesNotThrow(
        () => helper('-inu'),
        'does not throw on in when u is specified'
    );

    t.end();
});
