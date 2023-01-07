## General Example

A general day-to-day nested markdown list.

- `recursive` = `true`
- `sorter` = `"natural"`

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

## Removing Duplicates + Reverse

- `unique` = `"exact"`
- `reverse` = `true`

<div class="pre-container">

```text
- Hot Dog
- Burger
- Salad
- Burger
- Sandwhich
```

```text
- Sandwhich
- Salad
- Hot Dog
- Burger
```

</div>

## Numerical Sort

This sort will sort the lines based on the number in each line.

- `sorter` = `"numerical"`

<div class="pre-container">

```text
Hello 7, today's your lucky day
You are our 5000th customer!
To recieve your prize of $200
Meet me at the dark ally @ 2pm
```

```text
Meet me at the dark ally @ 2pm
Hello 7, today's your lucky day
To recieve your prize of $200
You are our 5000th customer!
```

</div>

## Switch Inner Case Statements

- no options

This is an example of how this program's indentation awareness works.

Note: the content actually being sorted is highlighted, the
non-highlighted lines are just there for visual aid.

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

## Imports

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

## Section Starter HTML

This in example which show's the possibilities of section-starter.

Note: the content actually being sorted is highlighted, the non-highlighted lines
are just there for visual aid.

- `section-starter` = `/^\t<div/`

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

## Sort By 3rd Column

- `sort-group` = `"{3}"`

<div class="pre-container">

```text
Sam    18  Male       140
Jack   23  Non-Binary 120
Niel   16  Female     135
Max    17  Male       135
Jane   22  Female     100
max    17  male       135
Jones  17  male       135
Lydia  N/A N/A        120
Mike   N/A male       N/A
```

```text
Niel   16  Female     135
Jane   22  Female     100
Sam    18  Male       140
Max    17  Male       135
Lydia  N/A N/A        120
Jack   23  Non-Binary 120
max    17  male       135
Jones  17  male       135
Mike   N/A male       N/A
```

</div>

## Sort By 2nd Column (CSV)

- `field-separator` = `","`
- `sort-group` = `"{2}"`

<div class="pre-container">

```text
Jake,Lil Peep,30
Niel,The Neighbourhood,12
Max,Arctic Monkeys,72
Jo,AJR,65
```

```text
Jo,AJR,65
Max,Arctic Monkeys,72
Jake,Lil Peep,30
Niel,The Neighbourhood,12
```

</div>

## Sort By 3rd Column (custom)

- `sort-group` = `"{3}"`
- `sort-order` = `"i:female;non-binary;male;n/a"`

<div class="pre-container">

```text
Sam    18  Male       140
Jack   23  Non-Binary 120
Niel   16  Female     135
Max    17  Male       135
Jane   22  Female     100
max    17  male       135
Jones  17  male       135
Lydia  N/A N/A        120
Mike   N/A male       N/A
```

```text
Niel   16  Female     135
Jane   22  Female     100
Jack   23  Non-Binary 120
Sam    18  Male       140
Max    17  Male       135
max    17  male       135
Jones  17  male       135
Mike   N/A male       N/A
Lydia  N/A N/A        120
```

</div>

## Sort By 4th Column (number)

- `sort-group` = `"{4}n"`

<div class="pre-container">

```text
Jake,Lil Peep,30
Niel,The Neighbourhood,12
Max,Arctic Monkeys,72
Jo,AJR,65
```

```text
Niel,The Neighbourhood,12
Jake,Lil Peep,30
Jo,AJR,65
Max,Arctic Monkeys,72
```

</div>

## Blank Line Separation

- `section-seaerator` = `/\n\n/`
- `section-rejoiner` = `"\n\n"`

<div class="pre-container">

```text
Website: Youtube
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
```

```text
Website: Discord
Link: https://discord.com
Type: Social Media
Age: 5

Website: Instagram
Link: https://www.instagram.com
Type: Social Media
Age: 18

Website: Youtube
Link: https://www.youtube.com
Type: Social Media
Age: 12
```

</div>

## Blank Line Separation: Age

Sorts by the number in each section separated by
a blank line.

- `section-separator` = `/\n\n/`
- `section-rejoiner` = `"\n\n"`
- `sorter` = `"numerical"`

<div class="pre-container">

```text
Website: Youtube
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
```

```text
Website: Discord
Link: https://discord.com
Type: Social Media
Age: 5

Website: Youtube
Link: https://www.youtube.com
Type: Social Media
Age: 12

Website: Instagram
Link: https://www.instagram.com
Type: Social Media
Age: 18
```

</div>

<style>

    :root {
        --sidebar-width: 400px;
        --max-content-width: 80rem;
    }

    h2:not(:first-child) {
        margin-top: 0.7em;
    }
</style>
