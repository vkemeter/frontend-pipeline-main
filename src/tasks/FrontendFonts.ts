import {TaskConfig} from '../types/config/PipelineConfig';
import {TaskDefinition} from '../types/TaskDefinition';
import gulp from 'gulp';

const taskDefinition: TaskDefinition<'FRONTEND:FONTS'> = {
    name: 'FRONTEND:FONTS',
    taskFn(config: TaskConfig) {
        return gulp.src(config.src);
    }
}

export default taskDefinition;
