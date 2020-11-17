const path = require('path');
const dotenv = require('dotenv');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');
const webpack = require('webpack');

const PATHS = {
  app: path.join(__dirname, 'app'),
  node_modules: path.join(__dirname, 'node_modules'),
  build: path.join(__dirname, '/'),
  env: path.join(__dirname, '/.env'),
};

const getEnvKeys = env => {
  const fileEnv = dotenv.config({ path: `${PATHS.env}.${env['ENVIRONMENT']}` }).parsed;

  return Object.keys(fileEnv).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);

    return prev;
  }, {});
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
      app: `${PATHS.app}/index.js`,
    },
    output: {
      publicPath: '/',
      filename: '[name].js',
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              pure_getters: true,
            },
            mangle: {
              reserved: [/\.min\.js$/gi],
            },
          },
        })
      ],
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
          test: /\.js$/,
          enforce: 'pre',
          use: ['source-map-loader'],
        },
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

const productionConfig = envKeys => {
  return merge([
    {
      mode: 'production',
      plugins: [
        new CompressionPlugin({
          test: /\.jsx?$/i,
        }),
        new webpack.DefinePlugin(merge(
          envKeys,
          { 'process.env.NODE_ENV': JSON.stringify('production') }
        )),
      ],
    },
  ]);
};

const developmentConfig = envKeys => {
  return merge([
    {
      mode: 'development',
      plugins: [
        new webpack.DefinePlugin(merge(
          envKeys,
          { 'process.env.NODE_ENV': JSON.stringify('development') }
        )),
      ],
      devServer: {
        clientLogLevel: 'debug',
        historyApiFallback: true,
        stats: {
          errors: true,
        },

        host: '0.0.0.0',
        port: '8080',
        proxy: {
          '/api': process.env.API_DEV_SERVER
        },

        publicPath: '/',

        overlay: {
          errors: true,
          warnings: true,
        },
      },
    },
  ]);
};

module.exports = (env) => {
  const envKeys = getEnvKeys(env);

  if (env['ENVIRONMENT'] === 'production') {
    return merge(commonConfig, productionConfig(envKeys));
  }

  return merge(commonConfig, developmentConfig(envKeys));
};
