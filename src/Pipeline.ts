import {PipelineConfiguration} from './types/PipelineConfiguration';
import {ContextFileHelper} from './libs/ContextFileHelper';

export default class Pipeline {
    private static readonly DEFAULT_CONFIG_FILENAME = process.env.PIPELINE_CONFIG_FILENAME || 'pipeline.config.js';

    private readonly config: PipelineConfiguration;

    constructor(config?: string | PipelineConfiguration) {
        if(typeof config !== 'object') {
            config = Pipeline.loadConfigFromFile(config || Pipeline.DEFAULT_CONFIG_FILENAME);
        }
        this.config = config;
    }

    registerGulpTasks() {
        // TODO: do the magic something here
    }

    private static loadConfigFromFile(configPath: string): PipelineConfiguration {
        const absoluteConfigPath = ContextFileHelper.getContextFilepath(configPath);
        const config = require(absoluteConfigPath);
        if(typeof config === 'function') {
            // TODO: inject configFactory here
            return config();
        }
        return config
    }
}
