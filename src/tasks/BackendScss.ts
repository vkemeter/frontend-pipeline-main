import * as taskGenerator from './FrontendScss'

// TODO: check this if it can be simplified
/*const taskGenerator: TaskFunctionGenerator<TaskConfig> = (config) => {
    return () => {
        return gulp.src(config.src)
            .pipe(gulpSassGlob())
            // TODO: Add options for dart-sass
            // TODO: log error in dev mode, abort task with error-code in prod-mode
            .pipe(gulpDartSass({
                outputStyle: 'compressed'
            }))
            // TODO: Add dynamic prefix browser-versions
            .pipe(gulpAutoprefixer())
            .pipe(gulp.dest(config.dest));
    }
}*/

export = taskGenerator;
