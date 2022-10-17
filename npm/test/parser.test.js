// @ts-check
const {
    tokenizeArgString,
    parseArgsIntoOptions,
    parseSortGroupKeys,
    sortGroupMatchRegex,
    sortGroupInnerValuesMatchRegex,
    sortGroupArgsMatchRegex,
    isValidSortGroupTest,
} = require('../dist/parser');
const test = require('tape');

test('sortGroupMatchRegex & isValidSortGroupTest', (t) => {
    /**
     * @param {string} sortGroup
     * @param {string[]|null} expectedMatches
     * @param {string} msg
     */
    function shouldMatchAndPass(sortGroup, expectedMatches, msg) {
        t.deepEquals(
            sortGroup.match(sortGroupMatchRegex),
            expectedMatches,
            msg
        );

        t.true(isValidSortGroupTest.test(sortGroup), msg + ': test');
    }

    /**
     * @param {string} sortGroup
     * @param {string[]|null} expectedMatches
     * @param {string} msg
     */
    function shouldMatchButNotPass(sortGroup, expectedMatches, msg) {
        t.deepEquals(
            sortGroup.match(sortGroupMatchRegex),
            expectedMatches,
            msg
        );
        t.false(isValidSortGroupTest.test(sortGroup), msg + ': test');
    }

    shouldMatchAndPass('{3}', ['{3}'], 'normal simple 1 number');

    shouldMatchAndPass(
        '{3,15}',
        ['{3,15}'],
        'normal simple 1 bracket with two numbers by comma'
    );

    shouldMatchAndPass(
        '{3,15,13}',
        ['{3,15,13}'],
        'normal simple 1 bracket with three numbers by comma'
    );

    shouldMatchAndPass('{3}aajs', ['{3}aajs'], '1 bracket with arguments');
    shouldMatchAndPass(
        '{3}a=1',
        ['{3}a=1'],
        '1 bracket with explicit argument'
    );

    shouldMatchAndPass(
        '{3}a_a=1',
        ['{3}a_a=1'],
        '1 bracket with arguments + explicit'
    );

    shouldMatchAndPass(
        '{3}a=1_bcd',
        ['{3}a=1_bcd'],
        '1 bracket with arguments + explicit (explicit written first)'
    );

    shouldMatchAndPass(
        '{42}sn_u=234_i{3..5}dsf{6}asgsdg,{90..132}',
        ['{42}sn_u=234_i', '{3..5}dsf', '{6}asgsdg', '{90..132}'],
        'more complex with tons of everything'
    );
    shouldMatchButNotPass(
        '{3}ax=i',
        ['{3}ax'],
        '1 bracket with letter argument no _'
    );

    shouldMatchButNotPass('{3..}', null, 'simple closing range with no ending');
    shouldMatchButNotPass(
        '{3..}ab',
        null,
        'simple closing range with no ending and arguments'
    );

    shouldMatchButNotPass(
        '{3..}ab_c=2',
        null,
        'simple closing range with no ending and arguments + explicit'
    );

    shouldMatchButNotPass('{3}=a23', ['{3}'], 'invalid explicit argument');
    shouldMatchButNotPass(
        '{3}99999',
        ['{3}'],
        'invalid characters after bracket'
    );

    shouldMatchButNotPass('{3-}', null, 'invalid range (3-)');
    shouldMatchButNotPass('{3-12}', null, 'invalid range (3-12)');
    shouldMatchButNotPass('{3,-35}', null, 'invalid range (-35)');
    shouldMatchButNotPass('{1,3-23,..}', null, 'invalid closing range (,..)');
    shouldMatchButNotPass(
        '{3-a}',
        null,
        'invalid [a-zA-Z] character in bracket'
    );

    t.end();
});

