import {
    PipelineConfig,
    PipelineConfigCallback,
    PipelineConfigReturnValue,
    PipelineServiceConfigOption
} from '../types/config/PipelineConfig';
import {PipelineConfigFactory} from './PipelineConfigFactory';
import {ConfigLoader} from './ConfigLoader';
import {TaskRegistry} from './TaskRegistry';

export class PipelineService<Tasks extends {}> {
    private static readonly DEFAULT_CONFIG_FILENAME = process.env.PIPELINE_CONFIG_FILENAME || 'pipeline.config.js';

    private readonly configLoader = new ConfigLoader<PipelineConfigReturnValue<Tasks>>();
    private readonly taskRegistry = new TaskRegistry<Tasks>();

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
        Object.entries(this.pipelineConfig!.tasks).forEach(([taskName, config]) => {
            if(!config) {
                return;
            }
            this.taskRegistry.get(taskName as keyof PipelineConfig<Tasks>['tasks']);
            // TODO: do something
        })
    }
}
