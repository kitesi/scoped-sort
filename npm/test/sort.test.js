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
        sorter: 'case-insensitive',
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
    const options = { unique: 'exact' };

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
    const options = { sorter: 'numerical' };

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
        sort(inputs.regex.media, { sorter: 'length' }),
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
        sort(inputs.regex.number, { sorter: 'length' }),
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
        sort(inputs.multiByteCharacters, { sorter: 'length' }),
        inputs.multiByteCharacters,
        'multi byte characters'
    );

    t.end();
});

test('floats', (t) => {
    testString(
        t,
        sort(inputs.simpleFloatList, { sorter: 'float' }),
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
                sorter: 'random',
            })
        );

        recursiveResults.add(
            sort(inputs.multiNestedList, {
                sorter: 'random',
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
        sort(inputs.simpleNaturalList, { sorter: 'natural' }),
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

    testString(
        t,
        sort(
            `c12 my a28
b23 my 95
a51 my88
a100  my 01
d91 my 22
z123
i could only see her once
g12
a20
no number herea`,
            { sorter: 'natural', regexFilter: /my / }
        ),
        `a51 my88
z123
i could only see her once
g12
a20
no number herea
a100  my 01
d91 my 22
b23 my 95
c12 my a28`,
        'natural with regex'
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
        sort(inputs.duplicates.simple, {
            sorter: 'case-insensitive',
            unique: 'case-insensitive',
        }),
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
            sorter: 'case-insensitive',
            unique: 'case-insensitive',
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
            sorter: 'case-insensitive',
            unique: 'case-insensitive',
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
            sorter: 'case-insensitive',
            unique: 'case-insensitive',
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
            sorter: 'case-insensitive',
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
            unique: 'exact',
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
            sorter: 'length',
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
            sorter: 'length',
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
            sorter: 'length',
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
            sorter: 'length',
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
            sorter: 'numerical',
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

    testString(
        t,
        sort(inputs.regex.number, {
            regexFilter: regexInputNumbersMatch,
            useMatchedRegex: true,
            sorter: 'numerical',
            attachNonMatchingToBottom: true,
        }),
        `An approximation of pi is 3.1415
King henry had 6 wives
7's the game
Cats have 9 lives
top 10 anime betrayals
It's been 18 years since I've felt the touch of a woman
the matched text isn't here`,
        'use number regex, use matched, matched to bottom'
    );

    testString(
        t,
        sort(
            `there are 2 numbers here 7
that should -10 convince you enough 10
but there lies 1 only tales of it 27
right slayer123? or no? 2`,
            {
                regexFilter: /(-?\d+)[^\d]+(-?\d+)/,
                sortGroups: [
                    {
                        group: 3,
                        sorter: 'numerical',
                    },
                ],
            }
        ),
        `right slayer123? or no? 2
there are 2 numbers here 7
that should -10 convince you enough 10
but there lies 1 only tales of it 27`,
        'test numbers, capture second, no g flag'
    );

    testString(
        t,
        sort(
            `there are 2 numbers here 7
that should -10 convince you enough 10
but there lies 1 only tales of it 27
right slayer123? or no? 2`,
            {
                regexFilter: /-?\d+/g,
                sortGroups: [
                    {
                        group: 2,
                        sorter: 'numerical',
                    },
                ],
            }
        ),
        `right slayer123? or no? 2
there are 2 numbers here 7
that should -10 convince you enough 10
but there lies 1 only tales of it 27`,
        'test numbers, capture second'
    );

    t.end();
});

test('field separator', (t) => {
    const csvTable = `Jake,Lil Peep,30
Niel,The Neighbourhood,12
Max,Arctic Monkeys,72
Jo,AJR,65`;

    testString(
        t,
        sort(csvTable, {
            fieldSeparator: /,/,
            sortGroups: [
                {
                    group: 2,
                    sorter: 'length',
                },
            ],
        }),
        `Jo,AJR,65
Jake,Lil Peep,30
Max,Arctic Monkeys,72
Niel,The Neighbourhood,12`,
        'csv table: -F, -k {2}l'
    );

    testString(
        t,
        sort(csvTable, {
            fieldSeparator: /,/,
            sortGroups: [
                {
                    group: 3,
                    sorter: 'numerical',
                },
            ],
        }),
        `Niel,The Neighbourhood,12
Jake,Lil Peep,30
Jo,AJR,65
Max,Arctic Monkeys,72`,
        'csv table: -F, -k {3}n'
    );

    t.end();
});

const listOfPersonalInfoTables = `Sam    18  Male       140
Jack   23  Non-Binary 120
Niel   16  Female     135
Max    17  Male       135
Jane   22  Female     100
max    17  male       135
Jones  17  male       135
Lydia  N/A N/A        120
Mike   N/A male       N/A`;

test('sort groups', (t) => {
    testString(
        t,
        sort(listOfPersonalInfoTables, {
            sortGroups: [
                {
                    group: 2,
                    sorter: 'numerical',
                },
            ],
        }),
        `Lydia  N/A N/A        120
Mike   N/A male       N/A
Niel   16  Female     135
Max    17  Male       135
max    17  male       135
Jones  17  male       135
Sam    18  Male       140
Jane   22  Female     100
Jack   23  Non-Binary 120`,
        'list of personal info: -k {2}n'
    );

    testString(
        t,
        sort(listOfPersonalInfoTables, {
            sortGroups: [
                {
                    group: 2,
                    sorter: 'numerical',
                    reverse: true,
                },
            ],
        }),
        `Jack   23  Non-Binary 120
Jane   22  Female     100
Sam    18  Male       140
Max    17  Male       135
max    17  male       135
Jones  17  male       135
Niel   16  Female     135
Lydia  N/A N/A        120
Mike   N/A male       N/A`,
        'list of personal info: -k {2}ns'
    );

    testString(
        t,
        sort(listOfPersonalInfoTables, {
            sortGroups: [
                {
                    group: 2,
                    sorter: 'numerical',
                    attachNonMatchingToBottom: true,
                },
            ],
        }),
        `Niel   16  Female     135
Max    17  Male       135
max    17  male       135
Jones  17  male       135
Sam    18  Male       140
Jane   22  Female     100
Jack   23  Non-Binary 120
Lydia  N/A N/A        120
Mike   N/A male       N/A`,
        'list of personal info -k {2}na'
    );

    testString(
        t,
        sort(listOfPersonalInfoTables, {
            sortGroups: [
                {
                    group: 2,
                    sorter: 'numerical',
                    reverse: true,
                    attachNonMatchingToBottom: true,
                },
            ],
        }),
        `Lydia  N/A N/A        120
Mike   N/A male       N/A
Jack   23  Non-Binary 120
Jane   22  Female     100
Sam    18  Male       140
Max    17  Male       135
max    17  male       135
Jones  17  male       135
Niel   16  Female     135`,
        'list of personal info -k {2}nas'
    );

    testString(
        t,
        sort(listOfPersonalInfoTables, {
            sortGroups: [
                {
                    group: 3,
                },
            ],
        }),
        `Niel   16  Female     135
Jane   22  Female     100
Sam    18  Male       140
Max    17  Male       135
Lydia  N/A N/A        120
Jack   23  Non-Binary 120
max    17  male       135
Jones  17  male       135
Mike   N/A male       N/A`,
        'list of personal info: -k {3}'
    );

    testString(
        t,
        sort(listOfPersonalInfoTables, {
            sortGroups: [
                {
                    group: 3,
                    sorter: 'case-insensitive',
                },
            ],
        }),
        `Niel   16  Female     135
Jane   22  Female     100
Sam    18  Male       140
Max    17  Male       135
max    17  male       135
Jones  17  male       135
Mike   N/A male       N/A
Lydia  N/A N/A        120
Jack   23  Non-Binary 120`,
        'list of personal info: -k {3}i'
    );

    testString(
        t,
        sort(listOfPersonalInfoTables, {
            sorter: 'case-insensitive',
            sortGroups: [
                {
                    group: 3,
                },
            ],
        }),
        `Niel   16  Female     135
Jane   22  Female     100
Sam    18  Male       140
Max    17  Male       135
max    17  male       135
Jones  17  male       135
Mike   N/A male       N/A
Lydia  N/A N/A        120
Jack   23  Non-Binary 120`,
        'list of personal info: -k {3} --case-insensitive; check if uppermost passes down'
    );

    testString(
        t,
        sort(listOfPersonalInfoTables, {
            sortGroups: [
                {
                    group: 3,
                    reverse: true,
                },
            ],
        }),
        `max    17  male       135
Jones  17  male       135
Mike   N/A male       N/A
Jack   23  Non-Binary 120
Lydia  N/A N/A        120
Sam    18  Male       140
Max    17  Male       135
Niel   16  Female     135
Jane   22  Female     100`,
        'list of personal info: -k {3}s'
    );

    testString(
        t,
        sort(listOfPersonalInfoTables, {
            sortGroups: [
                {
                    group: 3,
                    sorter: 'case-insensitive',
                    reverse: true,
                },
            ],
        }),
        `Jack   23  Non-Binary 120
Lydia  N/A N/A        120
Sam    18  Male       140
Max    17  Male       135
max    17  male       135
Jones  17  male       135
Mike   N/A male       N/A
Niel   16  Female     135
Jane   22  Female     100`,
        'list of personal info: -k {3}is'
    );

    testString(
        t,
        sort(listOfPersonalInfoTables, {
            sortGroups: [
                {
                    group: 3,
                    unique: 'exact',
                },
            ],
        }),
        `Niel   16  Female     135
Sam    18  Male       140
Lydia  N/A N/A        120
Jack   23  Non-Binary 120
max    17  male       135`,
        'list of personal info: -k {3}u'
    );

    testString(
        t,
        sort(listOfPersonalInfoTables, {
            sortGroups: [
                {
                    group: 3,
                    unique: 'case-insensitive',
                },
            ],
        }),
        `Niel   16  Female     135
Sam    18  Male       140
Lydia  N/A N/A        120
Jack   23  Non-Binary 120`,
        'list of personal info: -k {3}u=i'
    );

    testString(
        t,
        sort(listOfPersonalInfoTables, {
            sortGroups: [
                {
                    group: 3,
                    sorter: 'none',
                    unique: 'exact',
                },
            ],
        }),
        `Sam    18  Male       140
Jack   23  Non-Binary 120
Niel   16  Female     135
max    17  male       135
Lydia  N/A N/A        120`,
        'list of personal info: -k {3}xu'
    );

    testString(
        t,
        sort(listOfPersonalInfoTables, {
            sortGroups: [
                {
                    group: 3,
                    sorter: 'none',
                    unique: 'case-insensitive',
                },
            ],
        }),
        `Sam    18  Male       140
Jack   23  Non-Binary 120
Niel   16  Female     135
Lydia  N/A N/A        120`,
        'list of personal info: -k {3}x_u=i'
    );

    testString(
        t,

        sort(listOfPersonalInfoTables, {
            sortGroups: [
                {
                    group: 2,
                    sorter: 'numerical',
                },
                {
                    group: 4,
                    sorter: 'numerical',
                    attachNonMatchingToBottom: true,
                },
            ],
        }),
        `Lydia  N/A N/A        120
Mike   N/A male       N/A
Niel   16  Female     135
Max    17  Male       135
max    17  male       135
Jones  17  male       135
Sam    18  Male       140
Jane   22  Female     100
Jack   23  Non-Binary 120`,
        'list of personal info: -k {2}n{4}na'
    );

    testString(
        t,
        sort(listOfPersonalInfoTables, {
            sortGroups: [
                {
                    group: 2,
                    sorter: 'none',
                    unique: 'exact',
                },
                {
                    group: 1,
                },
            ],
        }),
        `Jack   23  Non-Binary 120
Jane   22  Female     100
Lydia  N/A N/A        120
Max    17  Male       135
Niel   16  Female     135
Sam    18  Male       140`,
        'list of personal info: -k {2}xu{1}'
    );

    testString(
        t,
        sort(listOfPersonalInfoTables, {
            regexFilter: /(?<= |^)\w{3}(?= |$)/,
            sortGroups: [
                {
                    group: 1,
                    reverse: true,
                },
            ],
        }),
        `max    17  male       135
Sam    18  Male       140
Max    17  Male       135
Niel   16  Female     135
Jones  17  male       135
Jack   23  Non-Binary 120
Lydia  N/A N/A        120
Jane   22  Female     100
Mike   N/A male       N/A`,
        'list of personal info: -k {1}s --regex /(?<= |^)w{3}(?= |$)/'
    );

    t.end();
});

test('sort order', (t) => {
    testString(
        t,
        sort(listOfPersonalInfoTables, {
            sortOrder: {
                values: ['female', 'non-binary', 'male', 'n/a'],
                caseInsensitive: true,
            },
            sortGroups: [
                {
                    group: 3,
                },
            ],
        }),
        `Niel   16  Female     135
Jane   22  Female     100
Jack   23  Non-Binary 120
Sam    18  Male       140
Max    17  Male       135
max    17  male       135
Jones  17  male       135
Mike   N/A male       N/A
Lydia  N/A N/A        120`,
        'sort-order on gender column 3, sort-order on uppermost'
    );

    testString(
        t,
        sort(listOfPersonalInfoTables, {
            sortGroups: [
                {
                    group: 3,
                    sortOrder: {
                        values: ['female', 'non-binary', 'male', 'n/a'],
                        caseInsensitive: true,
                    },
                },
            ],
        }),
        `Niel   16  Female     135
Jane   22  Female     100
Jack   23  Non-Binary 120
Sam    18  Male       140
Max    17  Male       135
max    17  male       135
Jones  17  male       135
Mike   N/A male       N/A
Lydia  N/A N/A        120`,
        'sort-order on gender column 3, sort-order on sort-group'
    );

    testString(
        t,
        sort(listOfPersonalInfoTables, {
            sortGroups: [
                {
                    group: 3,
                    sortOrder: {
                        values: ['Female', 'Male', 'Non-Binary', 'male'],
                    },
                },
            ],
        }),
        `Lydia  N/A N/A        120
Niel   16  Female     135
Jane   22  Female     100
Sam    18  Male       140
Max    17  Male       135
Jack   23  Non-Binary 120
max    17  male       135
Jones  17  male       135
Mike   N/A male       N/A`,
        'non matching to top, and test case insentivity'
    );

    testString(
        t,
        sort(listOfPersonalInfoTables, {
            sortGroups: [
                {
                    group: 3,
                    sortOrder: {
                        values: ['Female', 'Male', 'Non-Binary', 'male'],
                    },
                    attachNonMatchingToBottom: true,
                },
            ],
        }),
        `Niel   16  Female     135
Jane   22  Female     100
Sam    18  Male       140
Max    17  Male       135
Jack   23  Non-Binary 120
max    17  male       135
Jones  17  male       135
Mike   N/A male       N/A
Lydia  N/A N/A        120`,
        'non matching to bottom, add test case insentivity'
    );

    testString(
        t,
        sort(listOfPersonalInfoTables, {
            sortGroups: [
                {
                    group: 1,
                    sortOrder: {
                        values: [
                            'jac',
                            'max',
                            'sam',
                            'jan',
                            'nie',
                            'jon',
                            'mik',
                            'lyd',
                        ],
                        looseness: 3,
                        caseInsensitive: true,
                    },
                },
            ],
        }),
        `Jack   23  Non-Binary 120
Max    17  Male       135
max    17  male       135
Sam    18  Male       140
Jane   22  Female     100
Niel   16  Female     135
Jones  17  male       135
Mike   N/A male       N/A
Lydia  N/A N/A        120`,
        'by names looseness 3 and case-insensitive'
    );

    t.end();
});

test('separator', (t) => {
    const sectionStarter = /^    <div/;

    testString(
        t,
        sort(inputs.sectionStarter.divChildren, {
            sectionStarter,
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
        sort(inputs.sectionStarter.divChildren, {
            sectionStarter,
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

test('separation with blank lines', (t) => {
    const text = `Website: Youtube
Link: https://www.youtube.com
Type: Social Media
Age: 12

Website: Discord
Link: https://discord.com
Type: Social Media
Age: 5

Website: Instagram
Link: https://www.instagram.com
Type: Social Media
Age: 18

Website: StackOverflow
Link: https://stackoverflow.com
Type: Forum
Age: 10

Website: Reddit
Link: https://www.reddit.com
Type: Forum
Age: 20

Website: Nonexistent Website
Link: /dev/null
Type: invalid
Age: -23`;

    const options = {
        sectionSeparator: /\n\n/,
        sectionRejoiner: '\n\n',
    };

    testString(
        t,
        sort(text, options),
        `Website: Discord
Link: https://discord.com
Type: Social Media
Age: 5

Website: Instagram
Link: https://www.instagram.com
Type: Social Media
Age: 18

Website: Nonexistent Website
Link: /dev/null
Type: invalid
Age: -23

Website: Reddit
Link: https://www.reddit.com
Type: Forum
Age: 20

Website: StackOverflow
Link: https://stackoverflow.com
Type: Forum
Age: 10

Website: Youtube
Link: https://www.youtube.com
Type: Social Media
Age: 12`,
        'separation by blank lines'
    );

    testString(
        t,
        sort(text, {
            ...options,
            regexFilter: /Type: /,
        }),
        `Website: StackOverflow
Link: https://stackoverflow.com
Type: Forum
Age: 10

Website: Reddit
Link: https://www.reddit.com
Type: Forum
Age: 20

Website: Youtube
Link: https://www.youtube.com
Type: Social Media
Age: 12

Website: Instagram
Link: https://www.instagram.com
Type: Social Media
Age: 18

Website: Discord
Link: https://discord.com
Type: Social Media
Age: 5

Website: Nonexistent Website
Link: /dev/null
Type: invalid
Age: -23`,
        'sort by type of website'
    );

    testString(
        t,
        sort(text, { ...options, sorter: 'numerical' }),
        `Website: Nonexistent Website
Link: /dev/null
Type: invalid
Age: -23

Website: Discord
Link: https://discord.com
Type: Social Media
Age: 5

Website: StackOverflow
Link: https://stackoverflow.com
Type: Forum
Age: 10

Website: Youtube
Link: https://www.youtube.com
Type: Social Media
Age: 12

Website: Instagram
Link: https://www.instagram.com
Type: Social Media
Age: 18

Website: Reddit
Link: https://www.reddit.com
Type: Forum
Age: 20`,
        'sort by age'
    );

    t.end();
});

test('month sort', (t) => {
    const csvTableOfData = `Kali,10-Nov-2021
Westbrooke,30-Dec-2021
Janet,29-Sep-2022
Pete,10-Oct-2022
Ferdy,06-Mar-2022
Kasey,05-Dec-2021
Tamiko,21-Feb-2022
Benny,06-Aug-2022
Cassy,11-Jan-2022
Ricki,22-Apr-2022
Sabine,26-Oct-2021
Cly,25-Mar-2022
Amalea,24-Jul-2022
Owen,02-May-2022
Debby,28-Jun-2022`;

    testString(
        t,
        sort(csvTableOfData, { sorter: 'month' }),
        // janet is at top because of jan-et
        `Janet,29-Sep-2022
Cassy,11-Jan-2022
Tamiko,21-Feb-2022
Ferdy,06-Mar-2022
Cly,25-Mar-2022
Ricki,22-Apr-2022
Owen,02-May-2022
Debby,28-Jun-2022
Amalea,24-Jul-2022
Benny,06-Aug-2022
Pete,10-Oct-2022
Sabine,26-Oct-2021
Kali,10-Nov-2021
Westbrooke,30-Dec-2021
Kasey,05-Dec-2021`,
        'normal month sort'
    );

    // somewhat weird way to get actual desired sort, but works for this set
    testString(
        t,
        sort(csvTableOfData, {
            sorter: 'month',
            fieldSeparator: '-',
            sortGroups: [
                {
                    group: 2,
                },
            ],
        }),
        `Cassy,11-Jan-2022
Tamiko,21-Feb-2022
Ferdy,06-Mar-2022
Cly,25-Mar-2022
Ricki,22-Apr-2022
Owen,02-May-2022
Debby,28-Jun-2022
Amalea,24-Jul-2022
Benny,06-Aug-2022
Janet,29-Sep-2022
Pete,10-Oct-2022
Sabine,26-Oct-2021
Kali,10-Nov-2021
Westbrooke,30-Dec-2021
Kasey,05-Dec-2021`,
        'month sort with field separator & sort group'
    );

    t.end();
});

test('day sort', (t) => {
    const csvTableOfData = `Kali,Wednesday
Westbrooke,Monday
Janet,Tuesday
Pete,Thursday
Ferdy,Friday
Kasey,Saturday
Tamiko,Monday
Benny,Sunday`;

    testString(
        t,
        sort(csvTableOfData, { sorter: 'day' }),
        `Westbrooke,Monday
Tamiko,Monday
Janet,Tuesday
Kali,Wednesday
Pete,Thursday
Ferdy,Friday
Kasey,Saturday
Benny,Sunday`,
        'normal day sort'
    );

    testString(
        t,
        sort(csvTableOfData, {
            sorter: 'day',
            unique: 'exact',
        }),
        `Westbrooke,Monday
Janet,Tuesday
Kali,Wednesday
Pete,Thursday
Ferdy,Friday
Kasey,Saturday
Benny,Sunday`,
        'normal day sort with unique=exact'
    );
    t.end();
});

test('recursive with numeric value', (t) => {
    testString(
        t,
        sort(inputs.multiNestedList, {
            recursive: 0,
        }),
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
        'recursive depth 0'
    );

    testString(
        t,
        sort(inputs.multiNestedList, {
            recursive: 1,
        }),
        `gear
  dear
    aer do
    here me
      gamma
      mama
      aera
    make do
    sake so
hear
  alpha
  beta
  gamma
  zamma
there
zer`,
        'recursive depth 1'
    );

    testString(
        t,
        sort(inputs.multiNestedList, {
            recursive: 3,
        }),
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
        'recursive depth 2'
    );

    t.end();
});
