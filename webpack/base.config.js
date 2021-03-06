const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const resolvePath = relativePath => path.resolve(__dirname, relativePath);
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: resolvePath('../dist'),
  },
  resolve: {
    extensions: ['.vue', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [{ loader: 'vue-loader' }],
      },
      {
        test: /\.js$/,
        use: [{ loader: 'babel-loader' }],
      },
      {
        test: /\.less$/,
        use: [{ loader: 'vue-style-loader' }, { loader: 'css-loader' }, { loader: 'less-loader' }],
      },
      {
        test: /\.(png|svg|jpg|gif|mp3)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'static/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [new VueLoaderPlugin(), new HTMLWebpackPlugin({ template: './src/index.html' })],
};
