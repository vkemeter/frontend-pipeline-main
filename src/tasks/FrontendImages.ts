import {TaskFunctionGenerator} from '../types/Tasks'
import {TaskFrontendImageConfig} from '../types/tasks/FrontendImageTask'
import gulp from 'gulp'
import gulpImagemin from 'gulp-imagemin'
import {Plugin} from 'imagemin'

function getPluginByKey(key: string, pluginConfig?: any): Plugin {
    let plugin: Plugin;
    switch (key) {
        case 'gif': plugin = gulpImagemin.gifsicle(pluginConfig); break;
        case 'jpg': plugin = gulpImagemin.mozjpeg(pluginConfig); break;
        case 'png': plugin = gulpImagemin.optipng(pluginConfig); break;
        default:
            throw new Error(`Unknown imagemin plugin ${key}`);
    }
    return plugin;
}

function createPluginsFromConfig(config: TaskFrontendImageConfig): Plugin[] {
    const imageminPlugins: Plugin[] = [];
    if(typeof config.imagemin === 'object') {
        for(const i in config.imagemin) {
            const key = i as keyof typeof config.imagemin;
            if(!!config.imagemin[key]) {
                const pluginConfig = config.imagemin[key] === true ? undefined : config.imagemin[key];
                const plugin = getPluginByKey(key, pluginConfig);
                imageminPlugins.push(plugin);
            }
        }
    }
    return imageminPlugins;
}

const taskGenerator: TaskFunctionGenerator<TaskFrontendImageConfig> = (config) => {
    const imageminPlugins = createPluginsFromConfig(config);

    return () => {
        return gulp.src(config.src)
            .pipe(gulpImagemin(imageminPlugins))
            .pipe(gulp.dest(config.dest));
    }
}

export = taskGenerator;
