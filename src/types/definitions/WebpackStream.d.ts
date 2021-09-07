/*
declare module 'webpack-stream' {
    import * as webpack from 'webpack'
    import {Compilation} from 'webpack'

    interface CallbackFunction<T> {
        (err?: Error, result?: T): any;
    }

    export default function webpackStream(
        config?: webpack.Configuration,
        wp?: typeof webpack,
        callback?: CallbackFunction<Compilation>,
    ): NodeJS.ReadWriteStream;
}
*/
