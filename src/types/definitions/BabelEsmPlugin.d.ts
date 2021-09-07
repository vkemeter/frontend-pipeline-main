declare module 'babel-esm-plugin' {
    import {WebpackPluginInstance} from 'webpack'

    interface BabelEsmPluginOptions {
        filename: string,
        chunkFilename: string,
        excludedPlugins: string[],
        additionalPlugins: string[],
        beforeStartExecution: (plugins: any[], babelConfig: any) => void
    }

    class BabelEsmPlugin implements WebpackPluginInstance {
        constructor(options?: Partial<BabelEsmPluginOptions>)
        apply: (compiler: any) => void
    }

    export default BabelEsmPlugin
}
