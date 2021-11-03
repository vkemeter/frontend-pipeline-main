import {TaskFunctionGenerator} from '../types/Tasks'
import {TaskCallback} from 'undertaker'
import {TaskMiscVariableConfig} from '../types/tasks/MiscConfigTask'
import {ConfigLoader} from '../lib/ConfigLoader'
import {VariableConfig} from '../types/config/VariableConfig'
import {VariableGenerator} from '../lib/VariableGenerator'

const taskGenerator: TaskFunctionGenerator<TaskMiscVariableConfig, {}> = (config) => {
    const configLoader = new ConfigLoader<VariableConfig>();
    const variableGenerator = new VariableGenerator();

    return async (done: TaskCallback) => {
        const variables = configLoader.loadConfig('./', config.configFile);
        console.log(variables);
        variableGenerator.generate(variables);
        done();
    }
}

export = taskGenerator;
