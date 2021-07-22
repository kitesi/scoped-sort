// @ts-check

const { diffStringsUnified } = require('jest-diff');
/** @param {string[]} lines */
const join = (...lines) => lines.join('\n');

// simple => non nested list
// nestedDescriptions => nested list + has descriptions
module.exports.join = join;
module.exports.markdownInputs = {
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
- -91mark3
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
- -92`,
    },
    regex: {
        // /media/ is the tested regex
        media: `- media z
- media a
- media lover
- the matched text isn't here
- media hater
- consume media 24/7
- media more like __
- the media Decimated my life`,
        // /\d+/ is the tested regex
        number: `- top 10 anime betrayals
- 7's the game
- An approximation of pi is 3.1415
- It's been 18 years since I've felt the touch of a woman
- King henry had 6 wives
- the matched text isn't here
- Cats have 9 lives`,
    },
};

module.exports.nonMarkdownInputs = {
    simple: join('there', 'bear', 'sear', 'gear'),
    oneLevelDeepNestedList: `there
hear
  beta
  zamma
  alpha
  gamma
gear
  dear
zer`,
    multiNestedList: `there
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
      aera
zer`,
    nestedListWithDescriptions: `Commands
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
    multiByteCharacters: `𝟘𝟙𝟚𝟛
012345
0123456789`,
    simpleFloatList: `wack 12
dax 2.3 hax
1.20 max
dax 1.61
as 13.13
12.0`,
    simpleNaturalList: `c12
b23
a51
a100
d91
z123
i could only see her once
g12
a20
no number here`,
    duplicates: {
        simple: `There
there
make
so
do
lol
there
THERE`,
        oneLevelDeepNestedList: `There
there
make
so
do
  there
  THERE
  do
  HEllo
  hello
  grew
THEre
THERE
There`,
        nestedListWithDescriptions: `There
there
make
so
do
  there
  THERE
  do

    Once upon a time there was a blue whale.

  HEllo
  hello
  grew
THEre
THERE
There`,
    },
    numbers: {
        simple: `7
1
230
213dark
-91mark3
ama
12`,
        oneLevelDeepNestedList: `23
7
8aa
hello
  my ex wife still misses me
  but her aim is getting better
21a6
3
-92`,
    },
    regex: {
        // /medi(a|cal)/ is the tested regex
        media: `media zn
medical lover
the matched text isn't here
media hater
medical a
consume media 24/7
media more like __
the media Decimated my life`,
        // /\d+/ is the tested regex
        number: `top 10 anime betrayals
7's the game
An approximation of pi is 3.1415
It's been 18 years since I've felt the touch of a woman
King henry had 6 wives
the matched text isn't here
Cats have 9 lives`,
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
        console.log(diffStringsUnified(expected, actual));
    }
};

module.exports.possibleArguments = [
    's',
    'r',
    'i',
    'n',
    'u',
    'p',
    'm',
    'l',
    'f',
    '/\\d+/',
];
