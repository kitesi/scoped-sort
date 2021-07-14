<p align="center">
    <img src="assets/banner.png" alt="banner: scoped sort" />
</p>

<p align="center"><b>A better sort for Visual Studio Code.</b></p>

[![version](https://vsmarketplacebadge.apphb.com/version/karizma.scoped-sort.svg)](https://marketplace.visualstudio.com/items?itemName=karizma.scoped-sort)
[![installs](https://vsmarketplacebadge.apphb.com/installs-short/karizma.scoped-sort.svg)](https://marketplace.visualstudio.com/items?itemName=karizma.scoped-sort)
[![downloads](https://vsmarketplacebadge.apphb.com/downloads-short/karizma.scoped-sort.svg)](https://marketplace.visualstudio.com/items?itemName=karizma.scoped-sort)

This is a vscode extension to help sort text & lists in a scoped manner.
Currently it only supports markdown lists but it will eventually support other lists.

# Table of Contents

<!-- prettier-ignore -->
- [Why](#why)
  - [First: Options](#first-options)
  - [Second: Scope](#second-scope)
  - [Disclaimer](#disclaimer)
- [Demos](#demos)
- [Usage](#usage)
  - [Regexs](#regexs)
- [Configuration](#configuration)
  - [Adding Keybindings](#adding-keybindings)
- [Acknowledgements](#acknowledgements)
- [Contributing / Help](#contributing--help)

# Why

Vscode already provides a commands for sorting (`editor.action.sortLinesDescending` and
`editor.action.sortLinesAscending`), and there's tons of extensions for sorting.
So why use this extension?

## First: Options

There's a lot of options you might want, reversing the sort,
case insensitive sort, numeric sort, remove duplicates, etc.

Vscode native commands for sorting don't have many options, other extensions
like [tyriar.sort-lines](https://marketplace.visualstudio.com/items?itemName=Tyriar.sort-lines)
have a lot of options, but they don't have a nice way to combine them, so
they end up polluting the commands contributions with 8+ commands. And even
then they don't allow for all the possibilities. This extension uses a prompt,
so it only needs one command, and can use any combination.
has

## Second: Scope

Most of these extensions don't consider scope/indentation, so you end up with
an undesired sort.

Here's what I mean:

![the problem with most sort implementation](assets/non-scope-problem.png)

## Disclaimer

Currently, this extension is not meant for sorting words inside of a line, nor
is it trying to sort language specific things like imports or properties of an
object.

# Demos

If you want to see some demos visit [demos.md](demos.md). I'm not including them
here so it doesn't load gifs unnecessarily.

# Usage

This command is exposed by the command `scoped-sort.sort`.

To use this, first select the text you want to sort, or don't and it'll sort the entire document. Next go to your command pallete
(usually `ctrl+shift+p`), type 'scoped sort', and select the command. It will
then give you a prompt that allows for arguments.

Here's all the arguments:

<!-- prettier-ignore -->
- `s` sort descendingly
- `r` sort recursively
- `u` remove duplicates
- `i` case insensitive
- `n` sort by numbers
- `m` better sort for markdown lists, for the most part you won't need this, but
in certain cases you will
- `p` combined with regexs, instead of sorting after the matched text, it sorts using the matched text

## Regexs

You can also specify a regex, this will sort using the text _after_ the
match. If you want it to use the matched text, use the argument `p`. Text that
do not match will be left in place, and will be at the top (or bottom if reversed).
Also worth noting, the regex language is **javascript**.

Example: `usr` => get unique values, sort descendingly and recursively.

Example: `/title-/` => sort using the text after the text 'title-' in each section/item.

Example: `u /c\w+/ p` => sort using the matched word that starts with c in each
section/item and remove duplicates.

# Configuration

All of the configuration is under `scoped-sort`, visit your settings.json to change them.

`scoped-sort.prompt`: boolean

Decides if the program should always prompt/ask for options.

Default: true

`scoped-sort.defaultArgs`: string

This is a string of arguments which follow [#usage](#usage). If you have
`scoped-sort.prompt` on, it will insert the string into the prompt, if you have
it off, it will just execute the command with those arguments.

Default: ''

## Adding Keybindings

If you are planning to add keybindings, you can add `.args` to provide arguments. This will make it so no prompt shows

For example:

```json
{
    "key": "ctrl+shift+m",
    "command": "scoped-sort.sort",
    "args": "sur"
}
```

Your configuration of `scoped-sort.defaultArgs` is not used here. The reason for
this is that you might have something like `"r"` for your `defaultArgs`, but
want to turn it off for the keybinding. Problem is there is no negation/cancel
of an argument (and there won't ever be one).

# Acknowledgements

<!-- prettier-ignore -->
- Inspired by vim's :sort, but isn't going trying/going be a complete 1:1
- Font in banner is [Ordinary](https://www.dafont.com/ordinary.font)
- Font in previews is [Cascadia Code](https://github.com/microsoft/cascadia-code)

# Contributing / Help

Contributions are very welcome and appreciated.

If you need help with something, found a bug, or want to request a feature,
feel free to make an issue.

If you want to fix a bug or contribute a feature, first create an issue, and
then you can work on a pull request.
