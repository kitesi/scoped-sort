# String Content Sort Cli

## A feature rich sorter for the content inside of a string.

This is a CLI for the npm package [string-content-sort](https://www.npmjs.com/package/string-content-sort).

## Usage

Command usage: `ssort [files..]`

The command takes positional arguments of files or directories. Directories will be read through
recursively.

You can also specify text from standard input.

As for options I recommend reading the [documentation](https://scopedsort.netlify.app/docs).
There are some options that are not listed on their though. By default the command does
not modify the files. If you specify `--modify` it will.

There are times where you don't want to sort the entire file. This is where [sort comments](https://scopedsort.netlify.app/docs#sort-comments) come in.

You define the start of a section by having a line with `{ sort-start [options] }`. And you define the end of a section by having a line with `{ sort-end }`.

Make sure the spacing is exactly like that, other wise it will not work.

An example might be something like:

```
List of episodes:

<!-- { sort-start -mn } -->
Digimon: 12
Pokemon: 500
Shaman King: 56
<!-- { sort-end } -->
```

You can tell the program to sort using sort comments rather than reading line by line with the `--use-sort-comments | -c`

If you want to ignore a file, include a line with `{ sort-ignore-file }` somewhere in it.

# Completions

If you want bash completions, you can use the following code.
It's not reactive to valid options though. So you will still
get auto completions for invalid options.

If the completion word doesn't start with `-` then it will just use
the default file completion otherwise it will show the actual options.

```bash
_ssort_completions() {
    local generic_options="--reverse --recursive --unique --case-insensitive  --sort-naturally --sort-numerically --sort-by-float --sort-by-length --sort-randomly --regex --use-matched-regex --section-seperator --modify  --use-sort-comments"
    local cur_word="${COMP_WORDS[COMP_CWORD]}"
    local prev_word="${COMP_WORDS[COMP_CWORD - 1]}"

    if [[ $cur_word = -* ]]; then
        COMPREPLY=( $(compgen -W "$generic_options" -- $cur_word))
    fi

    return 0
}

complete -F _ssort_completions -o default ssort
```

# Questions & Contribution

If you need help, found bugs or want to contribute create a github issue.
