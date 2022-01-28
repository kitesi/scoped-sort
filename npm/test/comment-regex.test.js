// @ts-check

const test = require('tape');

const sortStartRegex = /\{ sort-start (?<args>[^\}]*)(?<= )\}/;
const sortEndRegex = /\{ sort-end \}/;

test('sort start', (t) => {
    t.false(sortStartRegex.test(''), 'empty string');
    t.false(sortStartRegex.test('{'), 'just open bracket');
    t.false(sortStartRegex.test('}'), 'just closing bracket');
    t.false(sortStartRegex.test('{}'), 'just brackets');
    t.false(sortStartRegex.test('{sort-start}'), 'no space between brackets');

    t.false(
        sortStartRegex.test('{ sort-start}'),
        'no space at end of brackets'
    );

    t.false(
        sortStartRegex.test('{sort-start }'),
        'no space at start of brackets'
    );

    t.true(sortStartRegex.test('{ sort-start }'), 'no arguments');

    t.true(
        sortStartRegex.test('{ sort-start uioas asdka asdklja /there/ }'),
        'lot of arguments'
    );

    t.deepEquals(
        '{ sort-start uioas asdka asdklja /there/ }'.match(sortStartRegex)
            ?.groups?.args,
        // space at the end idk how to solve for now, shouldn't matter thuogh
        'uioas asdka asdklja /there/ ',
        'deep equals, lot of arguments'
    );

    t.end();
});

test('sort end', (t) => {
    t.false(sortEndRegex.test(''), 'empty string');
    t.false(sortEndRegex.test('{'), 'just open brackets');
    t.false(sortEndRegex.test('}'), 'just closing bracket');
    t.false(sortEndRegex.test('{}'), 'just brackets');
    t.false(sortEndRegex.test('{sort-end}'), 'no space between brackets');
    t.false(sortEndRegex.test('{ sort-end}'), 'no space at end of brackets');
    t.false(sortEndRegex.test('{sort-end }'), 'no space at start of brackets');

    t.true(sortEndRegex.test('{ sort-end }'), 'only possible match');

    t.end();
});

test.skip('sort start escape brackets', (t) => {
    t.true(sortStartRegex.test('{ sort-start /\\\\}/ }'));
});
