<p align="center">
    <img src="assets/banner.png" alt="banner: scoped sort" />
</p>

<p align="center"><b>A feature rich text sorter that takes indentation into account.</b></p>

[![version](https://vsmarketplacebadge.apphb.com/version/karizma.scoped-sort.svg)](https://marketplace.visualstudio.com/items?itemName=karizma.scoped-sort)
[![installs](https://vsmarketplacebadge.apphb.com/installs-short/karizma.scoped-sort.svg)](https://marketplace.visualstudio.com/items?itemName=karizma.scoped-sort)
[![downloads](https://vsmarketplacebadge.apphb.com/downloads-short/karizma.scoped-sort.svg)](https://marketplace.visualstudio.com/items?itemName=karizma.scoped-sort)

This is a vscode extension to help sort text & lists in a scoped manner. It's a
part of a bigger project called [scopedsort](https://scopedsort.netlify.app/).
[Documentation](https://scopedsort.netlify.app/docs) and
[examples](https://scopedsort.netlify.app/examples) are mainly held there.

## Table of Contents

<!-- prettier-ignore -->
- [Why](#why)
- [Disclaimer](#disclaimer)
- [Demos / Previews](#demos--previews)
- [Usage](#usage)
- [Configuration](#configuration)
- [Adding Keybindings](#adding-keybindings)
- [Acknowledgements](#acknowledgements)
- [Contributing / Help](#contributing--help)

## Why

Vscode already provides a commands for sorting (`editor.action.sortLinesDescending` and
`editor.action.sortLinesAscending`), and there's tons of extensions for sorting.
So it begs the question, why use this extension?

1. Indentation awareness

Most sorters do not keep track of indentation and sort line by line.

This leads to some undesired sorts:

![the problem with most sort implementation](assets/non-scope-problem.png)

This was the initial reason I created this extension and project which is why it's called "scopedsort".

2. Standardization & Utility

This project is implemented on vscode, npm, command line and a website. They all share the same
output and options.

A big part of this tool is [sort-comments](#sort-comments). I am not aware of any other project
that allows for you to specify a sort section and sort it through the command line.

3. Options

This extensino has a lot of options, all of which can be used together (provided
they don't conflict logically). Other extensions like
[tyriar.sort-lines](https://marketplace.visualstudio.com/items?itemName=Tyriar.sort-lines)
have a reasonable amount of options, but they don't have a nice way to combine
them, so they end up polluting the commands contributions with 8+ commands. And
even then they don't allow for all the possibilities. This extension uses a
prompt, taking in options like a command line, so it only needs one command, and
can use any combination it has.

Some of the more extensive options this extension implmenets are: custom sort orders, sort by column,
sort by regex, etc...

This is one of the lesser points though, since you won't often need these advanced options.

## Disclaimer

This extension might have a bit of a learning curve and require some reading. Most sorting
cases can be solved with
[tyriar.sort-lines](https://marketplace.visualstudio.com/items?itemName=Tyriar.sort-lines).

This extension is not meant for sorting words inside of a line, nor is it trying
to sort language specific things like imports or properties of an object
(although it can sort them if they have a simple structure).

I am not a fan of adding extensions unless they are important, so I should also
inform you the other mediums this project has
([cli](https://www.npmjs.com/package/string-content-sort-cli) &
[website](https://www.npmjs.com/package/string-content-sort-cli))
might serve better for most users.

If you only need to sort text on occasions, the website has you covered. If you are sorting
certain sections or files repeatdely, the cli tool might be better. It's faster
and more automatable.

The only instances I see this extension being more efficient than the other
mediums is if you are sorting a lot of different text only once or if you are using
the helper command `scoped-sort.addSurroundingSortComments`

## Demos / Previews

Command:

Note this example is technically outdated since it uses `re`, which now should
be `-re`.

![command gif demo](assets/command-preview.gif)

Sort on save:

![sort on save gif demo](assets/sort-on-save.gif)

If you want to see examples of how the program sorts certain text, visit [examples](https://scopedsort.netlify.app/examples).

## Usage

This command contributes three commands: `scoped-sort.sort`,
`scoped-sort.sortComments`, `scoped-sort.addSurroundingSortComments`.

All three of these commands word on text that is selected. If no text
is selected it will use the whole document.

The main command: `scoped-sort.sort` simply takes in text and sorts with the options given.
Options are given through a cli-like interface in a prompt. Valid arguments include:
`--reverse`, `--recursive 3`, `--unique`, ...

Read more in the [documentation](https://scopedsort.netlify.app/docs).

The second command: `scoped-sort.sortComments` sorts only [sort-comment sections](#sort-comments) in the
given selection.

The last command: `scoped-sort.addSurroundingSortComments` is a helper command to generate sort-comments.
It will add a line before and after the selection to specify a sort-comment section.

```text
3
1
2
```

will (usually\*) turn into

```text
// { sort-start }
3
1
2
// { sort-end }
```

\*: depends on the file type and your configuration

To use the command, first select the text you want to sort, or don't and it'll
use the entire document. Next go to your command pallete (usually `ctrl+shift+p`),
type 'scoped sort', and select the command you want.

### Sort-on-save

To use the sort-on-save feature, you need to mark sections with [sort-comments](#sort-comments).
Next you need to go to your configuration and turn on `scoped-sort.formatSectionsOnSave`.

Although personally again, I would advise against using sort-on-save, and instead use
the cli version of this project.

### Sort Comments

Sort comments are a way for this program to automatically recognize a section to
sort and it’s options. This can help if you have a list that is constantly being
updated, and you don’t want to have to keep manually sorting.

Example:

```js
// { sort-start /['"]/ }
import react from 'react';
import express from 'express';
import isIsOdd from 'is-is-odd';
// { sort-end }
```

Read the [actual documentation](https://scopedsort.netlify.app/docs#sort-comments) for more.

## Configuration

All of the configuration is under `scoped-sort`. Visit your settings to change them.

`scoped-sort.prompt`: boolean

Decides if the program should always prompt/ask for options when executing the main command.

Default: `true`

`scoped-sort.formatSectionsOnSave`: boolean

Decides if the program should try to format sort comment sections on save.

Default: `false`

`scoped-sort.defaultArgs`: object

This is an object which defines the default arguments used in situations.
The properties of this object are all strings which follow the cli-like arguments.
All the defaults are empty strings.

`scoped-sort.defaultArgs.prompt`: string

When you call the main command, if you have `scoped-sort.prompt` set to true,
this string will be injected into the prompt box.

`scoped-sort.defaultArgs.no-prompt`: string

When you call the main command, if you have `scoped-sort.prompt` set to false,
the command will execute with this value

`scoped-sort.defaultArgs.addSurroundingSortComments`: string

When you call the `addSurroundingSortComments` command, the sort-start comment
will have this value as it's arguments.

For example, if the value was: `--random`, when you use the command on the following text:

```
a
z
b
```

it will turn into

```
// { sort-start --random }
a
z
b
// { sort-end }
```

## Adding Keybindings

If you are planning on adding keybindings on the `scoped-sort.sort` command. You
can also use the `.args` property to provide arguments. This will make it so no
prompt shows

For example:

```json
{
    "key": "ctrl+shift+m",
    "command": "scoped-sort.sort",
    "args": "-sur"
}
```

## Acknowledgements

<!-- prettier-ignore -->
- Theme in the demo is [Ayu Mirage](https://github.com/ayu-theme/vscode-ayu)
- Font in banner is [Ordinary](https://www.dafont.com/ordinary.font)
- Font in previews is [Cascadia Code](https://github.com/microsoft/cascadia-code)

## Questions & Contribution

This program might have some learning curve, so if you need any help, submit a
github issue and I'll be glad to help. If you find any bugs or want to
contribute also create a github issue.
