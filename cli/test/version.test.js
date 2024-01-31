// test if the output from --version matches that of package.json

const tape = require('tape');
const { spawnSync } = require('child_process');
const { readFileSync } = require('fs');
const { join } = require('path');

const pkg = JSON.parse(
    readFileSync(join(__dirname, '..', 'package.json'), 'utf8')
);

tape('should print version', (t) => {
    const { stdout } = spawnSync('node', ['./dist/main.js', '--version']);
    t.equals(
        stdout.toString(),
        `string-content-sort-cli (scoped-sort-cli) — v${pkg.version}\n`,
        'should print version'
    );
    t.end();
});
