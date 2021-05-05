const _gulp = require('gulp');
const _config = require(__dirname.substring(0, __dirname.indexOf('node_modules')) +'config');

module.exports = async function(done) {
    var _img = _gulp.src(_config().frontend.images.src);

    if (_config().frontend.images.optimize === true) {
        console.log('Optimize Images');
        const _image = require('gulp-image');
        _img.pipe(_image(_config().frontend.images.config));
    }

    _img.pipe(_gulp.dest(_config().frontend.images.dest));

    done();
};

module.exports.alias = 'Frontend:IMAGES';
module.exports.enabled = _config().frontend.images.enabled;