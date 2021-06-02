import * as fs from 'fs';
import * as path from 'path';
import {TaskDefinition, TaskFn} from '../types/TaskDefinition';
import {keys} from 'ts-transformer-keys';
import {ContextFileHelper} from './ContextFileHelper';

type TasksHolder<Tasks extends {}> = {
    [Key in keyof Tasks]?: TaskFn<Tasks[Key]>;
}

export interface TaskRegistryConstructorOptions {
    taskPath: string,
    taskFileExtension: string
}

export class TaskRegistry<Tasks extends {}> {
    private static readonly TASK_PATH = process.env.PIPELINE_TASK_PATH || path.join(__dirname, '../tasks');
    private static readonly TASK_FILE_EXTENSION = '.ts';

    private readonly taskPath: string;
    private readonly taskFileExtension: string;
    private taskHolder: TasksHolder<Tasks> = {};

    constructor({taskPath, taskFileExtension}: Partial<TaskRegistryConstructorOptions> = {}) {
        this.taskPath = taskPath || TaskRegistry.TASK_PATH;
        this.taskFileExtension = taskFileExtension || TaskRegistry.TASK_FILE_EXTENSION;

        this.loadAllTasks();
    }

    get<T extends keyof Tasks>(taskName: T): TaskFn<Tasks[T]> | undefined {
        if(this.taskHolder.hasOwnProperty(taskName)) {
            return this.taskHolder[taskName];
        }
        return undefined;
    }

    private loadAllTasks() {
        const absoluteTaskPath = ContextFileHelper.getContextFilepath(this.taskPath);
        const foundTaskFiles = fs.readdirSync(absoluteTaskPath);
        foundTaskFiles.forEach(fileName => {
            const fileExtension = path.extname(fileName);
            if(fileExtension !== this.taskFileExtension) {
                return;
            }
            const filePath = path.join(absoluteTaskPath, fileName);
            const taskDefinition = require(filePath);
            if(!this.isTaskDefinition(taskDefinition)) {
                throw new Error(`Unexpected content in file ${fileName}. Expected TaskDefinition but got: ${taskDefinition}`);
            }
            this.taskHolder[taskDefinition.name] = taskDefinition.taskFn;
        });
    }

    private isTaskDefinition(task: any): task is TaskDefinition<Tasks> {
        const isTypeValid = typeof task === 'object'
            && typeof task.name === 'string'
            && typeof task.taskFn === 'function';
        if(!isTypeValid) {
            return false;
        }
        const allowedNames = keys<Tasks>();
        return allowedNames.includes(task.name);
    }
}
