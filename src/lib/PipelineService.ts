import {
    DevTaskDefinition,
    PipelineConfig,
    PipelineConfigCallback,
    PipelineConfigReturnValue,
    PipelineServiceConfigOption
} from '../types/config/PipelineConfig';
import {PipelineConfigFactory} from './PipelineConfigFactory';
import {ConfigLoader} from './ConfigLoader';
import {TaskRegistry} from './TaskRegistry';
import gulp from 'gulp';
import {TaskFunction, Task} from 'undertaker';

export class PipelineService<Tasks extends {}> {
    private static readonly DEFAULT_CONFIG_FILENAME = process.env.PIPELINE_CONFIG_FILENAME || 'pipeline.config.js';
    private static readonly DEFAULT_BUILD_TASKNAME = 'build';
    private static readonly DEFAULT_WATCH_TASKNAME = 'watch';

    private readonly configLoader = new ConfigLoader<PipelineConfigReturnValue<Tasks>>();

    private defaultPipelineConfig: PipelineConfig<Tasks>
    private pipelineConfig?: PipelineConfig<Tasks>;
    private userConfigOption: PipelineServiceConfigOption<Tasks> = PipelineService.DEFAULT_CONFIG_FILENAME;

    constructor(defaultConfig: PipelineConfig<Tasks>) {
        this.defaultPipelineConfig = defaultConfig;
    }

    setConfig(configOptions: PipelineServiceConfigOption<Tasks>) {
        this.userConfigOption = configOptions;
    }

    init() {
        this.loadConfig();
        this.loadTasks();
        if(this.pipelineConfig?.createGulpDevTasks) {
            this.createDevTasks();
            if(this.pipelineConfig?.createDefaultGulpTask) {
                this.createDefaultTask();
            }
        }
    }

    private loadConfig(): void {
        const configFactory = new PipelineConfigFactory(this.defaultPipelineConfig);
        const loadedConfig = this.getConfigFromUserSetting(configFactory);
        if(loadedConfig instanceof PipelineConfigFactory) {
            configFactory.mergeFactory(loadedConfig);
        } else {
            configFactory.merge(loadedConfig);
        }
        this.pipelineConfig = configFactory.build();
    }

    private getConfigFromUserSetting(configFactory: PipelineConfigFactory<Tasks>): PipelineConfigReturnValue<Tasks> {
        switch (typeof this.userConfigOption) {
            case 'string':
                return this.configLoader.loadConfig(this.userConfigOption, PipelineService.DEFAULT_CONFIG_FILENAME, configFactory);
            case 'function':
                return (<PipelineConfigCallback<Tasks>>this.userConfigOption)(configFactory);
            default:
                return this.userConfigOption;
        }
    }

    private loadTasks(): void {
        const taskRegistry = new TaskRegistry<Tasks>({
            taskPath: this.pipelineConfig?.tasksPath,
            taskFileExtension: this.pipelineConfig?.tasksFileExtension
        });
        if(this.pipelineConfig?.tasks) {
            for (const key in this.pipelineConfig.tasks) {
                if (this.pipelineConfig.tasks.hasOwnProperty(key)) {
                    const config = this.pipelineConfig.tasks[key];
                    if (!config) {
                        return;
                    }
                    const taskGenerator = taskRegistry.get(key);
                    if (!taskGenerator) {
                        console.warn(`Configuration set for task ${key} but no task definition was found`);
                        return;
                    }
                    const taskFunction = taskGenerator(config as Tasks[typeof key]);
                    gulp.task(key, taskFunction);
                }
            }
        }
    }

    private createDevTasks(): void {
        const buildTaskChain = this.getGulpTaskChainFromDefinition(this.pipelineConfig!.gulpDevTasks.buildTasks);
        const watchTaskChain = this.getGulpTaskChainFromDefinition(this.pipelineConfig!.gulpDevTasks.watchTasks);
        gulp.task(this.pipelineConfig!.gulpDevTasks.buildTaskName || PipelineService.DEFAULT_BUILD_TASKNAME, buildTaskChain);
        gulp.task(this.pipelineConfig!.gulpDevTasks.watchTaskName || PipelineService.DEFAULT_WATCH_TASKNAME, watchTaskChain);
    }

    private getGulpTaskChainFromDefinition(definition: Array<DevTaskDefinition<Tasks>>, series: boolean = false): TaskFunction {
        if(!Array.isArray(definition)) {
            throw new Error(`Expected array to create task chain. Got ${definition}`);
        }
        const taskChain = definition.map<Task>(task => {
            if(Array.isArray(task)) {
                return this.getGulpTaskChainFromDefinition(task, !series);
            }
            return task as string;
        });
        if(series) {
            return gulp.series(...taskChain);
        }
        return gulp.parallel(...taskChain);
    }

    private createDefaultTask(): void {
        gulp.task('default', gulp.series(this.pipelineConfig!.gulpDevTasks.buildTaskName));
    }
}
