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
