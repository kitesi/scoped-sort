import * as vscode from 'vscode';
import type { Options } from './sort.js';

import { sort } from './sort.js';
import { parseStringArguments } from './parse-string-arguments.js';
import * as commentRegex from './comment-regexs.js';
import languageComments from './language-comments.js';
import path = require('path');

function sortOverRangeOrSelection(
    editor: vscode.TextEditor,
    location: vscode.Range | vscode.Selection,
    args: string
) {
    let options: Options = {};

    if (args) {
        try {
            options = parseStringArguments(args);
        } catch (err) {
            return vscode.window.showErrorMessage((err as Error)!.message);
        }
    }

    return editor.edit((edit) => {
        edit.replace(
            location,
            sort(editor.document.getText(location), options)
        );
    });
}

async function sortCommand(
    editor: vscode.TextEditor,
    _edit: vscode.TextEditorEdit,
    userExplicitArgs?: any
) {
    const config = vscode.workspace.getConfiguration();
    const defaultArgs = config.get('scoped-sort.defaultArgs');

    if (
        typeof userExplicitArgs !== 'string' &&
        typeof userExplicitArgs !== 'undefined'
    ) {
        return vscode.window.showErrorMessage(
            `User explicit arguments have to be strings, not: ${typeof userExplicitArgs}`
        );
    }

    if (typeof defaultArgs !== 'string') {
        return vscode.window.showErrorMessage(
            "Type of config 'scoped-sort.defaultArgs' should be a string"
        );
    }

    let args = userExplicitArgs ?? '';

    if (!userExplicitArgs && config.get('scoped-sort.prompt')) {
        const promptResponse = await vscode.window.showInputBox({
            placeHolder: 'Arguments: sr, r, u, i, ...',
            value: defaultArgs,
            ignoreFocusOut: true,
        });

        if (typeof promptResponse === 'undefined') {
            return;
        }

        args = promptResponse;
    }

    const document = editor.document;

    if (editor.selections.length === 1 && editor.selections[0].isEmpty) {
        const documentWholeRange = new vscode.Range(
            0,
            0,
            document.lineCount - 1,
            document.lineAt(document.lineCount - 1).text.length
        );

        return sortOverRangeOrSelection(editor, documentWholeRange, args);
    }

    for (const selection of editor.selections) {
        return sortOverRangeOrSelection(editor, selection, args);
        // const text = document.getText(selection);
        // edit.replace(selection, sort(text, options));
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

    const editor = vscode.window.activeTextEditor;

    for (const { range, args } of ranges) {
        if (editor) {
            sortOverRangeOrSelection(editor, range, args);
        } else {
            console.log('No active text editor?');
        }
    }
}

function addSurroundSortCommentsCommand(
    editor: vscode.TextEditor,
    _edit: vscode.TextEditorEdit
) {
    editor.edit((edit) => {
        if (editor.selections.length > 1 || !editor.selections[0].isEmpty) {
            for (const selection of editor.selections) {
                const ext = path.extname(editor.document.fileName);
                const language = languageComments.find((language) =>
                    language.exts.includes(ext)
                );

                const startPosition = new vscode.Position(
                    selection.start.line,
                    0
                );

                const endPosition = new vscode.Position(
                    selection.end.line,
                    editor.document.lineAt(selection.end.line).text.length
                );

                edit.insert(startPosition, '// { sort-start }\n');
                edit.insert(endPosition, '\n// { sort-end }');
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
