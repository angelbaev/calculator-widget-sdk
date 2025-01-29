const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/widgets/calculator-widget.ts',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        // library: 'calculatorWidget', // If you want to expose it as a library (optional)
        // libraryTarget: 'umd',       // For UMD library target (optional)
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'], // or 'style-loader', 'css-loader', 'postcss-loader' if you use PostCSS
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.css'],
    },
    mode: 'development',
    devtool: 'inline-source-map', // More efficient for development

    devServer: {
        port: 3006,
        hot: true,
        open: true, // Automatically open the browser
        static: { // Serve static files from the project root
            directory: path.join(__dirname, '.'), // Or where your index.html is
        },
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CopyPlugin({
            patterns: [
                { from: "src/**/*.css", to: "css/[path][name][ext]" } // Копира всички CSS файлове
        ]})
    ],
};