// @ts-check
const { nonMarkdownInputs: inputs } = require('./test-utils.js');

const expectedSectionSeperatorDivChildrenResult = `    <div class="child">
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
    </div>`;

/* 
    display is supposed to be the text that's displayed in a preview, this is
    accomanied by a highlightRange, which is supposed to show what text is
    selected to be highligted and will actually be sorted.

    For example:

    switch(name) {
        case 'jack':
           break;
        case 'may':
            break;
    }

    you won't be sorting the whole switch, you will only be sorting lines 2-4
    (the case statements)

    todo: make highlight range automatic 

 */
/** @typedef {{ input: string; output: string; highlightRange: string }} Display */
/** @typedef {{ display?: Display; input: string; output: string; options: import("./npm/dist/main.js").Options; language?: string; }} PreviewTest */
// manually listing everything so i can get auto complete
/** @type {{ sortImportsNormal: PreviewTest; switchCaseNormal: PreviewTest; numberNormal: PreviewTest; uniqueReverse: PreviewTest, sectionSeperatorHtml: PreviewTest, generalExample: PreviewTest  }} */
const previews = {
    sortImportsNormal: {
        input: `import react from 'react';
import express from 'express';
import discord from 'discord.js';
import isIsOdd from 'is-is-odd';
import boxen from 'boxen';
import isOdd from 'is-odd';`,
        output: `import boxen from 'boxen';
import discord from 'discord.js';
import express from 'express';
import isIsOdd from 'is-is-odd';
import isOdd from 'is-odd';
import react from 'react';`,
        options: { regexFilter: /'/ },
        language: 'javascript',
    },
    switchCaseNormal: {
        display: {
            input: `switch(name) {
    case 'max':
        console.log('max');
        break;
    case 'sam':
        console.log('sam');
        break;
    case 'ava':
        console.log('ava');
        break;
    case 'edna':
        console.log('edna');
        break;
}`,
            output: `switch(name) {
    case 'ava':
        console.log('ava');
        break;
    case 'edna':
        console.log('edna');
        break;
    case 'max':
        console.log('max');
        break;
    case 'sam':
        console.log('sam');
        break;
}`,
            highlightRange: '2-13',
        },
        input: `case 'max':
    console.log('max');
    break;
case 'sam':
    console.log('sam');
    break;
case 'ava':
    console.log('ava');
    break;
case 'edna':
    console.log('edna');
    break;`,
        output: `case 'ava':
    console.log('ava');
    break;
case 'edna':
    console.log('edna');
    break;
case 'max':
    console.log('max');
    break;
case 'sam':
    console.log('sam');
    break;`,
        options: {},
        language: 'javascript',
    },
    numberNormal: {
        input: `Hello 7, today's your lucky day
You are our 5000th customer!
To recieve your prize of $200
Meet me at the dark ally @ 2pm`,
        output: `Meet me at the dark ally @ 2pm
Hello 7, today's your lucky day
To recieve your prize of $200
You are our 5000th customer!`,
        options: { sorter: 'numerical' },
    },
    uniqueReverse: {
        input: `- Hot Dog
- Burger
- Salad
- Burger
- Sandwhich`,
        output: `- Sandwhich
- Salad
- Hot Dog
- Burger`,
        options: { unique: 'exact', reverse: true },
    },
    sectionSeperatorHtml: {
        input: inputs.sectionSeperator.divChildren,
        output: expectedSectionSeperatorDivChildrenResult,
        options: { sectionStarter: /^    <div/ },
        language: 'html',
        display: {
            input: `<div>\n${inputs.sectionSeperator.divChildren}\n</div>`,
            output: `<div>\n${expectedSectionSeperatorDivChildrenResult}\n</div>`,
            highlightRange: '2-29',
        },
    },
    generalExample: {
        input: `- Shows
  - Caroons
    - Simpsons
    - Family Guy
  - Anime
    - Noragami
    - Black Clover
    - One Piece
    - 7 Deadly Sins
- Apps
  - Games
    - Clash Royale
    - Brawl Stars
    - Dumb Ways To Die
  - Youtube
  - VLC
  - Brawl Stars
- Editors
  - VSCode
  - Atom
  - Vim
  - Emacs`,
        output: `- Apps
  - Brawl Stars
  - Games
    - Brawl Stars
    - Clash Royale
    - Dumb Ways To Die
  - VLC
  - Youtube
- Editors
  - Atom
  - Emacs
  - Vim
  - VSCode
- Shows
  - Anime
    - 7 Deadly Sins
    - Black Clover
    - Noragami
    - One Piece
  - Caroons
    - Family Guy
    - Simpsons`,
        options: { recursive: true, sorter: 'natural' },
    },
};

module.exports = { previews };
