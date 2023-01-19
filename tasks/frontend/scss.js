'use strict';

const _gulp = require('gulp');
const _sass = require('gulp-dart-sass');
const _prefix = require('gulp-autoprefixer');
const _rename = require('gulp-rename');
const _sourcemaps = require('gulp-sourcemaps');
const _glob = require('gulp-sass-glob');
const _filter = require('gulp-filter');
const _concat = require('gulp-concat');
const _cleanCss = require('gulp-clean-css');
const _config = require(__dirname.substring(0, __dirname.indexOf('node_modules')) +'config');

module.exports = function(done) {
    done();

    const scssFilter = _filter('**/*.scss', {restore: true});

    const cleanCssConfig = {
        level: {
            1: {
                tidySelectors: false
            }
        },
        minify: true
    };

    return _gulp.src(_config().frontend.css.src)
            .pipe(_sourcemaps.init())
            .pipe(scssFilter)
            .pipe(_glob())
            .pipe(_sass().on('error', _sass.logError))
            .pipe(scssFilter.restore)
            .pipe(_concat('Styles.css'))
            .pipe(_cleanCss(_config().frontend.css.cleanCssConfig ?? cleanCssConfig))
            .pipe(_prefix(_config().browserPrefix))
            .pipe(_rename({ suffix: '.min' }))
            .pipe(_sourcemaps.write('.'))
            .pipe(_gulp.dest(_config().frontend.css.dest));
};

module.exports.alias = 'Frontend:SCSS';
module.exports.enabled = _config().frontend.css.enabled;
