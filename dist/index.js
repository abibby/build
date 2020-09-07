"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
var webpack_1 = require("webpack");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var clean_webpack_plugin_1 = require("clean-webpack-plugin");
function build(options) {
    var entry = options.entry, html = options.html, dist = options.dist, moduleBase = options.moduleBase, publicPath = options.publicPath;
    return function (env, argv) {
        var devMode = argv.mode !== 'production';
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
                                        localIdentName: '[name]__[local]--[hash:base64:5]',
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
                new clean_webpack_plugin_1.CleanWebpackPlugin(),
                new HtmlWebpackPlugin({
                    template: html,
                    filename: 'index.html',
                }),
                new webpack_1.DefinePlugin({
                    __DEVELOPMENT__: devMode,
                }),
                new MiniCssExtractPlugin({
                    filename: '[name].css',
                    chunkFilename: '[id].css',
                }),
            ],
        };
    };
}
exports.build = build;
