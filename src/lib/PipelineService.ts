import {PipelineConfig} from '../types/config/PipelineConfig';
import {ConfigValidator} from './ConfigValidator';
import {PipelineConfigFactory} from './PipelineConfigFactory';
import {ConfigLoader} from './ConfigLoader';
import {merge} from 'lodash';

export type PipelineConfigOptionCallback = (configFactory: PipelineConfigFactory) => PipelineConfigFactory | PipelineConfig | void;
export type PipelineConfigOptions = string | PipelineConfig | PipelineConfigOptionCallback;

export class PipelineService {
    private static readonly DEFAULT_CONFIG_FILENAME = process.env.PIPELINE_CONFIG_FILENAME || 'pipeline.config.js';

    private readonly configValidator = new ConfigValidator<PipelineConfig>('PipelineConfig');
    private readonly configLoader = new ConfigLoader<PipelineConfig>();

    private config: PipelineConfig | undefined;
    private configOptions: PipelineConfigOptions = PipelineService.DEFAULT_CONFIG_FILENAME;

    setConfig(configOptions: PipelineConfigOptions) {
        this.configOptions = configOptions;
    }

    run() {
        this.loadAndValidateConfig();
        console.log(this.config);
    }

    private loadAndValidateConfig() {
        const defaultConfig = PipelineService.getDefaultPipelineConfiguration();
        const loadedConfig = this.getConfigFromConfigOptions();
        const isConfigValid = this.configValidator.validate(loadedConfig);
        if(!isConfigValid) {
            throw new Error('Invalid config');
        }
        this.config = merge({}, defaultConfig, loadedConfig);
    }

    private getConfigFromConfigOptions(): PipelineConfig {
        switch (typeof this.configOptions) {
            case 'string':
                return this.configLoader.loadConfig(this.configOptions);
            case 'function':
                return  PipelineService.getConfigFromCallback(this.configOptions);
            default:
                return this.configOptions;
        }
    }

    private static getConfigFromCallback(callback: PipelineConfigOptionCallback): PipelineConfig {
        const configFactory = new PipelineConfigFactory();
        const callbackReturn = callback(configFactory);
        if (callbackReturn) {
            if (callbackReturn instanceof PipelineConfigFactory) {
                return callbackReturn.build();
            }
            return callbackReturn;
        }
        return configFactory.build();
    }

    private static getDefaultPipelineConfiguration(): PipelineConfig {
        return {
            autoloadGulpTasks: true
        };
    }
}
