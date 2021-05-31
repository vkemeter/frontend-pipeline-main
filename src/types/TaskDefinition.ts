import {PipelineConfig} from './config/PipelineConfig';
import ReadWriteStream = NodeJS.ReadWriteStream;

export type TaskFn<T extends keyof PipelineConfig['tasks']> = (config: Exclude<PipelineConfig['tasks'][T], false>) => ReadWriteStream;

export interface TaskDefinition<T extends keyof PipelineConfig['tasks']> {
    name: T,
    taskFn: TaskFn<T>
}
