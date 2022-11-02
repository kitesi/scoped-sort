# String Content Sort Cli

## A feature rich text sorter that takes indentation into account

This is a CLI for the npm package [string-content-sort](https://www.npmjs.com/package/string-content-sort).

This cli tool is a part of a bigger project called
[scopedsort](https://scopedsort.netlify.app/).
[Documentation](https://scopedsort.netlify.app/docs) and
[examples](https://scopedsort.netlify.app/examples) are mainly held there.

## Usage

Command usage: `ssort [files..] [options]`

Concatenates provided file(s) -> sorts -> writes to standard output.
Provided files that are directories will be recursively read.

If no file is provided, reads from standard input.

For options use either `-h` for short help or `-H|--help` for long
help with descriptions.

Quick copy-paste from `-h`:

```text
OPTIONS: SORTERS
    You can only have one sorter at a time.

    -i, --case-insensitive
    -e, --natural-sort
    -n, --numerical-sort
    -f, --float-sort
    -l, --length-sort
    -M, --month-sort
    -D, --day-sort
    -x, --none-sort
    -z, --random-sort

OPTIONS: UNIVERSAL MODIFIERS
    These options will work on everything.

    -r, --recursive [number]
    -s, --reverse
    -u, --unique ['i']
    -m, --markdown

OPTIONS: ITEM SEARCH
        --regex <regex_value>
    -F, --field-separator <regex | string>
    -k, --use-sort-group <sort_group>
    -p, --use-matched-regex
    -o, --sort-order <sort_order>
    -a, --attach-non-matching-to-bottom

OPTIONS: SECTIONS
    --section-separator <regex | string>
    --section-starter <regex>
    --section-rejoiner <string>

OPTIONS: OTHER
    -c, --use-sort-comments
        --modify
    -y, --yes
```

## Sort Comments

This is documented on the
[website](https://scopedsort.netlify.app/docs#sort-comments), but it's one of
the most important features, so I'll repeat an introduction here.

sort-comments are a way for this program to recognize a section to sort. This
can help if you have a list that is constantly being updated, and you don’t want
to have to keep manually sorting

Example:

```js
// { sort-start --regex /['"]/ }
import react from 'react';
import express from 'express';
import isIsOdd from 'is-is-odd';
// { sort-end }
```

Read the
[actual documentation](https://scopedsort.netlify.app/docs#sort-comments) for more.

## Completions

You can use the following code if you want bash completions. It's not reactive
to valid options, so you will still get auto completions for invalid options.

If the completion word doesn't start with `-` then it will just use the default
file completion.

```bash
_ssort_completions() {
    local generic_options="--case-insensitive --natural-sort --numerical-sort --float-sort --length-sort --month-sort --day-sort --none-sort --random-sort --recursive --reverse --unique --markdown --regex --field-separator --use-sort-group --use-matched-regex --sort-order --attach-non-matching-to-bottom --section-separator --section-starter --section-rejoiner --use-sort-comments --modify --yes"

    local cur_word="${COMP_WORDS[COMP_CWORD]}"
    local prev_word="${COMP_WORDS[COMP_CWORD - 1]}"

    if [[ $cur_word = -* ]]; then
        COMPREPLY=( $(compgen -W "$generic_options" -- $cur_word))
    fi

    return 0
}

complete -F _ssort_completions -o default ssort

```

## Questions & Contribution

This program might have some learning curve, so if you need any help, submit a
GitHub issue, and I'll be glad to help. If you find any bugs or want to
contribute also create a GitHub issue.
