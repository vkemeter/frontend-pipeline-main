import {TaskFunction} from 'gulp';

export type TaskFunctionGenerator<T> = (config: T) => TaskFunction;

export type TaskFunctionDefinition<Tasks extends {}, Key extends keyof Tasks> = TaskFunctionGenerator<Tasks[Key]> & {
    name: Key
}
