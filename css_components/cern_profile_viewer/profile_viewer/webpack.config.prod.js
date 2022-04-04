const path = require('path')
//https://github.com/jantimon/html-webpack-plugin#plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: 'ProfileViewer',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html'
    })
  ],
  performance: {
    maxEntrypointSize: 900000,
    maxAssetSize: 900000
  }
}
