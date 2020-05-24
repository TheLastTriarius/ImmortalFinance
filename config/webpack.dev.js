const merge = require('webpack-merge')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const Dotenv = require('dotenv-webpack')

const { resolvePath } = require('./resolvePath')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: resolvePath('dist'),
    port: 3000,
    host: 'localhost',
    publicPath: 'http://localhost:3000',
    quiet: true,
    hot: false,
    open: true,
    compress: true,
    historyApiFallback: true,
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].bundle.js',
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: ['Application is running here http://localhost:3000'],
      },
    }),
    new Dotenv({
      path: resolvePath('.env.development'),
    }),
  ],
})
