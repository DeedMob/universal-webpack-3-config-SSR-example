process.traceDeprecation = true;

const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const nodeExternals = require('webpack-node-externals');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const vendors = require('./webpack.vendors.js');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
export const PUBLIC_PATH = 'https://www.deedmob.com/';
const nodeModules = new nodeExternals({
  whitelist: ['bootstrap-loader/extractStyles'],
});

const sharedRules = [
  {
    enforce: 'pre',
    test: /\.js?$/,
    exclude: /node_modules/,
    use: 'eslint-loader',
  },
  {
    test: /\.less$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: ['css-loader', 'less-loader'],
    }),
  },
  {
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: ['style-loader', 'css-loader'],
    }),
  },
  {
    test: /\.scss$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          query: {
            modules: true,
            importLoaders: 1,
            localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            config: {
              path: './postcss.config.js',
            },
          },
        },
        'sass-loader',
      ],
    }),
  },
  {
    test: /bootstrap-sass[/\\]assets[/\\]javascripts[/\\]/,
    loader: 'imports-loader?jQuery=jquery',
  },
  {
    test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/,
    use: ['url-loader'],
  },
  {
    test: /\.(ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
    use: ['file-loader'],
  },
  {
    test: /\.(webm|mp4)$/,
    use: ['file-loader'],
  },
  {
    test: /\.(gif|png|jpe?g|svg)?$/,
    use: [
      'file-loader',
      {
        loader: 'image-webpack-loader',
        query: {
          mozjpeg: {
            progressive: true,
          },
          gifsicle: {
            interlaced: false,
          },
          optipng: {
            optimizationLevel: 4,
          },
          pngquant: {
            quality: '75-90',
            speed: 3,
          },
        },
      },
    ],
    exclude: /node_modules/,
    include: __dirname,
  },
];

const serverRules = [...sharedRules];
serverRules.push({
  test: /\.js$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        presets: ['react', 'es2015', 'stage-0', 'jest'],
        plugins: [
          [
            'import-inspector',
            {
              serverSideRequirePath: true,
              webpackRequireWeakId: true,
            },
          ],
          [
            'transform-react-loadable',
            {
              server: true,
              webpack: true,
            },
          ],
          'dynamic-import-node',
          'syntax-dynamic-import',
          'transform-runtime',
          'add-module-exports',
          'transform-decorators-legacy',
          'transform-react-display-name',
          'transform-react-stateless-component-name',
          'transform-flow-strip-types',
        ],
      },
    },
  ],
});

const clientRules = [...sharedRules];
clientRules.push({
  test: /\.js$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        presets: ['react', ['es2015', { modules: false }], 'stage-0', 'jest'],
        plugins: [
          [
            'import-inspector',
            {
              serverSideRequirePath: true,
              webpackRequireWeakId: true,
            },
          ],
          [
            'transform-react-loadable',
            {
              server: true,
              webpack: true,
            },
          ],
          'syntax-dynamic-import',
          'transform-runtime',
          'add-module-exports',
          'transform-decorators-legacy',
          'transform-react-display-name',
          'transform-react-stateless-component-name',
          'transform-flow-strip-types',
        ],
      },
    },
  ],
});

const clientConfig = {
  name: 'client',
  output: {
    // filename: '[name].[chunkhash].js', PROD
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'static/dist'),
    publicPath: '/dist/',
  },
  resolve: {
    symlinks: false, // Makes npm link work with babel plugins https://github.com/webpack/webpack/issues/1866
    modules: ['node_modules', path.resolve('./static')],
    extensions: ['.json', '.js', '.jsx'],
    alias: {
      handlebars: 'handlebars/runtime.js',
      components$: path.resolve('./src/components/index.js'),
      reducks: path.resolve('./src/reducks'),
      containers$: path.resolve('./src/containers/index.js'),
    },
  },
  resolveLoader: {
    alias: {
      hbs: 'handlebars-loader',
    },
  },
  // externals: [nodeModules],
  entry: {
    main: [
      // 'webpack-hot-middleware/client?path=http://localhost:3001/__webpack_hmr',
      'bootstrap-loader/extractStyles',
      'font-awesome-webpack!./src/styles/font-awesome.config.js',
      './src/client.js',
    ],
    vendor: vendors,
  },
  module: {
    rules: clientRules,
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new LodashModuleReplacementPlugin({
      shorthands: true,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      // minChunks: function (module) {
      //   // this assumes your vendor imports exist in the node_modules directory
      //   return module.context && module.context.indexOf('node_modules') !== -1;
      // }
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    //CommonChunksPlugin will now extract all the common modules from vendor and main bundles
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest', //But since there are no more common modules between them we end up with just the runtime code included in the manifest file
      minChunks: Infinity,
    }),
    // new CleanWebpackPlugin('./static/dist'),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|de|nl/), // LOCALIZATION
    new Dotenv({ // FIXME wont work deployed
      path: './.env',
    }),
  ],
};

const serverConfig = {
  name: 'server',
  target: 'node',
  node: {
    process: false,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    dns: 'empty',
  },
  resolve: {
    modules: ['node_modules', path.resolve('./static'), path.resolve('./src')],
    extensions: ['.json', '.js', '.jsx'],
    alias: {
      handlebars: 'handlebars/runtime.js',
      components$: path.resolve('./src/components/index.js'),
      reducks: path.resolve('./src/reducks'),
      containers$: path.resolve('./src/containers/index.js'),
    },
  },
  externals: [nodeModules],
  entry: {
    main: ['bootstrap-loader/extractStyles', './src/server.js'],
  },
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, './static/dist'),
    publicPath: '/dist/',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: serverRules,
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new ExtractTextPlugin('styles.css'),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|de|nl/), // LOCALIZATION
  ],
};

// module.exports = clientConfig;
module.exports = [clientConfig, serverConfig];
