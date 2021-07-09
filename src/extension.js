// @ts-check
const vscode = require('vscode');
const sort = require('./sort.js');

/** @typedef {"ascending" | "descending"} Sort */

/**
 * @param {vscode.TextEditor} editor
 * @param {vscode.TextEditorEdit} _edit
 * @param {string} args
 */
async function baseCommand(editor, _edit, args) {
    const config = vscode.workspace.getConfiguration();
    /** @type {import("./sort.js").Options} */
    const options = {};
    const defaultArgs = config.get('scoped-sort.defaultArgs');
    let shouldPrompt = !args && config.get('scoped-sort.prompt');

    if (defaultArgs) {
        args = defaultArgs;
    }

    if (shouldPrompt) {
        args = await vscode.window.showInputBox({
            placeHolder: 'Arguments: sr, r, u, i, ...',
            value: defaultArgs,
        });
    }

    if (args) {
        const letters = args.split('');

        for (const letter of letters) {
            switch (letter) {
                case 's':
                    options.reverse = true;
                    break;
                case 'r':
                    options.recursive = true;
                    break;
                case 'u':
                    options.unique = true;
                    break;
                case 'i':
                    options.caseInsensitive = true;
                    break;
                default:
                    return vscode.window.showErrorMessage(
                        `Could not understand argument: "${letter}"`
                    );
            }
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
