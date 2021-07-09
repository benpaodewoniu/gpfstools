const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

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
        collection: './src/pages/collection/index.js',
        morebnb: './src/pages/morebnb/index.js',
        version: './src/pages/version/index.js',
        kline: './src/pages/kline/index.js',
        bnbstate: './src/pages/bnbstate/index.js',
        moregps: './src/pages/moregps/index.js',
        pi: './src/pages/pi/index.js',
        pancake: './src/pages/pancake/index.js',
        upload: './src/pages/upload/index.js',
        other: './src/pages/other/index.js',

        login: './src/pages/login/index.js',
        user: './src/pages/user/index.js',
        useraddresses: './src/pages/useraddresses/index.js',
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
            },
            {
                test: /\.ejs$/,
                use: [
                    {
                        loader: 'ejs-loader',
                        options: {
                            esModule: false,
                            variable: 'data',
                        },
                    },
                ],
            },
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
        new CopyWebpackPlugin([
            {
                from: 'src/static',	// 原始目录
                to: 'static',	// 输出目录
            }
        ]),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin(
            {
                template: './src/pages/index/index.ejs',
                filename: "index.html",
                chunks: ['index']
            }
        ),
        new HtmlWebpackPlugin(
            {
                template: './src/pages/state/index.ejs',
                filename: "state.html",
                chunks: ['state'],
            }
        ),
        new HtmlWebpackPlugin(
            {
                template: './src/pages/moreport/index.ejs',
                filename: "moreport.html",
                chunks: ['moreport'],
            }
        ),
        new HtmlWebpackPlugin(
            {
                template: './src/pages/multicash/index.ejs',
                filename: "multicash.html",
                chunks: ['multicash'],
            }
        ),
        new HtmlWebpackPlugin(
            {
                template: './src/pages/collection/index.ejs',
                filename: "collection.html",
                chunks: ['collection'],
            }
        ),
        new HtmlWebpackPlugin(
            {
                template: './src/pages/morebnb/index.ejs',
                filename: "morebnb.html",
                chunks: ['morebnb'],
            }
        ),
        new HtmlWebpackPlugin(
            {
                template: './src/pages/login/index.ejs',
                filename: "login.html",
                chunks: ['login'],
            }
        ),
        new HtmlWebpackPlugin(
            {
                template: './src/pages/user/index.ejs',
                filename: "user.html",
                chunks: ['user'],
            }
        ),
        new HtmlWebpackPlugin(
            {
                template: './src/pages/useraddresses/index.ejs',
                filename: "useraddresses.html",
                chunks: ['useraddresses'],
            }
        ),
        new HtmlWebpackPlugin(
            {
                template: './src/pages/version/index.ejs',
                filename: "version.html",
                chunks: ['version'],
            }
        ),
        new HtmlWebpackPlugin(
            {
                template: './src/pages/kline/index.ejs',
                filename: "kline.html",
                chunks: ['kline'],
            }
        ),
        new HtmlWebpackPlugin(
            {
                template: './src/pages/bnbstate/index.ejs',
                filename: "bnbstate.html",
                chunks: ['bnbstate'],
            }
        ),
        new HtmlWebpackPlugin(
            {
                template: './src/pages/moregps/index.ejs',
                filename: "moregps.html",
                chunks: ['moregps'],
            }
        ),
        new HtmlWebpackPlugin(
            {
                template: './src/pages/pi/index.ejs',
                filename: "pi.html",
                chunks: ['pi'],
            }
        ),
        new HtmlWebpackPlugin(
            {
                template: './src/pages/pancake/index.ejs',
                filename: "pancake.html",
                chunks: ['pancake'],
            }
        ),
        new HtmlWebpackPlugin(
            {
                template: './src/pages/upload/index.ejs',
                filename: "upload.html",
                chunks: ['upload'],
            }
        ),
        new HtmlWebpackPlugin(
            {
                template: './src/pages/other/index.ejs',
                filename: "other.html",
                chunks: ['other'],
            }
        ),
    ]
}
