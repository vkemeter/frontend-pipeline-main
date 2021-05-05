const _gulp = require('gulp');
const _ts = require('gulp-typescript');
const _browserify = require("browserify");
const _source = require("vinyl-source-stream");
const _tsify = require("tsify");
const _uglify = require('gulp-uglify');
const _sourcemaps = require('gulp-sourcemaps');
const _buffer = require("vinyl-buffer");
const _config = require(__dirname.substring(0, __dirname.indexOf('node_modules')) +'config');

module.exports = function(done) {
    done();

    return _browserify({
        basedir: _config().frontend.typescript.src,
        debug: true,
        entries: _config().frontend.typescript.entries,
        cache: {},
        packageCache: {},
    })
        .plugin(_tsify).transform("babelify", {
            presets: ["es2015"],
            extensions: [".ts"],
        }).bundle()
        .pipe(_source(_config().frontend.typescript.file))
        .pipe(_buffer())
        .pipe(_sourcemaps.init({ loadMaps: true }))
        .pipe(_uglify())
        .pipe(_sourcemaps.write("."))
        .pipe(_gulp.dest(_config().frontend.typescript.dest));
};

module.exports.alias = 'Frontend:TYPESCRIPT';
module.exports.enabled = _config().frontend.typescript.enabled;
