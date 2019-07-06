const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const InertEntryPlugin = require('inert-entry-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const DIST_DIR = path.resolve(__dirname, 'dist')
const SRC_DIR = path.resolve(__dirname, 'src')
const ASSET_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'eot', 'otf', 'svg', 'ttf', 'woff', 'woff2']
const MANIFEST_FILE = 'manifest.json'

const manifestPath = path.join(SRC_DIR, MANIFEST_FILE)

module.exports = {
  mode: IS_PRODUCTION ? 'production' : 'development',
  output: {
    filename: MANIFEST_FILE,
    path: DIST_DIR,
  },
  entry: `extricate-loader!interpolate-loader!${manifestPath}`,
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          'file-loader',
          'extract-loader',
          {
            loader: 'html-loader',
            options: {
              minimize: IS_PRODUCTION,
              attrs: [
                'link:href',
                'script:src',
                'img:src',
              ]
            }
          }
        ]
      },
      {
        test: /\.styl$/,
        use: [
          'file-loader',
          'extract-loader',
          'css-loader',
          'stylus-loader',
        ]
      },
      {
        test: /\/index\.(js|ts|jsx|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
          loader: 'spawn-loader',
          options: {
            name: '[hash].js'
          }
        }]
      },
      {
        test: /\.(js|ts|jsx|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              "presets": [
                ["@babel/env", {"modules": false}],
                "@babel/typescript"
              ],
              "plugins": [
                "@babel/proposal-class-properties",
                "@babel/proposal-object-rest-spread"
              ]
            }
          },
        ]
      },
      {
        test: new RegExp('\\.(' + ASSET_EXTENSIONS.join('|') + ')$'),
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'assets/'
          }
        }
      },
    ]
  },
  plugins: [
    new InertEntryPlugin(),
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      browser: 'webextension-polyfill'
    }),
    //new ForkTsCheckerWebpackPlugin(),
  ],
  devtool: IS_PRODUCTION ? '' : 'inline-source-map'
}
