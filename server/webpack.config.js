//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/
const nodeExternals = require('webpack-node-externals');
const dotenv = require('dotenv');
const webpack = require('webpack');


// /** @type WebpackConfig[] */
const configs = (env, options) => {
    const appEnv = env || options.mode;
    const envfile = `.env.${appEnv}`;
    const _dotenv = dotenv.config({
        path: envfile
    });

    return [
        {
            entry: {
                browser: './src/client/index.tsx'
            },
            output: {
                path: __dirname + '/dist',
                filename: '[name].js',
            },
            // Currently we need to add '.ts' to the resolve.extensions array.
            resolve: {
                extensions: ['.ts', '.tsx', '.js', '.jsx'],
            },
    
            // Source maps support ('inline-source-map' also works)
            devtool: 'source-map',
    
            // Add the loader for .ts files.
            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        loader: 'ts-loader',
                    },
                ],
            },
        },
        {
            entry: {
                server: './src/server.ts',
            },
            output: {
                path: __dirname + '/dist',
                filename: '[name].js',
            },
            // Currently we need to add '.ts' to the resolve.extensions array.
            resolve: {
                extensions: ['.ts', '.tsx', '.js', '.jsx', '.hbs'],
            },
            plugins: [
                new webpack.DefinePlugin({
                    "process.env": _dotenv.parsed
                }),
            ],
            // Source maps support ('inline-source-map' also works)
            devtool: 'source-map',
    
            // Add the loader for .ts files.
            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        loader: 'ts-loader',
                    },
                    {
                      test: /\.hbs$/,
                      loader: "handlebars-loader"
                    },
                ],
            },
            target: 'node',
            externals: [nodeExternals()],
        },
    ]
};

module.exports = configs;