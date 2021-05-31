import {Environment, PipelineConfig} from '../types/config/PipelineConfig';
import {PipelineConfigFactory} from './PipelineConfigFactory';
import {ConfigLoader} from './ConfigLoader';
import {DeepPartial} from '../types/DeepPartial';
import {TaskRegistry} from './TaskRegistry';

export type PipelineConfigOptionCallback = (configFactory: PipelineConfigFactory) => PipelineConfigFactory | PipelineConfig | void;
export type PipelineConfigOptions = string | DeepPartial<PipelineConfig> | PipelineConfigOptionCallback;

export class PipelineService {
    private static readonly DEFAULT_CONFIG_FILENAME = process.env.PIPELINE_CONFIG_FILENAME || 'pipeline.config.js';
    private static readonly DEFAULT_VARIABLES_FILENAME = process.env.PIPELINE_VARIABLES_FILENAME || 'variables.config.js';
    private static readonly DEFAULT_ENVIRONMENT = process.env.NODE_ENV === 'production' ? 'production' : 'development' as Environment;

    private readonly configLoader = new ConfigLoader<PipelineConfig | PipelineConfigFactory>();
    private readonly taskRegistry = new TaskRegistry();

    private config: PipelineConfig | undefined;
    private userConfig: PipelineConfigOptions = PipelineService.DEFAULT_CONFIG_FILENAME;

    setConfig(configOptions: PipelineConfigOptions) {
        this.userConfig = configOptions;
    }

    init() {
        this.config = this.loadConfig();
        this.loadTasks();
    }

    private loadConfig(): PipelineConfig {
        const configFactory = new PipelineConfigFactory({
            variablesFilename: PipelineService.DEFAULT_VARIABLES_FILENAME,
            environment: PipelineService.DEFAULT_ENVIRONMENT
        });
        let loadedConfig: DeepPartial<PipelineConfig> | PipelineConfigFactory | void;
        switch (typeof this.userConfig) {
            case 'string':
                loadedConfig = this.configLoader.loadConfig(this.userConfig, PipelineService.DEFAULT_CONFIG_FILENAME, configFactory);
                break;
            case 'function':
                loadedConfig = (<PipelineConfigOptionCallback>this.userConfig)(configFactory);
                break;
            default:
                loadedConfig = this.userConfig;
        }
        if(!loadedConfig) {
            return configFactory.build();
        }
        if(loadedConfig instanceof PipelineConfigFactory) {
            return loadedConfig.build();
        }
        return configFactory.build();
    }

    private loadTasks(): void {
        Object.entries(this.config!.tasks).forEach(([taskName, config]) => {
            if(!config) {
                return;
            }
            this.taskRegistry.get(taskName as keyof PipelineConfig['tasks']);
            // TODO: do something
        })
    }
}
