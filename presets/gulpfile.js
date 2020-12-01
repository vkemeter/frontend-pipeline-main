var _gulp = require('gulp'),
    _config = require("./config"),
    _glass = require('@agostone/gulp-glass'),
    _taskLoader = new _glass({
        taskPaths: 'node_modules/frontend-pipeline-main/tasks'
    });

_taskLoader.loadTasks();

/** an example default task */
_gulp.task('default',
    _gulp.series(
        'Misc:CONFIG',
        'Frontend:FONTS',
        'Frontend:IMAGES',
        _gulp.parallel(
            'Backend:JS',
            'Backend:SCSS',
            'Frontend:IE11',
            'Frontend:JS',
            'Frontend:SCSS',
        )
    )
);
