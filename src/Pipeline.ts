import {PipelineService} from './lib/PipelineService';

export type * from './lib/PipelineService';
export type * from './lib/ConfigLoader';
export type * from './lib/ContextFileHelper';

const pipeline = new PipelineService();
export default pipeline;
