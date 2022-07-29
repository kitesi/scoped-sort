# String Content Sort Cli

## A feature rich sorter for the content inside of a string.

This is a CLI for the npm package [string-content-sort](https://www.npmjs.com/package/string-content-sort).

## Usage

The commands are used through `ssort`.

There are two commands, the default command, and the modify command.

The default command works sort of like the unix sort commmand. It can take
in a file or read from standard input.

I recommend reading the [documentation](https://scopedsort.netlify.app/docs) or using `--help` to understand the options.

The modify command helps you modify files in-place. This does not sort the whole file as you might expect, you need to define sections to sort, and your options for those sections.

You define the start of a section by having a line with `{ sort-start [options] }`. And you define the end of a section by having a line with `{ sort-end }`.

These are called [sort comments](https://scopedsort.netlify.app/docs#sort-comments).

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

# Questions & Contribution

If you need help, found bugs or want to contribute create a github issue.
