const Mocha = require('mocha');
const path = require('path');

module.exports.run = function () {
    const mocha = new Mocha({
        ui: 'tdd',
        inlineDiffs: true,
    });

    mocha.addFile(path.join(__dirname, 'extension.test.js'));

    return new Promise((res, rej) => {
        try {
            mocha.run((failures) => {
                if (failures > 0) {
                    rej(new Error(`${failures} were found`));
                } else {
                    res();
                }
            });
        } catch (err) {
            console.error(err);
            rej(err);
        }
    });
};
