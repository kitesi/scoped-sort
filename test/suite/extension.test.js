// @ts-check
const test = require('tape');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode');
const sort = require('../../src/sort.js');
const { inputs, duplicateInputs, testString } = require('./utils.js');

// const myExtension = require('../extension');

test.createStream().on('data', console.log);

/** @param {vscode.TextEditor} editor */
function selectAllText(editor) {
    return executeCommand('editor.action.selectAll');
}

/** @param {vscode.TextDocument} document */
function getAllTextRange(document) {
    return new vscode.Range(
        0,
        0,
        document.lineCount - 1,
        document.lineAt(document.lineCount - 1).text.length
    );
}

/**
 * @param {vscode.TextEditor} editor
 * @param {string} text
 */
function changeAllText(editor, text) {
    const document = editor.document;

    return editor.edit((edit) => {
        return edit.replace(getAllTextRange(document), text);
    });
}

/** @param {vscode.TextDocument} document */
function getAllText(document) {
    return document.getText(getAllTextRange(document));
}

vscode.window.showInformationMessage('Start all tests.');
const executeCommand = vscode.commands.executeCommand;

test('Extension Test', async (t) => {
    if (!vscode.window.activeTextEditor) {
        await executeCommand('workbench.action.files.newUntitledFile');
    }

    const editor = vscode.window.activeTextEditor;

    /**
     * @param {string} input
     * @param {string} commandStringArgs
     * @param {import("../../src/sort.js").Options} sortArgs
     */
    async function testSortCommand(input, commandStringArgs, sortArgs) {
        await changeAllText(editor, input);
        await selectAllText(editor);
        await executeCommand('scoped-sort.sort', commandStringArgs);
        // await executeCommand should be suffecient since I return a promise
        // on the command, but it doesn't work for some reason
        await new Promise((res) => setTimeout(res, 200));

        testString(
            t,
            getAllText(editor.document).replace(/\r/g, ''),
            sort(input, sortArgs)
        );
    }

    await testSortCommand(inputs[4], 's', { reverse: false });
    await testSortCommand(inputs[4], 'S', { reverse: true });
    await testSortCommand(inputs[4], 'r', { recursive: true });
    await testSortCommand(inputs[4], 'R', { recursive: false });
    await testSortCommand(duplicateInputs[1], 'u', { unique: true });
    await testSortCommand(duplicateInputs[1], 'U', { unique: false });
    await testSortCommand(duplicateInputs[1], 'i', { caseInsensitive: true });
    await testSortCommand(duplicateInputs[1], 'I', { caseInsensitive: false });
    await testSortCommand(inputs[4], 'sr', { reverse: false, recursive: true });
    await testSortCommand(inputs[4], 'Sr', { reverse: true, recursive: true });
    await testSortCommand(duplicateInputs[1], 'ur', {
        unique: true,
        recursive: true,
    });
    await testSortCommand(duplicateInputs[1], 'ui', {
        unique: true,
        caseInsensitive: true,
    });
    await testSortCommand(duplicateInputs[1], 'uir', {
        unique: true,
        caseInsensitive: true,
        recursive: true,
    });

    t.end();
});
