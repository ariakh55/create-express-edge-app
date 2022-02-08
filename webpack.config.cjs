const config = require('./config.cjs')
const AssetsWebpackPlugin = require('assets-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const webPackConfig = {
    entry: {main: [`${config.srcFolder}/scripts/main.js`]},
    output: {
        path: config.distFolder,
        filename: "main.bundle.js",
        publicPath: "/assets/"
    },
    mode: config.isProd ? "production" : "development",
    devServer: {
        open: ['http://localhost:5005/'],
        watchFiles: [`${config.srcFolder}/**/*.edge`],
        static: {
            directory: config.distFolder
        },
        port: config.wdsPort,
        hot: config.hmrEnabled,
        devMiddleware: {
            publicPath: 'http://localhost:5505/assets'
        }
    },
    module: {
        rules: [
            {
                test: require.resolve('jquery'),
                loader: 'expose-loader',
                options: {
                    exposes: {
                        globalName: "$",
                        override: true,
                    }
                }
            },
            {
                test: /\.m?js$/,
                include: config.srcFolder,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    config.isProd ? {loader: MiniCssExtractPlugin.loader} : 'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new AssetsWebpackPlugin({path: config.distFolder}),
        new MiniCssExtractPlugin({filename: '[name].[contenthash].css'})
    ]
};

module.exports = webPackConfig;