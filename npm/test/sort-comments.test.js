// @ts-check

const test = require('tape');
const { nonMarkdownInputs: inputs } = require('../../test-utils');
const { sortComments, sort } = require('../dist/main');
const { commentRegexs } = require('../dist/utils');

const { sortStart: sortStartRegex, sortEnd: sortEndRegex } = commentRegexs;

test('sort start regex', (t) => {
    /**
     * @param {string} line
     * @param {string} expectedArgs
     * @param {string} msg
     */
    function testTrueAndArg(line, expectedArgs, msg) {
        t.true(sortStartRegex.test(line), 'works on test: ' + msg);
        t.equals(
            line.match(sortStartRegex)?.groups?.args || '',
            expectedArgs,
            'args check out: ' + msg
        );
    }

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

    testTrueAndArg('{ sort-start }', '', 'no arguments');

    testTrueAndArg(
        '{ sort-start uioas asdka asdklja /there/ }',
        'uioas asdka asdklja /there/',
        'lot of arguments'
    );

    testTrueAndArg(
        '{ sort-start --regex /\\}/ }',
        '--regex /\\}/',
        'ending bracket inside'
    );

    testTrueAndArg('{ sort-start }} }', '}}', 'unesacped brackets');

    t.end();
});

test('sort end regex', (t) => {
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

test('actual usage', (t) => {
    /**
     * @param {string} input
     * @param {ReturnType<typeof sortComments>} expected
     * @param {string} msg
     */
    function checkAll(input, expected, msg) {
        t.deepEquals(sortComments(input), expected, msg);
    }

    /**
     * @param {string} input
     * @param {import('../dist/main').Options} options
     */
    function sortIgnoringFirstAndSecondLine(input, options = {}) {
        const lines = input.split('\n');
        const firstLine = lines.shift() || '';
        const lastLine = lines.pop() || '';
        return (
            firstLine + '\n' + sort(lines.join('\n'), options) + '\n' + lastLine
        );
    }

    /**
     * @param {string} input
     * @param {string} options
     */
    function generateSortCommentSection(input, options = '') {
        return `// { sort-start ${
            options ? options + ' ' : ''
        }}\n${input}\n// { sort-end }`;
    }

    const simpleSortComment = generateSortCommentSection(inputs.simple);

    checkAll(
        simpleSortComment,
        {
            errors: [],
            commentSections: [{ startLine: 0, endLine: 5, hasChanged: true }],
            result: sortIgnoringFirstAndSecondLine(simpleSortComment),
        },
        'simple, no options'
    );

    const numberList = generateSortCommentSection(
        inputs.numbers.oneLevelDeepNestedList,
        '-n'
    );

    checkAll(
        numberList,
        {
            errors: [],
            commentSections: [{ startLine: 0, endLine: 10, hasChanged: true }],
            result: sortIgnoringFirstAndSecondLine(numberList, {
                sorter: 'numerical',
            }),
        },
        'check if works with -n option'
    );

    const noComments = `hi there
you look like a fan
are you?
now, you should tell me`;

    checkAll(
        noComments,
        {
            commentSections: [],
            errors: [],
            result: noComments,
        },
        'no sort comments'
    );

    const unfinishedSortStartOne = `// { sort-start }
there you go
with your gold
how could you do that`;

    checkAll(
        unfinishedSortStartOne,
        {
            errors: ['Did not finish sort-start comment at line 1'],
            commentSections: [
                { startLine: 0, endLine: null, hasChanged: false },
            ],
            result: unfinishedSortStartOne,
        },
        'unfinished sort start, only one sort comment'
    );

    const positionalsInSortStart = `// { sort-start ooga booga }\n${inputs.oneLevelDeepNestedList}\n// { sort-end }`;

    checkAll(
        positionalsInSortStart,
        {
            commentSections: [
                {
                    startLine: 0,
                    endLine: 10,
                    hasChanged: false,
                },
            ],
            errors: [
                'Recieved unknown positional arguments: ooga, booga at line 1',
            ],
            result: positionalsInSortStart,
        },
        'positionals in sort start'
    );

    const unfinishedSortStartTwo = `// { sort-start }
${inputs.duplicates.nestedListWithDescriptions}
// { sort-start }
my grocery list
apple
banana
// { sort-end }
// { sort-end }`;

    checkAll(
        unfinishedSortStartTwo,
        {
            commentSections: [
                {
                    startLine: 0,
                    endLine: null,
                    hasChanged: false,
                },
            ],
            errors: [
                "Recieved sort-start comment at line 19 but didn't finish the one at 0",
            ],
            result: unfinishedSortStartTwo,
        },
        'unfinished sort start, two sort comments'
    );

    const unknownOption = `// { sort-start --start }
${inputs.sectionStarter.divChildren}
// { sort-end }`;

    checkAll(
        unknownOption,
        {
            commentSections: [{ startLine: 0, endLine: 29, hasChanged: false }],
            errors: ['Unknown option: --start at line 1'],
            result: unknownOption,
        },
        'unknown option: --start'
    );

    const invalidNoPrefixUsage = `// { sort-start --no-case-insensitive }
${inputs.sectionStarter.divChildren}
// { sort-end }`;

    checkAll(
        invalidNoPrefixUsage,
        {
            commentSections: [{ startLine: 0, endLine: 29, hasChanged: false }],
            errors: [
                'Used --no- prefix on property that does not expect booleans at line 1',
            ],
            result: invalidNoPrefixUsage,
        },
        'invalid no prefix usage on option'
    );

    t.end();
});
