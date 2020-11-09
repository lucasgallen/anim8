const path = require('path');
const { merge } = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');
const webpack = require('webpack');

const PATHS = {
  app: path.join(__dirname, 'app'),
  node_modules: path.join(__dirname, 'node_modules'),
  build: path.join(__dirname, '/'),
};

const commonConfig = merge([
  {
    resolve: {
      modules: ['node_modules'],
      extensions: ['.js', '.jsx'],
      alias: {
        gif$: `${__dirname}/app/gif/gif.js`,
      },
    },
    entry: {
      app: PATHS.app,
    },
    output: {
      publicPath: '/',
      filename: '[name].js',
    },
    plugins: [
      new CleanObsoleteChunks(),
      new HtmlWebpackPlugin({
        inject: false,
        template: path.join(__dirname, 'public/index.html'),
      }),
    ],
  },
  {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: PATHS.app,
          exclude: [
            /gif/,
            /node_modules/,
          ],

          use: ['babel-loader', 'eslint-loader'],
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
  }
]);

const productionConfig = merge([
  {
    mode: 'production',
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            mangle: true,
            ie8: false,
            keep_fnames: true,
          },
          extractComments: false,
        }),

        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production')
        }),
      ],
    },
  },
]);

const developmentConfig = merge([
  {
    mode: 'development',
    devServer: {
      clientLogLevel: 'debug',
      historyApiFallback: true,
      stats: {
        errors: true,
      },

      host: '0.0.0.0',
      port: '8080',

      publicPath: '/',

      overlay: {
        errors: true,
        warnings: true,
      },
    },
  },
]);

module.exports = (env) => {
  if (env === 'production') {
    return merge(commonConfig, productionConfig);
  }

  return merge(commonConfig, developmentConfig);
};
