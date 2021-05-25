import {PipelineConfig} from '../types/config/PipelineConfig';

export class PipelineConfigFactory {
    private static readonly DEFAULT_SRC_FOLDER = 'Src/';
    private static readonly DEFAULT_DEST_FOLDER = '../Resources/Public/';

    constructor() {
    }

    build(): PipelineConfig {
        return {} as PipelineConfig
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
