const _config = require(__dirname.substring(0, __dirname.indexOf('node_modules')) +'config');

module.exports = function() {
    try {
        return require(_config().theme +"/Test/backstop/scenarios.json");
    } catch (e) {
        return [
            {
                "label": "Supseven Website",
                "url": "https://www.supseven.at"
            }
        ];
    }
}