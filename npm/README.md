# String Content Sort

## A feature rich text sorter that takes indentation into account

This npm package is a part of a bigger project called
[scopedsort](https://scopedsort.netlify.app/).
[Documentation](https://scopedsort.netlify.app/docs) and
[Examples](https://scopedsort.netlify.app/examples) are mainly held there.

Functions and properties will still have descriptions and typing, so you don't
need to always refer back to the documentation.

## Usage

This package exports two main functions `sort(<string>, [options])` and `sortComments(<string>)`. There
are other functions that are exported, but they are more low-level and meant for
other scopedsort providers like the [vscode extension](https://marketplace.visualstudio.com/items?itemName=karizma.scoped-sort)
or the [command line tool](https://www.npmjs.com/package/string-content-sort-cli)

```js
const { sort } = require('string-content-sort');
// or
import { sort } from 'string-content-sort';

let list = `Pokemon
Dragon Ball Z
Naruto`;

list = sort(list, { reverse: true });

assert(
    list,
    `Pokemon
Naruto
Dragon Ball Z`
);
```

The first argument is the string to sort, and the second argument is an optional
object of options.

NOTE: The options object will be mutated, as a lot of the properties are shorthand for other values.

The end result of options can still be re-used and will
still produce the same output.

This function will throw if you have faulty options. You can turn this off by setting `options.reportErrors`.
If turned off, it will always return a string similar to the input, possibly not what you want or expect.

```js
sort('', {
    sorter: 'random'
    // regex with random sort makes no sense
    regexFilter: /\w+/,
    reportErrors: false
});
```

---

The other function, `sortComments(<string>)` is to sort text that have
[sort-comments](https://scopedsort.netlify.app/docs#sort-comments). It does not
return back just a string, but an object with the schema:

```ts
interface {
    commentSections: {
        startLine: number;
        endLine: number | null;
        hasChanged: boolean;
    }[];
    errors: string[];
    result: string;
}
```

Example:

```js
import { sortComments } from 'string-content-sort';

const list = `Here is my list of my favorite food:

// { sort-start -s }
- ice cream
- pizza
- orange
// { sort-end }

Welp that concludes my list.`;

assertDeepEquals(sortComments(list), {
    errors: [],
    commentSections: {
        startLine: 2,
        endLine: 6,
        hasChanged: true,
    },
    result: `Here is my list of favorite food:

// { sort-start -s }
- pizza
- orange
- ice cream
// { sort-end }

Welp that concludes my list`,
});
```

# Questions & Contribution

This program might have some learning curve, so if you need any help, submit a
github issue and I'll be glad to help. If you find any bugs or want to
contribute also create a github issue.
