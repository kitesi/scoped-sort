// @ts-check
const test = require('tape');
const { sort } = require('../dist/main.js');
const { testString } = require('./testString.js');
const { previews } = require('../../previews.js');

test('preview sorts', (t) => {
    for (const [name, { input, output, options }] of Object.entries(previews)) {
        testString(t, sort(input, options), output, name);
    }

    t.end();
});
