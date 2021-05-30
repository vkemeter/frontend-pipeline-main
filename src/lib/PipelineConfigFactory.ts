import {Environment, PipelineConfig, TaskMiscVariableConfig} from '../types/config/PipelineConfig';
import {merge, cloneDeep} from 'lodash';

export interface PipelineConfigFactoryConstructorOptions {
    variablesFilename: string,
    environment: Environment
}

export class PipelineConfigFactory {
    private static readonly DEFAULT_SRC_FOLDER = 'Src/';
    private static readonly DEFAULT_DEST_FOLDER = '../Resources/Public/';

    private defaultConfig = PipelineConfigFactory.getDefaultPipelineConfiguration();
    private currentConfig: PipelineConfig;

    constructor({variablesFilename, environment}: PipelineConfigFactoryConstructorOptions) {
        this.currentConfig = merge({}, this.defaultConfig);
        this.currentConfig.environment = environment;
        (this.currentConfig.tasks['MISC:CONFIG'] as TaskMiscVariableConfig).configFile = variablesFilename;
    }

    enableGulpAutoload(): PipelineConfigFactory {
        this.currentConfig.autoloadGulpTasks = true;
        return this;
    }

    disableGulpAutoload(): PipelineConfigFactory {
        this.currentConfig.autoloadGulpTasks = false;
        return this;
    }

    enableGulpDevTasks(): PipelineConfigFactory {
        this.currentConfig.createGulpDevTasks = true;
        return this;
    }

    disableGulpDevTasks(): PipelineConfigFactory {
        this.currentConfig.createGulpDevTasks = false;
        return this;
    }

    environment(env: 'development' | 'production'): PipelineConfigFactory {
        this.currentConfig.environment = env;
        return this;
    }

    devEnvironment(): PipelineConfigFactory {
        this.currentConfig.environment = 'development';
        return this;
    }

    prodEnvironment(): PipelineConfigFactory {
        this.currentConfig.environment = 'production';
        return this;
    }

    disableTask(task: keyof PipelineConfig['tasks']): PipelineConfigFactory {
        this.currentConfig.tasks[task] = false;
        return this;
    }

    enableTask<T extends keyof PipelineConfig['tasks']>(task: T): PipelineConfigFactory {
        this.currentConfig.tasks[task] = cloneDeep(this.defaultConfig.tasks[task]);
        return this;
    }

    configureTask<T extends keyof PipelineConfig['tasks']>(task: T, settings: Exclude<PipelineConfig['tasks'][T], false>): PipelineConfigFactory {
        merge(this.currentConfig.tasks[task], settings);
        return this;
    }

    build(): PipelineConfig {
        return this.currentConfig;
    }

    private static getDefaultPipelineConfiguration(): PipelineConfig {
        return {
            autoloadGulpTasks: true,
            createGulpDevTasks: true,
            environment: 'development',
            tasks: {
                'BACKEND:JS': {
                    src: PipelineConfigFactory.DEFAULT_SRC_FOLDER + 'JavaScript/Backend.js',
                    dest: PipelineConfigFactory.DEFAULT_DEST_FOLDER + 'JavaScript'
                },
                'BACKEND:SCSS': {
                    src: PipelineConfigFactory.DEFAULT_SRC_FOLDER + 'Scss/Backend/**/*.scss',
                    dest: PipelineConfigFactory.DEFAULT_DEST_FOLDER + 'Css/Backend'
                },
                'FRONTEND:FONTS': {
                    src: PipelineConfigFactory.DEFAULT_SRC_FOLDER + 'Fonts/**/*',
                    dest: PipelineConfigFactory.DEFAULT_DEST_FOLDER + 'Webfonts'
                },
                'FRONTEND:IMAGES': {
                    src: PipelineConfigFactory.DEFAULT_SRC_FOLDER + 'Images/**/*',
                    dest: PipelineConfigFactory.DEFAULT_DEST_FOLDER + 'Images',
                    optimize: true
                },
                'FRONTEND:JS': {
                    src: PipelineConfigFactory.DEFAULT_SRC_FOLDER + 'Javascript/Main.ts',
                    dest: PipelineConfigFactory.DEFAULT_DEST_FOLDER + 'Javascript',
                    generateLegacyModule: true,
                    generateModernModule: true,
                    watchGlob: PipelineConfigFactory.DEFAULT_SRC_FOLDER + 'Javascript/**/*'
                },
                'FRONTEND:SCSS': {
                    src: PipelineConfigFactory.DEFAULT_SRC_FOLDER + 'Scss/Styles.scss',
                    dest: PipelineConfigFactory.DEFAULT_DEST_FOLDER + 'Css',
                    watchGlob: PipelineConfigFactory.DEFAULT_SRC_FOLDER + 'Scss/**/*'
                },
                'MISC:CLEAN': {},
                'MISC:CONFIG': {
                    configFile: ''
                }
            }
        }
    }
}
