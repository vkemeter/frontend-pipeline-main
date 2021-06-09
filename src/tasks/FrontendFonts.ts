import {TaskConfig} from '../types/tasks/BaseTask';
import gulp from 'gulp';
import {TaskFunctionGenerator} from '../types/Tasks';

const taskGenerator: TaskFunctionGenerator<TaskConfig> = (config) => {
    return () => {
        return gulp.src(config.src)
            .pipe(gulp.dest(config.dest));
    }
}

export = taskGenerator;
