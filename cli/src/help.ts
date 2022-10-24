/* eslint-disable indent */
import ansiColors from 'ansi-colors';

const { bold, underline } = ansiColors;
const spaceIfNoAlias = '    ';

const boilerplateUsage = `${bold('USAGE:')} ssort [files..] [options]

Concatenates provided file(s) -> sorts -> writes to standard output.
Provided files that are directories will be recursively read.

If no file is provided, takes in from standard input.

${bold('DESCRIPTION')}

A feature rich text sorter that takes indentation into account.

Need help or want to contribute?:
Visit https://github.com/sixskys/scoped-sort`;

export const longHelpText = `${boilerplateUsage}

${bold('OPTIONS: SORTERS')}
    You can only have one sorter at a time.

    ${bold('-i, --case-insensitive')}
        sort case case insensitively
    
    ${bold('-e, --natural-sort')}
        sort naturally based on the captured result
    
    ${bold('-n, --numerical-sort')}
        sorts based on the number of the captured result. if no regex is
        specified, it will sort by the first number in the line
    
    ${bold('-f, --float-sort')}
        sorts based on the float of the captured result. if no regex is
        specified, it will sort by the first number in the line

    ${bold('-l, --length-sort')}
        sorts based on the length of the captured result.
    
    ${bold('-M, --month-sort')}
        sorts by the month of the captured result (jan,feb,mar,..). if no regex
        or field-seperator is specified, it will sort by the first text that
        matches /jan|feb|mar|../

    ${bold('-D, --day-sort')}
        sorts by the day of the captured result (mon,tue,wed,..). if no regex or
        field-seperator is specified, it will sort by the first text that
        matches /mon|tue|wed|../

    ${bold('-x, --none-sort')}
        doesn't sort, mainly used with the --unique option

    ${bold('-z, --random-sort')}
        sorts randomly (psuedo)

${bold('OPTIONS: UNIVERSAL MODIFIERS')}
    These options will work on everything.

    ${bold('-r, --recursive')} [${underline('number')}]
        This project takes scope/indentation into account and does not just sort
        line by line.
        
        By default nested content (indented) will be left in place and not
        sorted. If set to true (no number argument), will sort inner sections
        recursively. Otherwise will only sort sections up to the provided depth.

    ${bold('-s, --reverse')}
        Reverses the sort comparasions.

    ${bold('-u, --unique')} ['i']
        Removes duplicate items. An optional value of "i" can be provided to
        remove duplicates without regard to casing
        
    ${bold('-m, --markdown')}
        Treats the text as a markdown list. You won't need his option most of
        the time, but in certain instances you will.
        
${bold('OPTIONS: ITEM SEARCH')}
    ${spaceIfNoAlias}${bold('--regex')} <${underline('regex')}>
        A regex to match text in each item/line. By default the sorter will sort
        based on the text after the match. Text that do no match will be left in
        place, and will be at the top. The regex language is javascript.
        
        A global flag (g) can be used, which will alter the way
        --use-sort-groups works.  An i flag can also be used.

    ${bold('-F, --field-seperator')} <${underline('regex')} | ${underline(
    'string'
)}>
        The seperator used to determine columns, defaults to /\\s+/ if no regex is specified.

    ${bold('-k, --use-sort-group')} <${underline('sort_group')}>
        Determines what group to use when sorting. Used with --regex or
        --field-seperator.
        
        If no regex or field-seperator is provided, field-seperator will default
        to /\\s+/, and groups will be split by whitespace.

        The syntax for this is a bit complex, first you have braces with the
        groups it should apply to: {2} or {2,5} or {2..5} or other combinations.
        Ranges {x..y} need to have both a start and end. So you can not have
        {..5} or {3..}.

        Next you have the options it should apply to those groups: {2}ls or
        {2}xu

        The allowed arguments are:
            - i,e,n,f,l,M,D,x for their respective sorter. z or random-sort is not allowed.
            - s for reverse
            - a for --attach-non-matching-to-bottom
            - o for --sort-order 

        If an option has an argument like 'u' (unique) you will need to seperate
        it with _: {2}sx_u=i or {2}u=i_x or {2}u=i

        The only other option that takes an argument is 'o'. For example usage,
        look at --sort-order.

        You can also have multiple sort groups like such:

            -k "{2}n,{3}l"

        Note: the comma is not necessary.
        
        This will sort by the second column, if it's a number. If it's not
        it will stay in place and then all the items that did not have a 
        number on group 2 will be compared based on the length of their
        3rd group.
        
        The first sort group will inherit any top level option that is valid for
        a sort-group (sorter, reverse, attach-non-matching-to-bottom, sort-order).
        
        ${bold('Examples:')}
        
            -k "{2}l" // => sort by the 2nd group's length
            -k "{1}x_u=i" // => remove duplicates on the 1st group case-insensitively
            -k "{5}s" // => sort by the 5th column and reverse 

    ${bold('-p, --use-matched-regex')}
        Combined with --regex, this will sort using the first matched text
        rather than the text after.  This is shorthand for --use-sort-groups
        "{1}".

    ${bold('-o, --sort-order')} <${underline('sort_order')}>
        Determines the sort order of the captured results. For example, let's
        say you had an csv table of people and their info, and the third column
        had their gender. If you wanted to sort by their gender, you could
        do: 
        
        -o "male;female;non-binary;n/a".

        ${bold(
            'NOTE:'
        )} You would first have to capture the 3rd group though, which you
        could do with -k {3} and -F ",". Won't be included for the rest of the
        examples.

        It's also possible the gender values are capatlized, you can set
        it to be case-insensitive by prefixing the "i" argue and a colon:

        -o "i:male;female;non-binary;n/a"
        
        Let's say you don't want to write as much, you can add a looseness
        argument, which will only compare the first x characters:

        -o "3i:mal;fem;non;n/a"

        ${bold('NOTE:')} the values you provide ('mal', 'female', ..) won't
        be tranformed at all, so make sure you have them correct if you are
        using case-insensitive or looseness.

        To summarize: you have a list of values seperated by ';', you can
        prefix that list with arguments followed by a colon. Those arguments
        can be either a number or 'i'.

    ${bold('-a, --attach-non-matching-to-bottom')}
     By default items that do not match a sorter (numerical, float, ...), or
     don't match a regex will stay in place and be at the top. If this is set
     to true, it will be at the bottom. Vise versa if --reverse is set to true.

${bold('OPTIONS: SECTIONS')}
    ${bold('--section-seperator')} <${underline('regex')} | ${underline(
    'string'
)}>
        Tells the program how to seperate sections as opposed to lines &
        identation.
        
        For example if you have text where the sections are seperated by a blank
        line, you can set this to "\\n\\n" and the sections will be sorted 
        accordingly.

    ${bold('--section-starter')} <${underline('regex')}>
        Tells the program when to start a new section as opposed to just 
        comparing indentations.

    ${bold('--section-rejoiner')} <${underline('regex')} | ${underline(
    'string'
)}>
        Tells the program how to rejoin sections, defaults to "\\n".

        In the example of --section-seperator, you would probably want to
        set this value to "\\n\\n".

${bold('OPTIONS: OTHER')}
    ${bold('-c, --use-sort-comments')}
        Will only sort sort-comments.

        Sort comments are a way for this program to automatically recognize a section to
        sort and it's options. This can help if you have a list that is constantly being
        updated, and you don't want to have to keep manually sorting.
        
        See https://scopedsort.netlify.app/docs#sort-comments for more.
        
    ${spaceIfNoAlias}${bold('--modify')}
        Modify files rather than write result to stdout. Will ask for
        confirmation if not using --use-sort-comments or -y.

    ${bold('-y, --yes')}
        Skip confirmation prompts.`;

