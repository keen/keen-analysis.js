const path = require('path');
const webpack = require('webpack');

const resolveAlias = {};

let definePluginVars = {};
if (process.env.NODE_ENV === 'development') {
  const demoConfig = require('./config');
  definePluginVars = {
    webpackKeenGlobals: JSON.stringify({ demoConfig })
  };
}

module.exports = {
  entry: {
    'localQuery': './lib/modules/local-query.js'
  },

  target: process.env.TARGET ? `${process.env.TARGET}` : 'web',

  output: {
    path: path.resolve(__dirname, `dist${!process.env.TARGET ? '' : '/' + process.env.TARGET}/modules`),
    filename: '[name].js',
    library: `${!process.env.LIBRARY ? '' : process.env.LIBRARY}`,
    libraryTarget: 'umd',
  },

  module: {

    rules: [
      {
        test: /\.js?$/,
        include: [
          path.resolve(__dirname, 'lib'),
        ],
        exclude: [
          path.resolve(__dirname, 'node_modules'),
        ],
        loader: 'babel-loader'
      },

      {
        test: /\.html$/,
        loader: 'html-loader',
      },
    ],

  },

  resolve: {
    modules: [
      'node_modules',
    ],
    extensions: ['.js', '.json', '.jsx', '.css', '.scss'],
    alias: resolveAlias
  },

  optimization: {
    minimize: !!process.env.OPTIMIZE_MINIMIZE,
  },

  devtool: 'source-map',

  context: __dirname,

  // stats: 'verbose',

  plugins: [
    new webpack.DefinePlugin(definePluginVars)
  ],

  mode: process.env.NODE_ENV,

  devServer: {
    contentBase: path.join(__dirname, 'test/demo'),
    open: true,
    inline: true,
    hot: false,
    watchContentBase: true,
  },

  externals: {
  },

};
