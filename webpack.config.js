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
  ],
  loaders: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
      query: {
        presets: ['es2015']
      }
    }
  ]
}