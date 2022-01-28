// @ts-check

// import { spawn } from 'child_process';
import { firefox, chromium, webkit } from 'playwright';
import { previews } from '../previews.js';

/** @param {string} str */
function convertCamelCase(str) {
    return str
        .split('')
        .map((l) => (l.toLowerCase() === l ? l : `-${l.toLowerCase()}`))
        .join('');
}

(async () => {
    console.log('Launching browser...');
    const browser = await webkit.launch({ timeout: 0 });
    console.log('Launching new page...');
    const page = await browser.newPage();
    console.log('Going to localhost...');
    await page.goto('http://localhost:5000', {
        timeout: 0,
        waitUntil: 'domcontentloaded',
    });

    console.log('Waiting for container...');
    const container = await page.waitForSelector('#container');

    for (const [name, { display, ...details }] of Object.entries(previews)) {
        console.log(`Trying input: ${name}`);
        await page.evaluate(
            (highlightArgs) => {
                // @ts-ignore
                window.highlight(...highlightArgs);
            },
            [
                display?.input || details.input,
                display?.output || details.output,
                details.language,
                display?.highlightRange,
            ]
        );

        // await inputTextArea.fill(input);
        // await outputTextArea.fill(output);

        try {
            const path = `../assets/previews/${convertCamelCase(name)}.png`;

            await container.screenshot({
                path,
                omitBackground: true,
            });

            console.log(`Wrote to ${path}`);
        } catch (err) {
            console.error('Received an error: ');
            console.error(err);
        }
    }

    browser.close();
    process.exit(0);
})();
