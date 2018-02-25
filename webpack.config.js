const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const loadEnv = require('./src/app/utils/loadEnv');

const DIST_DIR = path.resolve(__dirname, "dist");
const SRC_DIR = path.resolve(__dirname, "src");

const config = {
    entry: SRC_DIR + "/app/index.jsx",
    output: {
        path: DIST_DIR + "/app",
        filename: "bundle.js",
        publicPath: "/app/"
    },
    module: {
        loaders: [{
            test: /\.jsx?/,
            include: SRC_DIR,
            loader: "babel-loader",
            query: {
                presets: ["react", "es2015", "stage-2"]
            }
        },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader?url=false"
            }
        ]
    },
    devServer: {
        proxy: {
            '/api/**': {
                target: 'http://localhost:3000/',
                secure: false,
                changeOrigin: true
            }
        }
    },
    context: SRC_DIR,
    plugins: [
        new CopyWebpackPlugin([
            {
                from: 'images',
                to: path.resolve(DIST_DIR, "images"),
                toType: 'dir'
            },
            {
                from: 'index.html',
                to: path.resolve(DIST_DIR, 'index.html'),
                toType: 'file'
            }
        ]),
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development',
            apiKey: undefined,
            authDomain: undefined,
            databaseURL: undefined,
            messagingSenderId: undefined,
            projectId: undefined,
            storageBucket: undefined
        })
    ],
    node: {
        fs: 'empty'
    }
};


module.exports = config;