import type {Options as GifsicleOptions} from 'imagemin-gifsicle';
import type {Options as MozjpegOptions} from 'imagemin-mozjpeg';
import type {Options as OptipngOptions} from 'imagemin-optipng';
import type {Options as SvgoOptions} from 'imagemin-svgo';

export interface TaskConfig {
    src: string,
    dest: string
}

export interface WatchableTaskConfig extends TaskConfig {
    watchGlob: string
}

export interface TaskFrontendScssConfig extends Omit<WatchableTaskConfig, 'src'> {
    src: string | string[]
}

export interface TaskFrontendJsConfig extends WatchableTaskConfig {
    generateModernModule: boolean,
    generateLegacyModule: boolean
}

export interface TaskFrontendImageConfig extends TaskConfig {
    optimize: boolean,
    imagemin?: {
        gif?: false | GifsicleOptions,
        svg?: false | SvgoOptions,
        png?: false | OptipngOptions,
        jpg?: false | MozjpegOptions
    }
}

export interface TaskMiscCleanConfig {
}

export interface TaskMiscVariableConfig {
    configFile: string
}

export interface PipelineConfig {
    autoloadGulpTasks?: boolean,
    createGulpDevTasks?: boolean,
    environment: 'development' | 'production',
    tasks: {
        'FRONTEND:SCSS': false | TaskFrontendScssConfig,
        'FRONTEND:JS': false | TaskFrontendJsConfig,
        'FRONTEND:IMAGES': false | TaskFrontendImageConfig,
        'FRONTEND:FONTS': false | TaskConfig,
        'BACKEND:JS': false | TaskConfig,
        'BACKEND:SCSS': false | TaskConfig,
        'MISC:CLEAN': false | TaskMiscCleanConfig,
        'MISC:CONFIG': false | TaskMiscVariableConfig
    }
}
