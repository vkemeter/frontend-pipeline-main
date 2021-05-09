import {PipelineConfig} from '../types/config/PipelineConfig';

export class PipelineConfigFactory {
    constructor() {
    }

    build(): PipelineConfig {
        return {
            autoloadGulpTasks: true
        }
    }
}
