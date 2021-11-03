import {Environment, PipelineConfig} from '../types/config/PipelineConfig'
import {cloneDeep, mergeWith} from 'lodash'
import {DeepPartial} from '../types/DeepPartial'

export class PipelineConfigFactory<T extends {}> {
    private defaultConfig: PipelineConfig<T>
    private currentConfig: PipelineConfig<T>

    constructor (defaultConfig: PipelineConfig<T>) {
        this.defaultConfig = defaultConfig
        this.currentConfig = cloneDeep(defaultConfig)
    }

    enableGulpDevTasks (): this {
        this.currentConfig.createGulpDevTasks = true
        return this
    }

    disableGulpDevTasks (): this {
        this.currentConfig.createGulpDevTasks = false
        return this
    }

    environment (env: Environment): this {
        this.currentConfig.environment = env
        return this
    }

    devEnvironment (): this {
        this.currentConfig.environment = 'development'
        return this
    }

    prodEnvironment (): this {
        this.currentConfig.environment = 'production'
        return this
    }

    disableTask (task: keyof T): this {
        this.currentConfig.tasks[task] = false
        return this
    }

    enableTask (task: keyof T): this {
        this.currentConfig.tasks[task] = cloneDeep(this.defaultConfig.tasks[task])
        return this
    }

    configureTask<K extends keyof T> (task: K, settings: Exclude<T[K], false>): this {
        mergeWith(this.currentConfig.tasks[task], settings, PipelineConfigFactory.mergeCustomizer)
        return this
    }

    merge (config?: DeepPartial<PipelineConfig<T>>): this {
        mergeWith(this.currentConfig, config, PipelineConfigFactory.mergeCustomizer)
        return this
    }

    mergeFactory (factory: PipelineConfigFactory<T>): this {
        mergeWith(this.currentConfig, factory.build(), PipelineConfigFactory.mergeCustomizer)
        return this
    }

    build (): PipelineConfig<T> {
        return this.currentConfig
    }

    private static mergeCustomizer<A extends unknown, B extends unknown> (a: A, b: B): A | void {
        if (b === true && a !== null && typeof a === 'object') {
            return a;
        }
    }
}
