require('dotenv').config()

const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  chainWebpack: config => {
    config
      .entry('app')
        .prepend('@babel/polyfill')
        .prepend('../runtime/src/main.js')
        .end()
      .resolve
        .alias
          .set('vue$', 'vue/dist/vue')
          .end()
        .end()
      .plugin('html-template')
        .use(HtmlWebpackPlugin, [{
          template: 'public/index.html',
        }])
      .end()
  },
}
