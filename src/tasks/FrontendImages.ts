import {TaskFunctionGenerator} from '../types/Tasks';
import {TaskFrontendImageConfig} from '../types/tasks/FrontendImageTask';
import gulp from 'gulp';
import gulpImagemin from 'gulp-imagemin';
import {Plugin} from 'imagemin';

const taskGenerator: TaskFunctionGenerator<TaskFrontendImageConfig> = (config) => {
    const imageminPlugins: Plugin[] = [];
    if(config.imagemin) {
        for(const i in config.imagemin) {
            const key = i as keyof typeof config.imagemin;
            if(config.imagemin[key] === false) {
                continue;
            }
            let plugin: Plugin;
            switch (key) {
                case 'gif': plugin = gulpImagemin.gifsicle(config.imagemin![key] as any); break;
                case 'jpg': plugin = gulpImagemin.mozjpeg(config.imagemin![key] as any); break;
                case 'svg': plugin = gulpImagemin.svgo(config.imagemin![key] as any); break;
                case 'png': plugin = gulpImagemin.optipng(config.imagemin![key] as any); break;
            }
            imageminPlugins.push(plugin);
        }
    }

    return () => {
        const task = gulp.src(config.src);
        if (config.optimize) {
            task.pipe(gulpImagemin(imageminPlugins));
        }
        return task.pipe(gulp.dest(config.dest));
    }
}

export = taskGenerator;
