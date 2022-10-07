## Introductions

Scoped Sort is a tool to help sort text. It differs from other text sorters by
seperating items with respect to indentation. It has many options and is
implemented on npm, the command line, vscode and here. You can use this on
regular lists or markdown lists. This project was not made for programming
related things like objects, imports or html, but in certain instances it can
still sort them.

This page will serve as a reference for the website, the npm package, the cli
and vscode. Since three of those are programming related, it will lean towards
more programming type of documentation, but it should still be easy to follow. I will try to cover all the options they all mutually have, but individual things like the vscode extension's
'sort-on-save' functionality or all the command line parameters should be covered in their respective README.

If there's any issues, suggestions or questions, you can create a github issue
or email me at sixskys@proton.me.

## Universal Modifiers

These options work on everything. Except `case-insensitive` which does not work
when a sorter is specified but unique is not on.

### Case Insensitive

Makes the sort case insensitively.

- type: `boolean`
- object property: `.caseInsensitive`
- cli parameter: `--case-insensitive | -i`

### Recursive

This project takes scope/indentation into account. Most sorters just read line
by line, so when you have nested lists you end up with undesired sorts.

This program by default keeps nested content in place and does not sort the inner items, but setting
this option to true will sort the inner items.

- type: `boolean`
- object property: `.recursive`
- cli parameter: `--recursive | -r`

### Reverse

Reverses the sort after completely finishing.

- type: `boolean`
- object property: `.reverse`
- cli parameter: `--reverse | -s`

### Unique

Removes duplicate lines.

- type: `boolean`
- object property: `.unique`
- cli parameter: `--unique | -u`

### Markdown

Treats the text as a markdown list. You won't need this
option for most markdown lists but in certain instances
you will.

- type: `boolean`
- object property: `.markdown`
- cli parameter: `--markdown | -m`

## Sorters

You can only have one sorter. There is no fallback sorting here, if two lines
are equal in their sort position, they can't use a second sorter. Example: you
might expect [#length-sort](#length-sort) and [#numerical-sort](#numerical-sort)
to work as in, sort by length, and fallback to sort numerically if two lines
have the same length; but that will not work.

### Numerical Sort

Sorts based on the number in each line. All the lines
which do not have a number will be left in place.

- type: `boolean`
- object property: `.sortNumerically`
- cli parameter: `--sort-numerically | -n`

### Natural Sort

Sorts based on the [natural sort](https://en.wikipedia.org/wiki/Natural_sort_order).

- type: `boolean`
- object property: `.sortNaturally`
- cli parameter: `--sort-naturally | -e`

### Float Sort

Sorts based on the float in each line. All the lines
which do not have a float will be left in place.

- type: `boolean`
- object property: `.sortByFloat`
- cli parameter: `--sort-by-float | -f`

### Length Sort

Sorts based on the length of each line, short to long.

- type: `boolean`
- object property: `.sortByLength`
- cli parameter: `--sort-by-length | -l`

### Random Sort

Sorts randomly (psuedo).

- type: `boolean`
- object property: `.sortRandomly`
- cli parameter: `--sort-randomly | -z`

## Other

### Regex

A regex to match text in each item/line, the sorter will sort based on the text **after** the match (unless [#use-matched-regex](#use-matched-regex). Text that do not match will
be left in place, and will be at the top. The regex language is javascript.

- type: `RegExp`
- object property: `.regex`
- cli parameter: `--regex`

### Use Matched Regex

Combined with [#regex](#regex), this will instead sort using the matched text rather than the text afer.

- type: `boolean`
- object property: `.useMatchedRegex`
- cli parameter: `--use-matched-regex`

### Section Seperator

This is a way to tell the program when to start a new section as opposed to just comparing indentations.

Example: [section-seperator-html](/examples#section-seperator-html).

- type: `RegExp`
- object property: `.sectionSeperator`
- cli parameter: `--section-seperator`

## Combinations

Since this program has a lot of arguments, you might need
to know how they combine. As stated before, you can only have one
sorter. There is no such thing as fallback sorting here.

- `markdown`, `unique`, `recursive`, `reverse` work on everything
- `case-insensitive` and `unique`: removes duplicatse case insensitively
- `regex` and `case-insensitive`: doesn't make the regex case insensitive, only makes the sort insensitive
- `regex` and `sort-by-length`: sorts by the length of the text **after** the matched text
- `regex`, `sort-by-length` and `use-matched-regex`: sorts by the length of the matched text
- `regex` and `sort-numerically`: tries to parse the text **after** the matched text as a number
- `regex`, `sort-numerically`, and `use-matched-regex`: tries to parse the matched text as a number
- `regex` and `sort-by-float`: tries to parse the text **after** the matched text as a float
- `regex`, `sort-numerically`, and `use-matched-regex`: tries to parse the matched text as a float

### Combination Errors

These do not compute and will throw an error:

- Using more than one sorter
- `regex` and `sort-naturally`
- `regex` and `sort-randomly`
- `case-insensitive` when the sorter is not the normal one, and `unique` is not on

## Sort Comments

Sort comments are a way for this program to automatically recognize a section to
sort and it's options. This can help if you have a list that is constantly being
updated, and you don't want to have to keep manually sorting. In the vscode
extension, it allows the user to turn on a feature called 'sort-on-save' which
will like it states, sort the section on save. I personally would not recommend
using the feature, as it adds the check for _every_ file. Instead I would
suggest to use the cli application.

```js
// { sort-start --regex /['"]/ }
import react from 'react';
import express from 'express';
import isIsOdd from 'is-is-odd';
// { sort-end }
```

As you can see there are two lines to declare the start and end. The first line
(sort-start) has to have `{ sort-start }` some where in the line. It does not
matter where, it can be at the start, in between or at the end. Same for the
second line (sort-end) with `{ sort-end }`. Spacing and casing do matter.
`{sort-start}` or `{ sort-START }` would not work. In the sort-start line you
can also specify options after the text `sort-start`. It uses the same syntax
of the cli program. Just make sure you have a space after that text, and before
the `}`.

```text {0,4}
/* { sort-start --reverse --sort-numerically } */
There are 220 guards.
And only 50 of us.
What is a man do, but to call his 7yo daughter.
/* { sort-end } */
```

If you are sorting multiple files at once, and want to ignore a particular file,
you can include a line with the text `{ sort-ignore-file }`. It follows the same
rules of 'sort-start' and 'sort-end'.

<style>
    :root {
        --sidebar-width: 400px;
        --max-content-width: 100ch;
    }
</style>
