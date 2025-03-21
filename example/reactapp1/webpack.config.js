const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
  return {
    entry: './src/index.js',
    output: {
      filename: 'react-app.js',
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: 'system',
      publicPath: '/'
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
      }),
    ],
    devServer: {
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      port: env.development ? 4000 : 8080
    },
    externals: ['react', 'react-dom', 'single-spa'],
  };
};
