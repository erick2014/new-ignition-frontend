const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ResponsiveImagesPlugin = require('./webpack_plugins/responsive_images_plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const DEALER_FOLDER = process.env.DEALER_FOLDER || 'sound-national'
const NODE_ENV = process.env.NODE_ENV || 'development'

if (!DEALER_FOLDER) {
  module.exports = {}
  console.log('provide a dealer DEALER_FOLDER env variable ')
  return
}

module.exports = {
  mode: NODE_ENV,
  entry: {
    "bundle": path.join(__dirname, 'src', DEALER_FOLDER, 'src/js/index.js'),
  },
  output: {
    path: path.join(__dirname, 'src', DEALER_FOLDER, 'dist'),
    filename: '[name].js'
  },
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({})],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: NODE_ENV === 'development',
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  }
};
