const _gulp = require('gulp');
const _rename = require('gulp-rename');
const _concat = require('gulp-concat');
const _uglify = require('gulp-uglify');
const _sourcemaps = require('gulp-sourcemaps');
const _babel = require('gulp-babel');
const _config = require(__dirname.substring(0, __dirname.indexOf('node_modules')) +'config');

module.exports = function(done) {
    done();

    let modules = [];

    if (_config().frontend.javascript.includeJquery === true) {
        modules.push(
            _config().theme +'/node_modules/jquery/dist/jquery.js',
        );
    }

    modules = modules.concat(_config().frontend.javascript.modules);

    modules.push(
        _config().theme +'/Src/JavaScript/Plugins/*.js',
        _config().frontend.javascript.src
    );

    return _gulp.src(modules)
        .pipe(_sourcemaps.init())
        .pipe(_babel({
            plugins: ['@babel/env', '@babel/transform-runtime']
        }))
        .pipe(_concat('Main.js'))
        .pipe(_rename({ suffix: '.min' }))
        .pipe(_uglify())
        .pipe(_sourcemaps.write('.'))
        .pipe(_gulp.dest(_config().frontend.javascript.dest));
};

module.exports.alias = 'Frontend:JS';
module.exports.enabled = _config().frontend.javascript.enabled;
