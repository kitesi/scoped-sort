const getValuesRegex = /^(?<indentation>\s*)(?<char>[-*+])/;

export interface Options {
    recursive?: boolean;
    reverse?: boolean;
    unique?: boolean;
    caseInsensitive?: boolean;
    sortNumerically?: boolean;
    useMatchedRegex?: boolean;
    regex?: RegExp;
}

function calculateSpaceLength(str: string) {
    return str.replace('\t', '    ').length;
}

function getNumberPartFromString(str: string) {
    return str.match(/-?\d+/);
}

function numericalSort(a: string, b: string) {
    const numberA = getNumberPartFromString(a)?.[0];
    const numberB = getNumberPartFromString(b)?.[0];

    if (!numberB) {
        return 1;
    }

    if (!numberA) {
        return -1;
    }

    return parseInt(numberA) - parseInt(numberB);
}

function getModifiedSections(sections: string[], options: Options) {
    if (options.sortNumerically) {
        // could replace with localeCompare but idk for now
        sections.sort(numericalSort);
    } else if (options.regex) {
        // need this for some reason, other wise typing says options.regex
        // might be undefined inside of the sort callback
        const regex = options.regex;

        sections.sort((a, b) => {
            const matchedA = a.match(regex);
            const matchedB = b.match(regex);

            if (!matchedB || typeof matchedB.index === 'undefined') {
                return 1;
            }

            if (!matchedA || typeof matchedA.index === 'undefined') {
                return -1;
            }

            let compareA = matchedA[0];
            let compareB = matchedB[0];

            if (!options.useMatchedRegex) {
                compareA = a.slice(matchedA.index);
                compareB = b.slice(matchedB.index);
            }

            if (options.caseInsensitive) {
                compareA = compareA.toLowerCase();
                compareB = compareB.toLowerCase();
            }

            if (compareA > compareB) {
                return 1;
            } else if (compareB > compareA) {
                return -1;
            }

            return 0;
        });
    } else if (options.caseInsensitive) {
        // faster: https://stackoverflow.com/a/52369951/15021883
        const collator = new Intl.Collator('en', { sensitivity: 'base' });
        sections.sort((a, b) => collator.compare(a, b));
    } else {
        sections.sort();
    }

    if (options.reverse) {
        sections.reverse();
    }

    if (options.unique) {
        const haveSeen: Set<string> = new Set();
        const unique = [];

        for (const section of sections) {
            const adjustedSection = options.caseInsensitive
                ? section.toLowerCase()
                : section;

            if (!haveSeen.has(adjustedSection)) {
                unique.push(section);
                haveSeen.add(adjustedSection);
            }
        }

        return unique;
    }

    return sections;
}

function sortInnerSection(lines: string[], index: number, options: Options) {
    const sections: string[] = [];
    let currentIndentation = '';
    let amountAdded = 0;

    for (let i = index; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(getValuesRegex);
        const indentation = match?.groups?.indentation || '';
        const listChar = match?.groups?.char;

        if (!currentIndentation && indentation) {
            currentIndentation = indentation;
        }

        const indentationLength = calculateSpaceLength(indentation);
        const currentIndentationLength =
            calculateSpaceLength(currentIndentation);

        if (!listChar) {
            amountAdded++;
            sections[sections.length - 1] += '\n' + line;
        } else if (indentationLength === currentIndentationLength) {
            amountAdded++;
            sections.push(line);
        } else if (indentationLength > currentIndentationLength) {
            const child = sortInnerSection(lines, i, options);
            sections[sections.length - 1] += '\n' + child.content;
            i += child.amountAdded - 1;
            amountAdded += child.amountAdded;
        } else {
            break;
        }
    }

    return {
        content: getModifiedSections(sections, options).join('\n'),
        amountAdded,
    };
}

export function sort(text: string, options: Options) {
    const lines = text.trimEnd().split(/\r?\n/);
    let sections = [];
    let currentSection: string[] = [];
    let currentIndentation: string | undefined;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(getValuesRegex);
        const indentation = match?.groups?.indentation || '';
        const listChar = match?.groups?.char;

        if (typeof currentIndentation === 'undefined') {
            currentIndentation = indentation;
        }

        if (currentSection.length && listChar) {
            if (indentation === currentIndentation) {
                sections.push(currentSection.join('\n'));
                currentSection = [line];
            } else if (options.recursive) {
                const child = sortInnerSection(lines, i, options);
                currentSection.push(child.content);
                i += child.amountAdded - 1;
            } else {
                currentSection.push(line);
            }
        } else {
            currentSection.push(line);
        }
    }

    if (currentSection) {
        sections.push(currentSection.join('\n'));
    }

    return getModifiedSections(sections, options).join('\n');
}
