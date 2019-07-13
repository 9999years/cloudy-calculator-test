const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const InertEntryPlugin = require('inert-entry-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const DIST_DIR = path.resolve(__dirname, 'dist')
const SRC_DIR = path.resolve(__dirname, 'src')
const SCRIPT_DIR = path.join(SRC_DIR, 'scripts')
const STYLE_DIR = path.join(SRC_DIR, 'styles')
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
          {
            loader: 'file-loader',
            options: {
              name: '[name].css',
            }h
          },
          'extract-loader',
          'css-loader',
          'stylus-loader',
        ]
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          }
        ]
      },
      // Workaround for https://github.com/webpack/webpack/issues/5828
      {
        test: require.resolve('webextension-polyfill'),
        use: 'imports-loader?browser=>undefined'
      }
    ]
  },
  plugins: [
    new InertEntryPlugin(),
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      browser: 'webextension-polyfill'
    }),
    new CopyPlugin([
      { from: path.join(SRC_DIR, 'icon'), to: path.join(DIST_DIR, 'icon') },
    ]),
  ],
  devtool: IS_PRODUCTION ? '' : 'inline-source-map'
}
