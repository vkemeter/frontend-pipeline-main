import {TaskFrontendScssConfig} from '../types/tasks/FrontendScssTask';
import * as gulp from 'gulp';
import {TaskFunctionGenerator} from '../types/Tasks';
import * as gulpDartSass from 'gulp-dart-sass';
import gulpSassGlob from 'gulp-sass-glob';
import * as gulpRename from 'gulp-rename';
import * as gulpSourcemaps from 'gulp-sourcemaps';
import * as gulpAutoprefixer from 'gulp-autoprefixer';

const taskGenerator: TaskFunctionGenerator<TaskFrontendScssConfig> = (config) => {
    return () => {
        console.log(config.src)
        return gulp.src(config.src)
            .pipe(gulpSourcemaps.init())
            .pipe(gulpSassGlob())
            // TODO: Add options for dart-sass
            .pipe(gulpDartSass({
                outputStyle: 'compressed'
            }))
            // TODO: Add dynamic prefix browser-versions
            .pipe(gulpAutoprefixer())
            .pipe(gulpRename({suffix: '.min'}))
            // TODO: write only in dev context
            .pipe(gulpSourcemaps.write('.'))
            .pipe(gulp.dest(config.dest));
    }
}

export = taskGenerator;
