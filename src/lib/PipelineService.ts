import {PipelineConfig} from '../types/config/PipelineConfig';
import {PipelineConfigFactory} from './PipelineConfigFactory';
import {ConfigLoader} from './ConfigLoader';
import {DeepPartial} from '../types/DeepPartial';

export type PipelineConfigOptionCallback = (configFactory: PipelineConfigFactory) => PipelineConfigFactory | PipelineConfig | void;
export type PipelineConfigOptions = string | DeepPartial<PipelineConfig> | PipelineConfigOptionCallback;

export class PipelineService {
    private static readonly DEFAULT_CONFIG_FILENAME = process.env.PIPELINE_CONFIG_FILENAME || 'pipeline.config.js';
    private static readonly DEFAULT_VARIABLES_FILENAME = process.env.PIPELINE_VARIABLES_FILENAME || 'variables.config.js';

    private readonly configLoader = new ConfigLoader<PipelineConfig | PipelineConfigFactory>();

    private config: PipelineConfig | undefined;
    private userConfig: PipelineConfigOptions = PipelineService.DEFAULT_CONFIG_FILENAME;

    setConfig(configOptions: PipelineConfigOptions) {
        this.userConfig = configOptions;
    }

    init() {
        this.loadConfig();
        console.log(this.config);
    }

    private loadConfig(): PipelineConfig {
        const configFactory = new PipelineConfigFactory();
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
}
