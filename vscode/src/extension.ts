import * as vscode from 'vscode';
import type { Options } from 'string-content-sort';

import { sort } from 'string-content-sort';
import { parseStringArguments } from './parse-string-arguments.js';
import * as commentRegex from './comment-regexs.js';
import {
    languageComments,
    defaultLanguageComment,
} from './language-comments.js';
interface DefaultArgs {
    prompt?: string;
    'no-prompt'?: string;
    addSurroundingSortComments?: string;
}

function parseOptionsFromArgs(args: string) {
    try {
        const options = parseStringArguments(args);
        sort('', options);

        return options;
    } catch (err) {
        return err as Error;
    }
}

function sortOverRangeOrSelection(
    editor: vscode.TextEditor,
    location: vscode.Range | vscode.Selection,
    options: Options,
    isCommand: boolean
) {
    return editor.edit((edit) => {
        let replacementText = sort(editor.document.getText(location), options);

        // markdown formatters add a new line after a comment, and usually you will
        // use the sort on save functionality with a comment. To make the text still
        // look nice and symmetrical we just add a new line before the sort-end comment
        if (!isCommand && editor.document.languageId === 'markdown') {
            if (!replacementText.startsWith('\n')) {
                replacementText = '\n' + replacementText;
            }

            if (!replacementText.endsWith('\n')) {
                replacementText += '\n';
            }
        }

        edit.replace(location, replacementText);
    });
}

async function sortCommand(
    editor: vscode.TextEditor,
    _edit: vscode.TextEditorEdit,
    userExplicitArgs?: any
) {
    // might need better validation for the configuration, but vscode warns if you don't follow the rules so kinda on you tbh
    const config = vscode.workspace.getConfiguration();
    const defaultArgs: DefaultArgs = config.get('scoped-sort.defaultArgs')!;

    if (
        typeof userExplicitArgs !== 'string' &&
        typeof userExplicitArgs !== 'undefined'
    ) {
        return vscode.window.showErrorMessage(
            `User explicit arguments have to be strings, not: ${typeof userExplicitArgs}`
        );
    }

    if (
        typeof defaultArgs === 'undefined' ||
        typeof defaultArgs !== 'object' ||
        Array.isArray(defaultArgs)
    ) {
        return vscode.window.showErrorMessage(
            "Type of config 'scoped-sort.defaultArgs' should be an object"
        );
    }

    let sortArgs = userExplicitArgs ?? '';
    const shouldPrompt = config.get('scoped-sort.prompt') as boolean;

    if (!userExplicitArgs && shouldPrompt) {
        const promptResponse = await vscode.window.showInputBox({
            placeHolder:
                'Arguments: -sr, --random, -z, --case-insensitive, ...',
            value: defaultArgs.prompt,
            ignoreFocusOut: true,
        });

        if (typeof promptResponse === 'undefined') {
            return;
        }

        sortArgs = promptResponse;
    }

    if (!userExplicitArgs && !shouldPrompt && defaultArgs['no-prompt']) {
        sortArgs = defaultArgs['no-prompt'];
    }

    const options = parseOptionsFromArgs(sortArgs);

    if (options instanceof Error) {
        return vscode.window.showErrorMessage(
            options.message.replace(/\n/g, '. ')
        );
    }

    const document = editor.document;

    if (editor.selections.length === 1 && editor.selections[0].isEmpty) {
        const documentWholeRange = new vscode.Range(
            0,
            0,
            document.lineCount - 1,
            document.lineAt(document.lineCount - 1).text.length
        );

        return sortOverRangeOrSelection(
            editor,
            documentWholeRange,
            options,
            true
        );
    }

    for (const selection of editor.selections) {
        return sortOverRangeOrSelection(editor, selection, options, true);
    }
}

