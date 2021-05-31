import * as fs from 'fs';
import * as path from 'path';
import {PipelineConfig} from '../types/config/PipelineConfig';
import {TaskDefinition, TaskFn} from '../types/TaskDefinition';
import {keys} from 'ts-transformer-keys';

type TasksHolder = {
    [key in keyof PipelineConfig['tasks']]?: TaskFn<key>;
}

export interface TaskRegistryConstructorOptions {
    taskPath: string,
    taskFileExtension: string
}

export class TaskRegistry {
    private static readonly TASK_PATH = '../tasks/';
    private static readonly TASK_FILE_EXTENSION = '.ts';

    private readonly taskPath: string;
    private readonly taskFileExtension: string;
    private taskHolder: TasksHolder = {};

    constructor({taskPath, taskFileExtension}: Partial<TaskRegistryConstructorOptions> = {}) {
        this.taskPath = taskPath || TaskRegistry.TASK_PATH;
        this.taskFileExtension = taskFileExtension || TaskRegistry.TASK_FILE_EXTENSION;

        this.loadAllTasks();
    }

    get<T extends keyof PipelineConfig['tasks']>(taskName: T): TaskFn<T> | undefined {
        if(this.taskHolder.hasOwnProperty(taskName)) {
            return this.taskHolder[taskName] as TaskFn<T>;
        }
        return undefined;
    }

    private loadAllTasks() {
        const absoluteTaskPath = path.join(__dirname, this.taskPath);
        const foundTaskFiles = fs.readdirSync(absoluteTaskPath);
        foundTaskFiles.forEach(fileName => {
            const fileExtension = path.extname(fileName);
            if(fileExtension !== this.taskFileExtension) {
                return;
            }
            const filePath = path.join(absoluteTaskPath, fileName);
            const taskDefinition = require(filePath);
            if(!TaskRegistry.isTaskDefinition(taskDefinition)) {
                throw new Error(`Unexpected content in file ${fileName}. Expected TaskDefinition but got: ${taskDefinition}`);
            }
            this.taskHolder[taskDefinition.name] = taskDefinition.taskFn;
        });
    }

    private static isTaskDefinition<T extends keyof PipelineConfig['tasks']>(task: unknown): task is TaskDefinition<T> {
        const isTypeValid = typeof task === 'object'
            && typeof (<Partial<TaskDefinition<T>>>task).name === 'string'
            && typeof (<Partial<TaskDefinition<T>>>task).taskFn === 'function';
        if(!isTypeValid) {
            return false;
        }
        const allowedNames = keys<PipelineConfig['tasks']>();
        return allowedNames.includes((<TaskDefinition<T>>task).name);
    }
}
