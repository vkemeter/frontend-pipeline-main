import {TaskFunctionGenerator} from '../types/Tasks';
import {TaskFrontendJsConfig} from '../types/tasks/FrontendJsTask';
import gulp from 'gulp';
import webpackStream from 'webpack-stream';
import {generateWebpackConfig} from '../assets/webpack.config';

const taskGenerator: TaskFunctionGenerator<TaskFrontendJsConfig> = (config) => {
    return () => {
        const stream = gulp.src(config.src);

        if(config.generateModernModule) {
            // TODO: pass env to FE:JS task
            const webpackConfig = generateWebpackConfig('development')
            stream.pipe(webpackStream(webpackConfig))
        }
        if(config.generateLegacyModule) {

        }

        return stream.pipe(gulp.dest(config.dest));
    }
}

export = taskGenerator;