export const shortHelpText = `${boilerplateUsage}

${bold('OPTIONS: SORTERS')}
    You can only have one sorter at a time.

    ${bold('-i, --case-insensitive')}
    ${bold('-e, --natural-sort')}
    ${bold('-n, --numerical-sort')}
    ${bold('-f, --float-sort')}
    ${bold('-l, --length-sort')}
    ${bold('-M, --month-sort')}
    ${bold('-D, --day-sort')}
    ${bold('-x, --none-sort')}
    ${bold('-z, --random-sort')}

${bold('OPTIONS: UNIVERSAL MODIFIERS')}
    These options will work on everything.

    ${bold('-r, --recursive')} [${underline('number')}]
    ${bold('-s, --reverse')}
    ${bold('-u, --unique')} ['i']
    ${bold('-m, --markdown')}

${bold('OPTIONS: ITEM SEARCH')}
    ${spaceIfNoAlias}${bold('--regex')} <${underline('regex_value')}>
    ${bold('-F, --field-seperator')} <${underline('regex')} | ${underline(
    'string'
)}>
    ${bold('-k, --use-sort-group')}
    ${bold('-p, --use-matched-regex')}
    ${bold('-o, --sort-order')} <${underline('sort_order')}>
    ${bold('-a, --attach-non-matching-to-bottom')}

${bold('OPTIONS: SECTIONS')}
    ${bold('--section-seperator')} <${underline('regex')} | ${underline(
    'string'
)}>
    ${bold('--section-starter')} <${underline('regex')}>
    ${bold('--section-rejoiner')} <${underline('regex')} | ${underline(
    'string'
)}>

${bold('OPTIONS: OTHER')}
    ${bold('-c, --use-sort-comments')}
    ${spaceIfNoAlias}${bold('--modify')}
    ${bold('-y, --yes')}

Use ${bold('--help')} or ${bold('-H')} for help with descriptions`;
