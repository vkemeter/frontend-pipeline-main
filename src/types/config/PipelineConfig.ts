import {DeepPartial} from '../DeepPartial';
import {PipelineConfigFactory} from '../../lib/PipelineConfigFactory';

export type Environment = 'development' | 'production';

export type TaskConfiguration<T extends {}> = {
    [key in keyof T]: T[key] | false
}

export interface PipelineConfig<T extends {}> {
    createGulpDevTasks: boolean,
    tasksPath: string | string[],
    tasksFileExtension: string | string[],
    environment: Environment,
    tasks: TaskConfiguration<T>
}

export type PipelineConfigReturnValue<T extends {}> = PipelineConfigFactory<T> | DeepPartial<PipelineConfig<T>> | undefined
export type PipelineConfigCallback<T extends {}> = (configFactory: PipelineConfigFactory<T>) => PipelineConfigReturnValue<T>;

export type PipelineServiceConfigOption<T extends {}> = string | DeepPartial<PipelineConfig<T>> | PipelineConfigCallback<T>;
