import {Environment, PipelineConfig} from './types/config/PipelineConfig';
import {TaskMiscVariableConfig} from './types/tasks/MiscConfigTask';
import {TaskConfig} from './types/tasks/BaseTask';
import {TaskFrontendImageConfig} from './types/tasks/FrontendImageTask';
import {TaskFrontendJsConfig} from './types/tasks/FrontendJsTask';
import {TaskFrontendScssConfig} from './types/tasks/FrontendScssTask';
import * as path from 'path';

export interface DefaultTasks {
    'FRONTEND:SCSS': TaskFrontendScssConfig,
    'FRONTEND:JS': TaskFrontendJsConfig,
    'FRONTEND:IMAGES': TaskFrontendImageConfig,
    'FRONTEND:FONTS': TaskConfig,
    'BACKEND:JS': TaskConfig,
    'BACKEND:SCSS': TaskConfig,
    'MISC:CLEAN': {},
    'MISC:CONFIG': TaskMiscVariableConfig
}

export class DefaultConfig {
    private static readonly DEFAULT_SRC_FOLDER = process.env.PIPELINE_SRC_FOLDER || 'Src/';
    private static readonly DEFAULT_DEST_FOLDER = process.env.PIPELINE_DEST_FOLDER || '../Resources/Public/';
    private static readonly DEFAULT_VARIABLES_FILENAME = process.env.PIPELINE_VARIABLES_FILENAME || 'variables.config.js';
    private static readonly DEFAULT_ENVIRONMENT: Environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';
    private static readonly DEFAULT_TASK_PATH = process.env.PIPELINE_TASK_PATH || path.join(__dirname, './tasks');
    private static readonly DEFAULT_TASK_FILE_EXTENSION = process.env.PIPELINE_TASK_PATH || '.js';

    public static get(): PipelineConfig<DefaultTasks> {
        return {
            tasksPath: this.DEFAULT_TASK_PATH,
            tasksFileExtension: this.DEFAULT_TASK_FILE_EXTENSION,
            createGulpDevTasks: true,
            createDefaultGulpTask: true,
            gulpDevTasks: {
                buildTasks: [['FRONTEND:FONTS', 'FRONTEND:JS', 'FRONTEND:SCSS', 'FRONTEND:IMAGES', 'BACKEND:JS', 'BACKEND:SCSS'], ['MISC:CLEAN', 'MISC:CONFIG']],
                buildSequence: 'series'
            },
            environment: this.DEFAULT_ENVIRONMENT,
            tasks: {
                'BACKEND:JS': {
                    src: this.DEFAULT_SRC_FOLDER + 'JavaScript/Backend.js',
                    dest: this.DEFAULT_DEST_FOLDER + 'JavaScript'
                },
                'BACKEND:SCSS': {
                    src: this.DEFAULT_SRC_FOLDER + 'Scss/Backend/**/*.scss',
                    dest: this.DEFAULT_DEST_FOLDER + 'Css/Backend'
                },
                'FRONTEND:FONTS': {
                    src: this.DEFAULT_SRC_FOLDER + 'Fonts/**/*',
                    dest: this.DEFAULT_DEST_FOLDER + 'Webfonts'
                },
                'FRONTEND:IMAGES': {
                    src: this.DEFAULT_SRC_FOLDER + 'Images/**/*',
                    dest: this.DEFAULT_DEST_FOLDER + 'Images'
                },
                'FRONTEND:JS': {
                    src: this.DEFAULT_SRC_FOLDER + 'Javascript/Main.ts',
                    dest: this.DEFAULT_DEST_FOLDER + 'Javascript',
                    generateLegacyModule: true,
                    generateModernModule: true,
                    watchGlob: this.DEFAULT_SRC_FOLDER + 'Javascript/**/*'
                },
                'FRONTEND:SCSS': {
                    src: this.DEFAULT_SRC_FOLDER + 'Scss/Styles.scss',
                    dest: this.DEFAULT_DEST_FOLDER + 'Css',
                    watchGlob: this.DEFAULT_SRC_FOLDER + 'Scss/**/*'
                },
                'MISC:CLEAN': {},
                'MISC:CONFIG': {
                    configFile: this.DEFAULT_VARIABLES_FILENAME
                }
            },
            watcher: [
                {
                    glob: this.DEFAULT_SRC_FOLDER + 'Javascript/**/*.ts',
                    tasks: ['FRONTEND:JS']
                },
                {
                    glob: this.DEFAULT_SRC_FOLDER + 'Scss/**/*',
                    tasks: ['FRONTEND:SCSS', 'BACKEND:SCSS']
                }
            ]
        }
    }
}