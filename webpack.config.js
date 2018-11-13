const path = require('path');
const webpack = require('webpack');

const fileName = 'keen-analysis';
const entryFile = ( process.env.TARGET !== 'node' ) ? './lib/browser.js' : './lib/server.js' ;
const resolveAlias = {};
if (process.env.TARGET === 'node'){
  resolveAlias['abortcontroller-polyfill/dist/polyfill-patch-fetch'] = path.resolve(__dirname, 'lib/blank.js');
  resolveAlias['./browser-load-data-from-file'] = path.resolve(__dirname, 'lib/utils/node-load-data-from-file.js');
}

let definePluginVars = {};
if (process.env.NODE_ENV === 'development') {
  const demoConfig = require('../demo-config');
  definePluginVars = {
    webpackKeenGlobals: JSON.stringify({ demoConfig })
  };
}

module.exports = {
  entry: [entryFile],

  target: process.env.TARGET ? `${process.env.TARGET}` : 'web',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `${
      process.env.TARGET ? `${process.env.TARGET}/` : ''
    }${
      fileName
    }${
      process.env.OPTIMIZE_MINIMIZE ? '.min' : ''
    }.js`,
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

  externals: process.env.TARGET === 'node' ? {
    // don't include these in a bundle, because they are available in node_modules
    'whatwg-fetch' : true,
    'keen-core' : true,
    'promise-polyfill' : true,
    'moment' : true,
    'csvtojson' : true,
    'crossfilter2' : true
  } : {
  },

};
