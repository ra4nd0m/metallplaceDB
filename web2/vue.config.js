const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  configureWebpack: {
    plugins: [
      new webpack.EnvironmentPlugin({
        HTTP_HOST: 'localhost',
        HTTP_PORT: 8080,
      })
    ]
  },
  transpileDependencies: [
    'vuetify'
  ]
})
