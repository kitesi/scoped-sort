#!/usr/bin/env node

import yargs from 'yargs';
import { Options, sort } from 'string-content-sort';

import { statSync, existsSync } from 'fs';
import { readdir, readFile, writeFile } from 'fs/promises';
import * as path from 'path';

import {
    genericSortYargsBuilder,
    getCleanOptions,
    parseStringArguments,
    YargsCliArgumentsReturn,
} from './parse-string-arguments.js';
import { EOL } from 'os';

export const commentRegexs = {
    sortStart: /\{ sort-start (?<args>[^\}]*)(?<= )\}/,
    sortEnd: /\{ sort-end \}/,
};

async function defaultCommandHandler(args: YargsCliArgumentsReturn) {
    const { files } = args;

    const options = getCleanOptions(args);
    options.reportErrors = true;

    // need another try/catch?
    try {
        // quick test to see if options are valid
        sort('', options);
    } catch (err: any) {
        console.log('Error: ' + err?.message);
        return;
    }

    options.reportErrors = false;

    if (files && files.length !== 0) {
        const content: Promise<string>[] = [];

        for (const file of files) {
            if (!existsSync(file)) {
                console.log(`Error: File ${file} does not exist`);
                continue;
            }

            if (statSync(file).isDirectory()) {
                pushContentFromDirectory(file, content);
            } else {
                content.push(readFile(file, 'utf-8'));
            }
        }

        const resolvedContent = await Promise.all(content);

        if (args.modify) {
            for (let i = 0; i < resolvedContent.length; i++) {
                const content = resolvedContent[i];
                const file = files[i];

                if (args.useSortComments) {
                    const changedContent = sortComments(content, file, true);

                    if (changedContent?.hasOperatedOnFile) {
                        writeFile(
                            file,
                            changedContent.lines.join(EOL),
                            'utf-8'
                        );
                    }
                } else {
                    const changedContent = sort(content, options);

                    if (content !== changedContent) {
                        writeFile(file, changedContent, 'utf-8');
                    }
                }
            }

            return;
        }

        // arguable whether to sort each content individually and then join
        // them or just sort them once they have been concatenate
        // the unix sort command concatenates them first so yea
        const allContent = resolvedContent.join(EOL);

        if (args.useSortComments) {
            const changedContent = sortComments(allContent, 'N/A', false);

            if (changedContent?.lines) {
                console.log(changedContent.lines.join('\n'));
            }
        } else {
            console.log(sort(allContent, options));
        }

        return;
    }

    let stdinData = '';

    process.stdin.on('data', (data) => {
        stdinData += data;
    });

    process.stdin.on('close', () => {
        console.log(sort(stdinData, options));
    });
}

async function pushContentFromDirectory(
    dir: string,
    content: Promise<string>[]
) {
    const files = await readdir(dir);

    for (const file of files) {
        const next = path.join(dir, file);

        if (statSync(next).isDirectory()) {
            pushContentFromDirectory(next, content);
        } else {
            content.push(readFile(next, 'utf-8'));
        }
    }
}

function sortComments(content: string, file: string, logInfo: boolean) {
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
                console.log(currentStartLine);
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

            // not gonna throw errors for this one, maybe later
            const sortedSection = sort(section, options);

            if (sortedSection !== section) {
                if (!hasOperatedOnFile) {
                    if (logInfo) {
                        console.log(`Modifiying ${file}:`);
                    }

                    hasOperatedOnFile = true;
                }

                if (logInfo) {
                    console.log(
                        // +2 because of 0-index & the comment
                        `    sort changed from lines ${
                            currentStartLine + 2
                        }-${i}`
                    );
                }

                const deleteCount = i - currentStartLine - 1;
                const itemsToAdd = sortedSection.split(EOL);

                lines.splice(currentStartLine + 1, deleteCount, ...itemsToAdd);
                i -= deleteCount - itemsToAdd.length;
            }

            currentStartLine = undefined;
        }
    }

    return { hasOperatedOnFile, lines };
}

try {
    yargs(process.argv.slice(2))
        .command({
            command: '$0 [files..]',
            describe:
                'feature rich text sorter, takes in from stdin or from files/directories.\nDirectories will be looped through.\n\nUse https://scopedsort.netlify.app/ for full documentation.',
            builder: (y: any) =>
                genericSortYargsBuilder(y)
                    .option('useSortComments', {
                        type: 'boolean',
                        describe:
                            'sorts using sort comments rather than line by line',
                        alias: 'c',
                    })
                    .option('modify', {
                        type: 'boolean',
                        describe: 'modify the files in place',
                    })
                    .strict(),
            // @ts-ignore
            handler: defaultCommandHandler,
        })
        .alias('h', 'help')
        .strict()
        .fail(false)
        .wrap(90)
        .parse();
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
