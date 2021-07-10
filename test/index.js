// @ts-check
const path = require('path');

function run() {
    return new Promise((res, rej) => {
        require(path.join(__dirname, 'extension.test.js'));
    });
}

module.exports = {
    run,
};
