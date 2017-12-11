const fs = require('fs');
const path = require('path');


function getTemplate(fn) {
    return fs.readFileSync(fn, {
        encoding: 'utf8'
    });
}

module.exports = function (config) {
    let dir = path.join(config._root, 'views');

    config.views = {};

    // 递归获取所有views目录的文件-
    function loop(folder) {
        fs.readdir(folder, function (err, files) {

            files.forEach(function (f, i) {
                let fn = path.join(folder, f);
                let stat = fs.statSync(fn);
                if (stat.isDirectory()) {
                    loop(fn);
                } else {
                    config.views[fn.toLowerCase()] = getTemplate(fn);
                }
            });
        });
    }
    loop(dir);
};