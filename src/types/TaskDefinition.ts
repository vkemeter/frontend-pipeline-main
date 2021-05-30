import {TaskConfig} from './config/PipelineConfig';
import ReadWriteStream = NodeJS.ReadWriteStream;

export interface TaskDefinition {
    name: string,
    taskFn: (config: TaskConfig) => ReadWriteStream
}
