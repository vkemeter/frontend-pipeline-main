const _backstop = require('backstopjs');
const _config = require(__dirname.substring(0, __dirname.indexOf('node_modules')) + 'config');

module.exports = function (done) {
    done();

    let _filter = getArgs(process.argv);

    return _backstop('reference', {
        'config': _config().theme +'/Test/backstop/backstop.config.js',
        'filter': _filter
    });
};

module.exports.alias = 'TEST:Visual:Reference';
module.exports.enabled = _config().test.backstop.enabled;

function getArgs(args) {
    args.forEach(function (k) {
        if (k.indexOf('--filter') !== -1) {
            return k;
        }
    });
}