// @ts-check
/* eslint-disable indent */

/**
 * This cli just uses string-content-sort, which is pretty extensively tested,
 * so no need here except for integration.
 *
 * Lot of sub optimal things here, syncs, setTimeouts, race conditions,
 * not entirely sure of a better system.
 *
 * I've tried jest and memfs but couldn't get it to work as expected.
 */

const tape = require('tape');
const { spawn, spawnSync } = require('child_process');
const {
    readFileSync,
    readdirSync,
    writeFileSync,
    existsSync,
    mkdirSync,
} = require('fs');
const path = require('path');
const { sort, sortComments } = require('string-content-sort');

const { unstyle } = require('ansi-colors');

const testFilesPath = path.join(__dirname, 'files');
const originalTestFilesPath = path.join(testFilesPath, 'original');
const tmpTestFilesPath = path.join(testFilesPath, 'tmp');
const originalTestFiles = readdirSync(originalTestFilesPath);

if (!existsSync(tmpTestFilesPath)) {
    mkdirSync(tmpTestFilesPath);
}

for (const originalTestFile of originalTestFiles) {
    writeFileSync(
        path.join(tmpTestFilesPath, originalTestFile),
        readFileSync(
            path.join(originalTestFilesPath, originalTestFile),
            'utf-8'
        )
    );
}

/**
 * @param {string[]} args
 * @param {boolean} shouldUnstyle
 * @returns
 */
function runSync(args, shouldUnstyle = true) {
    const { stdout, stderr, error } = spawnSync('node', [
        './dist/main.js',
        ...args,
    ]);

    return {
        stdout: shouldUnstyle ? unstyle(stdout.toString()) : stdout.toString(),
        stderr: shouldUnstyle ? unstyle(stderr.toString()) : stderr.toString(),
        error,
    };
}

/**
 * @param {string} file
 */
function getTmpFilePath(file) {
    return path.join(tmpTestFilesPath, file);
}

/** @type {Map<string, string>} */
const cache = new Map();

/**
 * @param {keyof typeof files} filePath
 */
function getCachedContent(filePath) {
    if (!cache.has(filePath)) {
        cache.set(filePath, readFileSync(files[filePath], 'utf-8'));
    }

    return cache.get(filePath) || '';
}

const files = {
    'comment-sections': getTmpFilePath('comments.md'),
    'nested-simple-items': getTmpFilePath('nested-simple-items.md'),
    'nested-with-description': getTmpFilePath('nested-with-description.txt'),
};

getCachedContent('comment-sections');
getCachedContent('nested-simple-items');
getCachedContent('nested-with-description');

tape('non modifying', (t) => {
    t.deepEquals(
        runSync(['does-not-exist.txt']),
        {
            stdout: '',
            stderr: 'Error: File does-not-exist.txt does not exist\n',
            error: undefined,
        },
        'sort file that does not exist'
    );

    t.deepEquals(
        runSync([files['nested-simple-items']]),
        {
            stdout: sort(getCachedContent('nested-simple-items')) + '\n',
            stderr: '',
            error: undefined,
        },
        'sort single file no arguments'
    );

    t.deepEquals(
        runSync([files['nested-simple-items'], '-s']),
        {
            stdout:
                sort(getCachedContent('nested-simple-items'), {
                    reverse: true,
                }) + '\n',
            stderr: '',
            error: undefined,
        },
        'sort single file reverse'
    );

    t.deepEquals(
        runSync([
            files['nested-simple-items'],
            files['nested-with-description'],
        ]),
        {
            stdout:
                sort(
                    getCachedContent('nested-simple-items') +
                        '\n' +
                        getCachedContent('nested-with-description')
                ) + '\n',
            stderr: '',
            error: undefined,
        },
        'sort two files no args'
    );

    t.deepEquals(
        runSync([
            files['nested-simple-items'],
            files['nested-with-description'],
            '-s',
        ]),
        {
            stdout:
                sort(
                    getCachedContent('nested-simple-items') +
                        '\n' +
                        getCachedContent('nested-with-description'),
                    { reverse: true }
                ) + '\n',
            stderr: '',
            error: undefined,
        },
        'sort two files reverse'
    );

    t.deepEquals(
        runSync([files['comment-sections'], '--use-sort-comments']),
        {
            stdout:
                sortComments(getCachedContent('comment-sections')).result +
                '\n',
            stderr: '',
            error: undefined,
        },
        'one file with sort comments'
    );

    t.end();
});

// lot of possible race conditions, prob should write better
tape('modifying', (t) => {
    t.plan(10);

    t.deepEquals(
        runSync(
            [files['comment-sections'], '--modify', '--use-sort-comments'],
            false
        ),
        {
            stdout: `- ${files['comment-sections']}: \x1B[32m{1-9}\x1B[39m, \x1B[32m{11-21}\x1B[39m, \n`,
            stderr: '',
            error: undefined,
        },
        'one file with sort comments'
    );

    t.equals(
        readFileSync(files['comment-sections'], 'utf-8'),
        sortComments(getCachedContent('comment-sections')).result,
        'one file with sort comments: check if matches function call changes'
    );

    t.equals(
        readFileSync(files['comment-sections'], 'utf-8') ===
            getCachedContent('comment-sections'),
        false,
        'one file with sort comments: check if actually changes'
    );

    runSync([
        files['nested-with-description'],
        '--modify',
        '--recursive',
        '-y',
    ]);

    t.equals(
        readFileSync(files['nested-with-description'], 'utf-8'),
        sort(getCachedContent('nested-with-description'), { recursive: true }),
        'one file: check if modifies (matches function call) without user input when -y is provided'
    );

    t.equals(
        readFileSync(files['nested-with-description'], 'utf-8') ===
            getCachedContent('nested-with-description'),
        false,
        'one file: check if modifies (actual change) without user input when -y is provided'
    );

    t.deepEquals(
        runSync(['--modify']),
        {
            stdout: '',
            stderr: 'Error: provided --modify with no files\nUse -h (short) or --help (extensive) for help.\n',
            error: undefined,
        },
        'specified --modify without a file'
    );

    {
        const subprocess = spawn('node', [
            './dist/main.js',
            files['comment-sections'],
            '--modify',
        ]);

        let stdout = '';

        subprocess.stdout.on('data', (chunk) => {
            stdout += chunk;
        });

        setTimeout(
            () =>
                t.equals(
                    stdout,
                    'You are using --modify without --use-sort-comments, are you sure? (y/n): ',
                    'check if asks for confirmation'
                ),
            500
        );

        setTimeout(() => subprocess.stdin.write('n\n'), 100);
        setTimeout(
            () => t.equals(subprocess.exitCode, 0, 'check if exits'),
            400
        );
    }

    {
        const subprocess = spawn('node', [
            './dist/main.js',
            files['nested-simple-items'],
            '--modify',
        ]);

        let stdout = '';

        subprocess.stdout.on('data', (chunk) => {
            stdout += chunk;
        });

        setTimeout(() => subprocess.stdin.write('y\n'), 100);
        setTimeout(
            () =>
                t.equals(
                    stdout,
                    `You are using --modify without --use-sort-comments, are you sure? (y/n): Writing to file: ${files['nested-simple-items']}\n`,
                    'check if proceeds when user says yes'
                ),
            400
        );

        setTimeout(() => {
            t.equals(
                readFileSync(files['nested-simple-items'], 'utf8'),
                sort(getCachedContent('nested-simple-items')),
                'test if actually modified file (no --use-sort-comments)'
            );
        }, 1000);
    }
});
