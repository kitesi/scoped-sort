<p align="center"><b>A feature rich text sorter based on the unix sort.</b></p>

![Example](/assets/previews/general-example.png)
For more examples you can look at [the examples page](https://scopedsort.netlify.app/examples), or look at the test cases.

## Usage

```js
const { sort } = require('string-content-sort');
// or
import { sort } from 'string-content-sort';

let list = `Pokemon
Dragon Ball Z
Naruto`;

list = sort(list, { reverse: true });

/* list's value is now:
Pokemon
Naruto
Dragon Ball Z 
*/
```

The first argument is the string to sort, and the second argument is an optional
object of options.

You can read the documentation on [the docs page](https://scopedsort.netlify.app/docs).

## Future

Here are some possible future features. Some of these features need a more defined api, or I need to know
if people actually want them.

<!-- prettier-ignore -->
- Seperate sections with blank lines

  For example you might have some text like this:

  ```text
  Theme: Material Dark
  Link: https://example.com

  Theme: Horizon
  Link: https://example.com

  Theme: Ayu Dark
  Link: https://example.com

  Theme: Atom One Dark
  Link: https://example.com
  ```

# Questions & Contribution

If you need help, found bugs or want to contribute create a github issue.
