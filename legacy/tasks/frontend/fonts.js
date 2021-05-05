const _gulp = require('gulp');
const _config = require(__dirname.substring(0, __dirname.indexOf('node_modules')) +'config');

module.exports = function(done) {
    _gulp.src(_config().frontend.fonts.src)
        .pipe(_gulp.dest(_config().frontend.fonts.dest))

    setTimeout(function() { done(); }, 100);
};

module.exports.alias = 'Frontend:FONTS';
module.exports.enabled = _config().frontend.fonts.enabled;