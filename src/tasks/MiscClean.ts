import {TaskConfig} from '../types/tasks/BaseTask'
import {TaskFunctionGenerator} from '../types/Tasks'
import {TaskCallback} from 'undertaker'
import del from 'del'

const taskGenerator: TaskFunctionGenerator<TaskConfig, {}> = (_, pipelineConfig) => {
    return async (done: TaskCallback) => {
        const taskConfigs: Partial<TaskConfig>[] = Object.values(pipelineConfig.tasks);
        const pathsToDelete = taskConfigs
            .filter(taskConfig => taskConfig.enabled !== false && !!taskConfig.dest)
            .map(taskConfig => taskConfig.dest);

        try {
            await del(pathsToDelete as string[], {force: true});
            done()
        } catch (err) {
            done(new Error(err as string))
        }
    }
}

export = taskGenerator;
