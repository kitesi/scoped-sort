// @ts-check

const test = require('tape');
const sort = require('../../src/sort.js');
const { inputs, join, testString } = require('../utils.js');

/** @typedef {import("../../src/sort.js").Options} Options */

test('normal sort', (t) => {
    /** @type {Options} */
    const options = {};

    testString(
        t,
        sort(inputs.simple, options),
        join('- bear', '- gear', '- sear', '- there'),
        'simple list'
    );

    testString(
        t,
        sort(inputs.oneLevelDeepNestedList, options),
        `- gear
  - dear
- hear
  - beta
  - zamma
  - alpha
  - gamma
- there
- zer`,
        '1 level deep nested list'
    );

    testString(
        t,
        sort(inputs.multiNestedList, options),
        `- gear
  - dear
    - make do
    - sake so
    - aer do
    - here me
      - gamma
      - mama
      - aera
- hear
  - beta
  - zamma
  - alpha
  - gamma
- there
- zer`,
        'multi deep nested list'
    );

    testString(
        t,
        sort(inputs.nestedListWithDescriptions, options),
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
        'multi nested list with descriptions in items'
    );

    t.end();
});

test('reverse', (t) => {
    /** @type {Options} */
    const options = {
        reverse: true,
    };

    testString(
        t,
        sort(inputs.simple, options),
        join('- there', '- sear', '- gear', '- bear'),
        'simple list'
    );

    testString(
        t,
        sort(inputs.oneLevelDeepNestedList, options),
        `- zer
- there
- hear
  - beta
  - zamma
  - alpha
  - gamma
- gear
  - dear`,
        '1 level deep nested list'
    );

    testString(
        t,
        sort(inputs.multiNestedList, options),
        `- zer
- there
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
      - aera`,
        'multi deep nested list'
    );

    testString(
        t,
        sort(inputs.nestedListWithDescriptions, options),
        `* Package Upgrade Status:
  1. Install Package
  2. Attach Plugin
  3. Review Installation
  ~~~
  |Install|Status|
  |Yes|Pending|
  ~~~
* Commands
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
    \`\`\``,
        'multi nested list with descriptions in items'
    );

    t.end();
});

test('case insensitive', (t) => {
    /** @type {Options} */
    const options = {
        caseInsensitive: true,
    };

    testString(
        t,
        sort(inputs.duplicates.simple, options),
        `- do
- lol
- make
- so
- There
- there
- there
- THERE`,
        'simple list'
    );

    testString(
        t,
        sort(inputs.duplicates.oneLevelDeepNestedList, options),
        `- do
  - there
  - THERE
  - do
  - HEllo
  - hello
  - grew
- make
- so
- There
- there
- THEre
- THERE
- There`,
        'one level deep nested list'
    );

    t.end();
});

test('unique', (t) => {
    /** @type {Options} */
    const options = { unique: true };

    testString(
        t,
        sort(inputs.duplicates.simple, options),
        `- THERE
- There
- do
- lol
- make
- so
- there`,
        'simple list'
    );

    testString(
        t,
        sort(inputs.duplicates.oneLevelDeepNestedList, options),
        `- THERE
- THEre
- There
- do
  - there
  - THERE
  - do
  - HEllo
  - hello
  - grew
- make
- so
- there`,
        'one level deep list'
    );

    testString(
        t,
        sort(
            `- monkey
- ape
- zea
- zea
  - sea`,
            options
        ),
        `- ape
- monkey
- zea
- zea
  - sea`,
        'duplicate with nested item'
    );

    t.end();
});

test('sort numerically', (t) => {
    /** @type {Options} */
    const options = { sortNumerically: true };

    testString(
        t,
        sort(inputs.numbers.simple, options),
        `- ama
- 1
- 7
- 12
- 91mark3
- 213dark
- 230`,
        'simple list'
    );

    testString(
        t,
        sort(inputs.numbers.oneLevelDeepNestedList, options),
        `- hello
  - my ex wife still misses me
  - but her aim is getting better
- 3
- 7
- 8aa
- 21a6
- 23
- 92`,
        'one level deep nested list'
    );

    t.end();
});

