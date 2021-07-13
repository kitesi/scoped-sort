import * as vscode from 'vscode';
import type { Options } from './sort.js';

import { sort } from './sort.js';
import { parseStringArguments } from './parse-string-arguments.js';

async function baseCommand(
    editor: vscode.TextEditor,
    _edit: vscode.TextEditorEdit,
    userExplicitArgs?: any
) {
    const config = vscode.workspace.getConfiguration();
    const defaultArgs = config.get('scoped-sort.defaultArgs');
    let options: Options = {};

    if (
        typeof userExplicitArgs !== 'string' &&
        typeof userExplicitArgs !== 'undefined'
    ) {
        return vscode.window.showErrorMessage(
            `User explict arguments have to be strings, not: ${typeof userExplicitArgs}`
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
        });

        if (typeof promptResponse === 'undefined') {
            return;
        }

        args = promptResponse;
    }

    if (args) {
        try {
            options = parseStringArguments(args);
        } catch (err) {
            const message = err.message;
            return vscode.window.showErrorMessage(message);
        }
    }

    const document = editor.document;

    return editor.edit((edit) => {
        if (editor.selections.length === 1 && editor.selections[0].isEmpty) {
            const range = new vscode.Range(
                0,
                0,
                document.lineCount - 1,
                document.lineAt(document.lineCount - 1).text.length
            );

            edit.replace(range, sort(document.getText(range), options));
        } else {
            for (const selection of editor.selections) {
                const text = document.getText(selection);
                edit.replace(selection, sort(text, options));
            }
        }
    });
}

function activate(context: vscode.ExtensionContext) {
    const _mainCommand = vscode.commands.registerTextEditorCommand(
        'scoped-sort.sort',
        baseCommand
    );

    context.subscriptions.push(_mainCommand);
}

function deactivate() {}

export = {
    activate,
    deactivate,
};
