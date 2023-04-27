const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  configureWebpack: {
    plugins: [
      new webpack.EnvironmentPlugin({
        HTTP_HOST: process.env.MPLBASE_BACK_HTTP_HOST,
        HTTP_PORT: process.env.MPLBASE_BACK_HTTP_PORT,
      })
    ]
  },
  transpileDependencies: [
    'vuetify'
  ]
})
