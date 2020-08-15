/**
* @Author: Igor Fischer <igor>
* @Date:   2016-03-01T21:06:22+01:00
* @Last modified by:   igor
* @Last modified time: 2016-05-25T20:58:41+02:00
*/

import HtmlWebpackPlugin from 'html-webpack-plugin';

// import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import LiveReloadPlugin from 'webpack-livereload-plugin';
import path from 'path';
import webpack, {DefinePlugin} from 'webpack';
import merge from 'lodash.merge';

const DEBUG = process.env.NODE_ENV !== 'production';
const VERBOSE = false;
const AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 35',
  'Firefox >= 31',
  'Explorer >= 9',
  'iOS >= 7',
  'Opera >= 12',
  'Safari >= 7.1',
];
const GLOBALS = {
  // 'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
  __DEV__: DEBUG,
};

//
// Common configuration chunk to be used for both
// client-side (app.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------

const config = {
  output: {
    publicPath: '/',
    sourcePrefix: '  ',
  },

  cache: DEBUG,
  debug: DEBUG,

  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    ...(DEBUG ? [new LiveReloadPlugin({ignore: 'woff'})] : []),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new CopyWebpackPlugin([
      {from: './public/src_ionic/app-assets', to: '../assets/app'},
      {from: './public/src_ionic/app-assets', to: 'app'},
    ]),
  ],

  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.ts', '.tsx'],
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules|lib\/ionic/,
        loader: 'babel',
        query:
        {
          // cacheDirectory: true,
          plugins: ['transform-decorators-legacy', 'transform-class-properties'],
          presets: ['react', 'es2015', 'stage-0'],
        },
      }, {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.(ts|tsx)$/,
        loaders: ['babel?presets[]=es2015', 'ts-loader'],
      },

      // {
      //   test: /\.(txt|html)$/,
      //   loader: 'raw-loader',
      // },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)?(\?v\=2\.0\.1)?$/,
        loader: 'url-loader?limit=400&name=[name].[ext]',
      }, {
        test: /\.(eot|ttf|wav|mp3)?(\?v\=2\.0\.1)?$/,
        loader: 'file-loader',
      },
      {
        test: /\.(scss|sass)$/,
        loaders: ['style', 'css', 'sass'],
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
    ],
  },

  postcss: function plugins() {
    return [
      require('postcss-import')({
        onImport: files => files.forEach(this.addDependency),
      }),
      require('postcss-nested')(),
      require('postcss-cssnext')({autoprefixer: AUTOPREFIXER_BROWSERS}),
    ];
  },
};

//
// Configuration for the client-side bundle (app.js)
// -----------------------------------------------------------------------------

// config for react sources
const reactConfig = merge({}, config, {
  entry: [
    './public/src_react/main.jsx',
  ],
  output: {
    path: path.join(__dirname, '../assets'),
    filename: 'view/app.js',
  },
  devtool: DEBUG ? 'source-map' : false,
  plugins: [
    ...config.plugins,
    new DefinePlugin(GLOBALS),
    ...(!DEBUG && [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({compress: {warnings: VERBOSE}}),
      new webpack.optimize.AggressiveMergingPlugin(),
    ]),
    new HtmlWebpackPlugin({
      template: './public/src_react/index.html',
      inject: true,
      filename: './view/index.ejs',
    }),
  ],
  module: {
    loaders: [
      ...config.module.loaders,
    ],
  },
});

// config for angular sources
const ngConfig = merge({}, config, {
  entry: [
    './public/src_ng/main.js',
  ],
  output: {
    path: path.join(__dirname, '../assets'),
    filename: 'admin/app.js',
  },
  devtool: DEBUG ? 'source-map' : false,
  plugins: [
    ...config.plugins,

    new DefinePlugin(GLOBALS),
    ...(!DEBUG && [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({compress: {warnings: VERBOSE}, mangle: false}),
      new webpack.optimize.AggressiveMergingPlugin(),
    ]),
    new HtmlWebpackPlugin({
      template: './public/src_ng/index.html',
      inject: true,
      filename: './admin/index.ejs',
    }),
  ],
  module: {
    loaders: [
      ...config.module.loaders,
    ],
  },
});

// config for angular sources
const ionicConfig = merge({}, config, {
  entry: [
    'babel-polyfill',
    './public/src_ionic/web-app/js/app.js',
  ],
  output: {
    // path: path.join(__dirname, '../assets'),
    path: path.join(__dirname, '../public/src_ionic/www'),
    filename: 'app.js',
  },
  devtool: DEBUG ? 'source-map' : false,
  plugins: [
    ...config.plugins,

    new DefinePlugin(GLOBALS),
    ...(!DEBUG && [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({compress: {warnings: VERBOSE}, mangle: false}),
      new webpack.optimize.AggressiveMergingPlugin(),
    ]),
    new HtmlWebpackPlugin({
      template: './public/src_ionic/web-app/index.html',
      inject: true,
      filename: 'index.ejs',
    }),
    new CopyWebpackPlugin([
      {
        from: './public/src_ionic/web-app/index-app.html',
        to: 'index.html',
      },
      {
        from: './public/src_ionic/www',
        to: '../../../assets',
      },
    ], {ignore: ['index.html']}),
  ],
  module: {
    loaders: [
      ...config.module.loaders,

    ],
  },
});

// config for angular sources
const ionicWebConfig = merge({}, config, {
  entry: [
    'babel-polyfill',
    './public/src_ionic/web-app/js/app.js',
  ],
  output: {
    path: path.join(__dirname, '../assets'),
    filename: 'app.js',
  },
  devtool: DEBUG ? 'source-map' : false,
  plugins: [
    ...config.plugins,

    new DefinePlugin(GLOBALS),
    ...(!DEBUG && [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({compress: {warnings: VERBOSE}, mangle: false}),
      new webpack.optimize.AggressiveMergingPlugin(),
    ]),
    new HtmlWebpackPlugin({
      template: './public/src_ionic/web-app/index.html',
      inject: true,
      filename: 'index.ejs',
    }),
    new CopyWebpackPlugin([
      {
        from: './public/src_ionic/web-app/index-app.html',
        to: 'index.html',
      },

      // {
      //   from: './public/src_ionic/www',
      //   to: '../../../assets',
      // },
    ], {ignore: ['index.html']}),
  ],
  module: {
    loaders: [
      ...config.module.loaders,

    ],
  },
});

export default [
  ionicWebConfig,

  //ngConfig,
  //reactConfig,
];
