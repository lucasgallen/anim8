const Webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
const CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');

const configurator = {
  entries: function(){
    var entries = {
      drawpass: [
        './assets/js/drawpass.js',
      ],
      flipbook: [
        './assets/js/flipbook.js',
      ],
      app: [
        './assets/css/app.scss'
      ],
    }
    return entries
  },

  plugins() {
    var plugins = [
      new CleanObsoleteChunks(),
      new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),
      new CopyWebpackPlugin(
        [
          { from: './assets', to: '' }
        ],{
          copyUnmodified: true,
          ignore: ['css/**', 'js/**', 'src/**']
        }
      ),
      new Webpack.LoaderOptionsPlugin(
        { minimize: true, debug: false }
      ),
      new ManifestPlugin({ fileName: 'manifest.json' }),
    ];

    return plugins
  },

  moduleOptions: function() {
    return {
      rules: [
        {
          test: /\.s[ac]ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: {sourceMap: true} },
            { loader: 'sass-loader', options: {sourceMap: true} }
          ]
        },
        { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
        { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ },
        { test: /\.go$/, use: 'gopherjs-loader'}
      ]
    }
  },
  buildConfig: function(){
    // NOTE: If you are having issues with this not being set 'properly', make
    // sure your GO_ENV is set properly as `buffalo build` overrides NODE_ENV
    // with whatever GO_ENV is set to or 'development'.
    const env = process.env.NODE_ENV || 'development';

    var config = {
      mode: env,
      entry: configurator.entries(),
      output: {
        filename: '[name].[hash].js',
        path: `${__dirname}/public/assets`
      },
      plugins: configurator.plugins(),
      module: configurator.moduleOptions(),
      resolve: {
        extensions: ['.jsx', '.js'],
        alias: {
          gif$: `${__dirname}/assets/js/gif/gif.js`,
        },
      },
    }

    if (env === 'development') {
      config.plugins.push(new LiveReloadPlugin({ appendScriptTag: true }))
      return config
    }

    const uglifier = new UglifyJsPlugin({
      uglifyOptions: {
        beautify: false,
        mangle: { keep_fnames: true },
        output: { comments: false },
        compress: {}
      }
    })

    config.optimization = {
      minimizer: [uglifier]
    }

    return config
  }
}

module.exports = configurator.buildConfig()
