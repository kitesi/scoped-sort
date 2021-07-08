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
    /** @type {Sort} */
    const sortType = config.get('scoped-sort.sortType');
    /** @type {boolean} */
    let recursive = config.get('scoped-sort.recursive');
    /** @type {boolean} */
    let reverse = sortType === 'ascending' ? false : true;
    /** @type {boolean} */
    let unique = config.get('scoped-sort.unique');
    /** @type {boolean} */
    let caseInsensitive = config.get('scoped-sort.caseInsensitive');

    if (!args && config.get('scoped-sort.prompt')) {
        args = await vscode.window.showInputBox({
            placeHolder: 'Arguments: sr, Sr, R, r, u, i, ...',
        });
    }

    if (args) {
        const letters = args.split('');

        for (const letter of letters) {
            switch (letter) {
                case 's':
                    reverse = false;
                    break;
                case 'S':
                    reverse = true;
                    break;
                case 'r':
                    recursive = true;
                    break;
                case 'R':
                    recursive = false;
                    break;
                case 'u':
                    unique = true;
                    break;
                case 'U':
                    unique = false;
                    break;
                case 'i':
                    caseInsensitive = true;
                    break;
                case 'I':
                    caseInsensitive = false;
                    break;
                default:
                    vscode.window.showErrorMessage(
                        `Could not understand argument: "${letter}"`
                    );
                    return;
            }
        }
    }

    return editor.edit((edit) => {
        for (const selection of editor.selections) {
            const text = editor.document.getText(selection);
            edit.replace(
                selection,
                sort(text, { reverse, recursive, unique, caseInsensitive })
            );
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