test('recursive, non reverse', (t) => {
    const options = {
        recursive: true,
    };

    testString(
        t,
        sort(inputs.simple, options),
        join('- bear', '- gear', '- sear', '- there'),
        'simple list'
    );

    testString(
        t,
        sort(inputs.oneLevelDeepNestedList, options),
        `- gear
  - dear
- hear
  - alpha
  - beta
  - gamma
  - zamma
- there
- zer`,
        'one level deep nested list'
    );

    testString(
        t,
        sort(inputs.multiNestedList, options),
        `- gear
  - dear
    - aer do
    - here me
      - aera
      - gamma
      - mama
    - make do
    - sake so
- hear
  - alpha
  - beta
  - gamma
  - zamma
- there
- zer`,
        'multi deep nested list'
    );

    testString(
        t,
        sort(inputs.nestedListWithDescriptions, options),
        `* Commands
  * Migrations
    * 'STEP=3' - revert the last 3 migrations
    * rake db: migrate - push all migrations to the database
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
        'multi nested list with descriptions in items'
    );

    t.end();
});

test('recursive, reverse', (t) => {
    const options = {
        recursive: true,
        reverse: true,
    };

    testString(
        t,
        sort(inputs.simple, options),
        join('- there', '- sear', '- gear', '- bear'),
        'simple list'
    );

    testString(
        t,
        sort(inputs.oneLevelDeepNestedList, options),
        `- zer
- there
- hear
  - zamma
  - gamma
  - beta
  - alpha
- gear
  - dear`,
        '1 level deep nested list'
    );

    testString(
        t,
        sort(inputs.multiNestedList, options),
        `- zer
- there
- hear
  - zamma
  - gamma
  - beta
  - alpha
- gear
  - dear
    - sake so
    - make do
    - here me
      - mama
      - gamma
      - aera
    - aer do`,
        'multi deep nested list'
    );

    testString(
        t,
        sort(inputs.nestedListWithDescriptions, options),
        `* Package Upgrade Status:
  1. Install Package
  2. Attach Plugin
  3. Review Installation
  ~~~
  |Install|Status|
  |Yes|Pending|
  ~~~
* Commands
  * Rake
    * Rake Task
    \`\`\`ruby
    desc 'process csv'
    task process_csv: :environment do
        Node.process_csv
    end
    \`\`\`
  * Rails
    * c - start rails console, run code from your app!
  * Migrations
    * rake db: migrate - push all migrations to the database
    * 'STEP=3' - revert the last 3 migrations`,
        'multi deep nested list with descriptions in items'
    );

    t.end();
});

test('unique, case insensitive, recursive', (t) => {
    testString(
        t,
        sort(inputs.duplicates.simple, { caseInsensitive: true, unique: true }),
        `- do
- lol
- make
- so
- There`,
        'both, simple list'
    );

    testString(
        t,
        sort(inputs.duplicates.nestedListWithDescriptions, {
            caseInsensitive: true,
            unique: true,
        }),
        `- do
  - there
  - THERE
  - do

    Once upon a time there was a blue whale.

  - HEllo
  - hello
  - grew
- make
- so
- There`,
        'both, nested list with descriptions list'
    );

    testString(
        t,
        sort(inputs.duplicates.nestedListWithDescriptions, {
            caseInsensitive: true,
            unique: true,
            recursive: true,
        }),
        `- do
  - do

    Once upon a time there was a blue whale.

  - grew
  - HEllo
  - there
- make
- so
- There`,
        'both, nested list with descriptions list, recursive'
    );

    testString(
        t,
        sort(inputs.duplicates.oneLevelDeepNestedList, {
            caseInsensitive: true,
            unique: true,
            recursive: true,
        }),
        `- do
  - do
  - grew
  - HEllo
  - there
- make
- so
- There`,
        'both + recursive, one level deep nested list'
    );

    testString(
        t,
        sort(inputs.duplicates.simple, {}),
        `- THERE
- There
- do
- lol
- make
- so
- there
- there`,
        'simple list, none'
    );

    t.end();
});

test('others with recursive', (t) => {
    testString(
        t,
        sort(inputs.duplicates.oneLevelDeepNestedList, {
            caseInsensitive: true,
            recursive: true,
        }),
        `- do
  - do
  - grew
  - HEllo
  - hello
  - there
  - THERE
- make
- so
- There
- there
- THEre
- THERE
- There`,
        'one level nested list, case insensitive, recursive'
    );

    testString(
        t,
        sort(inputs.duplicates.oneLevelDeepNestedList, {
            unique: true,
            recursive: true,
        }),
        `- THERE
- THEre
- There
- do
  - HEllo
  - THERE
  - do
  - grew
  - hello
  - there
- make
- so
- there`,
        'one level deep nested list, unique & recursive'
    );

    t.end();
});
