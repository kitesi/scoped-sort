// @ts-check
const test = require('tape');

const { sort } = require('../dist/main.js');

/** @typedef {import("../dist/main.js").Options} Options */

test('testing if throws', (t) => {
    /**
     * @param {Options} extraOptions
     * @param {string} msg
     */
    function helper(extraOptions, msg) {
        t.throws(
            () =>
                sort('', {
                    reportErrors: true,
                    ...extraOptions,
                }),
            msg
        );
    }

    helper(
        { sorter: 'random', regexFilter: /me/ },
        'throws on random + pattern'
    );

    helper(
        { sorter: 'random', useMatchedRegex: true },
        'throws on random + use-matched-regex'
    );

    helper(
        { regexFilter: /\d/, fieldSeperator: ' ' },
        'throws on regex + field-seperator'
    );

    helper(
        {
            useMatchedRegex: true,
            sortGroups: [],
        },
        'throws on use-matched-regex + sort-groups'
    );

    t.doesNotThrow(() => {
        sort('', {
            sorter: 'natural',
            regexFilter: /my/,
            reportErrors: true,
        });
    }, 'does not throw on natural + pattern');

    t.end();
});
