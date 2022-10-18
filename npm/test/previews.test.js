// @ts-check
const test = require('tape');
const { sort } = require('../dist/main.js');
const { testString } = require('./testString.js');

test('preview sorts', (t) => {
    testString(
        t,
        sort(
            `import react from 'react';
import express from 'express';
import discord from 'discord.js';
import isIsOdd from 'is-is-odd';
import boxen from 'boxen';
import isOdd from 'is-odd';`,
            { regexFilter: /'/ }
        ),
        `import boxen from 'boxen';
import discord from 'discord.js';
import express from 'express';
import isIsOdd from 'is-is-odd';
import isOdd from 'is-odd';
import react from 'react';`,
        'sort imports normal'
    );

    testString(
        t,
        sort(`case 'max':
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
    break;`),
        `case 'ava':
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
        'switch statements inner conten'
    );

    testString(
        t,
        sort(
            `Hello 7, today's your lucky day
You are our 5000th customer!
To recieve your prize of $200
Meet me at the dark ally @ 2pm`,
            { sorter: 'numerical' }
        ),
        `Meet me at the dark ally @ 2pm
Hello 7, today's your lucky day
To recieve your prize of $200
You are our 5000th customer!`,
        'paragraph 4 lines of numbers'
    );

    testString(
        t,
        sort(
            `- Hot Dog
- Burger
- Salad
- Burger
- Sandwhich`,
            { unique: 'exact', reverse: true }
        ),
        `- Sandwhich
- Salad
- Hot Dog
- Burger`,
        'unique reverse on simple md list'
    );

    testString(
        t,
        sort(
            `- Shows
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
            { sorter: 'natural', recursive: true }
        ),

        `- Apps
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
        'nested markdown list, recursive'
    );

    t.end();
});
