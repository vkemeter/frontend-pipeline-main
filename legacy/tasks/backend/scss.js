'use strict';

const _gulp = require('gulp');
const _sass = require('gulp-dart-sass');
const _prefix = require('gulp-autoprefixer');
const _glob = require('gulp-sass-glob');
const _config = require(__dirname.substring(0, __dirname.indexOf('node_modules')) +'config');

_sass.compiler = require('node-sass');

/**
 * this task compiles the backend
 * scss files for the TYPO3 backend
 *
 * @param done
 * @return {*}
 */
module.exports = function(done) {
    done();

    return _gulp.src(_config().backend.css.src)
        .pipe(_glob())
        .pipe(_sass({
            outputStyle: 'compressed'
        }).on('error', _sass.logError))
        .pipe(_prefix(_config().browserPrefix))
        .pipe(_gulp.dest(_config().backend.css.dest));
};

module.exports.alias = 'Backend:SCSS';
module.exports.enabled = _config().backend.css.enabled;