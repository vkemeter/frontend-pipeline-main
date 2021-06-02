import ReadWriteStream = NodeJS.ReadWriteStream;

export type TaskFn<T> = (config: Exclude<T, false>) => ReadWriteStream;

export interface TaskDefinition<Tasks extends {}> {
    name: keyof Tasks,
    taskFn: TaskFn<Tasks[keyof Tasks]>
}
