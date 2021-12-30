// @ts-check

const test = require('tape');

const { sort } = require('../dist/main.js');
const { testString } = require('./testString.js');
const { nonMarkdownInputs: inputs, join } = require('../../test-utils.js');

const regexInputMediaMatch = /medi(a|cal)/;
const regexInputNumbersMatch = /-?\d+/;

/** @typedef {import("../dist/main.js").Options} Options */

test('regular sort', (t) => {
    /** @type {Options} */
    const options = {};

    testString(
        t,
        sort(inputs.simple, options),
        join('bear', 'gear', 'sear', 'there'),
        'simple list'
    );

    testString(
        t,
        sort(inputs.oneLevelDeepNestedList, options),
        `gear
  dear
hear
  beta
  zamma
  alpha
  gamma
there
zer`,
        '1 level deep nested list'
    );

    testString(
        t,
        sort(inputs.multiNestedList, options),
        `gear
  dear
    make do
    sake so
    aer do
    here me
      gamma
      mama
      aera
hear
  beta
  zamma
  alpha
  gamma
there
zer`,
        'multi deep nested list'
    );

    testString(
        t,
        sort(inputs.nestedListWithDescriptions, options),
        `Commands
  Migrations
    rake db: - migrate push all migrations to the database
    'STEP=3' - revert the last 3 migrations
  Rails
    c - start rails console, run code from your app!
  Rake
    Rake Task
    \`\`\`ruby
    desc 'process csv'
    task process_csv: :environment do
        Node.process_csv
    end
    \`\`\`
Package Upgrade Status:
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
        join('there', 'sear', 'gear', 'bear'),
        'simple list'
    );

    testString(
        t,
        sort(inputs.oneLevelDeepNestedList, options),
        `zer
there
hear
  beta
  zamma
  alpha
  gamma
gear
  dear`,
        '1 level deep nested list'
    );

    testString(
        t,
        sort(inputs.multiNestedList, options),
        `zer
there
hear
  beta
  zamma
  alpha
  gamma
gear
  dear
    make do
    sake so
    aer do
    here me
      gamma
      mama
      aera`,
        'multi deep nested list'
    );

    testString(
        t,
        sort(inputs.nestedListWithDescriptions, options),
        `Package Upgrade Status:
  1. Install Package
  2. Attach Plugin
  3. Review Installation
  ~~~
  |Install|Status|
  |Yes|Pending|
  ~~~
Commands
  Migrations
    rake db: - migrate push all migrations to the database
    'STEP=3' - revert the last 3 migrations
  Rails
    c - start rails console, run code from your app!
  Rake
    Rake Task
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
        `do
lol
make
so
There
there
there
THERE`,
        'simple list'
    );

    testString(
        t,
        sort(inputs.duplicates.oneLevelDeepNestedList, options),
        `do
  there
  THERE
  do
  HEllo
  hello
  grew
make
so
There
there
THEre
THERE
There`,
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
        `THERE
There
do
lol
make
so
there`,
        'simple list'
    );

    testString(
        t,
        sort(inputs.duplicates.oneLevelDeepNestedList, options),
        `THERE
THEre
There
do
  there
  THERE
  do
  HEllo
  hello
  grew
make
so
there`,
        'one level deep list'
    );

    testString(
        t,
        sort(
            `monkey
ape
zea
zea
  sea`,
            options
        ),
        `ape
monkey
zea
zea
  sea`,
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
        `ama
-91mark3
1
7
12
213dark
230`,
        'simple list'
    );

    testString(
        t,
        sort(inputs.numbers.oneLevelDeepNestedList, options),
        `hello
  my ex wife still misses me
  but her aim is getting better
-92
3
7
8aa
21a6
23`,
        'one level deep nested list'
    );

    t.end();
});

