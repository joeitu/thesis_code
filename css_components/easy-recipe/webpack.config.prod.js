const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    main: './easy_token/src/index.js',
    fetch_token: './easy_token/src/fetch_token.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'easy_token/scripts'),
    library: 'easyToken',
  }
}
