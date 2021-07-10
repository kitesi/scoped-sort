// @ts-check

const test = require('tape');
const parseStringArguments = require('../../src/parse-string-arguments.js');
const { allUniqueStringArguments } = require('../utils.js');

test('main', (t) => {
    for (const stringArguments of allUniqueStringArguments) {
        t.doesNotThrow(() => parseStringArguments(stringArguments));
    }

    t.doesNotThrow(() => parseStringArguments(''));
    t.throws(() => parseStringArguments('alskjdLKASJDLK'));
    t.throws(() => parseStringArguments('{'));

    t.end();
});