test('regex', (t) => {
    testString(
        t,
        sort(inputs.regex.media, {
            regexFilter: regexInputMediaMatch,
        }),
        `the matched text isn't here
consume media 24/7
the media Decimated my life
medical a
media hater
medical lover
media more like __
media zn`,
        'media regex no p argument'
    );

    testString(
        t,
        sort(inputs.regex.media, {
            regexFilter: regexInputMediaMatch,
            useMatchedRegex: true,
        }),
        `the matched text isn't here
media zn
media hater
consume media 24/7
media more like __
the media Decimated my life
medical lover
medical a`,
        'media regex with p argument'
    );

    testString(
        t,
        sort(inputs.regex.number, {
            regexFilter: regexInputNumbersMatch,
            useMatchedRegex: true,
        }),
        `the matched text isn't here
top 10 anime betrayals
It's been 18 years since I've felt the touch of a woman
An approximation of pi is 3.1415
King henry had 6 wives
7's the game
Cats have 9 lives`
    );

    t.end();
});

// uses inputs.regex for the text since all the other inputs have similar text length
test('length', (t) => {
    testString(
        t,
        sort(inputs.regex.media, { sortByLength: true }),
        `media zn
medical a
media hater
medical lover
consume media 24/7
media more like __
the matched text isn't here
the media Decimated my life`,
        'media'
    );

    testString(
        t,
        sort(inputs.regex.number, { sortByLength: true }),
        `7's the game
Cats have 9 lives
top 10 anime betrayals
King henry had 6 wives
the matched text isn't here
An approximation of pi is 3.1415
It's been 18 years since I've felt the touch of a woman`,
        'numbers'
    );

    testString(
        t,
        sort(inputs.multiByteCharacters, { sortByLength: true }),
        inputs.multiByteCharacters,
        'multi byte characters'
    );

    t.end();
});

test('floats', (t) => {
    testString(
        t,
        sort(inputs.simpleFloatList, { sortByFloat: true }),
        `1.20 max
dax 1.61
dax 2.3 hax
wack 12
12.0
as 13.13`,
        'simple list'
    );

    t.end();
});

// tbh not sure how to test this
test('random', (t) => {
    /** @type {Set<string>} */
    const nonRecursiveResults = new Set();
    /** @type {Set<string>} */
    const recursiveResults = new Set();

    for (let i = 0; i < 1000; i++) {
        nonRecursiveResults.add(
            sort(inputs.multiNestedList, {
                sortRandomly: true,
            })
        );

        recursiveResults.add(
            sort(inputs.multiNestedList, {
                sortRandomly: true,
                recursive: true,
            })
        );
    }

    // t.assert(results.size > 20, 'set is greater than 20');
    t.equals(nonRecursiveResults.size, 24, 'non recursive results 24');

    t.assert(
        recursiveResults.size > 900,
        'recursive results is greater than 900'
    );

    t.end();
});

test('sort naturally', (t) => {
    testString(
        t,
        sort(inputs.simpleNaturalList, { sortNaturally: true }),
        `a20
a51
a100
b23
c12
d91
g12
i could only see her once
no number here
z123`
    );

    t.end();
});

test('recursive, non reverse', (t) => {
    /** @type {Options} */
    const options = {
        recursive: true,
    };

    testString(
        t,
        sort(inputs.simple, options),
        join('bear', 'gear', 'sear', 'there'),
        'simple list'
    );

    testString(
        t,
        sort(inputs.oneLevelDeepNestedList, options),
        `gear
  dear
hear
  alpha
  beta
  gamma
  zamma
there
zer`,
        'one level deep nested list'
    );

    testString(
        t,
        sort(inputs.multiNestedList, options),
        `gear
  dear
    aer do
    here me
      aera
      gamma
      mama
    make do
    sake so
hear
  alpha
  beta
  gamma
  zamma
there
zer`,
        'multi deep nested list'
    );

    testString(
        t,
        sort(inputs.nestedListWithDescriptions, options),
        `Commands
  Migrations
    'STEP=3' - revert the last 3 migrations
    rake db: - migrate push all migrations to the database
  Rails
    c - start rails console, run code from your app!
  Rake
    Rake Task
    \`\`\`
    \`\`\`ruby
    desc 'process csv'
    end
    task process_csv: :environment do
        Node.process_csv
Package Upgrade Status:
  1. Install Package
  2. Attach Plugin
  3. Review Installation
  |Install|Status|
  |Yes|Pending|
  ~~~
  ~~~`,
        'multi nested list with descriptions in items'
    );

    t.end();
});

