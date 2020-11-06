var _gulp = require('gulp'),
    _config = require("./config"),
    _glass = require('@agostone/gulp-glass'),
    _taskLoader = new _glass({
        taskPaths: 'node_modules/s7-fe-pipeline-main/tasks'
    });

_taskLoader.loadTasks();

_gulp.task('default', function(cb){
   console.log(_config());
   cb();
});