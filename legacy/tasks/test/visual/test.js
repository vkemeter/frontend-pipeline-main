const _backstop = require('backstopjs');
const _config = require(__dirname.substring(0, __dirname.indexOf('node_modules')) +'config');

module.exports = function(done) {
    done();

    return _backstop('test', {
        'config': _config().theme +'/Test/backstop/backstop.config.js'
    });
};

module.exports.alias = 'TEST:Visual:Test';
module.exports.enabled = _config().test.backstop.enabled;