test('recursive, reverse', (t) => {
    /** @type {Options} */
    const options = {
        recursive: true,
        reverse: true,
    };

    testString(
        t,
        sort(inputs.simple, options),
        join('there', 'sear', 'gear', 'bear'),
        'simple list'
    );

    testString(
        t,
        sort(inputs.oneLevelDeepNestedList, options),
        `zer
there
hear
  zamma
  gamma
  beta
  alpha
gear
  dear`,
        '1 level deep nested list'
    );

    testString(
        t,
        sort(inputs.multiNestedList, options),
        `zer
there
hear
  zamma
  gamma
  beta
  alpha
gear
  dear
    sake so
    make do
    here me
      mama
      gamma
      aera
    aer do`,
        'multi deep nested list'
    );

    testString(
        t,
        sort(inputs.nestedListWithDescriptions, options),
        `Package Upgrade Status:
  ~~~
  ~~~
  |Yes|Pending|
  |Install|Status|
  3. Review Installation
  2. Attach Plugin
  1. Install Package
Commands
  Rake
    task process_csv: :environment do
        Node.process_csv
    end
    desc 'process csv'
    \`\`\`ruby
    \`\`\`
    Rake Task
  Rails
    c - start rails console, run code from your app!
  Migrations
    rake db: - migrate push all migrations to the database
    'STEP=3' - revert the last 3 migrations`,
        'multi deep nested list with descriptions in items'
    );

    t.end();
});

test('unique, case insensitive, recursive', (t) => {
    testString(
        t,
        sort(inputs.duplicates.simple, { caseInsensitive: true, unique: true }),
        `do
lol
make
so
There`,
        'both, simple list'
    );

    testString(
        t,
        sort(inputs.duplicates.nestedListWithDescriptions, {
            caseInsensitive: true,
            unique: true,
        }),
        `do
  there
  THERE
  do

    Once upon a time there was a blue whale.

  HEllo
  hello
  grew
make
so
There`,
        'both, nested list with descriptions list'
    );

    testString(
        t,
        sort(inputs.duplicates.nestedListWithDescriptions, {
            caseInsensitive: true,
            unique: true,
            recursive: true,
        }),
        `do
  do

    Once upon a time there was a blue whale.

  grew
  HEllo
  there
make
so
There`,
        'both, nested list with descriptions list, recursive'
    );

    testString(
        t,
        sort(inputs.duplicates.oneLevelDeepNestedList, {
            caseInsensitive: true,
            unique: true,
            recursive: true,
        }),
        `do
  do
  grew
  HEllo
  there
make
so
There`,
        'both + recursive, one level deep nested list'
    );

    testString(
        t,
        sort(inputs.duplicates.simple, {}),
        `THERE
There
do
lol
make
so
there
there`,
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
        `do
  do
  grew
  HEllo
  hello
  there
  THERE
make
so
There
there
THEre
THERE
There`,
        'one level nested list, case insensitive, recursive'
    );

    testString(
        t,
        sort(inputs.duplicates.oneLevelDeepNestedList, {
            unique: true,
            recursive: true,
        }),
        `THERE
THEre
There
do
  HEllo
  THERE
  do
  grew
  hello
  there
make
so
there`,
        'one level deep nested list, unique & recursive'
    );

    t.end();
});

test('length with regex', (t) => {
    testString(
        t,
        sort(inputs.regex.number, {
            sortByLength: true,
            regexFilter: regexInputNumbersMatch,
        }),
        `the matched text isn't here
An approximation of pi is 3.1415
King henry had 6 wives
Cats have 9 lives
7's the game
top 10 anime betrayals
It's been 18 years since I've felt the touch of a woman`,
        "number regex don't use match"
    );

    testString(
        t,
        sort(inputs.regex.number, {
            sortByLength: true,
            regexFilter: regexInputNumbersMatch,
            useMatchedRegex: true,
        }),
        `the matched text isn't here
7's the game
An approximation of pi is 3.1415
King henry had 6 wives
Cats have 9 lives
top 10 anime betrayals
It's been 18 years since I've felt the touch of a woman`,
        'number regex use match'
    );

    testString(
        t,
        sort(inputs.regex.media, {
            sortByLength: true,
            regexFilter: regexInputMediaMatch,
        }),
        `the matched text isn't here
medical a
media zn
consume media 24/7
medical lover
media hater
media more like __
the media Decimated my life`,
        "media regex don't use match"
    );

    testString(
        t,
        sort(inputs.regex.media, {
            sortByLength: true,
            regexFilter: regexInputMediaMatch,
            useMatchedRegex: true,
        }),
        `the matched text isn't here
media zn
media hater
consume media 24/7
media more like __
the media Decimated my life
medical lover
medical a`,
        'media regex use matched'
    );

    t.end();
});

