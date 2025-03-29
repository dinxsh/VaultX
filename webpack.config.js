const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        popup: './popup.js',
        background: './background.js',
        content: './content.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        clean: {
            keep: /icons\//
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js'],
        fallback: {
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify"),
            "buffer": require.resolve("buffer/"),
            "util": require.resolve("util/")
        }
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'manifest.json', to: 'manifest.json' },
                { from: 'popup.html', to: 'popup.html' },
                { from: 'styles.css', to: 'styles.css' },
                { 
                    from: 'icons',
                    to: 'icons',
                    noErrorOnMissing: true
                }
            ]
        })
    ],
    optimization: {
        splitChunks: {
            chunks: (chunk) => chunk.name !== 'background',
            name: 'vendor'
        }
    }
}; 