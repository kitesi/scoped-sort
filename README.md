<p align="center">
    <img src="assets/banner.png" alt="banner: scoped sort" />
</p>

<p align="center"><b>Sort lines in a scope for Visual Studio Code</b></p>

[![version](https://vsmarketplacebadge.apphb.com/version/karizma.scoped-sort.svg)](https://marketplace.visualstudio.com/items?itemName=karizma.scoped-sort)
[![installs](https://vsmarketplacebadge.apphb.com/installs-short/karizma.scoped-sort.svg)](https://marketplace.visualstudio.com/items?itemName=karizma.scoped-sort)

This is a vscode extension to help sort text & lists in a scoped manner. Vscode
already provides a commands for sorting (`editor.action.sortLinesDescending` and
`editor.action.sortLinesAscending`) but the problem with these commands is that
they sort line by line rather than in a scope.

Here's what I mean:

![the problem with vscode's implementation](assets/non-scope-problem.png)

Another problem is that the sorting is very limited, (only ascending and descending). Other extensions solve that problem,
but they don't add scoping.

Currently it only supports markdown lists but it will eventually support other lists.

## Demos

If you want to see some demos visit [demos.md](demos.md). I'm not including them
here so it doesn't load gifs unnecessarily.

## Usage

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
- `p` combined with regexs, instead of sorting after the matched text, it sorts using the matched text

### Regexs

You can also specify a regex, this will sort using the text _after_ the
match. If you want it to use the matched text, use the argument `p`. Text that
do not match will be left in place, and will be at the top (or bottom if reversed).
Also worth noting, the regex language is **javascript**.

Example: `usr` => get unique values, sort descendingly and recursively.

Example: `/title-/` => sort using the text after the text 'title-' in each section/item.

## Configuration

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
