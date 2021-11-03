import {TaskFunctionGenerator} from '../types/Tasks';
import {TaskFrontendJsConfig} from '../types/tasks/FrontendJsTask';
import * as gulp from 'gulp';
import * as webpackStream from 'webpack-stream';
import {generateWebpackConfig} from '../assets/webpackConfiguration';

const taskGenerator: TaskFunctionGenerator<TaskFrontendJsConfig> = (config) => {
    return () => {
        // TODO: pass env to FE:JS task
        const webpackConfig = generateWebpackConfig('development')
        return gulp.src(config.src)
            .pipe(webpackStream(webpackConfig))
            .pipe(gulp.dest(config.dest));
    }
}

export = taskGenerator;
