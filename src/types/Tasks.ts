import {TaskFunction} from 'gulp';
import {PipelineConfig} from './config/PipelineConfig'

export type TaskFunctionGenerator<T, P extends {} = {}> = (config: T, pipelineConfig: PipelineConfig<P>) => TaskFunction;

export type TaskFunctionDefinition<Tasks extends {}, Key extends keyof Tasks> = TaskFunctionGenerator<Tasks[Key], Tasks> & {
    name: Key
}
