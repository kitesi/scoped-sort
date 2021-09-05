// might use the links below in the future
// https://github.com/nknapp/comment-patterns/blob/master/docs/languages.md
// https://github.com/nevir/groc

interface Language {
    exts: string[];
    singleLineComment?: string[];
    multiLineComment?: string[];
}

export default [
    {
        exts: ['.md', '.markdown'],
        multiLineComment: ['<!--', '-->'],
    },
] as Language[];
