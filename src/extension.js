// @ts-check
const vscode = require('vscode');
const sort = require('./sort.js');
const { parseStringArguments } = require('./parse-string-arguments.js');

/** @typedef {"ascending" | "descending"} Sort */

/**
 * @param {vscode.TextEditor} editor
 * @param {vscode.TextEditorEdit} _edit
 * @param {string} args
 */
async function baseCommand(editor, _edit, args) {
    const config = vscode.workspace.getConfiguration();
    /** @type {import("./sort.js").Options} */
    let options = {};
    const defaultArgs = config.get('scoped-sort.defaultArgs');
    let shouldPrompt = !args && config.get('scoped-sort.prompt');

    if (defaultArgs) {
        args = defaultArgs;
    }

    if (shouldPrompt) {
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
            /** @type {string} */
            // @ts-ignore
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

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    const _mainCommand = vscode.commands.registerTextEditorCommand(
        'scoped-sort.sort',
        baseCommand
    );

    context.subscriptions.push(_mainCommand);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate,
    sort,
};
