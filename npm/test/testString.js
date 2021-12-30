/**
 *
 * @param {import("tape").Test} t
 * @param {string} actual
 * @param {string} expected
 * @param {string} [message]
 */
module.exports.testString = function (t, actual, expected, message) {
    t.equals(actual, expected, message);

    if (actual !== expected) {
        console.log(diffStringsUnified(expected, actual));
    }
};
