const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      minify: true
    })
  ],
  devServer: {
    port: 3000,
    hot: true,
    compress: true,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'public')
    }
  },
  devtool: 'source-map',
  mode: 'development',
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
};
