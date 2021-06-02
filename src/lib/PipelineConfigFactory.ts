import {Environment, PipelineConfig} from '../types/config/PipelineConfig';
import {cloneDeep, merge} from 'lodash';
import {DeepPartial} from '../types/DeepPartial';

export class PipelineConfigFactory<T extends {}> {
    private defaultConfig: PipelineConfig<T>;
    private currentConfig: PipelineConfig<T>;

    constructor(defaultConfig: PipelineConfig<T>) {
        this.defaultConfig = defaultConfig;
        this.currentConfig = cloneDeep(defaultConfig);
    }

    enableGulpDevTasks(): this {
        this.currentConfig.createGulpDevTasks = true;
        return this;
    }

    disableGulpDevTasks(): this {
        this.currentConfig.createGulpDevTasks = false;
        return this;
    }

    environment(env: Environment): this {
        this.currentConfig.environment = env;
        return this;
    }

    devEnvironment(): this {
        this.currentConfig.environment = 'development';
        return this;
    }

    prodEnvironment(): this {
        this.currentConfig.environment = 'production';
        return this;
    }

    disableTask(task: keyof T): this {
        this.currentConfig.tasks[task] = false;
        return this;
    }

    enableTask(task: keyof T): this {
        this.currentConfig.tasks[task] = cloneDeep(this.defaultConfig.tasks[task]);
        return this;
    }

    configureTask<K extends keyof T>(task: K, settings: Exclude<T[K], false>): this {
        merge(this.currentConfig.tasks[task], settings);
        return this;
    }

    merge(config?: DeepPartial<PipelineConfig<T>>): this {
        merge(this.currentConfig, config);
        return this;
    }

    mergeFactory(factory: PipelineConfigFactory<T>): this {
        merge(this.currentConfig, factory.build());
        return this;
    }

    build(): PipelineConfig<T> {
        return this.currentConfig;
    }
}
