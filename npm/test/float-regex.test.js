// @ts-check

const test = require('tape');
const { floatRegex } = require('../dist/utils.js');

/** @param {string} str */
const getValue = (str) => str.match(floatRegex)?.[0];

test('float regex', (t) => {
    t.equals(getValue('ajslkdjalskdj 23.2 jmake'), '23.2');
    t.equals(getValue('ajslkdjalskdj -23.2 jmake'), '-23.2');
    t.equals(getValue('ajslkdjalskdj 23. jmake'), '23');
    t.equals(getValue('ajslkdjalskdj -23. jmake'), '-23');
    t.equals(getValue('ajslkdjalskdj .2 make'), '.2');
    t.equals(getValue('ajslkdjalskdj -.2 make'), '-.2');
    t.equals(getValue('ajslkdjalskdj 23 jmake'), '23');
    t.equals(getValue('ajslkdjalskdj -23 jmake'), '-23');
    t.equals(getValue('ajslkdjalskdj make'), undefined);
    t.equals(getValue('ajslkdjalskdj . make'), undefined);

    t.end();
});

test.skip('scientific notation/exponential', (t) => {
    t.equals(getValue('ajslkdjalskdj -4.70e+9'), '-4.70e+9');
    t.equals(getValue('ajslkdjalskdj 3.2e23'), '3.2e23');
    t.equals(getValue('ajslkdjalskdj -.2E-4'), '-.2E-4');
});
