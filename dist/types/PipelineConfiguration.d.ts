import { BaseConfiguration } from './abstract/BaseConfiguration';
export interface PipelineConfiguration extends BaseConfiguration {
    readonly SCHEMA: 'PipelineConfiguration';
    autoloadGulpTasks?: boolean;
}
