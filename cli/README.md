# String Content Sort Cli

This is a CLI for the npm package [string-content-sort](https://www.npmjs.com/package/string-content-sort).

This will help automatically sort text with a command.

## Usage

The commands are used through `ssort`.

There are two commands, the default command, and the modify command.

The default command works sort of like the unix sort commmand. It can take
in a file or read from standard input.

I recommend reading the [original npm package](https://www.npmjs.com/package/string-content-sort) and using `--help` for options on the default command.

Here are the correlations:

```
--reverse | -s => .reverse
--recursive | -r => .recursive
--unique | -u => .unique
--case-insensitive | -i => .caseInsensitive
--sort-numerically | -n => .sortNumerically
--sort-by-float | -f => .sortByFloat
--sort-by-length | -l => .sortByLength
--sort-randomly | -z => .sortRandomly
--markdown | -m => .markdown
--regex => .regex
--use-matched-regex | -p => .useMatchedRegex
--section-seperator => .sectionSeperator
```

The modify command helps you modify files in-place. This does not sort the whole file as you might expect, you need to define sections to sort, and your options for those sections.

You define the start of a section by having a line with `{ sort-start [options] }`. And you define the end of a section by having a line with `{ sort-end }`.

It does not matter where those texts are, for example you could have `// { sort-start }` or `<!-- { sort-start } -->`. But you do need to to have a space before and after the words, so `// {sort-start}` would not work.

As for options, you simply just use flairs like in the default command `// { sort-start -re }` or `// { sort-start --reverse --recursive }`.

An example might be something like:

```
List of episodes:

<!-- { sort-start -mn } -->
Digimon: 12
Pokemon: 500
Shaman King: 56
<!-- { sort-end } -->
```

If you want to ignore a file, include a line with `{ sort-ignore-file }` somewhere in it.

# Contributing / Help

Contributions are very welcome and appreciated.

If you need help with something, found a bug, or want to request a feature,
feel free to make an issue.

If you want to fix a bug or contribute a feature, first create an issue, and
then you can work on a pull request.
