// @ts-check
const path = require('path');
const glob = require('glob');

function run() {
    const testsRoot = path.resolve(__dirname, '..');

    return new Promise((res, rej) => {
        glob('**/**.test.js', { cwd: testsRoot }, (err, files) => {
            if (err) {
                return rej(err);
            }

            files.forEach((f) => {
                require(path.resolve(testsRoot, f));
            });
        });
    });
}

module.exports = {
    run,
};
