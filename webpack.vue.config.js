var path = require('path');
const webpack = require('webpack');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const nodeExternals = require('webpack-node-externals');

var config = [{
  entry: path.resolve(__dirname, './products/vue/pages/hello/server.js'),
  output: {
    path: path.resolve(__dirname, './products/vue/pages/hello'),
    filename: 'server.bundle.js',
    libraryTarget: "commonjs2",
  },
  plugins: [
    // ...
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new VueSSRServerPlugin(),
  ],
  externals: nodeExternals({
    // do not externalize dependencies that need to be processed by webpack.
    // you can add more file types here e.g. raw *.vue files
    // you should also whitelist deps that modifies `global` (e.g. polyfills)
    whitelist: /\.css$/
  }),
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
    ]
  }
}, {
  entry: path.resolve(__dirname, './products/vue/pages/hello/index.js'),
  output: {
    path: path.resolve(__dirname, './products/vue/pages/hello'),
    filename: 'client.bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
    ]
  }
}];

module.exports = config;
