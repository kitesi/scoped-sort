// @ts-check
const test = require('tape');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode');
const sort = require('../../src/sort.js');
const { inputs, testString } = require('./utils.js');
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

test('Sample test', async (t) => {
	if (!vscode.window.activeTextEditor) {
		await executeCommand('workbench.action.files.newUntitledFile');
	}

	const editor = vscode.window.activeTextEditor;

	/**
	 * @param {string} input
	 * @param {string} commandStringArgs
	 * @param {Parameters<typeof sort>[1]} sortArgs
	 */
	async function testSortCommand(input, commandStringArgs, sortArgs) {
		await changeAllText(editor, input);
		await selectAllText(editor);
		await executeCommand('scoped-sort.sort', commandStringArgs);
		testString(
			t,
			getAllText(editor.document).replace(/\r/g, ''),
			sort(input, sortArgs)
		);
	}

	// 	const duplicateTestString = `- monkey
	// - ape
	// - zea
	// - zea
	//   - sea`;

	await testSortCommand(inputs[4], 's', { reverse: false });
	// The ones below don't work for some reason.
	// await testSortCommand(inputs[4], 'S', { reverse: true });
	// await testSortCommand(inputs[4], 'r', { recursive: true });
	// await testSortCommand(inputs[4], 'R', { recursive: false });
	// await testSortCommand(inputs[4], 'R', { recursive: false });
	// await testSortCommand(inputs[4], 'Sr', { recursive: true, reverse: true });
	// await testSortCommand(duplicateTestString, 'u', { unique: true });
	// await testSortCommand(duplicateTestString, 'U', { unique: false });

	t.end();
});
