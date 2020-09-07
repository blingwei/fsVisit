/**
 * Created by PengLing on 2017/3/28.
 */
'use strict';

const path = require('path');
const fs = require('fs');


module.exports = function (app, router, opts) {
    fs.readdirSync(__dirname).forEach((filename) => {
        if (fs.lstatSync(path.join(__dirname, filename)).isDirectory()) {
            fs.readdirSync(path.join(__dirname, filename)).forEach((api) => {
                require(`./${filename}/${api}`)(app, router, opts);
            });
        }
    });

    return router;
};
