// def not the best suites tbh, mocha + vscode is such a hassle

// @ts-check
// const suite = require('tape');
const path = require('path');
const { mkdir, writeFile } = require('fs/promises');
const { existsSync } = require('fs');

// You can import and use all API from the 'vscode' module
// as well as import your extension to suite it
const vscode = require('vscode');
const {
    sort,
    parseArgsIntoOptions,
    tokenizeArgString,
} = require('string-content-sort');

const assert = require('assert');

const { nonMarkdownInputs: inputs } = require('../../test-utils.js');

const possibleArguments = [
    '-s',
    '-r',
    '-i',
    '-n',
    '-u',
    '-p',
    '-m',
    '-l',
    '-f',
    '-sr',
    '-rs',
    '--unique',
    '--regex /\\d+/',
];

/**
 * @param {string} argsString
 */
function parseStringArguments(argsString) {
    return parseArgsIntoOptions(tokenizeArgString(argsString));
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
    return document.getText(getAllTextRange(document)).replace(/\r/g, '');
}

// todo: write suites based on configuration
suite('Extension suite Suite', function () {
    const executeCommand = vscode.commands.executeCommand;
    vscode.window.showInformationMessage('Start all suites.');
    this.timeout(0);

    let addSurroundingSortCommentsDefaultArgs = vscode.workspace
        .getConfiguration()
        .get('scoped-sort.defaultArgs.addSurroundingSortComments');

    if (typeof addSurroundingSortCommentsDefaultArgs === 'undefined') {
        addSurroundingSortCommentsDefaultArgs = '';
    } else {
        addSurroundingSortCommentsDefaultArgs += ' ';
    }

    test('everything', async () => {
        // create throwaway files to test with if it doesn't exist
        const tmpFolderPath = path.join(__dirname, '..', 'tmp');
        const tmpDocumentPath = path.join(tmpFolderPath, 'tmp.txt');
        const tmpMarkdownDocumentPath = path.join(tmpFolderPath, 'tmp.md');

        if (!existsSync(tmpFolderPath)) {
            await mkdir(tmpFolderPath);
        }

        if (!existsSync(tmpDocumentPath)) {
            await writeFile(tmpDocumentPath, '');
        }

        if (!existsSync(tmpMarkdownDocumentPath)) {
            await writeFile(tmpMarkdownDocumentPath, '');
        }

        const tmpDocument = await vscode.workspace.openTextDocument(
            tmpDocumentPath
        );

        await vscode.window.showTextDocument(tmpDocument);

        /** @type {vscode.TextEditor} */
        // @ts-ignore
        let editor = vscode.window.activeTextEditor;
        let testIndex = 0;

        if (!editor) {
            return vscode.window.showErrorMessage('No editor???');
        }

        /**
         * @param {string} input
         * @param {string} commandStringArgs
         * @param {ReturnType<typeof parseArgsIntoOptions>} sortArgs
         * @param {string} message
         */
        async function testSortCommand(
            input,
            commandStringArgs,
            { options },
            message
        ) {
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

            // test(message, function () {
            assert.strictEqual(
                getAllText(editor.document),
                sort(input, options)
            );
            // });

            testIndex++;
        }

        const sortIgnoreFileLine = '// { sort-ignore-file }\n';
        const sortEndLine = '\n// { sort-end }';

        if (!editor) {
            return vscode.window.showErrorMessage('No editor???');
        }

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

            // test('works on save', function () {
            assert.strictEqual(
                getAllText(editor.document),
                sortStartLine +
                    sort(
                        inputs.multiNestedList,
                        parseStringArguments(stringArguments).options
                    ) +
                    sortEndLine
            );
            // });

            await changeAllText(
                editor,
                sortIgnoreFileLine +
                    sortStartLine +
                    inputs.multiNestedList +
                    sortEndLine
            );

            await executeCommand('workbench.action.files.save');

            // test('should work with sort-file-ignore', function () {
            assert.strictEqual(
                getAllText(editor.document),
                sortIgnoreFileLine +
                    sortStartLine +
                    inputs.multiNestedList +
                    sortEndLine
            );
            // });
        }

        // test --section-separator
        await changeAllText(editor, inputs.sectionStarter.divChildren);
        await executeCommand(
            'scoped-sort.sort',
            '--section-start "/^ {4}<div/"'
        );
        await new Promise((res) => setTimeout(res, 200));

        // test('should work with section starter /^    <div/', function () {
        assert.strictEqual(
            getAllText(editor.document),
            sort(inputs.sectionStarter.divChildren, {
                sectionStarter: /^    <div/,
            })
        );
        // });

        // test command: addSurroundingSortComments
        await changeAllText(editor, 'one\ntwo\nthree');
        await executeCommand('editor.action.selectAll');
        await executeCommand('scoped-sort.addSurroundingSortComments');
        await new Promise((res) => setTimeout(res, 800));

        // test('addSurroundSortComments works on regular documents', function () {
        assert.strictEqual(
            getAllText(editor.document),
            `// { sort-start ${addSurroundingSortCommentsDefaultArgs}}\none\ntwo\nthree\n// { sort-end }`
        );
        // });

        const tmpMarkdownDocument = await vscode.workspace.openTextDocument(
            tmpMarkdownDocumentPath
        );

        await vscode.window.showTextDocument(tmpMarkdownDocument);
        // @ts-ignore
        editor = vscode.window.activeTextEditor;

        if (!editor) {
            return vscode.window.showErrorMessage('No editor???');
        }

        await changeAllText(editor, 'one\ntwo\nthree');
        await executeCommand('editor.action.selectAll');
        await executeCommand('scoped-sort.addSurroundingSortComments');
        await new Promise((res) => setTimeout(res, 200));

        // test('addSurroundSortComments works on markdown documents', function () {
        assert.strictEqual(
            getAllText(editor.document),
            `<!-- { sort-start ${addSurroundingSortCommentsDefaultArgs}} -->\none\ntwo\nthree\n<!-- { sort-end } -->`
        );
        // });

        return;
    });
});
