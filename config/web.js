const webpack = require('webpack');
const path = require('path');

const DEV = path.resolve(__dirname, '../react');
const OUTPUT = path.resolve(__dirname, '../web');

module.exports = env => (
  {
    context: DEV,
    entry: {
      folder: './folder.web.jsx',
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    output: {
      filename: '[name].bundle.js',
      path: OUTPUT,
    },
    module: {
      loaders: [{
        include: [DEV],
        loader: 'babel-loader',
      }],
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
      })
    ],
  }
);