function onWillSaveTextDocument(ev: vscode.TextDocumentWillSaveEvent) {
    if (
        !vscode.workspace
            .getConfiguration()
            .get('scoped-sort.formatSectionsOnSave')
    ) {
        return;
    }

    const file = ev.document;
    let currentStartLine: vscode.TextLine | undefined = undefined;

    if (!file.isDirty) {
        return;
    }

    const ranges: {
        range: vscode.Range;
        args: string;
    }[] = [];

    for (let i = 0; i < file.lineCount; i++) {
        const line = file.lineAt(i);
        const lineText = line.text;

        if (lineText.includes('{ sort-ignore-file }')) {
            return;
        }

        if (commentRegex.sortStart.test(lineText)) {
            if (currentStartLine) {
                return vscode.window.showErrorMessage(
                    `Recieved sort-start comment at ${line.lineNumber} but didn't finish the one at ${currentStartLine.lineNumber}`
                );
            }

            currentStartLine = line;
        } else if (commentRegex.sortEnd.test(lineText)) {
            if (!currentStartLine) {
                return vscode.window.showErrorMessage(
                    `Recieved sort-end comment at ${line.lineNumber} but didn't recieve any sort-start`
                );
            }

            ranges.push({
                range: new vscode.Range(
                    currentStartLine.range.start.line + 1,
                    0,
                    line.range.end.line - 1,
                    file.lineAt(i - 1).range.end.character
                ),
                args:
                    currentStartLine.text.match(commentRegex.sortStart)?.groups
                        ?.args || '',
            });

            currentStartLine = undefined;
        }
    }

    const editor = vscode.window.visibleTextEditors.find(
        (editor) => editor.document === ev.document
    );

    for (const { range, args } of ranges) {
        if (editor) {
            const options = parseOptionsFromArgs(args);

            if (options instanceof Error) {
                vscode.window.showErrorMessage(options.message);
            } else {
                sortOverRangeOrSelection(editor, range, options, false);
            }
        } else {
            console.log("Didn't match any text editor?");
        }
    }
}

function addSurroundSortCommentsCommand(
    editor: vscode.TextEditor,
    _edit: vscode.TextEditorEdit
) {
    const config = vscode.workspace.getConfiguration();
    let sortArgs = (config.get(
        'scoped-sort.defaultArgs.addSurroundingSortComments'
    ) || '') as string;

    if (sortArgs !== '') {
        sortArgs += ' ';
    }

    return editor.edit((edit) => {
        if (editor.selections.length > 1 || !editor.selections[0].isEmpty) {
            for (const selection of editor.selections) {
                const language =
                    languageComments.find((lang) =>
                        lang.ids?.includes(editor.document.languageId)
                    ) || defaultLanguageComment;

                const startPosition = new vscode.Position(
                    selection.start.line,
                    0
                );

                const endPosition = new vscode.Position(
                    selection.end.line,
                    editor.document.lineAt(selection.end.line).text.length
                );

                if ('singleLineComment' in language) {
                    edit.insert(
                        startPosition,
                        `${language.singleLineComment} { sort-start ${sortArgs}}\n`
                    );
                    edit.insert(
                        endPosition,
                        `\n${language.singleLineComment} { sort-end }`
                    );
                } else {
                    const startingCommentBlock = language.multiLineComment[0];
                    const endingCommentBlock = language.multiLineComment[1];

                    edit.insert(
                        startPosition,
                        `${startingCommentBlock} { sort-start ${sortArgs}} ${endingCommentBlock}\n`
                    );
                    edit.insert(
                        endPosition,
                        `\n${startingCommentBlock} { sort-end } ${endingCommentBlock}`
                    );
                }

                // todo: remove selection or make it so the selection stays the same
            }
        }
    });
}

function activate(context: vscode.ExtensionContext) {
    const _mainCommand = vscode.commands.registerTextEditorCommand(
        'scoped-sort.sort',
        sortCommand
    );

    const _addSurroundingSortCommentsCommand =
        vscode.commands.registerTextEditorCommand(
            'scoped-sort.addSurroundingSortComments',
            addSurroundSortCommentsCommand
        );

    const _onWillSaveTextDocument = vscode.workspace.onWillSaveTextDocument(
        onWillSaveTextDocument
    );

    context.subscriptions.push(_mainCommand);
    context.subscriptions.push(_addSurroundingSortCommentsCommand);
    context.subscriptions.push(_onWillSaveTextDocument);
}

function deactivate() {}

export = {
    activate,
    deactivate,
};
