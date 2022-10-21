## 2.0.0 (10/21/22)

### Sorter propety rename

Instead of having `sortNaturally`, `sortNumerically`... as a boolean property on options,
there is now just a "sorter" property on options.

this makes it a lot easier:

1. no error checks needed for multiple sorters
2. possibly easier auto completion since all the values are there
3. code is cleaner

### Make case-insensitive a sorter

case-insensitive could not be used with another sorter unless `unique` was specified,
practically being a sorter itself. Makes it less confusing and removes error
check/documentation.

The only loss is that before you could use a sorter, and have case-insensitive with `unique`.
this would sort based on the sorter.

This was fixed by making unique a string value rather than a boolean. A value of
`'exact'` will only remove exact duplicates, `'case-insensitive'` will remove
case-insensitively.

### Include sort-comments support:

Both the vscode extension and cli program used sort-comments, and the npm package should too.
This also removes the repeated code.

You can now use `sortComments()` to sort comments.
It does not return just a string, but an object of errors, the comment sections, and the result

This meant I had to make my own parser and string tokenizer (didn't want to include dependencies).
Might have some bugs, but should work as long as you stick to a normal/reasonable user.

### Switch naming styling to x-sort rather than sort-by-x or sort-x

for example we had, sortNaturally, sortNumerically, sortByLength, etc...

they have now been switched to natural-sort, numerical-sort, length-sort.
(in the sorter property they don't have the '-sort' suffix)

the sort-by-x is just tedious and long to type out.

### natural-sort works with regex now

Mistakenly thought sorting naturally with regexs would not be useful.

### Allow i & g flag on regexs

The i flag is now allowed on all regexs, the g flag is allowed on `.regexFilter` and `--regex`.

### Add property & concept: sortGroups

This is a pretty big feature, it allows you to sort based on groups or fields.
Similar to unix sort's `-k | --keydef`.

columns/fields are determined by either a field-seperator, or a regex.
if neither are specified, the default field-seperator will be `/\s+/`,
any blank whitespace.

if a regex is specified, it will use `section.match(regex)`. this means
having a g flag on your regex will change the columns.

### Add property: sortOrder

This is like a custom sorter, it tells the program how to compare values.
For example if you have a list of genders you can supply the details
of what gender should go before and after which

### Add property: fieldSeperator

as mentioned in sortGroups, columns are determined by either a fieldSeperator or regex.

### Add property: attachNonMatchingToBottom

By default items that do not match a sorter (numerical, float, ...), or
don't match a regex will stay in place and be at the top. If this is set
to true, it will be at the bottom. Vise versa if
`reverse` is set to true.

### Add sorters

-   none-sort: don't sort, might seem counterintuitive for a text sorter, but it's main
    use case is with unique
-   month-sort: sort by month
-   day-sort: sort by day

### Rework section-seperator & add section-starter & section-rejoiner

section-seperator was inappropriately named, as it was more of a section-starter.
So that's the new name. I added an actual section-seperator, and added section-rejoiner
to help.

section-seperator can be used to seperate sections with blank lines like so:

```
Website: Instagram
Link: https://www.instagram.com
Type: Social Media
Age: 18

Website: StackOverflow
Link: https://stackoverflow.com
Type: Forum
Age: 10

Website: Discord
Link: https://discord.com
Type: Social Media
Age: 5
```

```js
sort(text, {
    sectionSeperator: /\n\n/,
    sectionRejoiner: '\n\n',
});
```

which will result in the expected result of:

```
Website: Discord
Link: https://discord.com
Type: Social Media
Age: 5

Website: Instagram
Link: https://www.instagram.com
Type: Social Media
Age: 18

Website: StackOverflow
Link: https://stackoverflow.com
Type: Forum
Age: 10
```

### Recursive can now take a number for depth

Previously it was all or nothing. Now you can limit how far recursively it will sort.
I would prefer the ability to have individual options and sorters for each level,
but thinking about implementation details & documentation of it is giving me a headache

### Sort functions throws by default now

## 1.0.8 (8/1/22)

-   fix error where `case-insensitive` and no `unique` resulted in error, when it
    was only supposed to result in error when a sorter is also specified

## 1.0.7 (8/1/22)

-   changes in meta data
-   add `reportErrors` option

## 1.0.5 (2/6/22)

-   try to get img to work

## 1.0.4 (2/6/22)

-   update git repo

## 1.0.3 (1/27/22)

-   Add general-example.png to files

## 1.0.2 (1/27/22)

-   Add repo to package.json

## 1.0.1 (12/31/21)

-   Fix some readme issues
