// @ts-check

const test = require('tape');
const {
    parseStringArguments,
    argumentParserRegex,
} = require('../../src/parse-string-arguments.js');
const { allowedArguments } = require('../utils.js');

test('argument parser regex', (t) => {
    t.deepEquals('s'.match(argumentParserRegex), ['s']);
    t.deepEquals('n'.match(argumentParserRegex), ['n']);
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
    for (const stringArguments of allowedArguments) {
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

    t.deepEquals(parseStringArguments('u'), {
        unique: true,
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

    t.end();
});
