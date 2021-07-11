// @ts-check

const test = require('tape');
const parseStringArguments = require('../../src/parse-string-arguments.js');
const { allowedArguments } = require('../utils.js');

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

    t.doesNotThrow(() => parseStringArguments(''));
    t.throws(() => parseStringArguments('alskjdLKASJDLK'));
    t.throws(() => parseStringArguments('{'));

    t.end();
});
