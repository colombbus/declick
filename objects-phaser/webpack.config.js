const path = require('path')
const pathToPhaser = path.join(__dirname, '/node_modules/phaser/')
const phaser = path.join(pathToPhaser, 'dist/phaser.js')
const webpack = require('webpack');

module.exports = {
  entry:
    // 'babel-polyfill',
    path.resolve(__dirname, 'src', 'game.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader', exclude: '/node_modules/' },
      { test: /phaser\.js$/, loader: 'expose-loader?Phaser' }
    ]
  },
  devServer: {
    // contentBase: path.resolve(__dirname, './'),
    // publicPath: '/',
    // host: '127.0.0.1',
    // port: 8080,
    // open: true,
    hot: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      phaser
    }
  }
}
