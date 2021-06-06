const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    resolve: {
        alias: {
            src: path.resolve(__dirname, 'src'),
            '@pages': path.resolve(__dirname, 'src/pages')
        }
    },
    entry: {
        index: './src/pages/index/index.js',
        state: './src/pages/state/index.js',
        moreport: './src/pages/moreport/index.js',
        multicash: './src/pages/multicash/index.js',
    },
    output: {
        filename: "js/bundle.[contentHash].js",
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'production',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 9000,
        proxy: {}
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: './dist',
                    },
                }, {
                    loader: "css-loader",
                }
                ]
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: 'images/[name].[hash].[ext]'
                        }
                    }
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                loader: 'url-loader',
                options: {
                    esModule: false,
                    name: 'fonts/[name].[hash].[ext]'
                }
            },
            {
                test: /\.html$/i,
                use: [{
                    loader: 'html-loader'
                }]
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        }),
        new MiniCssExtractPlugin({
            filename: 'css/style.[name].[contentHash].css',
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin(
            {
                template: './src/pages/index/index.html',
                filename: "index.html",
                chunks: ['index']
            }
        ),
        new HtmlWebpackPlugin(
            {
                template: './src/pages/state/index.html',
                filename: "state.html",
                chunks: ['state'],
            }
        ),
        new HtmlWebpackPlugin(
            {
                template: './src/pages/moreport/index.html',
                filename: "moreport.html",
                chunks: ['moreport'],
            }
        ),
        new HtmlWebpackPlugin(
            {
                template: './src/pages/multicash/index.html',
                filename: "multicash.html",
                chunks: ['multicash'],
            }
        ),
    ]
}
