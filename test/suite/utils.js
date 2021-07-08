// @ts-check

const { diffStringsUnified } = require('jest-diff');
/** @param {string[]} lines */
const join = (...lines) => lines.join('\n');

module.exports.join = join;
module.exports.inputs = [
    join('- there', '- bear', '- sear', '- gear'),
    join('- a', '- b', '- z', '- g', '- op'),
    `- there
- hear
  - beta
  - zamma
  - alpha
  - gamma
- gear
  - dear
- zer`,
    `- there
- hear
  - beta
  - zamma
  - alpha
  - gamma
- gear
  - dear
    - make do
    - sake so
    - aer do
    - here me
      - gamma
      - mama
      - aera
- zer`,
    `* Commands
  * Migrations
    * rake db: migrate - push all migrations to the database
    * 'STEP=3' - revert the last 3 migrations
  * Rails
    * c - start rails console, run code from your app!
  * Rake
    * Rake Task
    \`\`\`ruby
    desc 'process csv'
    task process_csv: :environment do
        Node.process_csv
    end
    \`\`\`
* Package Upgrade Status:
  1. Install Package
  2. Attach Plugin
  3. Review Installation
  ~~~
  |Install|Status|
  |Yes|Pending|
  ~~~`,
];

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
