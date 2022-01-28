// @ts-check

const test = require('tape');

const { parseStringArguments } = require('../dist/parse-string-arguments.js');

const { possibleArguments } = require('../../test-utils.js');

test('main parse-string-arguments', (t) => {
    for (const stringArguments of possibleArguments) {
        t.doesNotThrow(() => parseStringArguments(stringArguments));
    }

    t.deepEquals(parseStringArguments('-s'), {
        reverse: true,
    });

    t.deepEquals(parseStringArguments('--reverse'), {
        reverse: true,
    });

    t.deepEquals(parseStringArguments('-r'), {
        recursive: true,
    });

    t.deepEquals(parseStringArguments('--recursive'), {
        recursive: true,
    });

    t.deepEquals(parseStringArguments('-n'), {
        sortNumerically: true,
    });

    t.deepEquals(parseStringArguments('--sort-numerically'), {
        sortNumerically: true,
    });

    t.deepEquals(parseStringArguments('-i'), {
        caseInsensitive: true,
    });

    t.deepEquals(parseStringArguments('--case-insensitive'), {
        caseInsensitive: true,
    });

    t.deepEquals(parseStringArguments('-m'), {
        markdown: true,
    });

    t.deepEquals(parseStringArguments('--markdown'), {
        markdown: true,
    });

    t.deepEquals(parseStringArguments('-l'), {
        sortByLength: true,
    });

    t.deepEquals(parseStringArguments('--sort-by-length'), {
        sortByLength: true,
    });

    t.deepEquals(parseStringArguments('-u'), {
        unique: true,
    });

    t.deepEquals(parseStringArguments('--unique'), {
        unique: true,
    });

    t.deepEquals(parseStringArguments('-f'), {
        sortByFloat: true,
    });

    t.deepEquals(parseStringArguments('--sort-by-float'), {
        sortByFloat: true,
    });

    t.deepEquals(parseStringArguments('-z'), {
        sortRandomly: true,
    });

    t.deepEquals(parseStringArguments('--sort-randomly'), {
        sortRandomly: true,
    });

    t.deepEquals(parseStringArguments('-su'), {
        reverse: true,
        unique: true,
    });

    t.deepEquals(parseStringArguments('-nu'), {
        sortNumerically: true,
        unique: true,
    });

    t.deepEquals(parseStringArguments('-s --regex /\\w/'), {
        reverse: true,
        regexFilter: /\w/,
    });

    t.deepEquals(parseStringArguments('-sp --regex /\\w/'), {
        reverse: true,
        regexFilter: /\w/,
        useMatchedRegex: true,
    });

    t.deepEquals(parseStringArguments('-s --regex /\\w/ -p'), {
        reverse: true,
        regexFilter: /\w/,
        useMatchedRegex: true,
    });

    t.deepEquals(parseStringArguments('--sectionSeperator /^Title/'), {
        sectionSeperator: /^Title/,
    });

    t.deepEquals(parseStringArguments('--section-seperator "/^  <div/"'), {
        sectionSeperator: /^  <div/,
    });

    t.doesNotThrow(() => parseStringArguments(''));

    t.doesNotThrow(
        () => parseStringArguments('-p'),
        'does not throw error on m with no regex'
    );

    t.throws(
        () => parseStringArguments('alskjdLKASJDLK'),
        'throws error on random mess'
    );

    t.throws(
        () => parseStringArguments('{'),
        'throws error on random non alphanumerical character'
    );

    t.throws(
        () => parseStringArguments('/[.++/'),
        'throws error on invalid regex'
    );

    t.throws(
        () => parseStringArguments('/\\d+/'),
        'throws on positional regex'
    );

    t.throws(() => parseStringArguments('-fl'), 'throws on fl');
    t.throws(() => parseStringArguments('-fn'), 'throws on fn');
    t.throws(() => parseStringArguments('-fz'), 'throws on fz');
    t.throws(() => parseStringArguments('-fe'), 'throws on fe');

    t.throws(() => parseStringArguments('-ln'), 'throws on ln');
    t.throws(() => parseStringArguments('-lz'), 'throws on lz');
    t.throws(() => parseStringArguments('-le'), 'throws on le');

    t.throws(() => parseStringArguments('-nz'), 'throws on nz');
    t.throws(() => parseStringArguments('-ne'), 'throws on ne');

    t.throws(() => parseStringArguments('-ze'), 'throws on ze');

    t.throws(() => parseStringArguments('-ie'), 'throws on ie');
    t.throws(() => parseStringArguments('-in'), 'throws on in');
    t.throws(() => parseStringArguments('-if'), 'throws on if');
    t.throws(() => parseStringArguments('-il'), 'throws on il');
    t.throws(() => parseStringArguments('-iz'), 'throws on iz');

    t.throws(
        () => parseStringArguments('-z --regex /me/'),
        'throws on random + pattern'
    );
    t.throws(
        () => parseStringArguments('-e --regex /me/'),
        'throws on natural + pattern'
    );

    t.throws(
        () => parseStringArguments('-in --regex /\\d+/'),
        'still throws on in when pattern is specified'
    );

    t.doesNotThrow(
        () => parseStringArguments('-inu'),
        'does not throw on in when u is specified'
    );

    t.end();
});
