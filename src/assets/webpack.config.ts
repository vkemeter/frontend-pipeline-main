import {Configuration} from 'webpack';
import {Environment} from '../types/config/PipelineConfig';
import * as path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import BabelEsmPlugin from 'babel-esm-plugin';

const nodeModulesPath = path.join(process.cwd(), 'node_modules');

export function generateWebpackConfig(env: Environment): Configuration {
    const webpackConfig: Configuration = {
        target: ['web', 'es2017'],
        mode: env,
        output: {
            filename: '[name].js',
            module: true
        },
        module: {
            rules: [
                {
                    test: /\.(ts|js)$/,
                    use: ['babel-leader'],
                    exclude: nodeModulesPath
                }
            ]
        },
        resolve: {
            extensions: ['.ts', '.js']
        },
        optimization: {
            mergeDuplicateChunks: true,
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    parallel: true
                })
            ]
        },
        devtool: env === 'development' ? 'source-map' : 'none',
        performance: {
            hints: 'warning'
        },
        plugins: [
            new BabelEsmPlugin()
        ]
    }

    return webpackConfig;
}
