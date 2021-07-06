# Scoped Sort

![banner](assets/banner.png)

This is a vscode extension to help sort text & lists in a scoped manner. Vscode
already provides a commands for sorting (`editor.action.sortLinesDescending` and `editor.action.sortLinesAscending`) but the problem with these commands is that they sort line by line rather than in a scope.

So:

```text
- pikachu
  - yellow
- charmander
  - red
- bulbasaur
  - green
- squirtle
  - blue
```

Becomes:

```text
  - blue
  - green
  - red
  - yellow
- bulbasaur
- charmander
- pikachu
- squirtle
```

But obviously we would want:

```text
- bulbasaur
  - green
- charmander
  - red
- pikachu
  - yellow
- squirtle
  - blue
```

Another problem is that it's very limited, other extensions solve that problem,
but they don't add scope.

Currently it only supports markdown lists but it will eventually support other lists.

## Demos

If you want to see some demos visit [demos.md](demos.md). I'm not including them
here so it doesn't load gifs unnecessarily.

## Usage

This command is exposed by the command `scoped-sort.sort`.

To use this, go to your command pallete (usually `ctrl+shift+p`), type 'scoped sort',
and select the command. It will then give you a prompt that allows for arguments.

These arguments are single letters, and can be uppercased to get the opposite. Here's all the arguments:

<!-- prettier-ignore -->
- `s` sort ascendingly
- `S` sort descendingly
- `r` sort recursively
- `R` don't sort recursively
- `u` remove duplicates
- `U` don't remove duplicates
- `i` case insensitive
- `I` not case insensitive

Example: `uSr` => get unique values, sort descendingly and recursively.

## Configuration

All of the configuration is under `scoped-sort`, visit your settings.json to change them.

`scoped-sort.prompt`: boolean

Decides if the program should always prompt/ask for options.
Default: true

`scoped-sort.sortType`: 'ascending' | 'descending'

The sorting type.
Default: 'ascending'

`scoped-sort.recursive`: boolean

Decides if nested items will also be sorted.
Default: false

`scoped-sort.unique`: boolean

Decides if duplicated items will be deleted.
Default: false

`scoped-sort.caseInsensitive`: boolean

Decides if sorting should be case insensitive, if unique is also provided, it will delete duplicate items regardless of their difference in casing.

## Adding Keybindings

If you are planning to add keybindings, you can add `.args` to provide arguments. This will make it so no prompt shows
For example:

```json
{
    "key": "ctrl+shift+m",
    "command": "scoped-sort.sort",
    "args": "Sur"
}
```

Would mean sort descendingly and recursively, and remove duplicates.
