import {WatchableTaskConfig} from './BaseTask';

export interface TaskFrontendJsConfig extends WatchableTaskConfig {
    generateModernModule: boolean,
    generateLegacyModule: boolean
}
