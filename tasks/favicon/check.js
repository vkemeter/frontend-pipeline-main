const _realFavicon = require('gulp-real-favicon');
const _fs = require('fs');
const _config = require(__dirname.substring(0, __dirname.indexOf('node_modules')) +'config');
const _FAVICON_DATA_FILE = _config().favIcon.data;
const _currentVersion = JSON.parse(_fs.readFileSync(_FAVICON_DATA_FILE)).version;

/**
 * Check for updates on RealFaviconGenerator (think: Apple has just
 * released a new Touch icon along with the latest version of iOS).
 * Run this task from time to time. Ideally, make it part of your
 * continuous integration system.
 *
 * @param done
 * @return {*|void}
 */
module.exports = function(done) {
    return _realFavicon.checkForUpdates(_currentVersion, function (err) {
        if (err) {
            throw err;
        }

        done();
    });
};

module.exports.alias = 'Favicon:CHECK';
module.exports.enabled = _config().favIcon.enabled;