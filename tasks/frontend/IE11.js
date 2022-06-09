const _gulp = require('gulp');
const _concat = require('gulp-concat');
const _sourcemaps = require('gulp-sourcemaps');
const _config = require(__dirname.substring(0, __dirname.indexOf('node_modules')) +'config');

module.exports = function(done) {
    done();

    let modules = [];
    modules = modules.concat(_config().frontend.javascript.ie11Modules);

    modules.push(
        _config().frontend.javascript.ie11
    );

    return _gulp.src(modules)
        .pipe(_sourcemaps.init())
        .pipe(_concat('IE11.js'))
        .pipe(_sourcemaps.write('.'))
        .pipe(_gulp.dest(_config().frontend.javascript.dest));
};

module.exports.alias = 'Frontend:IE11';
module.exports.enabled = _config().frontend.javascript.ie11Enabled;