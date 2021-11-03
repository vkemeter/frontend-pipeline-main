import {PipelineService} from './lib/PipelineService';
import {DefaultConfig} from './DefaultConfig';

const defaultConfig = DefaultConfig.get();
const pipeline = new PipelineService(defaultConfig);

export = pipeline;
