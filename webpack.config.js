const Webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
const CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');

const configurator = {
  entries: function(){
    var entries = {
      app: ['./assets/js/app.js'],
    }
    return entries
  },

  plugins() {
    var plugins = [
      new CleanObsoleteChunks(),
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
        { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
        { test: /\.jsx?$/,loader: 'babel-loader',exclude: /node_modules/ },
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
      output: { filename: '[name].[hash].js', path: `${__dirname}/public/assets` },
      plugins: configurator.plugins(),
      module: configurator.moduleOptions(),
      resolve: {
        extensions: ['.jsx', '.js'],
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
