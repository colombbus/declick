require('dotenv').config()

const HtmlWebpackPlugin = require('html-webpack-plugin')
// const path = require('path')
// const webpack = require('webpack')

module.exports = {
  chainWebpack: config => {
    config
      .entry('app')
        .prepend('@babel/polyfill')
        .end()
      .resolve
        .alias
          .set('vue$', 'vue/dist/vue')
          .end()
        .end()
      .plugin('html-template')
        .use(HtmlWebpackPlugin, [{
          template: 'public/index.html',
          favicon:
            process.env.NODE_ENV === 'production'
            ? 'public/favicon-prod.ico'
            : 'public/favicon-dev.ico'
        }])
      .end()
      const svgRule = config.module.rule('svg')
      svgRule.uses.clear()
      svgRule
        .oneOf('inline')
        .resourceQuery(/inline/)
        // use('babel-loader')
        //   .loader('babel-loader')
          .use('vue-svg-loader')
          .loader('vue-svg-loader')
        .end()
      .end()
         .oneOf('external')
          .use('file-loader')
          .loader('file-loader')
          .options({
            name: 'assets/[name].[hash:8].[ext]',
          });
  },
}
