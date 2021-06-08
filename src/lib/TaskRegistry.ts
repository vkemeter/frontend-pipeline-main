import * as fs from 'fs';
import * as path from 'path';
import {keys} from 'ts-transformer-keys';
import {ContextFileHelper} from './ContextFileHelper';
import {TaskFunctionDefinition} from '../types/Tasks';

type TasksHolder<Tasks extends {}> = {
    [Key in keyof Tasks]?: TaskFunctionDefinition<Tasks, Key>
}

export interface TaskRegistryConstructorOptions {
    taskPath: string | string[],
    taskFileExtension: string | string[]
}

export class TaskRegistry<Tasks extends {}> {
    private static readonly DEFAULT_TASK_PATH = process.env.PIPELINE_TASK_PATH || path.join(__dirname, '../tasks');
    private static readonly DEFAULT_TASK_FILE_EXTENSION = '.ts';

    private readonly taskPaths: string[];
    private readonly taskFileExtensions: string[];
    private taskHolder: TasksHolder<Tasks> = {};

    constructor({taskPath = TaskRegistry.DEFAULT_TASK_PATH, taskFileExtension = TaskRegistry.DEFAULT_TASK_FILE_EXTENSION}: Partial<TaskRegistryConstructorOptions> = {}) {
        this.taskPaths = Array.isArray(taskPath) ? taskPath : [taskPath];
        this.taskFileExtensions = Array.isArray(taskFileExtension) ? taskFileExtension : [taskFileExtension];

        this.loadAllTasks();
    }

    get<T extends keyof Tasks>(taskName: T): TasksHolder<Tasks>[T] {
        if(this.taskHolder.hasOwnProperty(taskName)) {
            return this.taskHolder[taskName];
        }
        return undefined;
    }

    private loadAllTasks() {
        this.taskPaths.forEach(taskPath => this.loadAllTasksFromDirectory(taskPath));
    }

    private loadAllTasksFromDirectory(taskPath: string) {
        const absoluteTaskPath = ContextFileHelper.getContextFilepath(taskPath);
        const foundTaskFiles = fs.readdirSync(absoluteTaskPath);
        foundTaskFiles.forEach(fileName => {
            const fileExtension = path.extname(fileName);
            if(!this.taskFileExtensions.includes(fileExtension)) {
                return;
            }
            const filePath = path.join(absoluteTaskPath, fileName);
            const taskDefinition = require(filePath);
            if(!this.isTaskDefinition(taskDefinition)) {
                throw new Error(`Unexpected content in file ${fileName}. Expected TaskDefinition but got: ${taskDefinition}`);
            }
            this.taskHolder[taskDefinition.name] = taskDefinition;
        });
    }

    private isTaskDefinition<Key extends keyof Tasks>(task: any | Key): task is TaskFunctionDefinition<Tasks, Key> {
        const isTypeValid = typeof task === 'object'
            && typeof task.name === 'string'
            && typeof task === 'function';
        if(!isTypeValid) {
            return false;
        }
        const allowedNames = keys<Tasks>();
        return allowedNames.includes(task.name);
    }
}