test('sortGroupInnerValuesMatchRegex and sortGroupArgsMatchRege', (t) => {
    /**
     *
     * @param {string} input
     * @param {string[]|null} expected
     * @param {string} msg
     */
    function testInnerValuesMatch(input, expected, msg) {
        const results = input.match(sortGroupInnerValuesMatchRegex);
        t.deepEquals(results && [results[1], results[2]], expected, msg);
    }

    /**
     *
     * @param {string} input
     * @param {string[]|null} expected
     * @param {string} msg
     */
    function testSortGroupArgsMatch(input, expected, msg) {
        t.deepEquals(input.match(sortGroupArgsMatchRegex), expected, msg);
    }

    testInnerValuesMatch('{2}', ['2', ''], 'normal no range or args');
    testInnerValuesMatch(
        '{2,3}',
        ['2,3', ''],
        'normal with commas no range or args'
    );
    testInnerValuesMatch('{2..3}', ['2..3', ''], 'normal with range no args');
    testInnerValuesMatch('{2}l', ['2', 'l'], 'normal no range no args');
    testInnerValuesMatch('{2,3}l', ['2,3', 'l'], 'normal with comma no range ');
    testInnerValuesMatch('{2..3}a', ['2..3', 'a'], 'normal with range & args');

    testSortGroupArgsMatch(
        'abcdef',
        ['a', 'b', 'c', 'd', 'e', 'f'],
        'all normal letters'
    );
    testSortGroupArgsMatch('u=i', ['u=i'], 'starting with a letter=arg');
    testSortGroupArgsMatch(
        'u=i_a',
        ['u=i', 'a'],
        'starting with a letter=arg and then an argument after _'
    );
    testSortGroupArgsMatch(
        'a_u=2',
        ['a', 'u=2'],
        'starting with a letter and then a letter=argument after _'
    );
    testSortGroupArgsMatch(
        'a_u=2_x=n',
        ['a', 'u=2', 'x=n'],
        'starting with a letter and two letter arguments'
    );
    testSortGroupArgsMatch('ax=i', ['a', 'x=i'], 'letter argument with no _');
    testSortGroupArgsMatch('a=i', ['a=i'], 'letter argument at start');

    t.end();
});

