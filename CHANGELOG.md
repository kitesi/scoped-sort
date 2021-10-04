# 1.1.0 (10/3/2021)

<!-- prettier-ignore -->
- Add `scoped-sort.addSurroundingSortComments` command 
  - Just adds surrounding comments that works with the sort-on-save functionality.
  
  ```
  3
  1
  2
  ```
  
  turns into (assuming it's not a markdown file)

  ```
  // { sort-start }
  3
  1
  2
  // { sort-end }
  ```

# 1.0.2 (8/4/2021)

<!-- prettier-ignore -->
- Update readme
- Remove unnecessary assets packed in extension

# 1.0.1 (7/22/2021)

<!-- prettier-ignore -->
- Update readme
- Update configuration descriptions
- Add dates on changelog

# 1.0.0 (7/22/2021)

<!-- prettier-ignore -->
- Add random sort `z`
- Add natural sort `e`
- Add sorting on save
  - Add configuration option `scoped-sort.formatSectionsOnSave`, to toggle this feature
  - Extension now runs after start up instead of when you first try the sort command
  
- Errors now occur when `i` is specified with a sorter (n, f, l, z), but doesn't
  include `u`. Before it used to be if it doesn't include `u` *or* a regex pattern
  but if you are using a regex pattern with n, f, or l, then making it case insensitive
  wouldn't do anything, and using z with a regex pattern is an error anyways.

# 0.10.0 (7/17/2021)

<!-- prettier-ignore -->
- Add sort by length
- Add sort by float
- Add feature: `n` with `/pattern/` will now try to parse the matched text/the text after matched text
- Fix bug: `/pattern/` without `p` will now exclude the entire match, (before it only excluded the first letter)

# 0.9.1 (7/13/2021)

<!-- prettier-ignore -->
- Fix bug: argument `m` wasn't recognized

# 0.9.0 (7/13/2021)

<!-- prettier-ignore -->
- Arguments provided by keybindings ignore `scoped-sort.defaultArgs`
- Add ability to sort non markdown list
- Added argument `m` to help better sort markdown lists

# 0.8.2 (7/12/2021)

<!-- prettier-ignore -->
- Fix bug, command didn't work at all, due to call to dev-dependency library.

# 0.8.1 (7/12/2021)

<!-- prettier-ignore -->
- Change argument `m` to `p`

  Forgot I was gonna use `m` to specify markdown.

- Change command title from `Scope Sort Selected` to `Scoped Sort`

# 0.8.0 (7/11/2021)

<!-- prettier-ignore -->
- Fix bug where if you escaped on the prompt, it still continued, just with blank arguments
- Add `n` as possible argument (sort by number)
- Add regexs as possible argument
  - Add `m` as possible argument

# 0.7.0 (7/9/2021)

<!-- prettier-ignore -->
- Added feature: if nothing is selected, sort entire document
- Allow indented lists whose parents either don't exist or aren't selected, to be sorted

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

  If you selected the inner animals list (dog, cat, zebra, giraffe), and tried sorting it, nothing would happen.

# 0.6.0 (7/9/2021)

<!-- prettier-ignore -->
- Fix configuration defaults (recursive => false) & (caseInsensitive => false)
- Remove configuration: `.sortType`, `.recursive`, `.unique`, `.caseInsensitive`

  Redundant, replaced with `scoped-sort.defaultArgs`.
  
- Add configuration `scoped-sort.defaultArgs`

  String you would give to the prompt. If `scoped-sort.prompt` is on, it will
  auto fill the prompt with this configuration. If it is off, it will execute
  the command with these arguments.

- Remove negation arguments: `S`, `U`, `R`, `I`

  These were helpful with the previous configurations, since they didn't inject any arguments into the prompt. Since they didn't inject anything into the prompt it was also less visible what arguments were really being provided. Now that the configuration values do inject into the prompt, these are useless.

# 0.5.0 (7/6/2021)

Initial Release
