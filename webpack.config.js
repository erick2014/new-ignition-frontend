const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ResponsiveImagesPlugin = require('./webpack_plugins/responsive_images_plugin');
const DEALER_FOLDER = process.env.DEALER_FOLDER

if (!DEALER_FOLDER) {
  module.exports = {}
  console.log('provide a dealer DEALER_FOLDER variable')
  return
}

module.exports = {
  entry: {
    "bundle": path.join(__dirname, 'src', DEALER_FOLDER, 'src/js/index.js')
  },
  output: {
    path: path.join(__dirname, 'src', DEALER_FOLDER, 'dist'),
    filename: '[name].js'
  },
};
