import {TaskDefinition} from './types/TaskDefinition';

declare module '*.task.js' {
    export default TaskDefinition;
}
