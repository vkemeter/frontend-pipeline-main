const _gulp  = require('gulp');
const _realFavicon = require('gulp-real-favicon');
const _fs = require('fs');
const _config = require(__dirname.substring(0, __dirname.indexOf('node_modules')) +'config');
const _fancyLog = require('fancy-log');
const _colors = require('ansi-colors');

/**
 * Inject the favicon markups in your HTML pages. You should run
 * this task whenever you modify a page. You can keep this task
 *
 * @param done
 * as is or refactor your existing HTML pipeline.@return {*}
 */
module.exports = function(done) {
    done();

    _config().favIcon.icons.forEach(function(icon, key) {
        _fancyLog(_colors.green('Injecting '+ icon.name));

        let _destHtmlFiles = _config().favIcon.srcHtml,
            _FAVICON_DATA_FILE = icon.data,
            _destDir = icon.destDir;

        _gulp.src([ _destHtmlFiles ])
            .pipe(_realFavicon.injectFaviconMarkups(JSON.parse(_fs.readFileSync(_FAVICON_DATA_FILE)).favicon.html_code))
            .pipe(_gulp.dest(_destDir));
    });

    return done();
};

module.exports.alias = 'Favicon:INJECT';
module.exports.enabled = _config().favIcon.enabled;