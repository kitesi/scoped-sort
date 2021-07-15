// @ts-check

const test = require('tape');
const { sort } = require('../../dist/sort.js');
const { markdownInputs: inputs, join, testString } = require('../utils.js');

/**
 *
 * @param {test.Test} t
 * @param {string} input
 * @param {import("../../dist/sort.js").Options} options
 * @param {string} expected
 * @param {string} message
 */
function assertNoChangeWithMarkdownOption(
    t,
    input,
    options,
    expected,
    message
) {
    testString(t, sort(input, options), expected, message + ': no m');

    testString(
        t,
        sort(input, { ...options, markdown: true }),
        expected,
        message + ': with m'
    );
}

/** @typedef {import("../../dist/sort.js").Options} Options */

test('regular sort', (t) => {
    /** @type {Options} */
    const options = {};

    assertNoChangeWithMarkdownOption(
        t,
        inputs.simple,
        options,
        join('- bear', '- gear', '- sear', '- there'),
        'simple list'
    );

    assertNoChangeWithMarkdownOption(
        t,
        inputs.oneLevelDeepNestedList,
        options,
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

    assertNoChangeWithMarkdownOption(
        t,
        inputs.multiNestedList,
        options,
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

    assertNoChangeWithMarkdownOption(
        t,
        inputs.nestedListWithDescriptions,
        options,
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

    assertNoChangeWithMarkdownOption(
        t,
        inputs.simple,
        options,
        join('- there', '- sear', '- gear', '- bear'),
        'simple list'
    );

    assertNoChangeWithMarkdownOption(
        t,
        inputs.oneLevelDeepNestedList,
        options,
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

    assertNoChangeWithMarkdownOption(
        t,
        inputs.multiNestedList,
        options,
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

    assertNoChangeWithMarkdownOption(
        t,
        inputs.nestedListWithDescriptions,
        options,
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

    assertNoChangeWithMarkdownOption(
        t,
        inputs.duplicates.simple,
        options,
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

    assertNoChangeWithMarkdownOption(
        t,
        inputs.duplicates.oneLevelDeepNestedList,
        options,
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

    assertNoChangeWithMarkdownOption(
        t,
        inputs.duplicates.simple,
        options,
        `- THERE
- There
- do
- lol
- make
- so
- there`,
        'simple list'
    );

    assertNoChangeWithMarkdownOption(
        t,
        inputs.duplicates.oneLevelDeepNestedList,
        options,
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

    assertNoChangeWithMarkdownOption(
        t,
        `- monkey
- ape
- zea
- zea
  - sea`,
        options,
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

    assertNoChangeWithMarkdownOption(
        t,
        inputs.numbers.simple,
        options,
        `- ama
- -91mark3
- 1
- 7
- 12
- 213dark
- 230`,
        'simple list'
    );

    assertNoChangeWithMarkdownOption(
        t,
        inputs.numbers.oneLevelDeepNestedList,
        options,
        `- hello
  - my ex wife still misses me
  - but her aim is getting better
- -92
- 3
- 7
- 8aa
- 21a6
- 23`,
        'one level deep nested list'
    );

    t.end();
});

test('regex', (t) => {
    assertNoChangeWithMarkdownOption(
        t,
        inputs.regex.media,
        {
            regex: /media/,
        },
        `- the matched text isn't here
- consume media 24/7
- the media Decimated my life
- media a
- media hater
- media lover
- media more like __
- media z`,
        'regex: /media/ no m argument'
    );

    assertNoChangeWithMarkdownOption(
        t,
        inputs.regex.media,
        {
            regex: /media/,
            useMatchedRegex: true,
        },
        `- the matched text isn't here
- media z
- media a
- media lover
- media hater
- consume media 24/7
- media more like __
- the media Decimated my life`,
        'regex: /media/ with m argument'
    );

    assertNoChangeWithMarkdownOption(
        t,
        inputs.regex.number,
        {
            regex: /\d+/,
            useMatchedRegex: true,
        },
        `- the matched text isn't here
- top 10 anime betrayals
- It's been 18 years since I've felt the touch of a woman
- An approximation of pi is 3.1415
- King henry had 6 wives
- 7's the game
- Cats have 9 lives`,
        '/\\d+/'
    );

    t.end();
});

test('recursive, non reverse', (t) => {
    const options = {
        recursive: true,
    };

    assertNoChangeWithMarkdownOption(
        t,
        inputs.simple,
        options,
        join('- bear', '- gear', '- sear', '- there'),
        'simple list'
    );

    assertNoChangeWithMarkdownOption(
        t,
        inputs.oneLevelDeepNestedList,
        options,
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

    assertNoChangeWithMarkdownOption(
        t,
        inputs.multiNestedList,
        options,
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
    \`\`\`
    \`\`\`ruby
    desc 'process csv'
    end
    task process_csv: :environment do
        Node.process_csv
* Package Upgrade Status:
  1. Install Package
  2. Attach Plugin
  3. Review Installation
  |Install|Status|
  |Yes|Pending|
  ~~~
  ~~~`,
        'multi nested list with descriptions in items: no m'
    );

    testString(
        t,
        sort(inputs.nestedListWithDescriptions, { ...options, markdown: true }),
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
        'multi nested list with descriptions in items: with m'
    );

    t.end();
});

test('recursive, reverse', (t) => {
    const options = {
        recursive: true,
        reverse: true,
    };

    assertNoChangeWithMarkdownOption(
        t,
        inputs.simple,
        options,
        join('- there', '- sear', '- gear', '- bear'),
        'simple list'
    );

    assertNoChangeWithMarkdownOption(
        t,
        inputs.oneLevelDeepNestedList,
        options,
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

    assertNoChangeWithMarkdownOption(
        t,
        inputs.multiNestedList,
        options,
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
  ~~~
  ~~~
  |Yes|Pending|
  |Install|Status|
  3. Review Installation
  2. Attach Plugin
  1. Install Package
* Commands
  * Rake
    task process_csv: :environment do
        Node.process_csv
    end
    desc 'process csv'
    \`\`\`ruby
    \`\`\`
    * Rake Task
  * Rails
    * c - start rails console, run code from your app!
  * Migrations
    * rake db: migrate - push all migrations to the database
    * 'STEP=3' - revert the last 3 migrations`,
        'multi nested list with descriptions in items: no m'
    );

    testString(
        t,
        sort(inputs.nestedListWithDescriptions, { ...options, markdown: true }),
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
        'multi deep nested list with descriptions in items: with m'
    );

    t.end();
});

test('unique, case insensitive, recursive', (t) => {
    assertNoChangeWithMarkdownOption(
        t,
        inputs.duplicates.simple,
        { caseInsensitive: true, unique: true },
        `- do
- lol
- make
- so
- There`,
        'both, simple list'
    );

    assertNoChangeWithMarkdownOption(
        t,
        inputs.duplicates.nestedListWithDescriptions,
        {
            caseInsensitive: true,
            unique: true,
        },
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

    assertNoChangeWithMarkdownOption(
        t,
        inputs.duplicates.nestedListWithDescriptions,
        {
            caseInsensitive: true,
            unique: true,
            recursive: true,
        },
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

    assertNoChangeWithMarkdownOption(
        t,
        inputs.duplicates.oneLevelDeepNestedList,
        {
            caseInsensitive: true,
            unique: true,
            recursive: true,
        },
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

    assertNoChangeWithMarkdownOption(
        t,
        inputs.duplicates.simple,
        {},
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
    assertNoChangeWithMarkdownOption(
        t,
        inputs.duplicates.oneLevelDeepNestedList,
        {
            caseInsensitive: true,
            recursive: true,
        },
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

    assertNoChangeWithMarkdownOption(
        t,
        inputs.duplicates.oneLevelDeepNestedList,
        {
            unique: true,
            recursive: true,
        },
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
