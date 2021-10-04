// might use the links below in the future
// https://github.com/nknapp/comment-patterns/blob/master/docs/languages.md
// https://github.com/nevir/groc

type Language = {
    ids?: string[];
} & ({ singleLineComment: string } | { multiLineComment: string[] });

export const languageComments: Language[] = [
    {
        ids: ['markdown', 'html'],
        multiLineComment: ['<!--', '-->'],
    },
];

export const defaultLanguageComment: Language = {
    singleLineComment: '//',
};
