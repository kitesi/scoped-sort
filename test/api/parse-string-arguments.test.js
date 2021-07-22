// @ts-check

const test = require('tape');
const {
    parseStringArguments,
    argumentParserRegex,
} = require('../../dist/parse-string-arguments.js');
const { possibleArguments } = require('../utils.js');

test('argument parser regex', (t) => {
    t.deepEquals('s'.match(argumentParserRegex), ['s']);
    t.deepEquals('n'.match(argumentParserRegex), ['n']);
    t.deepEquals('m'.match(argumentParserRegex), ['m']);
    t.deepEquals('l'.match(argumentParserRegex), ['l']);
    t.deepEquals('snur'.match(argumentParserRegex), ['s', 'n', 'u', 'r']);
    t.deepEquals('snur /\\d+/'.match(argumentParserRegex), [
        's',
        'n',
        'u',
        'r',
        '/\\d+/',
    ]);

    t.deepEquals('snur /\\d+/i'.match(argumentParserRegex), [
        's',
        'n',
        'u',
        'r',
        '/\\d+/',
        'i',
    ]);

    t.deepEquals('snur /\\d+/ i'.match(argumentParserRegex), [
        's',
        'n',
        'u',
        'r',
        '/\\d+/',
        'i',
    ]);

    t.deepEquals('snur /\\d+/p'.match(argumentParserRegex), [
        's',
        'n',
        'u',
        'r',
        '/\\d+/',
        'p',
    ]);

    t.deepEquals('snur /\\d+/ p'.match(argumentParserRegex), [
        's',
        'n',
        'u',
        'r',
        '/\\d+/',
        'p',
    ]);

    t.deepEquals('snur /\\d+/ p23'.match(argumentParserRegex), [
        's',
        'n',
        'u',
        'r',
        '/\\d+/',
        'p',
        '2',
        '3',
    ]);

    t.end();
});

test('main', (t) => {
    for (const stringArguments of possibleArguments) {
        t.doesNotThrow(() => parseStringArguments(stringArguments));
    }

    t.deepEquals(parseStringArguments('s'), {
        reverse: true,
    });

    t.deepEquals(parseStringArguments('r'), {
        recursive: true,
    });

    t.deepEquals(parseStringArguments('n'), {
        sortNumerically: true,
    });

    t.deepEquals(parseStringArguments('i'), {
        caseInsensitive: true,
    });

    t.deepEquals(parseStringArguments('m'), {
        markdown: true,
    });

    t.deepEquals(parseStringArguments('l'), {
        sortByLength: true,
    });

    t.deepEquals(parseStringArguments('u'), {
        unique: true,
    });

    t.deepEquals(parseStringArguments('f'), {
        sortByFloat: true,
    });

    t.deepEquals(parseStringArguments('z'), {
        sortRandomly: true,
    });

    t.deepEquals(parseStringArguments('su'), {
        reverse: true,
        unique: true,
    });

    t.deepEquals(parseStringArguments('nu'), {
        sortNumerically: true,
        unique: true,
    });

    t.deepEquals(parseStringArguments('s /\\w/'), {
        reverse: true,
        regex: /\w/,
    });

    t.deepEquals(parseStringArguments('s /\\w/p'), {
        reverse: true,
        regex: /\w/,
        useMatchedRegex: true,
    });

    t.deepEquals(parseStringArguments('s /\\w/ p'), {
        reverse: true,
        regex: /\w/,
        useMatchedRegex: true,
    });

    t.doesNotThrow(() => parseStringArguments(''));

    t.doesNotThrow(
        () => parseStringArguments('p'),
        'throws error on m with no regex'
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

    t.throws(() => parseStringArguments('fl'), 'throws on fl');
    t.throws(() => parseStringArguments('fn'), 'throws on fn');
    t.throws(() => parseStringArguments('fz'), 'throws on fz');
    t.throws(() => parseStringArguments('fe'), 'throws on fe');

    t.throws(() => parseStringArguments('ln'), 'throws on ln');
    t.throws(() => parseStringArguments('lz'), 'throws on lz');
    t.throws(() => parseStringArguments('le'), 'throws on le');

    t.throws(() => parseStringArguments('nz'), 'throws on nz');
    t.throws(() => parseStringArguments('ne'), 'throws on ne');

    t.throws(() => parseStringArguments('ze'), 'throws on ze');

    t.throws(() => parseStringArguments('ie'), 'throws on ie');
    t.throws(() => parseStringArguments('in'), 'throws on in');
    t.throws(() => parseStringArguments('if'), 'throws on if');
    t.throws(() => parseStringArguments('il'), 'throws on il');
    t.throws(() => parseStringArguments('iz'), 'throws on iz');

    t.throws(() => parseStringArguments('z/me/'), 'throws on random + pattern');
    t.throws(() => parseStringArguments('e/me/'), 'throws on random + pattern');

    t.throws(
        () => parseStringArguments('in /\\d+/'),
        'still throws on in when pattern is specified'
    );

    t.doesNotThrow(
        () => parseStringArguments('inu'),
        'does not throw on in when u is specified'
    );

    t.end();
});
