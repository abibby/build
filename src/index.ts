import {
    CliConfigOptions,
    Configuration,
    DefinePlugin,
    Entry,
    EntryFunc,
} from 'webpack'
import { join } from 'path'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

export interface Options {
    entry: string | string[] | Entry | EntryFunc
    html: string
    moduleBase: string
    dist: string
    publicPath?: string
}

export function build(
    options: Options,
): (
    env: string | Record<string, boolean | number | string>,
    argv: CliConfigOptions,
) => Configuration | Promise<Configuration> {
    const { entry, html, dist, moduleBase, publicPath } = options

    return (env, argv) => {
        const devMode = argv.mode !== 'production'

        return {
            entry: entry,
            mode: devMode ? 'development' : 'production',
            devtool: devMode ? 'source-map' : false,
            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        exclude: /node_modules/,
                        loader: ['ts-loader', 'eslint-loader'],
                    },
                    {
                        test: /\.module\.scss$/,
                        exclude: /node_modules/,
                        loader: [
                            MiniCssExtractPlugin.loader,
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1,
                                    modules: {
                                        localIdentName:
                                            '[name]__[local]--[hash:base64:5]',
                                    },
                                },
                            },
                            'sass-loader',
                        ],
                    },
                    {
                        test: /(?<!\.module)\.scss$/,
                        exclude: /node_modules/,
                        loader: [
                            MiniCssExtractPlugin.loader,
                            'css-loader',
                            'sass-loader',
                        ],
                    },
                    {
                        test: /\.css$/,
                        include: /node_modules/,
                        loader: [MiniCssExtractPlugin.loader, 'css-loader'],
                    },
                    {
                        test: /\.(svg|eot|woff|woff2|ttf)/,
                        loader: 'file-loader',
                        options: {
                            name: devMode
                                ? '[name].[ext]'
                                : '[name].[hash].[ext]',
                        },
                    },
                ],
            },
            output: {
                path: dist,
                filename: devMode ? '[name].js' : '[name].[hash].js',
                chunkFilename: devMode ? '[id].js' : '[id].[hash].js',
                publicPath: publicPath,
            },
            resolve: {
                extensions: ['.tsx', '.ts', '.js', '.scss', '.css'],
                modules: ['node_modules', moduleBase],
            },
            plugins: [
                new CleanWebpackPlugin(),
                new HtmlWebpackPlugin({
                    template: html,
                    filename: 'index.html',
                }),
                new DefinePlugin({
                    __DEVELOPMENT__: devMode,
                }),
                new MiniCssExtractPlugin({
                    filename: '[name].css',
                    chunkFilename: '[id].css',
                }),
            ],
        }
    }
}
