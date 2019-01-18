var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToReact = path.resolve(node_modules, 'react/dist/react.min.js');

var config = [{
  entry: path.resolve(__dirname, './products/react/pages/hello/server.js'),
  resolve: {
  },
  target: 'node',
  output: {
    path: path.resolve(__dirname, './products/react/pages/hello'),
    filename: 'server.bundle.js',
    libraryTarget: "umd",
  },
  module: {
    // noParse: [pathToReact],
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel-loader'
    }, {
      test: /\.css$/,
      loader: 'style!css'
    }, {
      test: /\.less$/,
      loader: 'style!css!less'
    },{ 
      test: /\.(png|jpg)$/, 
      loader: 'url?limit=25000' 
    }]
  }
}, {
  entry: path.resolve(__dirname, './products/react/pages/hello/index.js'),
  resolve: {
  },
  output: {
    path: path.resolve(__dirname, './products/react/pages/hello'),
    filename: 'client.bundle.js',
  },
  module: {
    // noParse: [pathToReact],
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel-loader'
    }, {
      test: /\.css$/,
      loader: 'style!css'
    }, {
      test: /\.less$/,
      loader: 'style!css!less'
    },{ 
      test: /\.(png|jpg)$/, 
      loader: 'url?limit=25000' 
    }]
  }
}];
module.exports = config;
