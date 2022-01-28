// @ts-check
const test = require('tape');
const path = require('path');
const fs = require('fs');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode');
const { sort } = require('string-content-sort');
const { diffStringsUnified } = require('jest-diff');
const { parseStringArguments } = require('../dist/parse-string-arguments.js');
const {
    nonMarkdownInputs: inputs,
    possibleArguments,
} = require('../../test-utils.js');

/**
 *
 * @param {import("tape").Test} t
 * @param {string} actual
 * @param {string} expected
 * @param {string} [message]
 */
function testString(t, actual, expected, message) {
    t.equals(actual, expected, message);

    if (actual !== expected) {
        console.log(diffStringsUnified(expected, actual));
    }
}

/** @typedef {import("string-content-sort").Options} SortArgs */
// const myExtension = require('../extension');

test.createStream().on('data', console.log);

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
    return document.getText(getAllTextRange(document)).replace(/\r/g, '');
}

vscode.window.showInformationMessage('Start all tests.');
const executeCommand = vscode.commands.executeCommand;

// todo: write tests based on configuration
test('Extension Test', async (t) => {
    // create throwaway files to test with if it doesn't exist
    const tmpFolderPath = path.join(__dirname, '..', 'tmp');
    const tmpDocumentPath = path.join(tmpFolderPath, 'tmp.txt');
    const tmpMarkdownDocumentPath = path.join(tmpFolderPath, 'tmp.md');
    /** @type {string} */
    const addSurroundingSortCommentsDefaultArgs =
        vscode.workspace
            .getConfiguration()
            .get('scoped-sort.defaultArgs.addSurroundingSortComments') + ' ';

    if (!fs.existsSync(tmpFolderPath)) {
        await fs.promises.mkdir(tmpFolderPath);
    }

    if (!fs.existsSync(tmpDocumentPath)) {
        await fs.promises.writeFile(tmpDocumentPath, '');
    }

    if (!fs.existsSync(tmpMarkdownDocumentPath)) {
        await fs.promises.writeFile(tmpMarkdownDocumentPath, '');
    }

    const tmpDocument = await vscode.workspace.openTextDocument(
        tmpDocumentPath
    );

    await vscode.window.showTextDocument(tmpDocument);

    let editor = vscode.window.activeTextEditor;
    let testIndex = 0;

    /**
     * @param {string} input
     * @param {string} commandStringArgs
     * @param {SortArgs} sortArgs
     * @param {string} message
     */
    async function testSortCommand(
        input,
        commandStringArgs,
        sortArgs,
        message
    ) {
        if (!editor) {
            return console.error('Still no active text editor');
        }

        await changeAllText(editor, input);

        // this extension formats the whole document on no selection
        // this is just testing that it works both with and without selection
        if (testIndex % 2 === 0) {
            await executeCommand('editor.action.selectAll');
        } else {
            await executeCommand('cancelSelection');
        }

        await executeCommand('scoped-sort.sort', commandStringArgs);
        // await executeCommand should be suffecient since I return a promise
        // on the command, but it doesn't work for some reason
        await new Promise((res) => setTimeout(res, 200));

        testString(
            t,
            getAllText(editor.document),
            sort(input, sortArgs),
            message
        );

        testIndex++;
    }

    const sortIgnoreFileLine = '// { sort-ignore-file }\n';
    const sortEndLine = '\n// { sort-end }';

    // todo: maybe make better integration tests
    for (const stringArguments of possibleArguments) {
        await testSortCommand(
            inputs.nestedListWithDescriptions,
            stringArguments,
            parseStringArguments(stringArguments),
            stringArguments + ': nested list with description'
        );

        await testSortCommand(
            inputs.duplicates.nestedListWithDescriptions,
            stringArguments,
            parseStringArguments(stringArguments),
            stringArguments + ': duplicates nested list w/desc'
        );

        await testSortCommand(
            inputs.numbers.oneLevelDeepNestedList,
            stringArguments,
            parseStringArguments(stringArguments),
            stringArguments + ': numbers one level deep nested list'
        );

        const sortStartLine = `// { sort-start ${stringArguments} }\n`;

        await changeAllText(
            editor,
            sortStartLine + inputs.multiNestedList + sortEndLine
        );

        await executeCommand('workbench.action.files.save');

        testString(
            t,
            getAllText(editor.document),
            sortStartLine +
                sort(
                    inputs.multiNestedList,
                    parseStringArguments(stringArguments)
                ) +
                sortEndLine,
            'works on save'
        );

        await changeAllText(
            editor,
            sortIgnoreFileLine +
                sortStartLine +
                inputs.multiNestedList +
                sortEndLine
        );

        await executeCommand('workbench.action.files.save');

        testString(
            t,
            getAllText(editor.document),
            sortIgnoreFileLine +
                sortStartLine +
                inputs.multiNestedList +
                sortEndLine,
            'should work with sort-file-ignore'
        );
    }

    // test --section-seperator
    await changeAllText(editor, inputs.sectionSeperator.divChildren);
    await executeCommand(
        'scoped-sort.sort',
        '--section-seperator "/^    <div/"'
    );
    await new Promise((res) => setTimeout(res, 200));

    testString(
        t,
        getAllText(editor.document),
        sort(inputs.sectionSeperator.divChildren, {
            sectionSeperator: /^    <div/,
        }),
        'should work with section seperator /^    <div/'
    );

    // test command: addSurroundingSortComments
    await changeAllText(editor, 'one\ntwo\nthree');
    await executeCommand('editor.action.selectAll');
    await executeCommand('scoped-sort.addSurroundingSortComments');
    await new Promise((res) => setTimeout(res, 200));

    testString(
        t,
        getAllText(editor.document),
        `// { sort-start ${addSurroundingSortCommentsDefaultArgs}}\none\ntwo\nthree\n// { sort-end }`,
        'addSurroundSortComments works on regular documents'
    );

    const tmpMarkdownDocument = await vscode.workspace.openTextDocument(
        tmpMarkdownDocumentPath
    );

    await vscode.window.showTextDocument(tmpMarkdownDocument);
    editor = vscode.window.activeTextEditor;

    await changeAllText(editor, 'one\ntwo\nthree');
    await executeCommand('editor.action.selectAll');
    await executeCommand('scoped-sort.addSurroundingSortComments');
    await new Promise((res) => setTimeout(res, 200));

    testString(
        t,
        getAllText(editor.document),
        `<!-- { sort-start ${addSurroundingSortCommentsDefaultArgs}} -->\none\ntwo\nthree\n<!-- { sort-end } -->`,
        'addSurroundSortComments works on markdown documents'
    );

    t.end();
});
