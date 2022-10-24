// const readline = require('readline');

import { createInterface } from 'readline';

const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
});

export function question(query: string): Promise<string> {
    return new Promise((res) => {
        rl.question(query, (answer) => {
            res(answer);
        });
    });
}

export { rl };
