import {Options as GifsicleOptions} from 'imagemin-gifsicle';
import {Options as SvgoOptions} from 'imagemin-svgo';
import {Options as OptipngOptions} from 'imagemin-optipng';
import {Options as MozjpegOptions} from 'imagemin-mozjpeg';
import {TaskConfig} from './BaseTask';

export interface TaskFrontendImageConfig extends TaskConfig {
    optimize: boolean,
    imagemin?: {
        gif?: false | GifsicleOptions,
        svg?: false | SvgoOptions,
        png?: false | OptipngOptions,
        jpg?: false | MozjpegOptions
    }
}
