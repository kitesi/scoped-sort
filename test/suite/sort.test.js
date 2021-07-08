// @ts-check

const test = require('tape');
const sort = require('../../src/sort.js');
const { inputs, join, testString } = require('./utils.js');

test('non recursive, non reverse', (t) => {
    const options = {};

    testString(
        t,
        sort(inputs[0], options),
        join('- bear', '- gear', '- sear', '- there'),
        'simple non nested list'
    );

    testString(
        t,
        sort(inputs[1], options),
        join('- a', '- b', '- g', '- op', '- z'),
        'another simple non nested list'
    );

    testString(
        t,
        sort(inputs[2], options),
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
        sort(inputs[3], options),
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
        sort(inputs[4], options),
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
        'descriptions in items'
    );

    t.end();
});

test('non recursive, reverse', (t) => {
    const options = {
        reverse: true,
    };

    testString(
        t,
        sort(inputs[0], options),
        join('- there', '- sear', '- gear', '- bear'),
        'simple non nested list'
    );

    testString(
        t,
        sort(inputs[1], options),
        join('- z', '- op', '- g', '- b', '- a'),
        'another simple non nested list'
    );

    testString(
        t,
        sort(inputs[2], options),
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
        sort(inputs[3], options),
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
        sort(inputs[4], options),
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
        'descriptions in items'
    );

    t.end();
});

test('recursive, non reverse', (t) => {
    const options = {
        recursive: true,
    };

    testString(
        t,
        sort(inputs[0], options),
        join('- bear', '- gear', '- sear', '- there'),
        'simple non nested list'
    );

    testString(
        t,
        sort(inputs[1], options),
        join('- a', '- b', '- g', '- op', '- z'),
        'another simple non nested list'
    );

    testString(
        t,
        sort(inputs[2], options),
        `- gear
  - dear
- hear
  - alpha
  - beta
  - gamma
  - zamma
- there
- zer`,
        '1 level deep nested list'
    );

    testString(
        t,
        sort(inputs[3], options),
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
        sort(inputs[4], options),
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
        'descriptions in items'
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
        sort(inputs[0], options),
        join('- there', '- sear', '- gear', '- bear'),
        'simple non nested list'
    );

    testString(
        t,
        sort(inputs[1], options),
        join('- z', '- op', '- g', '- b', '- a'),
        'another simple non nested list'
    );

    testString(
        t,
        sort(inputs[2], options),
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
        sort(inputs[3], options),
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
        sort(inputs[4], options),
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
        'descriptions in items'
    );

    t.end();
});

const duplicateInputs = [
    `- There
- there
- make
- so
- do
- lol
- there
- THERE`,
    `- There
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
];

test('unique', (t) => {
    testString(
        t,
        sort(duplicateInputs[0], { unique: true }),
        `- THERE
- There
- do
- lol
- make
- so
- there`,
        'simple 1 level deep list'
    );

    testString(
        t,
        sort(duplicateInputs[1], { unique: true }),
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
        'simple 2 level deep list'
    );

    testString(
        t,
        sort(duplicateInputs[1], { unique: true, recursive: true }),
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
        'simple 2 level deep list, recursive'
    );

    testString(
        t,
        sort(
            `- monkey
- ape
- zea
- zea
  - sea`,
            { unique: true }
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

test('case insensitive', (t) => {
    testString(
        t,
        sort(duplicateInputs[0], { caseInsensitive: true, unique: false }),
        `- do
- lol
- make
- so
- There
- there
- there
- THERE`,
        '1 level deep list, case insensitive'
    );

    testString(
        t,
        sort(duplicateInputs[1], { caseInsensitive: true }),
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
        'nested list, case insensitive'
    );

    testString(
        t,
        sort(duplicateInputs[1], { caseInsensitive: true, recursive: true }),
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
        'nested list, case insensitive, recursive'
    );

    t.end();
});

test('combination of unique and case-insensitive', (t) => {
    testString(
        t,
        sort(duplicateInputs[0], { caseInsensitive: true, unique: true }),
        `- do
- lol
- make
- so
- There`,
        'both, 1 level deep'
    );

    testString(
        t,
        sort(duplicateInputs[1], {
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
        'both + recursive, nested list'
    );

    testString(
        t,
        sort(duplicateInputs[0], { caseInsensitive: false, unique: false }),
        `- THERE
- There
- do
- lol
- make
- so
- there
- there`,
        'simple 1 level deep list, neither'
    );

    t.end();
});
