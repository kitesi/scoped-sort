#!/usr/bin/env node

import {
    sort,
    sortComments,
    parseArgsIntoOptions,
    type Options,
} from 'string-content-sort';
import ansiColors from 'ansi-colors';

import { statSync, existsSync } from 'fs';
import { readdir, readFile, writeFile } from 'fs/promises';
import { EOL } from 'os';
import * as path from 'path';

import { longHelpText, shortHelpText } from './help.js';

interface ExtraOptions {
    modify: boolean;
    useSortComments: boolean;
    skipPrompts: boolean;
}

const { red, yellow, green } = ansiColors;
const useHelpMessage = 'Use -h (short) or --help (extensive) for help.\n';

function printError(errorText: string) {
    process.stderr.write(errorText + '\n');
}

function printErrorAndExit(errorText: string) {
    process.stderr.write(errorText + '\n' + useHelpMessage);
    process.exit(1);
}

function padString(text: string) {
    return '    ' + text;
}

async function pushContentFromDirectory(
    dir: string,
    fileContents: Promise<string>[],
    fileNames: string[]
) {
    const files = await readdir(dir);

    for (const file of files) {
        if (file === '.git') {
            continue;
        }

        const next = path.join(dir, file);

        if (statSync(next).isDirectory()) {
            // might be a bit slow
            await pushContentFromDirectory(next, fileContents, fileNames);
        } else {
            fileContents.push(readFile(next, 'utf-8'));
            fileNames.push(next);
        }
    }
}

function takeinStdin(options: Options) {
    let stdinData = '';

    process.stdin.on('data', (data) => {
        stdinData += data;
    });

    function printSortedAndExit() {
        console.log(sort(stdinData, options));
        process.exit(0);
    }

    process.stdin.on('close', printSortedAndExit);
    process.stdin.on('end', printSortedAndExit);
}

async function takeinFiles(
    positionals: string[],
    options: Options,
    question: (query: string) => Promise<string>,
    { modify, useSortComments, skipPrompts }: ExtraOptions
) {
    const fileContents: Promise<string>[] = [];
    const fileNames: string[] = [];

    for (const file of positionals) {
        if (file == '.git') {
            continue;
        }

        if (!existsSync(file)) {
            printError(`${red('Error:')} File ${file} does not exist`);
            continue;
        }

        if (statSync(file).isDirectory()) {
            await pushContentFromDirectory(file, fileContents, fileNames);
        } else {
            fileContents.push(readFile(file, 'utf-8'));
            fileNames.push(file);
        }
    }

    if (fileContents.length === 0) {
        process.exit(1);
    }

    const resolvedContent = await Promise.all(fileContents);

    if (modify) {
        for (let i = 0; i < resolvedContent.length; i++) {
            const content = resolvedContent[i];
            const file = fileNames[i];

            if (useSortComments) {
                const {
                    commentSections,
                    errors: commentSectionsErrors,
                    result,
                } = sortComments(content);

                if (commentSections.length === 0) {
                    continue;
                }

                process.stdout.write('- ' + file + ': ');

                if (commentSectionsErrors.length > 0) {
                    console.log();
                    printError(
                        commentSectionsErrors
                            .map((e) => red(padString(e)))
                            .join('\n')
                    );
                    continue;
                }

                let atleastOneHasChange = false;

                for (const {
                    hasChanged,
                    endLine,
                    startLine,
                } of commentSections) {
                    const range = `${startLine + 1}-${
                        endLine === null ? 'none' : endLine + 1
                    }`;

                    if (hasChanged) {
                        atleastOneHasChange = true;
                        process.stdout.write(green(`{${range}}`) + ', ');
                    } else {
                        process.stdout.write(yellow(`{${range}}`) + ', ');
                    }
                }

                // print newline
                console.log();

                if (atleastOneHasChange) {
                    writeFile(file, result, 'utf-8');
                }
            } else {
                const changedContent = sort(content, options);

                if (content === changedContent) {
                    console.log('No change.');
                    return;
                }

                if (!skipPrompts) {
                    let answer = await question(
                        'You are using --modify without --use-sort-comments, are you sure? (y/n): '
                    );

                    answer = answer.toLowerCase();

                    switch (answer) {
                        case 'y':
                        case 'yes':
                        case 'ya':
                        case 'ye':
                            break;
                        default:
                            process.exit(0);
                    }
                }

                console.log('Writing to file: ' + file);
                writeFile(file, changedContent, 'utf-8');
            }
        }

        return;
    }

    // arguable whether to sort each content individually and then join
    // them or just sort them once they have been concatenate
    // the unix sort command concatenates them first so yea
    const allContent = resolvedContent.join(EOL);

    if (useSortComments) {
        const sortCommentsResults = sortComments(allContent);

        if (sortCommentsResults.errors.length > 0) {
            printErrorAndExit(
                sortCommentsResults.errors.map(padString).join('\n')
            );
        }

        console.log(sortCommentsResults.result);
    } else {
        console.log(sort(allContent, options));
    }

    return;
}

export async function main() {
    let useSortComments = false;
    let modify = false;
    let skipPrompts = false;

    const {
        errors: parsingErrors,
        options,
        positionals,
    } = parseArgsIntoOptions(process.argv.slice(2), (arg) => {
        switch (arg) {
            case '-h':
                console.log(shortHelpText);
                process.exit(0);
            /* eslint-disable-next-line no-fallthrough */
            case '-H':
            case '--help':
                console.log(longHelpText);
                process.exit(0);
            /* eslint-disable-next-line no-fallthrough */
            case '-c':
            case '--use-sort-comments':
                useSortComments = true;
                return 0;
            case '--modify':
                modify = true;
                return 0;
            case '-y':
            case '--yes':
                skipPrompts = true;
                return 0;
            default:
                return 1;
        }
    });

    if (parsingErrors.length > 0) {
        printErrorAndExit(
            'Error(s) with parsing options: \n' +
                parsingErrors.map(padString).join('\n') +
                '\n'
        );
    }

    // try sort options quickly
    try {
        sort('', options);
    } catch (optionsError: any) {
        printErrorAndExit(
            'Error(s) with options: \n' +
                (optionsError?.message || '').split('\n').map(padString) +
                '\n'
        );
    }

    for (let i = positionals.length - 1; i >= 0; i--) {
        if (!positionals[i]) {
            positionals.splice(i, 1);
        }
    }

    if (positionals.length > 0) {
        const { rl, question } = await import('./prompt');

        await takeinFiles(positionals, options, question, {
            modify,
            skipPrompts,
            useSortComments,
        });

        rl.close();
    } else {
        if (modify) {
            printErrorAndExit('Error: provided --modify with no files');
        }

        takeinStdin(options);
    }
}

main();
