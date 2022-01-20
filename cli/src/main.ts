#!/usr/bin/env node
import yargs from 'yargs';
import { Options, sort } from 'string-content-sort';

import * as fs from 'fs';
import { join } from 'path';

import {
    genericSortYargsBuilder,
    parseStringArguments,
} from './parse-string-arguments.js';

export const commentRegexs = {
    sortStart: /\{ sort-start (?<args>[^\}]*)(?<= )\}/,
    sortEnd: /\{ sort-end \}/,
};

interface DefaultCommandArgs extends Options {
    file?: string;
}

function defaultCommandHandler(args: DefaultCommandArgs) {
    // yargs has this bug (i think it's a bug) where when you use the modify command,
    // the default command is also called
    if (process.argv[2] === 'modify') {
        return;
    }

    let stdinData = '';

    process.stdin.on('data', (data) => {
        stdinData += data;
    });

    const { file } = args;

    if (file) {
        args.file = undefined;

        if (!fs.existsSync(file)) {
            throw new Error('File does not exist');
        }

        if (fs.statSync(file).isDirectory()) {
            throw new Error(
                'Input has to be a directory. Maybe you meant to use the modify command?'
            );
        }

        console.log(sort(fs.readFileSync(file, 'utf-8'), args));
        process.exit(0);
    } else {
        process.stdin.on('close', () => {
            console.log(sort(stdinData, args));
        });
    }
}

async function handleDirectory(dir: string) {
    const files = await fs.promises.readdir(dir);

    for (const file of files) {
        const next = join(dir, file);

        if (fs.statSync(next).isDirectory()) {
            handleDirectory(next);
        } else {
            handleFile(next);
        }
    }
}

async function handleFile(file: string) {
    const content = await fs.promises.readFile(file, 'utf-8');
    let lines = content.split('\n');

    let hasOperatedOnFile = false;
    let currentStartLine: number | undefined = undefined;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // only want indentation if the file has already been stated
        const indentation = hasOperatedOnFile ? '    ' : '';
        // don't want to reiterate the file name if it already has been stated
        const fileInfo = hasOperatedOnFile ? '' : `[${file}]`;

        if (line.includes('{ sort-ignore-file }')) {
            return;
        }

        if (commentRegexs.sortStart.test(line)) {
            if (typeof currentStartLine !== 'undefined') {
                return console.log(
                    `${indentation}[Error] Recieved sort-start comment at line: ${i} but didn't finish the one at ${currentStartLine}\nSkipping file: ${fileInfo}`
                );
            }

            currentStartLine = i;
        } else if (commentRegexs.sortEnd.test(line)) {
            if (typeof currentStartLine === 'undefined') {
                return console.log(
                    `${indentation}[Error] Recieved sort-end comment at line: ${i} but didn't receive any sort-start${fileInfo}`
                );
            }

            const section = lines.slice(currentStartLine + 1, i).join('\n');
            const sortArgs =
                lines[currentStartLine].match(commentRegexs.sortStart)?.groups
                    ?.args || '';
            let options: Options = {};

            if (sortArgs !== '') {
                try {
                    options = parseStringArguments(sortArgs);
                } catch (err) {
                    console.error('[Error]: ' + (err as Error)?.message);
                    return;
                }
            }

            const sortedSection = sort(section, options);

            if (sortedSection !== section) {
                if (!hasOperatedOnFile) {
                    console.log(`Modifiying ${file}:`);
                    hasOperatedOnFile = true;
                }

                console.log(
                    // +2 because of 0-index & the comment
                    `    sort changed from lines ${currentStartLine + 2}-${i}`
                );

                lines.splice(
                    currentStartLine + 1,
                    i - currentStartLine - 1,
                    ...sortedSection.split('\n')
                );
            }

            currentStartLine = undefined;
        }
    }

    if (hasOperatedOnFile) {
        fs.writeFile(file, lines.join('\n'), (err) => {
            if (err) throw err;
        });
    }
}

function modifyCommandHandler(argv: { paths: string[] }) {
    for (const file of argv.paths) {
        if (!fs.existsSync(file)) {
            console.log(`[Warning]: ${file} doesn't exist`);
            continue;
        }

        if (fs.statSync(file).isDirectory()) {
            handleDirectory(file);
        } else {
            handleFile(file);
        }
    }
}

try {
    yargs(process.argv.slice(2))
        .command({
            command: '$0 [file]',
            description: 'regular sort, takes in from stdin or takes a file',
            builder: (y) => genericSortYargsBuilder(y).strict(),
            // @ts-ignore
            handler: defaultCommandHandler,
        })
        .command({
            command: 'modify <paths..>',
            description: 'command to modify files in place',
            builder: (y) => y,
            // @ts-ignore
            handler: modifyCommandHandler,
        })
        .fail(false)
        // .fail((msg, err, y) => {
        //     console.log(2, 5);
        //     if (msg) {
        //         console.error(msg);
        //     }
        // })
        .strict()
        .parserConfiguration({ 'dot-notation': false }).argv;
} catch (err) {
    if (err) {
        // @ts-ignore
        if (err.message) {
            // @ts-ignore
            console.error('Error: ' + err.message);
        } else {
            console.error(err);
        }

        process.exit(1);
    }
}
