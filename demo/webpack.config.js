const path = require('path')
const webpack = require('webpack')
const fs = require('fs')

module.exports = {
  entry: './src/demo.js',
  output: {
    filename: 'demo.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Declick',
    libraryTarget: 'var',
    libraryExport: 'default',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __EXAMPLE_FILES__: JSON.stringify(
        fs.readdirSync('./examples').filter(file => file.match(/.*\.js$/)),
      ),
    }),
  ],
}
