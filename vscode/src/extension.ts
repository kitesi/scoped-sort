import * as vscode from 'vscode';
import { sortComments } from 'string-content-sort';

import {
    sort,
    tokenizeArgString,
    parseArgsIntoOptions,
} from 'string-content-sort';

import {
    languageComments,
    defaultLanguageComment,
} from './language-comments.js';

interface DefaultArgs {
    prompt?: string;
    'no-prompt'?: string;
    addSurroundingSortComments?: string;
}

function getWholeDocumentRange(editor: vscode.TextEditor) {
    return new vscode.Range(
        0,
        0,
        editor.document.lineCount - 1,
        editor.document.lineAt(editor.document.lineCount - 1).text.length
    );
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

    const { options, errors } = parseArgsIntoOptions(
        tokenizeArgString(sortArgs)
    );

    if (errors.length > 0) {
        return vscode.window.showErrorMessage(errors.join('. '));
    }

    editor.edit((edit) => {
        if (editor.selections.length === 1 && editor.selections[0].isEmpty) {
            const location = getWholeDocumentRange(editor);
            const content = editor.document.getText(location);
            edit.replace(location, sort(content, options));
        }

        for (const selection of editor.selections) {
            const content = editor.document.getText(selection);
            edit.replace(selection, sort(content, options));
        }
    });
}

async function sortCommentsCommand(editor: vscode.TextEditor) {
    editor.edit((edit) => {
        if (editor.selections.length === 1 && editor.selections[0].isEmpty) {
            const location = getWholeDocumentRange(editor);
            const { result, errors } = sortComments(
                editor.document.getText(location)
            );

            if (errors.length > 0) {
                return vscode.window.showErrorMessage(errors.join('. '));
            }

            edit.replace(location, result);
        }

        for (const selection of editor.selections) {
            const { result, errors } = sortComments(
                editor.document.getText(selection)
            );

            if (errors.length > 0) {
                return vscode.window.showErrorMessage(errors.join('. '));
            }

            edit.replace(selection, result);
        }
    });
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

    if (!file.isDirty) {
        return;
    }

    const oldContent = file.getText();
    const { errors, result } = sortComments(oldContent);

    if (errors.length > 0) {
        return vscode.window.showErrorMessage(errors.join('. '));
    }

    if (result === oldContent) {
        return;
    }

    const editor = vscode.window.visibleTextEditors.find(
        (editor) => editor.document === ev.document
    );

    if (!editor) {
        return;
    }

    editor.edit((edit) => {
        edit.replace(getWholeDocumentRange(editor), result);
    });
}

function addSurroundSortCommentsCommand(editor: vscode.TextEditor) {
    const config = vscode.workspace.getConfiguration();
    let sortArgs = (config.get(
        'scoped-sort.defaultArgs.addSurroundingSortComments'
    ) || '') as string;

    if (sortArgs !== '') {
        sortArgs += ' ';
    }

    return editor.edit((edit) => {
        const locations =
            editor.selections.length > 1 || !editor.selections[0].isEmpty
                ? editor.selections
                : [getWholeDocumentRange(editor)];

        for (const location of locations) {
            const language =
                languageComments.find((lang) =>
                    lang.ids?.includes(editor.document.languageId)
                ) || defaultLanguageComment;

            const startPosition = new vscode.Position(location.start.line, 0);

            const endPosition = new vscode.Position(
                location.end.line,
                editor.document.lineAt(location.end.line).text.length
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
    });
}

function activate(context: vscode.ExtensionContext) {
    const _mainCommand = vscode.commands.registerTextEditorCommand(
        'scoped-sort.sort',
        sortCommand
    );

    const _sortCommentsCommand = vscode.commands.registerTextEditorCommand(
        'scoped-sort.sortComments',
        sortCommentsCommand
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
    context.subscriptions.push(_sortCommentsCommand);
    context.subscriptions.push(_addSurroundingSortCommentsCommand);
    context.subscriptions.push(_onWillSaveTextDocument);
}

function deactivate() {
    return;
}

export = {
    activate,
    deactivate,
};
