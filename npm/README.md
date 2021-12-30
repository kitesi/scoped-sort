<p align="center"><b>A feature rich sorter for the content inside of a string, usually lists</b></p>

![Example](general-example.png)

For more examples you can look at [previews.md](../previews.md), or look at the test cases.

## Usage

```js
const { sort } = require('string-content-sort');
// or
import { sort } from 'string-content-sort';

sort(
    `a
b
d
c`,
    {
        recursive: true,
    }
);
```

The first argument is the string, and the second argument is an object of options.

## Options

**reverse** | boolean

sorts descendingly

**recursive** | boolean

sorts the nested content recursively

**unique** | boolean

removes duplicates

**caseInsensitive** | boolean

sorts case insensitively. If used with `.unique`, duplicates are removed case insensitively

**sortNumerically** | boolean

sorts numerically

**sortByFloat** | boolean

sorts by floats

**sortByLength** | boolean

sorts by the length of the items/lines

**sortRandomly** | boolean

sort randomly (psuedo)

**markdown** | boolean

better sort for markdown lists. For the most part you won't need this if you properly format your markdown, but in certain cases you will.

**regex** | RegExp

a regex to match text in each item/line, the sorter will sort based on the text **after** the match. Text that do not match will be left in place, and will be at the top. The regex language is **javascript**.

**useMatchedregex** | boolean

combined with `.regex`, this will instead sort using the matched text rather than the text after the matched text.

**sectionSeperator** | RegExp

This is a way to tell the program when to start a new section as opposed to just comparing indentations. Kind of hard to example so check out [previews.md](../previws.md) example 5 for more.

## Combinations

Since this program has a lot of arguments, you might need to know how they
combine. There is no such thing as a fallback sorting here, if two lines are
equal in their sort position, they won't use the second sorter if specified.
Example: you might expect `sortByLength` and `sortNaturally` to work as in, sort by length, and fallback to
sort numerically if two lines have the same length; but that will not work.

Combinations not already stated:

<!-- prettier-ignore -->
- `markdown`, `unique`, `recursive` and `reverse` work on everything
- `regex && caseInsensitive` this doesn't make the regex case insensitive, it only makes the sort insensitive
- `regex && sortByLength && useMatchedRegex` sorts by the length of the matched text
- `regex && sortByLength` sorts by the length of the text after the matched part
- `regex && sortNumerically` tries to parse the text after the pattern as a number
- `regex && sortNumerically && useMatchedRegex` tries to parse the matched text as a number
- `regex && sortByFloat` tries to parse the end of the line as a float
- `regex && sortByFloat && useMatchedRegex` tries to parse the matched text as a float

Errors: (library does not throw any errors for now, but these make no sense)

<!-- prettier-ignore -->
- Mixing sorters like `sortNumerically` and `sortByLength`
- `regex && sortNaturally` - `regex && sortRandomly` - `caseInsensitive` when
options include one of: `sortNumerically`, `sortByFloat`, `sortByLength`,
`sortNaturally`, `sortRandomly` but doesn't include `unique`
