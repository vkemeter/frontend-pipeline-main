import {Configuration, LoaderOptionsPlugin} from 'webpack'
import {Environment} from '../types/config/PipelineConfig'
import * as path from 'path'
import TerserPlugin from 'terser-webpack-plugin'
import babelConfiguration from './babelConfiguration'
import BabelEsmPlugin from 'babel-esm-plugin'

const nodeModulesPath = path.join(process.cwd(), 'node_modules')
const tsConfigPath = path.join(process.cwd(), 'tsconfig.json')

export function generateWebpackConfig (env: Environment): Configuration {
    const webpackConfig: Configuration = {
        target: 'web',
        mode: 'development',
        output: {
            filename: "[name].js"
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: babelConfiguration
                        },
                        {
                            loader: 'ts-loader',
                            options: {
                                configFile: tsConfigPath
                            }
                        }
                    ],
                    exclude: nodeModulesPath
                },
                {
                    test: /\.js$/,
                    use: [{
                        loader: 'babel-loader',
                        options: babelConfiguration
                    }],
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
                    parallel: true,
                    extractComments: false
                })
            ]
        },
        devtool: env === 'development' ? 'source-map' : 'none',
        performance: {
            hints: 'warning'
        },
        plugins: [
            new BabelEsmPlugin(),
            new LoaderOptionsPlugin({
                options: {
                    devTool: 'source-map',
                }
            })
        ]
    }

    return webpackConfig
}
