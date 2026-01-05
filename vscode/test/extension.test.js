// @ts-check

const path = require('path');
const { mkdir, writeFile } = require('fs/promises');
const { existsSync } = require('fs');
const assert = require('assert');

const vscode = require('vscode');
const {
    sort,
    parseArgsIntoOptions,
    tokenizeArgString,
} = require('string-content-sort');

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

function parseStringArguments(argsString) {
    return parseArgsIntoOptions(tokenizeArgString(argsString));
}

function getAllTextRange(document) {
    return new vscode.Range(
        0,
        0,
        document.lineCount - 1,
        document.lineAt(document.lineCount - 1).text.length
    );
}

function getAllText(document) {
    return document.getText(getAllTextRange(document)).replace(/\r/g, '');
}

async function replaceAllText(editor, text) {
    const document = editor.document;
    await editor.edit((edit) => {
        edit.replace(getAllTextRange(document), text);
    });
}

async function runSortCommand(editor, args) {
    await vscode.commands.executeCommand('editor.action.selectAll');
    await vscode.commands.executeCommand('scoped-sort.sort', args);
    await new Promise((res) => setTimeout(res, 200));
}

async function runSave() {
    await vscode.commands.executeCommand('workbench.action.files.save');
    await new Promise((res) => setTimeout(res, 200));
}

suite('scoped-sort extension', function () {
    this.timeout(0);

    let editor;
    let tmpTxtPath;
    let tmpMdPath;

    let defaultSurroundArgs = vscode.workspace
        .getConfiguration()
        .get('scoped-sort.defaultArgs.addSurroundingSortComments');

    if (typeof defaultSurroundArgs === 'undefined') {
        defaultSurroundArgs = '';
    } else {
        defaultSurroundArgs += ' ';
    }

    suiteSetup(async () => {
        const tmpDir = path.join(__dirname, '..', 'tmp');
        tmpTxtPath = path.join(tmpDir, 'tmp.txt');
        tmpMdPath = path.join(tmpDir, 'tmp.md');

        if (!existsSync(tmpDir)) await mkdir(tmpDir);
        if (!existsSync(tmpTxtPath)) await writeFile(tmpTxtPath, '');
        if (!existsSync(tmpMdPath)) await writeFile(tmpMdPath, '');

        const doc = await vscode.workspace.openTextDocument(tmpTxtPath);
        await vscode.window.showTextDocument(doc);
        editor = vscode.window.activeTextEditor;

        if (!editor) {
            throw new Error('No active editor');
        }
    });

    suite('scoped-sort.sort command', () => {
        for (const args of possibleArguments) {
            suite(`args: ${args}`, () => {
                test('sorts nested list with descriptions', async () => {
                    const { options } = parseStringArguments(args);

                    await replaceAllText(
                        editor,
                        inputs.nestedListWithDescriptions
                    );
                    await runSortCommand(editor, args);

                    assert.strictEqual(
                        getAllText(editor.document),
                        sort(inputs.nestedListWithDescriptions, options)
                    );
                });

                test('sorts duplicates correctly', async () => {
                    const { options } = parseStringArguments(args);

                    await replaceAllText(
                        editor,
                        inputs.duplicates.nestedListWithDescriptions
                    );
                    await runSortCommand(editor, args);

                    assert.strictEqual(
                        getAllText(editor.document),
                        sort(
                            inputs.duplicates.nestedListWithDescriptions,
                            options
                        )
                    );
                });

                test('sorts numeric lists', async () => {
                    const { options } = parseStringArguments(args);

                    await replaceAllText(
                        editor,
                        inputs.numbers.oneLevelDeepNestedList
                    );
                    await runSortCommand(editor, args);

                    assert.strictEqual(
                        getAllText(editor.document),
                        sort(inputs.numbers.oneLevelDeepNestedList, options)
                    );
                });
            });
        }
    });

    suite('save-triggered sorting', async () => {
        await vscode.workspace
            .getConfiguration()
            .update(
                'scoped-sort.formatSectionsOnSave',
                true,
                vscode.ConfigurationTarget.Workspace
            );

        for (const args of possibleArguments) {
            test(`sorts on save with args: ${args}`, async () => {
                const { options } = parseStringArguments(args);
                const start = `// { sort-start ${args} }\n`;
                const end = '\n// { sort-end }';

                await replaceAllText(
                    editor,
                    start + inputs.multiNestedList + end
                );
                await runSave();

                assert.strictEqual(
                    getAllText(editor.document),
                    start + sort(inputs.multiNestedList, options) + end
                );
            });

            test(`ignores file when sort-ignore-file is present (${args})`, async () => {
                const start = `// { sort-start ${args} }\n`;
                const end = '\n// { sort-end }';
                const ignore = '// { sort-ignore-file }\n';

                await replaceAllText(
                    editor,
                    ignore + start + inputs.multiNestedList + end
                );
                await runSave();

                assert.strictEqual(
                    getAllText(editor.document),
                    ignore + start + inputs.multiNestedList + end
                );
            });
        }
    });

    suite('section starter option', () => {
        test('respects section-start regex', async () => {
            await replaceAllText(editor, inputs.sectionStarter.divChildren);

            await vscode.commands.executeCommand(
                'scoped-sort.sort',
                '--section-starter "/^ {4}<div/"'
            );
            await new Promise((res) => setTimeout(res, 400));

            assert.strictEqual(
                getAllText(editor.document),
                sort(inputs.sectionStarter.divChildren, {
                    sectionStarter: /^ {4}<div/,
                })
            );
        });
    });

    suite('addSurroundingSortComments command', () => {
        test('works on plain text files', async () => {
            await replaceAllText(editor, 'one\ntwo\nthree');
            await vscode.commands.executeCommand('editor.action.selectAll');
            await vscode.commands.executeCommand(
                'scoped-sort.addSurroundingSortComments'
            );
            await new Promise((res) => setTimeout(res, 200));

            assert.strictEqual(
                getAllText(editor.document),
                `// { sort-start ${defaultSurroundArgs}}\none\ntwo\nthree\n// { sort-end }`
            );
        });

        test('works on markdown files', async () => {
            const doc = await vscode.workspace.openTextDocument(tmpMdPath);
            await vscode.window.showTextDocument(doc);
            editor = vscode.window.activeTextEditor;

            await replaceAllText(editor, 'one\ntwo\nthree');
            await vscode.commands.executeCommand('editor.action.selectAll');
            await vscode.commands.executeCommand(
                'scoped-sort.addSurroundingSortComments'
            );
            await new Promise((res) => setTimeout(res, 400));

            assert.strictEqual(
                getAllText(editor.document),
                `<!-- { sort-start ${defaultSurroundArgs}} -->\none\ntwo\nthree\n<!-- { sort-end } -->`
            );
        });
    });
});
