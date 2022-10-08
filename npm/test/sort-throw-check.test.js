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

    helper({ sortByFloat: true, sortByLength: true }, 'throws on fl');
    helper({ sortByFloat: true, sortNumerically: true }, 'throws on fn');
    helper({ sortByFloat: true, sortRandomly: true }, 'throws on fz');
    helper({ sortByFloat: true, sortNaturally: true }, 'throws on fe');

    helper({ sortByLength: true, sortNumerically: true }, 'throws on ln');
    helper({ sortByLength: true, sortRandomly: true }, 'throws on lz');
    helper({ sortByLength: true, sortNaturally: true }, 'throws on le');

    helper({ sortNumerically: true, sortRandomly: true }, 'throws on nz');
    helper({ sortNumerically: true, sortNaturally: true }, 'throws on ne');

    helper({ sortRandomly: true, sortNaturally: true }, 'throws on ze');

    helper({ caseInsensitive: true, sortNaturally: true }, 'throws on ie');
    helper({ caseInsensitive: true, sortNumerically: true }, 'throws on in');
    helper({ caseInsensitive: true, sortByFloat: true }, 'throws on if');
    helper({ caseInsensitive: true, sortByLength: true }, 'throws on il');
    helper({ caseInsensitive: true, sortRandomly: true }, 'throws on iz');

    helper(
        { sortRandomly: true, regexFilter: /me/ },
        'throws on random + pattern'
    );

    helper(
        { caseInsensitive: true, sortNumerically: true, regexFilter: /\d+/ },
        'still throws on in when pattern is specified'
    );

    t.doesNotThrow(
        () =>
            sort('', {
                caseInsensitive: true,
                sortNumerically: true,
                unique: true,
                reportErrors: true,
            }),
        'does not throw on in when u is specified'
    );

    t.doesNotThrow(() => {
        sort('', {
            sortNaturally: true,
            regexFilter: /my/,
            reportErrors: true,
        });
    }, 'does not throw on natural + pattern');

    t.end();
});
