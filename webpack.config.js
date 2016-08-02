var debug = process.env.NODE_ENV !== 'production'
var webpack = require('webpack')

module.exports = {
  context: __dirname + '/assets',
  devtool: debug ? 'inline-sourcemap' : null,
  entry: './js/scripts.js',
  output: {
    path: __dirname + '/assets/dist',
    filename: 'scripts.min.js'
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: true, sourcemap: false }),
  ]
}