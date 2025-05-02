<!-- { sort-ignore-file } -->

# Changelog

## 4.0.1 (5/2/25)

-   fix "rate me" popup on every startup?

## 4.0.0 (4/28/25)

-   not really a big update, just fixed up some old code with new VSCode API + added a quick reminder to rate this extension if you find it helpful + add small analytic
    to check active user count

## 3.1.1 (11/12/22)

-   update to npm version 2.3.2 which patches issue #10 where starting blank
    lines were not properly being handled

## 3.1.0 (11/2/22)

-   implement [string-content-sort@2.3.0](https://www.npmjs.com/package/string-content-sort),
    which fixed typos of 'seperate' to 'separate'. This does affect the old
    options of `--field-seperator` and `--section-seperator`.

## 3.0.0 (10/28/22)

-   implement
    [string-content-sort@~v2](https://www.npmjs.com/package/string-content-sort)
    which includes a lot more sorting options - add `scoped-sort.sortComments` to
    help sort comments
-   set `scoped-sort.formatSectionsOnSave` to default to false

## 2.3.0 (8/1/22)

-   mainly metadata and internal changes, nothing new
-   all the errors are now sent in one message. So if you have multiple errors
    you don't keep changing and getting new errors.

## 2.2.1 (2/6/22)

-   update repo link

## 2.2.0 (1/27/22)

-   [fix bug: sort on save accidently sorts the wrong file](https://github.com/sixskys/scoped-sort/issues/3)
-   start using npm package `string-content-sort` and `string-content-sort-cli`
    -   regex is now not specified by positional arguments, use `--regex`

## 2.1.0 (12/28/2021)

-   update placeholder text to match the new arguments' schema introduced in
    2.0.0 (flairs)

-   changed `.defaultArgs` in settings to be an object
-   fix adding a new line before and after selected text when using the main
    command on a markdown file

## 2.0.1 (12/26/2021)

-   fix formatting on save on markdown files adding an empty line after sort-start

markdown formatters like prettier add a new line after a comment.
So `<!-- { sort-start } -->` would always have a new line after it.

So

```text
<!-- { sort-start } -->
z
b
a
<!-- { sort-end } -->
```

turns into

```text
<!-- { sort-start } -->

a
b
z
<!-- { sort-end } -->
```

There's no way to turn it off afaik so the 'fix' is to add a new line
before the ending sort comment as well (`<!-- { sort-end } -->`).

So now the result is

```text
<!-- { sort-start } -->

a
b
z

<!-- { sort-end } -->
```

# 2.0.0 (10/25/2021)

-   Change parsing rules
    -   add long option names
        -   example: you can use `--sort-naturally` instead of `-e`
    -   must now use dashes to specify options, this is due to the previous
        change, so something like `su` would now have to be `-su` or `-s -u`
-   Add option `--section-seperator`, this is a way to tell the program when to
    start a new section, as opposed to just comparing indentations. Check out
    [previews.md](previews.md) example 5, for an example.

# 1.1.0 (10/3/2021)

-   Add `scoped-sort.addSurroundingSortComments` command

    -   Just adds surrounding comments that works with the sort-on-save functionality.

    ```text
    3
    1
    2
    ```

    turns into (assuming it's not a markdown file)

    ```text
    // { sort-start }
    1
    2
    3
    // { sort-end }
    ```

# 1.0.2 (8/4/2021)

-   Update readme
-   Remove unnecessary assets packed in extension

# 1.0.1 (7/22/2021)

-   Update readme
-   Update configuration descriptions
-   Add dates on changelog

# 1.0.0 (7/22/2021)

-   Add random sort `z`
-   Add natural sort `e`
-   Add sorting on save

    -   Add configuration option `scoped-sort.formatSectionsOnSave`, to toggle
        this feature

    -   Extension now runs after start up instead of when you first try the sort
        command

-   Errors now occur when `i` is specified with a sorter (n, f, l, z), but doesn't
    include `u`. Before it used to be if it doesn't include `u` _or_ a regex pattern
    but if you are using a regex pattern with n, f, or l, then making it case-insensitive
    wouldn't do anything, and using z with a regex pattern is an error anyway.

# 0.10.0 (7/17/2021)

-   Add sort by length
-   Add sort by float
-   Add feature: `n` with `/pattern/` will now try to parse the matched text/the
    text after matched text

-   Fix bug: `/pattern/` without `p` will now exclude the entire match, (before
    it only excluded the first letter)

# 0.9.1 (7/13/2021)

-   Fix bug: argument `m` wasn't recognized

# 0.9.0 (7/13/2021)

-   Arguments provided by keybindings ignore `scoped-sort.defaultArgs`
-   Add ability to sort non markdown list
-   Added argument `m` to help better sort markdown lists

# 0.8.2 (7/12/2021)

-   Fix bug, command didn't work at all, due to call to dev-dependency library.

# 0.8.1 (7/12/2021)

-   Change argument `m` to `p`

    Forgot I was gonna use `m` to specify markdown.

-   Change command title from `Scope Sort Selected` to `Scoped Sort`

# 0.8.0 (7/11/2021)

-   Fix bug where if you escaped on the prompt, it still continued, just with
    blank arguments

-   Add `n` as possible argument (sort by number)
-   Add regex as possible argument
-   Add `m` as possible argument

# 0.7.0 (7/9/2021)

-   Added feature: if nothing is selected, sort entire document
-   Allow indented lists whose parents either don't exist or aren't selected, to
    be sorted

    Example:

    ```text
    - Animals
      - Dog
      - Cat
      - Zebra
      - Giraffe
    - Places
      - Something
      - Otherthing
    ```

    If you selected the inner animals list (dog, cat, zebra, giraffe), and tried
    sorting it, nothing would happen.

# 0.6.0 (7/9/2021)

-   Fix configuration defaults (`recursive` => false) & (`caseInsensitive` => false)
-   Remove configuration: `.sortType`, `.recursive`, `.unique`, `.caseInsensitive`

    Redundant, replaced with `scoped-sort.defaultArgs`.

-   Add configuration `scoped-sort.defaultArgs`

    String you would give to the prompt. If `scoped-sort.prompt` is on, it will
    autofill the prompt with this configuration. If it is off, it will execute
    the command with these arguments.

-   Remove negation arguments: `S`, `U`, `R`, `I`

    These were helpful with the previous configurations, since they didn't
    inject any arguments into the prompt. Since they didn't inject anything into
    the prompt it was also less visible what arguments were really being
    provided. Now that the configuration values do inject into the prompt, these
    are useless.

# 0.5.0 (7/6/2021)

Initial Release
