// @ts-check
const getValuesRegex = /^(?<indentation>\s*)(?<char>[-*+])/;

/**
 *  @typedef {object} Options
 *  @property {boolean} [recursive]
 *  @property {boolean} [reverse]
 *  @property {boolean} [unique]
 *  @property {boolean} [caseInsensitive]
 *  @property {boolean} [sortNumerically]
 *  @property {RegExp} [regex]
 *  @property {boolean} [useMatchedRegex]
 */

/** @param {string} str **/
function calculateSpaceLength(str) {
    return str.replace('\t', '    ').length;
}

/** @param {string} str */
function getNumberPartFromString(str) {
    return str.match(/-?\d+/);
}

/**
 * @param {string} a
 * @param {string} b
 */
function numericalSort(a, b) {
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

/**
 * @param {string[]} sections
 * @param {Options} options
 */
function getModifiedSections(sections, options) {
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
        /** @type {Set<string>} */
        const haveSeen = new Set();
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

/**
 * @param {string[]} lines
 * @param {number} index
 * @param {Options} options
 */
function sortInnerSection(lines, index, options) {
    /** @type {string[]} */
    const sections = [];
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

/**
 *  @param {string} text
 *  @param {Options} options
 */
function sort(text, options) {
    const lines = text.trimEnd().split(/\r?\n/);
    let sections = [];
    /** @type {string[]} */
    let currentSection = [];
    /** @type {string | undefined} */
    let currentIndentation;

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

module.exports = sort;
