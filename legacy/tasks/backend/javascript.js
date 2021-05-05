const {src, dest} = require('gulp');
const _config = require(__dirname.substring(0, __dirname.indexOf('node_modules')) +'config');

module.exports = function(done) {
    done();

    return src(_config().backend.javascript.src)
        .pipe(dest(_config().backend.javascript.dest));
};

module.exports.alias = 'Backend:JS';
module.exports.enabled = _config().backend.javascript.enabled;