// @ts-check

const { diffStringsUnified } = require('jest-diff');
/** @param {string[]} lines */
const join = (...lines) => lines.join('\n');

// simple => non nested list
// nestedDescriptions => nested list + has descriptions
module.exports.join = join;
module.exports.inputs = {
    simple: join('- there', '- bear', '- sear', '- gear'),
    oneLevelDeepNestedList: `- there
- hear
  - beta
  - zamma
  - alpha
  - gamma
- gear
  - dear
- zer`,
    multiNestedList: `- there
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
    nestedListWithDescriptions: `* Commands
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
    duplicates: {
        simple: `- There
- there
- make
- so
- do
- lol
- there
- THERE`,
        oneLevelDeepNestedList: `- There
- there
- make
- so
- do
  - there
  - THERE
  - do
  - HEllo
  - hello
  - grew
- THEre
- THERE
- There`,
        nestedListWithDescriptions: `- There
- there
- make
- so
- do
  - there
  - THERE
  - do

    Once upon a time there was a blue whale.

  - HEllo
  - hello
  - grew
- THEre
- THERE
- There`,
    },
    numbers: {
        simple: `- 7
- 1
- 230
- 213dark
- 91mark3
- ama
- 12`,
        oneLevelDeepNestedList: `- 23
- 7
- 8aa
- hello
  - my ex wife still misses me
  - but her aim is getting better
- 21a6
- 3
- 92`,
    },
};
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
        // console.log(`EXPECTED:\n\n${expected}`);
        // console.log(`ACTUAL:\n\n${actual}`);
        console.log(diffStringsUnified(expected, actual));
    }
};

module.exports.allowedArguments = ['s', 'r', 'i', 'n', 'u'];
