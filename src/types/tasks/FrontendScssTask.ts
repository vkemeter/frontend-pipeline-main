import {WatchableTaskConfig} from './BaseTask';

export interface TaskFrontendScssConfig extends Omit<WatchableTaskConfig, 'src'> {
    src: string | string[]
}