test('regex + n', (t) => {
    testString(
        t,
        sort(inputs.regex.number, {
            regexFilter: regexInputNumbersMatch,
            useMatchedRegex: true,
            sortNumerically: true,
        }),
        `the matched text isn't here
An approximation of pi is 3.1415
King henry had 6 wives
7's the game
Cats have 9 lives
top 10 anime betrayals
It's been 18 years since I've felt the touch of a woman`,
        'use number regex, use matched'
    );

    // not sure how to implement it, maybe something like --use-match-group {number}?
    //     testString(
    //         t,
    //         sort(
    //             `there are 2 numbers here 7
    // that should -10 convince you enough 10
    // but there lies 1 only tales of it 27
    // right slayer123? or no? 2`,
    //             {
    //                 regexFilter: /\d+[^\d]+(\d+)/,
    //                 useMatchedRegex: true,
    //                 sortNumerically: true,
    //             }
    //         ),
    //         `right slayer123? or no? 2
    // there are -10 numbers here 7
    // that should 6 convince you enough 10
    // but there lies 1 only tales of it 27`,
    //         'test double numbers, capture second'
    //     );

    t.end();
});

test('seperator', (t) => {
    const sectionSeperator = /^    <div/;

    testString(
        t,
        sort(inputs.sectionSeperator.divChildren, {
            sectionSeperator,
        }),
        `    <div class="child">
        <h3>Earl Henry</h3>
        <p>Aerospace</p>
        <div class="something">
            lorem ipsum
        </div>
    </div>
    <div class="child">
        <h3>Elijah Tyler</h3>
        <p>Math</p>
        <div class="something">
            lorem ipsum
        </div>
    </div>
    <div class="child">
        <h3>Herman Reed</h3>
        <p>English</p>
        <div class="something">
            lorem ipsum
        </div>
    </div>
    <div class="child">
        <h3>Zachary Garrett</h3>
        <p>Computer Science</p>
        <div class="something">
            lorem ipsum
        </div>
    </div>`,
        'div children'
    );

    testString(
        t,
        sort(inputs.sectionSeperator.divChildren, {
            sectionSeperator,
            regexFilter: /<p>/,
        }),
        `    <div class="child">
        <h3>Earl Henry</h3>
        <p>Aerospace</p>
        <div class="something">
            lorem ipsum
        </div>
    </div>
    <div class="child">
        <h3>Zachary Garrett</h3>
        <p>Computer Science</p>
        <div class="something">
            lorem ipsum
        </div>
    </div>
    <div class="child">
        <h3>Herman Reed</h3>
        <p>English</p>
        <div class="something">
            lorem ipsum
        </div>
    </div>
    <div class="child">
        <h3>Elijah Tyler</h3>
        <p>Math</p>
        <div class="something">
            lorem ipsum
        </div>
    </div>`,
        'div children with regex filer on <p>'
    );

    t.end();
});

/*

    Can't find any combo that works with sectionSeperator, /^Title/ is close,
    but there's no blank line after the atom theme, and there's an extra empty
    line after Material Dark
    
    It makes sense why it does it, and I think trying to make it work with 
    sectionSeperator will just be a hack, and unintuitive. Instead I'm thinking
    another option might be required, like --seperate-on? 

*/
test.skip('seperation with blank lines', (t) => {
    testString(
        t,
        sort(
            `Theme: Material Dark
Link: https://example.com

Theme: Horizon
Link: https://example.com

Theme: Ayu Dark
Link: https://example.com

Theme: Atom One Dark
Link: https://example.com`,
            {
                sectionSeperator: /^Title/,
            }
        ),
        `Theme: Atom One Dark
Link: https://example.com

Theme: Ayu Dark
Link: https://example.com

Theme: Horizon
Link: https://example.com

Theme: Material Dark
Link: https://example.com`,
        'seperation by blank lines'
    );

    t.end();
});
