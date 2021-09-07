import {Options as GifsicleOptions} from 'imagemin-gifsicle'
import {Options as OptipngOptions} from 'imagemin-optipng'
import {Options as MozjpegOptions} from 'imagemin-mozjpeg'
import {TaskConfig} from './BaseTask'

export interface TaskFrontendImageConfig extends TaskConfig {
    imagemin?: {
        gif?: boolean | GifsicleOptions,
        png?: boolean | OptipngOptions,
        jpg?: boolean | MozjpegOptions
    }
}
