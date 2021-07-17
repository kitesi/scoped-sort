// @ts-check

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

 */
/** @typedef {{ input: string; output: string; highlightRange: string }} Display */
/** @typedef {{ display?: Display; input: string; output: string; options: import("../dist/sort.js").Options; language?: string; }} PreviewTest */
// manually listing everything so i can get auto complete
/** @type {{ sortImportsNormal: PreviewTest; switchCaseNormal: PreviewTest; numberNormal: PreviewTest; uniqueReverse: PreviewTest }} */
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
        options: { regex: /'/ },
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
        options: { sortNumerically: true },
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
        options: { unique: true, reverse: true },
    },
};

module.exports = previews;
