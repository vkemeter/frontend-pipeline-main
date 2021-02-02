const _config = require(__dirname.substring(0, __dirname.indexOf('Test')) +'config');
const _scenarios = require(_config().theme + '/node_modules/frontend-pipeline-main/test/backstop/modules/scenario.js');
const _viewports = require(_config().theme + '/node_modules/frontend-pipeline-main/test/backstop/modules/viewport.js');

module.exports = {
    "id": _config().test.backstop.id,
    "viewports": _viewports(),
    "onBeforeScript": _config().test.backstop.scripts.onBeforeScript,
    "onReadyScript": _config().test.backstop.scripts.onReadyScript,
    "scenarios": _scenarios(),
    "paths": _config().test.backstop.paths,
    "report": _config().test.backstop.report,
    "engine": _config().test.backstop.engine,
    "engineOptions": _config().test.backstop.engineOptions,
    "asyncCaptureLimit": _config().test.backstop.asyncCaptureLimit,
    "asyncCompareLimit": _config().test.backstop.asyncCompareLimit,
    "debug": _config().test.backstop.debug,
    "debugWindow": _config().test.backstop.debugWindow
}