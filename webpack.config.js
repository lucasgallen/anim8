const path = require('path');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');
const webpack = require('webpack');

const PATHS = {
  app: path.join(__dirname, 'app'),
  'node_modules': path.join(__dirname, 'node_modules'),
  build: path.join(__dirname, '/'),
};

const commonConfig = merge([
  {
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        gif$: `${__dirname}/app/gif/gif.js`,
      },
    },
    entry: {
      app: PATHS.app,
    },
    output: {
      path: PATHS.build,
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
          exclude(path) {
            return path.match(/node_modules|gif/);
          },

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
    devServer: {
      historyApiFallback: true,
      stats: 'errors-only',

      host: null,
      port: null,

      publicPath: '/',
      //conentBase: path.join(__dirname, '/public/assets'),

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
