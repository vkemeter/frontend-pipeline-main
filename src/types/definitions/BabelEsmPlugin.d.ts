declare module 'babel-esm-plugin' {
    import {WebpackPluginInstance} from 'webpack';

    interface BabelEsmPluginOptions {

    }
    class BabelEsmPlugin extends WebpackPluginInstance {
        constructor(options?: BabelEsmPluginOptions) {super()}
    }

    export default BabelEsmPlugin
}
