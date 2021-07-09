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
