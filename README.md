# scopedsort

<p align="center">
    <img src="assets/banner.png" alt="banner: scopedsort" />
</p>

<p align="center">

<b>A feature rich text sorter that takes indentation into
account.</b>

</p>

scopedsort is a feature rich text sorter that takes indentation into account. It
contains an extensive amount of options and features. It's main distinct feature is the implementation of [sort-comments](#sort-comments), which allows you to define sections to repeatedly sort:

```
/* { sort-start --reverse --numerical-sort } */
John has 50 cats.
Max has 20 dogs.
Susan has 10 bats.
/* { sort-end } */
```

I recommend reading the website's [introduction](https://scopedsort.netlify.app/docs#introduction).

This repo contains all its mediums:

[the npm package](/npm), [the vscode extension](/vscode),
[the website](https://scopedsort.netlify.app/) and
[the cli tool](/cli).

## Questions & Contribution

This program might have some learning curve, so if you need any help, submit a
GitHub issue, and I'll be glad to help. If you find any bugs or want to
contribute you should also create a GitHub issue.
