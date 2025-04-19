## Introduction

scopedsort is a feature rich text sorter that takes indentation into account.
It contains an extensive amount of options and features.

### Why

#### Indentation Awareness

Most sorters do not keep track of indentation and simply sort line by line.

<div class="pre-container">

```py
# input
- Games
  - Valorant
  - League of Legends
- Music
- Apps
```

```py
# expected
- Apps
- Games
  - League of Legends
  - Valorant
- Music
```

```py
# actual
  - League of Legends
  - Valorant
- Apps
- Games
- Music
```

</div>

#### Standardization & Utility

This project is implemented on vscode, npm, the command line and this website.
They all share the same options and output.

A big part of this tool is [sort-comments](#sort-comments). I am not aware of
any other project that allows you to specify a section to repeatedly sort.

#### Options

This project has a lot of options; all of which can be used together (provided
they don't conflict logically). Other tools have a reasonable amount of options,
but usually they don't provide a nice way to combine them.

Some of the more extensive options this program implements include:
custom-sort-orders, sort-by-column, sort-by-regex, etc...

This is one of the less valid points though, since you won't need these
advanced options often.

#### What This Project Is Not

This extension is not meant for sorting words inside a line, nor is it trying
to sort language specific things like imports or properties of an object
(although it can sort them if they have a simple structure using regex).

#### Alternatives

This tool might have a bit of a learning curve and does require some reading.
Here are some alternatives that might suit you better:

- vscode extension:
  [tyriar.sort-lines](https://marketplace.visualstudio.com/items?itemName=Tyriar.sort-lines)
  the native commands might also work
- website: [texttools.org/sort-text](https://texttools.org/sort-text)
- cli: standard unix sort command

### Before Reading

I recommend reading through everything sequentially first, and then using it as
a reference.

This page will serve as a reference for the website, the npm package, the cli command and the vscode extension.

I will try to cover the options they all mutually have, but individual
things like the vscode extension's 'sort-on-save' functionality or the extra
command line options should be covered in their respective README or
documentation.

The website, vscode extension and command all share a cli-like style of providing
arguments (i.e. `--recursive 3`).

The npm package also has some usage of this argument style when using [sort-comments](#sort-comments).

If there are any issues, suggestions or questions, you can create a github issue
or email me at kitesi@proton.me.

### Philosophy & Speed

You can skip this section if you aren't interested.

scopedsort started out as a vscode extension to sort nested lists. I had
a variety of markdown lists that I wanted to sort, but none of the sorters
took indentation into consideration.

I realized the project could be helpful as a npm package, so I
abstracted the functionality into npm, and then a command line tool, and lastly a
website.

It has evolved into something much more than merely just a "scoped sorter", but
too late to change the name.

scopedsort is written in JavaScript. It is a slower language, but
since this project in so many places, it's easier to just use JavaScript. There is WebAssembly and I could possibly
embed a command line tool into the vscode extension, but it's not worth the hassle.

As for speed, it is obviously slower than the unix sort command, and probably
more than other options. Speed is not the ultimate goal for this project, but I
do take it into consideration.

If you are interested in some benchmarks:

Note: these benchmarks aren't run formally or professionally at all. They are
run on my computer with other processes running in the background.

<div class="pre-container">

```shell
~$ time ssort /utc/share/dict/*
real    0m2.336s
user    0m1.750s
sys     0m0.839s
```

```shell
~$ time sort /utc/share/dict/*
real    0m3.356s
user    0m4.292s
sys     0m2.136s
```

</div>

This is not a fair comparison as the outputs are different (accents & such);
a fairer comparison would be using the `-e` flag on `ssort`.

```shell
~$ time ssort /utc/share/dict/* -e
real    0m3.346s
user    0m2.726s
sys     0m0.917s
```

Generally on smaller individual files, `sort` is faster.

## Universal Modifiers

These options work on everything.

### Recursive

This project takes scope/indentation into consideration and does not just sort
line by line.

By default, nested content (indented) will be left in place and not
sorted. If set to true (no number argument), will sort inner sections
recursively. If a number is set, it will only sort sections up whose depth is less than or equal to that number.

Note: on the website version, there is no boolean option, only numbers.

- type: `boolean` | `number`
- object property: `.recursive`
- cli parameter: `--recursive` | `-r`

### Reverse

Reverse the sort comparisons.

- type: `boolean`
- object property: `.reverse`
- cli parameter: `--reverse` |`-s`

### Unique

Remove duplicate lines. If "case-insensitive" is provided, duplicates will be
removed without regard to casing.

- type: `"exact"` | `"case-insensitive"`
- object property: `.unique`
- cli parameter: `--unique` | `-u`

### Markdown

Treat the text as a markdown list. You won't need this
option for most markdown lists but in certain instances
you will.

Usually the program starts a new section if the indentation
changes, but with this, it'll wait for "\*", "-", or "+".

- type: `boolean`
- object property: `.markdown`
- cli parameter: `--markdown` | `-m`

## Sorters

You can only have one sorter. On npm, the property name is `"sorter"`. Example:

```js
sort(someText, {
	sorter: 'case-insensitive'
});
```

### Case Insensitive

Sort case insensitively on the captured result.

- object value: `"case-insensitive"`
- cli parameter: `--case-insensitive` | `-i`

### Natural Sort

Sort [naturally](https://en.wikipedia.org/wiki/Natural_sort_order) based on the
captured result.

- object value: `"natural"`
- cli parameter: `--natural-sort` | `-e`

### Numerical Sort

Sort based on the number of the captured result. If no regex is
specified, it will sort by the first number in the line.

- object value: `"numerical"`
- cli parameter: `--numerical-sort` | `-n`

### Float Sort

Sort based on the float of the captured result. If no regex is
specified, it will sort by the first float in the line.

- object value: `"float"`
- cli parameter: `--float-sort` | `-f`

### Length Sort

Sort based on the length of the captured result, short to long.

- object value: `"length"`
- cli parameter: `--length-sort` | `-l`

### Month Sort

Sort by the month of the captured result (jan, feb, mar, ..). If no regex
or field-separator is specified, it will sort by the first text that
matches `/jan|feb|mar|../`.

- object value: `"month"`
- cli parameter: `--month-sort` | `-M`

### Day Sort

Sort by the day of the captured result (mon, tue, wed,..). If no regex or
field-separator is specified, it will sort by the first text that
matches `/mon|tue|wed|../`.

- object value: `"day"`
- cli parameter: `--day-sort` | `-D`

### None Sort

Don't sort; mainly used with the [#unique](#unique) option.

- object value: `"none"`
- cli parameter: `--none-sort` | `-x`

### Random Sort

Sort (psuedo) randomly.

- object property: `"random"`
- cli parameter: `--random-sort` | `-z`

## Item Search

### Regex

A regex to match text in each item. By default, the sorter will use
the text after the match. Text that does not match will be left in
place, and will be at the top. The regex language is JavaScript.

A global flag (g) can be used, which will alter the way
[#sort-groups](#sort-groups) works. An "i" flag can also be used.

- type: `RegExp`
- object property: `.regexFilter`
- cli parameter: `--regex`

### Field Separator

The separator used to determine columns, defaults to `/\s+/` if no regex is
specified.

- type: `RegExp` | `string`
- object property: `.fieldSeparator`
- cli parameter: `--field-separator` | `-F`

### Sort Groups

Determine what group(s) to use when sorting. Used with [#regex](#regex) or
[#field-separator](#field-separator).

If no regex or field-separator is provided, field-separator will default
to `/\s+/`, and groups will be split by whitespace.

The syntax for this is a bit complex. First you have braces with the
groups it should apply to: `{2}`, `{2,5}`, `{2..5}` (or other combinations).
Ranges (`{x..y}`) need to have both a start and end. So you can not have
`{..5}` or `{3..}`.

Next you have the options it should apply to those groups, i.e., `ls` or
`xu`.

Which would result in something like: `{2}ls` or `{5..6}xu`.

```shell
-k "{5..6}xu"
```

The allowed arguments are:

- i,e,n,f,l,M,D,x for their respective sorter. z or random-sort is not allowed
- s for reverse
- a for [#attach-non-matching-to-bottom](#attach-non-matching-to-bottom)
- o for [#sort-order](#sort-order)

If an option has an argument like 'u' (unique), you will need to separate
the name and the argument with \_: `{2}sx_u=i`, `{2}u=i_x` or `{2}u=i`

The only other option that takes an argument is 'o'. For example usage,
look at [#sort-order](#sort-order).

You can also have multiple sort groups like such:

```shell
-k "{2}n,{3}l"
```

Note: the comma is not necessary.

This translates to: if an item's second group is a number, it will sort using
that. Otherwise, it will stay in place and then all the items that did not have
a number on group 2 will be compared based on the length of their 3rd group.

The first sort group will inherit any top level option that is valid for
a sort-group (sorter, reverse, attach-non-matching-to-bottom, sort-order).

For example, the bottom two are the same:

```shell
-k "{2}e"
-k "{2}" -e
```

Other examples:

```shell
-k "{2}l" # sort by the 2nd group's length
-k "{1}x_u=i" # remove duplicates on the 1st group case-insensitively
-k "{5}s" # sort normally by the 5th group and reverse
```

- type: `object` (npm), `string` (everything else)
- object property: `.sortGroups`
- cli parameter: `--use-sort-group` | `-k`

### Use Matched Regex

Combined with [#regex](#regex), this will sort using the first matched text
rather than the text after. Shorthand for `--use-sort-group "{1}"`.

- type: `boolean`
- object property: `.useMatchedRegex`
- cli parameter: `--use-matched-regex` | `-p`

### Sort Order

Determine the sort order of the captured results. For example, let's
say you have an CSV table of people and their info, and the third column
contained their gender. If you wanted to define a custom sort by gender,
you could do:

```shell
-o "male;female;non-binary;n/a" -F "," -k "{3}"
```

NOTE: You would first have to capture the 3rd group, which is done
with `-k {3}` and `-F ","`. These options won't be included for the rest of the
examples.

It's also possible the gender values are capitalized. You can set
it to be case-insensitive by prefixing the "i" argument and a colon:

```shell
-o "i:male;female;non-binary;n/a"
```

If you don't want to write as much, you can add a looseness
argument, which will only compare the first x characters:

```shell
-o "3i:mal;fem;non;n/a"
```

NOTE: the values you provide ('mal', 'fem', ...) won't
be transformed at all, so make sure you have them correct if you are
using case-insensitive or looseness.

To summarize: you have a list of values separated by ';', and you can
prefix that list with arguments followed by a colon. The arguments
can be either a number or 'i'.

- type: `object` (npm), `string` (everything else)
- object property: `.sortOrder`
- cli parameter: `--sort-order` | `-o`

### Attach Non-Matching To Bottom

By default, items that do not match a sorter (numerical, float, ...) or
regex will stay in place and be set at the top. If this is set to true, it
will be at the bottom. Vise versa if `reverse` is set to true.

- type: `boolean`
- object property: `.attachNonMatchingToBottom`
- cli parameter: `--attach-non-matching-to-bottom` | `-a`

## Sections

### Section Separator

Tell the program when to separate sections as opposed to lines & indentation.
Lines are not read at all, and the text is split on every instance of the given
value.

Example: [blank-line-separation](/examples#blank-line-separation)

- type: `RegExp` | `string`
- object property: `.sectionSeparator`
- cli parameter: `--section-separator`

### Section Starter

Tell the program when to start a new section as opposed to lines & indentation.
The difference it has with [#section-separator](#section-starter) is that lines
are still read through, and whenever a line tested against this regex passes, a
new section is started.

Example: [section-starter-html](/examples#section-starter-html)

### Section Rejoiner

Tell the program how to rejoin sections, defaults to `"\n"`.

- type: `string`
- object property: `.sectionRejoiner`
- cli parameter: `--section-rejoiner`

## Sort Comments

sort-comments are a way for this program to recognize a section to sort. This
can help if you have a list that is constantly being updated, and you don't want
to have to keep manually sorting. In the vscode
extension, it allows the user to turn on a feature called 'sort-on-save', which
will like it states, sort the section on save. I personally would not recommend
using the sort-on-save feature, as it adds the check for _every_ file, and does it on every save instance. Instead, I would suggest using the cli application.

Example:

```js
// { sort-start --regex /['"]/ }
import react from 'react';
import express from 'express';
import isIsOdd from 'is-is-odd';
// { sort-end }
```

As you can see there are two lines to declare the start and end. The first line
(sort-start) has to have `{ sort-start }` somewhere in the line. It does not
matter where. It can be at the start, in between, or at the end. Same for the
second line (sort-end) with `{ sort-end }`. Spacing and casing **do** matter.
`{sort-start}` or `{ sort-START }` will not work. In the sort-start line you
can also specify options after the text "sort-start". It uses the same syntax
of the cli program. Just make sure you have a space after the arguments (before
the `}`).

```text {0,4}
/* { sort-start --reverse --numerical-sort } */
There are 220 guards.
And only 50 of us.
What is a man do, but to call his 7yo daughter.
/* { sort-end } */
```

If you want to ignore a particular file, you can include a line with the text
`{ sort-ignore-file }` at the start of the file. It follows the same rules of
sort-start and sort-end.

## Combination Errors

These do not compute and will throw an error:

- `regex` and `random-sort`
- `use-matched-regex` and `random-sort`
- `regex` and `field-separator`
- `use-matched-regex` and `sort-groups`
- `month-sort` or `day-sort` and `sort-order`

All of them either don't make sense, or conflict. There are other
questionable combinations, but they do not throw an error.

<style>
    :root {
        --sidebar-width: 400px;
        --max-content-width: 100ch;
    }
</style>
