export const commentRegexs = {
    sortStart: /\{ sort-start ?(?<args>.*) \}/,
    sortEnd: /\{ sort-end \}/,
};

export const getIndentationAndCharRegex = /^(?<indentation>\s*)(?<char>[-*+])?/;
// from https://stackoverflow.com/a/12643073/, doesn't support more complex floats
// like 2.3e23, I'm not too experienced with those floats so I'll hold off for now
export const floatRegex = /[+-]?([0-9]*[.])?[0-9]+/;

export const isBlankLineRegexTest = /^\s*$/;
