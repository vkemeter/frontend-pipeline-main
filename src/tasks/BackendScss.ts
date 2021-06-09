import gulp from 'gulp';
import {TaskFunctionGenerator} from '../types/Tasks';
import gulpDartSass from 'gulp-dart-sass';
import gulpSassGlob from 'gulp-sass-glob';
import gulpAutoprefixer from 'gulp-autoprefixer';
import {TaskConfig} from '../types/tasks/BaseTask';

const taskGenerator: TaskFunctionGenerator<TaskConfig> = (config) => {
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
}

export = taskGenerator;
