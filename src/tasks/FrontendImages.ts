import {TaskFunctionGenerator} from '../types/Tasks';
import {TaskFrontendImageConfig} from '../types/tasks/FrontendImageTask';
import gulp from 'gulp';
import gulpImagemin from 'gulp-imagemin';
import {Plugin} from 'imagemin';

function getPluginByKey(key: string, pluginConfig?: any): Plugin {
    let plugin: Plugin;
    switch (key) {
        case 'gif': plugin = gulpImagemin.gifsicle(pluginConfig); break;
        case 'jpg': plugin = gulpImagemin.mozjpeg(pluginConfig); break;
        case 'svg': plugin = gulpImagemin.svgo(pluginConfig); break;
        case 'png': plugin = gulpImagemin.optipng(pluginConfig); break;
        default:
            throw new Error(`Unknown imagemin plugin ${key}`);
    }
    return plugin;
}

function createPluginsFromConfig(config: TaskFrontendImageConfig): Plugin[] {
    const imageminPlugins: Plugin[] = [];
    if(config.imagemin) {
        for(const i in config.imagemin) {
            const key = i as keyof typeof config.imagemin;
            if(config.imagemin[key] === false) {
                continue;
            }
            const plugin = getPluginByKey(key, config.imagemin[key]);
            imageminPlugins.push(plugin);
        }
    }
    return imageminPlugins;
}

const taskGenerator: TaskFunctionGenerator<TaskFrontendImageConfig> = (config) => {
    const imageminPlugins = createPluginsFromConfig(config);

    return () => {
        const task = gulp.src(config.src);
        if (config.optimize) {
            task.pipe(gulpImagemin(imageminPlugins));
        }
        return task.pipe(gulp.dest(config.dest));
    }
}

export = taskGenerator;