test('test regex parser', (t) => {
    /**
     * @param {string} input
     * @param {RegExp} expected
     * @param {string} msg
     */
    function expectRegex(input, expected, msg) {
        t.deepEquals(
            parseArgsIntoOptions(tokenizeArgString('--regex ' + input)),
            { options: { regexFilter: expected }, errors: [], positionals: [] },
            msg
        );
    }

    /**
     * @param {string} input
     * @param {string} expected
     * @param {string} msg
     */
    function expectError(input, expected, msg) {
        t.deepEquals(
            parseArgsIntoOptions(tokenizeArgString('--regex ' + input)),
            { errors: [expected], positionals: [], options: {} },
            msg
        );
    }

    expectRegex('/\\d/', /\d/, 'regular regex');
    expectRegex('/\\d/i', /\d/i, 'regular regex with i flag');
    expectRegex('/\\{/', /\{/, 'regex with escaped {');
    expectRegex(`/\\"/`, /\"/, 'regex with blackslash for quote');

    // might seem weird how the program lists 'd' or 'd/' as the input,
    // this is because the tokenizer ignores \\ if not inside of a regex
    // /\\d is still outputed as /\\d because of the starting slash
    //
    // this is an issue, and thinking of how to fix it
    expectError(
        '\\d',
        "Expected regex, got: '\\d'",
        'no starting and ending slash'
    );
    expectError('/\\d', "Expected regex, got: '/\\d'", 'no ending slash');
    expectError('\\d/', "Expected regex, got: '\\d/'", 'no starting slash');
    expectError(
        '/\\d/m',
        "The only regex flag allowed is 'i'. Recieved: 'm'",
        'invalid flag'
    );

    t.end();
});

test('parsing sort group keys', (t) => {
    /**
     * @param {string} input
     * @param {Partial<ReturnType<typeof parseSortGroupKeys>>} expected
     * @param {string} msg
     */
    function expectResult(input, expected, msg) {
        t.deepEquals(parseSortGroupKeys(input), expected, msg);
    }

    expectResult(
        '{2}l',
        {
            errors: [],
            sortGroups: [
                { forNumbers: [2], sortGroupArgs: { sorter: 'length' } },
            ],
        },
        '-k {2}l'
    );

    expectResult(
        '{3}a',
        {
            errors: [],
            sortGroups: [
                {
                    forNumbers: [3],
                    sortGroupArgs: { attachNonMatchingToBottom: true },
                },
            ],
        },
        '-k {3}a'
    );

    expectResult(
        '{2..10}ns',
        {
            errors: [],
            sortGroups: [
                {
                    forNumbers: [2, 3, 4, 5, 6, 7, 8, 9, 10],
                    sortGroupArgs: {
                        sorter: 'numerical',
                        reverse: true,
                    },
                },
            ],
        },
        '-k {2..10}'
    );

    expectResult(
        '{3..5}u',
        {
            errors: [],
            sortGroups: [
                { forNumbers: [3, 4, 5], sortGroupArgs: { unique: 'exact' } },
            ],
        },
        '-k {3..5}'
    );

    expectResult(
        '{5}s',
        {
            errors: [],
            sortGroups: [{ forNumbers: [5], sortGroupArgs: { reverse: true } }],
        },
        '-k {5}s'
    );

    expectResult(
        '{5}u=i',
        {
            errors: [],
            sortGroups: [
                {
                    forNumbers: [5],
                    sortGroupArgs: { unique: 'case-insensitive' },
                },
            ],
        },
        '-k {5}u=i'
    );

    expectResult(
        '{5}x_u=i',
        {
            errors: [],
            sortGroups: [
                {
                    forNumbers: [5],
                    sortGroupArgs: {
                        sorter: 'none',
                        unique: 'case-insensitive',
                    },
                },
            ],
        },
        '-k {5}x_u=i'
    );

    expectResult(
        '{2}xu{1}',
        {
            errors: [],
            sortGroups: [
                {
                    forNumbers: [2],
                    sortGroupArgs: { sorter: 'none', unique: 'exact' },
                },
                { forNumbers: [1], sortGroupArgs: {} },
            ],
        },
        '-k {2}xu{1}'
    );

    expectResult(
        '{3..1}',
        {
            errors: [
                'End range must be higher than the starting range for sort group: {3..1}',
            ],
            sortGroups: [{ forNumbers: [], sortGroupArgs: {} }],
        },
        'ending range bigger than starting'
    );

    t.end();
});

test('parsing sort group keys', (t) => {
    /**
     * @param {string} input
     * @param {ReturnType<import('../dist/parser').parseArgsIntoOptions>} expected
     * @param {string} msg
     */
    function expectResult(input, expected, msg) {
        t.deepEquals(
            parseArgsIntoOptions(tokenizeArgString('-k ' + input)),
            expected,
            msg
        );
    }

    expectResult(
        '{2}l',
        {
            errors: [],
            positionals: [],
            options: { sortGroups: [{ group: 2, sorter: 'length' }] },
        },
        '-k {2}l'
    );

    expectResult(
        '{3}a',
        {
            errors: [],
            positionals: [],
            options: {
                sortGroups: [{ group: 3, attachNonMatchingToBottom: true }],
            },
        },
        '-k {3}a'
    );

    expectResult(
        '{2..10}ns',
        {
            errors: [],
            positionals: [],
            options: {
                sortGroups: [
                    { group: 2, sorter: 'numerical', reverse: true },
                    { group: 3, sorter: 'numerical', reverse: true },
                    { group: 4, sorter: 'numerical', reverse: true },
                    { group: 5, sorter: 'numerical', reverse: true },
                    { group: 6, sorter: 'numerical', reverse: true },
                    { group: 7, sorter: 'numerical', reverse: true },
                    { group: 8, sorter: 'numerical', reverse: true },
                    { group: 9, sorter: 'numerical', reverse: true },
                    { group: 10, sorter: 'numerical', reverse: true },
                ],
            },
        },
        '-k {2..10}'
    );

    expectResult(
        '{3..5}u',
        {
            errors: [],
            positionals: [],
            options: {
                sortGroups: [
                    { group: 3, unique: 'exact' },
                    { group: 4, unique: 'exact' },
                    { group: 5, unique: 'exact' },
                ],
            },
        },
        '-k {3..5}'
    );

    expectResult(
        '{5}s',
        {
            errors: [],
            positionals: [],
            options: { sortGroups: [{ group: 5, reverse: true }] },
        },
        '-k {5}s'
    );

    expectResult(
        '{5}u=i',
        {
            errors: [],
            positionals: [],
            options: { sortGroups: [{ group: 5, unique: 'case-insensitive' }] },
        },
        '-k {5}u=i'
    );

    expectResult(
        '{5}x_u=i',
        {
            errors: [],
            positionals: [],
            options: {
                sortGroups: [
                    { group: 5, sorter: 'none', unique: 'case-insensitive' },
                ],
            },
        },
        '-k {5}x_u=i'
    );

    expectResult(
        '{2}xu{1}',
        {
            errors: [],
            positionals: [],
            options: {
                sortGroups: [
                    { group: 2, sorter: 'none', unique: 'exact' },
                    { group: 1 },
                ],
            },
        },
        '-k {2}xu{1}'
    );

    expectResult(
        '{3..}k',
        {
            errors: ['Sort group key did not pass the regex test.'],
            positionals: [],
            options: {},
        },
        '-k "{3..}k"'
    );

    expectResult(
        '{3}nl',
        {
            errors: ["Can't have more than one sorter in sort group"],
            positionals: [],
            options: {},
        },
        '-k {3}nl'
    );

    expectResult(
        '{3}{5}n{3}',
        {
            errors: ['Conflicting sort group numbers'],
            positionals: [],
            options: {},
        },
        '-k {3}{5}n{3}'
    );

    expectResult(
        '{1..5}{3}',
        {
            errors: ['Conflicting sort group numbers'],
            positionals: [],
            options: {},
        },
        '-k {1..5}{3}'
    );

    t.end();
});

test('string argument tokenizer', (t) => {
    t.deepEquals(
        tokenizeArgString('--hi there --my name is jake'),
        ['--hi', 'there', '--my', 'name', 'is', 'jake'],
        'basic arguments'
    );

    t.deepEquals(
        tokenizeArgString('--hi \t\t  there     yolo'),
        ['--hi', 'there', 'yolo'],
        'basic arguments with multiple spaces in between'
    );

    t.deepEquals(
        tokenizeArgString('--hi there "/i love you/"'),
        ['--hi', 'there', '/i love you/'],
        'quoted arguments with multiple spaces'
    );

    t.deepEquals(
        tokenizeArgString(
            `--hi "there \\\"my\\\"" name is jake 'you \\\'feel\\\' me?'`
        ),
        ['--hi', 'there "my"', 'name', 'is', 'jake', "you 'feel' me?"],
        'quoted arguments'
    );

    t.deepEquals(
        tokenizeArgString('--section-seperator /\\w+/'),
        ['--section-seperator', '/\\w+/'],
        'backslash inside regex'
    );

    t.deepEquals(tokenizeArgString('-su'), ['-su'], 'short option group');

    t.deepEquals(
        tokenizeArgString('-s3u'),
        ['-s3u'],
        'short option group works with arguments right next'
    );

    t.deepEquals(
        tokenizeArgString('--regex /\\"/'),
        ['--regex', '/\\"/'],
        'backslash before "'
    );

    t.end();
});

test('arg array into options (single options)', (t) => {
    /**
     * @param {string[]} args
     * @param {ReturnType<import('../dist/parser').parseArgsIntoOptions>} result
     * @param {string} msg
     */
    function expectResult(args, result, msg) {
        t.deepEquals(parseArgsIntoOptions(args), result, msg);
    }

    /**
     * @param {string[]} args
     * @param {import('../dist/main').Options} options
     * @param {string} msg
     */
    function expectOptions(args, options, msg) {
        expectResult(
            args,
            {
                options,
                errors: [],
                positionals: [],
            },
            msg
        );
    }

    /**
     * @param {string} main
     * @param {string} alias
     * @param {import('../dist/main').Options} options
     */
    function expectOptionsWithSingleAndAlias(main, alias, options) {
        const flags = tokenizeArgString(main);
        main = flags.shift() || '';

        expectOptions([main, ...flags], options, main);
        expectOptions([alias, ...flags], options, alias);
    }

    /**
     * @param {string} main
     * @param {string} alias
     * @param {import('../dist/main').Options} options
     */
    function expectBooleanOptionsWithSingleAndAlias(main, alias, options) {
        expectOptionsWithSingleAndAlias(main, alias, options);

        for (const [key, value] of Object.entries(options)) {
            if (typeof value === 'boolean') {
                options[key] = !value;
            }
        }

        expectOptions(['--no-' + main.slice(2)], options, main + ' (--no-)');
        expectOptions(['--no-' + alias.slice(1)], options, alias + ' (--no-)');
    }

    expectOptionsWithSingleAndAlias('--case-insensitive', '-i', {
        sorter: 'case-insensitive',
    });

    expectOptionsWithSingleAndAlias('--natural-sort', '-e', {
        sorter: 'natural',
    });

    expectOptionsWithSingleAndAlias('--numerical-sort', '-n', {
        sorter: 'numerical',
    });

    expectOptionsWithSingleAndAlias('--float-sort', '-f', {
        sorter: 'float',
    });

    expectOptionsWithSingleAndAlias('--length-sort', '-l', {
        sorter: 'length',
    });

    expectOptionsWithSingleAndAlias('--random-sort', '-z', {
        sorter: 'random',
    });

    expectOptionsWithSingleAndAlias('--unique', '-u', {
        unique: 'exact',
    });

    expectOptionsWithSingleAndAlias('--unique i', '-u', {
        unique: 'case-insensitive',
    });

    expectBooleanOptionsWithSingleAndAlias('--recursive', '-r', {
        recursive: true,
    });

    expectBooleanOptionsWithSingleAndAlias('--reverse', '-s', {
        reverse: true,
    });

    expectBooleanOptionsWithSingleAndAlias('--markdown', '-m', {
        markdown: true,
    });

    expectBooleanOptionsWithSingleAndAlias('--use-matched-regex', '-p', {
        useMatchedRegex: true,
    });

    expectBooleanOptionsWithSingleAndAlias(
        '--attach-non-matching-to-bottom',
        '-a',
        {
            attachNonMatchingToBottom: true,
        }
    );

    expectResult(
        ['-F/'],
        {
            errors: [],
            positionals: [],
            options: { fieldSeperator: '/' },
        },
        '-F'
    );

    expectResult(
        ['--field-seperator', '/'],
        {
            errors: [],
            positionals: [],
            options: { fieldSeperator: '/' },
        },
        '--field-seperator'
    );

    expectResult(
        ['--unique', 'al'],
        {
            errors: ['Invalid value for --unique, only "i" is allowed.'],
            positionals: [],
            options: {},
        },
        '--unique al'
    );

    expectResult(
        ['-k', '{3}n'],
        {
            errors: [],
            positionals: [],
            options: {
                sortGroups: [
                    {
                        group: 3,
                        sorter: 'numerical',
                    },
                ],
            },
        },
        '-k {3}n'
    );

    // the next two tests have been done before but only with parseSortGroupsKey()
    // just checking if they are properly called here
    expectResult(
        ['--use-sort-group', '{3..}k'],
        {
            errors: ['Sort group key did not pass the regex test.'],
            positionals: [],
            options: {},
        },
        '--use-sort-group "{3..}k"'
    );

    expectResult(
        ['-k', '{3}nl'],
        {
            errors: ["Can't have more than one sorter in sort group"],
            positionals: [],
            options: {},
        },
        '-k {3}nl'
    );

    t.end();
});

test('arg array into options (combining options)', (t) => {
    /**
     * @param {string[]|string} args
     * @param {import('../dist/main').Options} options
     */
    function expectOptions(args, options) {
        if (typeof args === 'string') {
            args = tokenizeArgString(args);
        }

        t.deepEquals(parseArgsIntoOptions(args), {
            options,
            positionals: [],
            errors: [],
        });
    }

    /**
     * @param {string[]|string} args
     * @param {string} msg
     */
    function expectError(args, msg) {
        if (typeof args === 'string') {
            args = tokenizeArgString(args);
        }

        t.deepEquals(parseArgsIntoOptions(args).errors, [msg]);
    }

    expectOptions('-su', {
        reverse: true,
        unique: 'exact',
    });

    expectOptions('-nu', {
        sorter: 'numerical',
        unique: 'exact',
    });

    expectOptions('-s --regex /\\w/', {
        reverse: true,
        regexFilter: /\w/,
    });

    expectOptions('-sp --regex /\\w/', {
        reverse: true,
        regexFilter: /\w/,
        useMatchedRegex: true,
    });

    expectOptions('-s --regex /\\w/ -p', {
        reverse: true,
        regexFilter: /\w/,
        useMatchedRegex: true,
    });

    expectOptions('--section-starter /^Title/', {
        sectionStarter: /^Title/,
    });

    expectOptions('--section-starter "/^  <div/"', {
        sectionStarter: /^  <div/,
    });

    expectOptions('--sectionSeperator "/Title: /"', {
        sectionSeperator: /Title: /,
    });

    expectOptions('--section-rejoiner "\\n\\n"', {
        sectionRejoiner: '\n\n',
    });

    expectError('--hi', 'Unknown option: --hi');
    expectError(
        '--numerical-sort --random-sort',
        "Can't have more than one sorter"
    );

    t.deepEquals(parseArgsIntoOptions(tokenizeArgString('hi there you')), {
        positionals: ['hi', 'there', 'you'],
        errors: [],
        options: {},
    });

    t.end();
});
