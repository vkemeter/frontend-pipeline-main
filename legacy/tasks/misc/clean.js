const _config = require(__dirname.substring(0, __dirname.indexOf('node_modules')) +'config');
const _del = require('del');
const _folderAndFiles = _config().clean.files;

/**
 * removes auto generated files, configure via
 * config.js in clean section
 *
 * @param done
 */
module.exports = function(done) {
    console.log('delete following files:');
    console.table(_folderAndFiles);
    _del(_folderAndFiles, { force: true });
    setTimeout(function(){ done(); }, 100);
};

module.exports.alias = 'Misc:CLEAN';
module.exports.enabled = _config().clean.enabled;
