// @ts-check
const path = require('path');
const { runTests } = require('@vscode/test-electron');

async function main() {
    try {
        const extensionDevelopmentPath = path.resolve(__dirname, '../');

        // The path to the extension test runner script
        // Passed to --extensionTestsPath
        const extensionTestsPath = path.resolve(__dirname, 'run-tests.js');

        console.log(extensionDevelopmentPath, extensionTestsPath);

        // Download VS Code, unzip it and run the integration test
        await runTests({ extensionDevelopmentPath, extensionTestsPath });
    } catch (err) {
        console.error(err);
        console.error('Failed to run tests');
        process.exit(1);
    }
}

main();
