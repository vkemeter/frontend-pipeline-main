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
import * as gulp from 'gulp';
import {Task, TaskFunction} from 'undertaker';
import {TaskConfig} from '../types/tasks/BaseTask'

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

    get buildTaskName(): string {
        return this.pipelineConfig?.gulpDevTasks.buildTaskName || PipelineService.DEFAULT_BUILD_TASKNAME;
    }

    get watchTaskName(): string {
        return this.pipelineConfig?.gulpDevTasks.watchTaskName || PipelineService.DEFAULT_WATCH_TASKNAME;
    }

    setConfig(configOptions: PipelineServiceConfigOption<Tasks>): void {
        this.userConfigOption = configOptions;
    }

    init() {
        this.loadConfig();
        this.loadTasks();
        if (this.pipelineConfig?.createGulpDevTasks) {
            this.createDevTasks();
            this.createWatchTask();
            if (this.pipelineConfig?.createDefaultGulpTask) {
                this.createDefaultTask();
            }
        }
    }

    private loadConfig(): void {
        const configFactory = new PipelineConfigFactory(this.defaultPipelineConfig);
        const loadedConfig = this.getConfigFromUserSetting(configFactory);
        if (loadedConfig instanceof PipelineConfigFactory) {
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
        if (this.pipelineConfig?.tasks) {
            const taskRegistry = new TaskRegistry<Tasks>({
                taskPath: this.pipelineConfig?.tasksPath,
                taskFileExtension: this.pipelineConfig?.tasksFileExtension,
            });
            const enabledTasks = Object.keys(this.pipelineConfig.tasks).filter(taskName => {
                const config = this.pipelineConfig!.tasks[<keyof Tasks>taskName] as TaskConfig | false;
                return !(!config || config.enabled === false);
            });
            enabledTasks.forEach((key) => {
                const config = this.pipelineConfig!.tasks[<keyof Tasks>key];
                const taskGenerator = taskRegistry.get(<keyof Tasks>key);
                if (!taskGenerator) {
                    console.warn(`Configuration set for task ${key} but no task definition was found`);
                    return;
                }
                const buildFunction = taskGenerator(config as any);
                gulp.task(key, buildFunction);
            });
        }
    }

    private createWatchTask(): void {
        gulp.task(this.watchTaskName, () => {
            if (this.pipelineConfig?.watcher) {
                this.pipelineConfig!.watcher.forEach(watchConfig => {
                    const watchTasks = Array.isArray(watchConfig.tasks) ? watchConfig.tasks as string[] : [watchConfig.tasks] as string[];
                    gulp.watch(watchConfig.glob, this.pipelineConfig!.gulpDevTasks.watchOptions, watchConfig.sequence === 'series' ? gulp.series(...watchTasks) : gulp.parallel(...watchTasks));
                });
            }
        });
    }

    private createDevTasks(): void {
        const buildTaskChain = this.getGulpTaskChainFromDefinition(this.pipelineConfig!.gulpDevTasks.buildTasks);
        if(buildTaskChain) {
            gulp.task(this.buildTaskName, buildTaskChain);
        }
    }

    private getGulpTaskChainFromDefinition(definition: Array<DevTaskDefinition<Tasks>>, series: boolean = false): TaskFunction | undefined {
        if (!Array.isArray(definition)) {
            throw new Error(`Expected array to create task chain. Got ${definition}`);
        }
        const taskChain = definition.map(task => {
            if (Array.isArray(task)) {
                return this.getGulpTaskChainFromDefinition(task, !series);
            }
            if(this.pipelineConfig?.tasks[task]) {
                return task as string;
            }
            return undefined;
        }).filter(task => !!task) as Task[];

        if(taskChain.length) {
            if (series) {
                return gulp.series(...taskChain);
            }
            return gulp.parallel(...taskChain);
        }
        return undefined;
    }

    private createDefaultTask(): void {
        gulp.task('default', gulp.series(this.buildTaskName));
    }
}
