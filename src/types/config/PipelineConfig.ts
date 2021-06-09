import {DeepPartial} from '../DeepPartial';
import {PipelineConfigFactory} from '../../lib/PipelineConfigFactory';
import {WatchOptions} from 'gulp';

export type Environment = 'development' | 'production';

export type TaskConfiguration<T extends {}> = {
    [key in keyof T]: T[key] | false
}

export type DevTaskDefinition<T extends {}> = keyof T | Array<keyof T | DevTaskDefinition<T>>;

export type TaskSequence = 'series' | 'parallel';

export type GulpDevTasks<T extends {}> = {
    buildTaskName?: string,
    buildTasks: Array<DevTaskDefinition<T>>,
    buildSequence: TaskSequence,
    watchTaskName?: string,
    watchOptions?: WatchOptions
}

export interface WatchConfig<T extends {}> {
    glob: string,
    sequence?: TaskSequence,
    tasks: keyof T | Array<keyof T>
}

export interface PipelineConfig<T extends {}> {
    createGulpDevTasks: boolean,
    gulpDevTasks: GulpDevTasks<T>,
    createDefaultGulpTask: boolean,
    tasksPath: string | string[],
    tasksFileExtension: string | string[],
    environment: Environment,
    tasks: TaskConfiguration<T>,
    watcher: Array<WatchConfig<T>>
}

export type PipelineConfigReturnValue<T extends {}> = PipelineConfigFactory<T> | DeepPartial<PipelineConfig<T>> | undefined
export type PipelineConfigCallback<T extends {}> = (configFactory: PipelineConfigFactory<T>) => PipelineConfigReturnValue<T>;

export type PipelineServiceConfigOption<T extends {}> = string | DeepPartial<PipelineConfig<T>> | PipelineConfigCallback<T>;
