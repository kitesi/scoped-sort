## General Example

A general day to day nested markdown list.

- `recursive` = `true`
- `sort-naturally` = `true`

<div class="pre-container">

```markdown
- Shows
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
  - Emacs
```

```markdown
- Apps
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
    - Simpsons
```

</div>

## Removing Dupliactes + Reverse

- `unique` = `true`
- `reverse` = `true`

<div class="pre-container">

```
- Hot Dog
- Burger
- Salad
- Burger
- Sandwhich
```

```
- Sandwhich
- Salad
- Hot Dog
- Burger
```

</div>

## Numerical Sort

This sort will sort the lines based on the number in each line.

- `sort-numerically` = `true`

<div class="pre-container">

```
Hello 7, today's your lucky day
You are our 5000th customer!
To recieve your prize of $200
Meet me at the dark ally @ 2pm
```

```
Meet me at the dark ally @ 2pm
Hello 7, today's your lucky day
To recieve your prize of $200
You are our 5000th customer!
```

</div>

## Switch Inner Case Statements

- no options

This is an example of how this program's indentation awareness works. You might
see that certain lines are highlighted, those lines are the actual lines that
are being sorted.

Note: the content actually being sorted is highlighted, the
unhighlighted lines are just there for visual aid.

<div class="pre-container">

```js {1-12}
switch (name) {
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
}
```

```js
switch (name) {
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
}
```

</div>

## Sorting Imports

Here we can see how the regex option can help us sort using text that is not at
the start of the line.

- `regex-filter` = `/['"]/`

<div class="pre-container">

```js
import react from 'react';
import express from 'express';
import discord from 'discord.js';
import isIsOdd from 'is-is-odd';
import boxen from 'boxen';
import isOdd from 'is-odd';
```

```js
import boxen from 'boxen';
import discord from 'discord.js';
import express from 'express';
import isIsOdd from 'is-is-odd';
import isOdd from 'is-odd';
import react from 'react';
```

</div>

## Section Seperator HTML

This in example which show's the possibilities of section-seperator.

Note: the content actually being sorted is highlighted, the unhighlighted lines
are just there for visual aid.

- `section-seperator` = `/^\t<div/`

<div class="pre-container">

```html {1-20}
<div>
	<div class="child">
		<h3>Zachary Garrett</h3>
		<p>Computer Science</p>
		<div class="something">lorem ipsum</div>
	</div>
	<div class="child">
		<h3>Elijah Tyler</h3>
		<p>Math</p>
		<div class="something">lorem ipsum</div>
	</div>
	<div class="child">
		<h3>Earl Henry</h3>
		<p>Aerospace</p>
		<div class="something">lorem ipsum</div>
	</div>
	<div class="child">
		<h3>Herman Reed</h3>
		<p>English</p>
		<div class="something">lorem ipsum</div>
	</div>
</div>
```

```html
<div>
	<div class="child">
		<h3>Earl Henry</h3>
		<p>Aerospace</p>
		<div class="something">lorem ipsum</div>
	</div>
	<div class="child">
		<h3>Elijah Tyler</h3>
		<p>Math</p>
		<div class="something">lorem ipsum</div>
	</div>
	<div class="child">
		<h3>Herman Reed</h3>
		<p>English</p>
		<div class="something">lorem ipsum</div>
	</div>
	<div class="child">
		<h3>Zachary Garrett</h3>
		<p>Computer Science</p>
		<div class="something">lorem ipsum</div>
	</div>
</div>
```

</div>

<style>
	.pre-container {
		display: flex;
		flex-wrap: wrap;
		gap: 1em;
		margin-top: 1em;
	}

    pre {
		flex: 1;
		min-width: 20em;
		margin: 0 !important;
    }

    :root {
        --sidebar-width: 400px;
        --max-content-width: 80rem;
    }

    h2:not(:first-child) {
        margin-top: 0.7em;
    }
</style>
