const _config = require(__dirname.substring(0, __dirname.indexOf('node_modules')) +'config');
const _yaml = require('js-yaml');
const _fs = require('fs');

module.exports = function() {
    let _yamlFileData = _fs.readFileSync(_config().theme +'/config.yaml', 'utf8');
    let _breakpoints = _yaml.load(_yamlFileData).config.breakpoints.values;
    let _viewports = [];

    _breakpoints.forEach(function(breakpoint){
        let _width = breakpoint.key === 'xs' ? 320 : parseInt(breakpoint.value);
        let _viewport = {
            label: breakpoint.key,
            width: _width,
            height: 500
        };

        _viewports.push(_viewport);
    });

    return _viewports;
}