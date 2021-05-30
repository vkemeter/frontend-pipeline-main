import {TaskConfig} from '../types/config/PipelineConfig';

const taskDefinition = {
    // name: 'Frontend:FONTS',
    taskFn(config: TaskConfig) {
        return config;
    }
}

export default taskDefinition;
