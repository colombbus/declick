/* global __dirname, require, module*/

const path = require('path')
const env = require('yargs').argv.env // use --env with webpack 2
const pkg = require('./package.json')
const fs = require('fs')
const webpack = require('webpack')

let libraryName = pkg.name

let outputFile, mode

if (env === 'build') {
  mode = 'production'
  outputFile = libraryName + '.min.js'
} else {
  mode = 'development'
  outputFile = libraryName + '.js'
}

const config = {
  mode: mode,
  entry: __dirname + '/src/loader.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/lib',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js'],
  },
  plugins: [
    new webpack.DefinePlugin({
      __CLASSES__: JSON.stringify(
        fs.readdirSync('./src/classes').filter(file => file.match(/.*\.js$/)),
      ),
    }),
  ],
}

module.exports = config
