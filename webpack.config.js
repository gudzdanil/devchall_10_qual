var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var precss       = require('precss');
var autoprefixer = require('autoprefixer');
var path = require("path");
var pkg = require('./package.json');

var rootPath = path.resolve(__dirname, "");

var distPath = path.join(rootPath, "dist");
var srcPath = path.join(rootPath, "src");

module.exports = {
    entry: {
        app: path.join(srcPath, "app/app.js"),
        vendor: ['angular', 'angular-resource', 'leaflet']
    },
    output: {
        path: distPath,
        filename: "[name].bundle.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            pkg: pkg,
            template: path.join(srcPath, "index.html")
        }),
        new CopyWebpackPlugin([
            {
                from: 'leaflet/dist/images',
                to: 'images'
            },
            {
                from: path.join(srcPath, 'app/data'),
                to: 'data'
            }
        ]),
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js")
    ],
    // devtool: 'source-map',
    debug: true,
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loaders: ['eslint'],
                include: [
                    path.resolve(__dirname, './src')
                ]
            }
        ],
        loaders: [
            {test: /\.js$/, loader: 'ng-annotate!babel', exclude: [/node_modules/]},
            {test: /\.html$/, loader: 'raw'},
            {test: /\.css$/, loader: 'style!css!postcss'},
            {test: /\.scss$/, loader: 'style!css!postcss!sass'},
            {test: /\.json/, loader: 'json'},
            {test: /\.png|\.jpg$/, loader: 'file?name=images/[name].[ext]'}
        ]
    },
    postcss: function () {
        return [precss, autoprefixer];
    }
};