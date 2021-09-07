import {PipelineService} from './lib/PipelineService';
import {DefaultConfig} from './DefaultConfig';

export * from './lib/PipelineService';
export * from './lib/ConfigLoader';
export * from './lib/ContextFileHelper';
export * from './DefaultConfig';

const defaultConfig = DefaultConfig.get();
const pipeline = new PipelineService(defaultConfig);

export default pipeline;
