import webpack from 'webpack';
import baseConfiguration from './webpack.config.server';
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

const configuration = baseConfiguration({
  development: false,
  css_bundle: true,
});

configuration.devtool = 'inline-source-map';

configuration.plugins.push(
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env.BABEL_ENV': JSON.stringify('es6'),

    __CLIENT__: JSON.stringify(false),
    __SERVER__: JSON.stringify(true),
    __STAGING__: JSON.stringify(false),
    __DEVELOPMENT__: JSON.stringify(false),
  }),
  new webpack.NamedModulesPlugin(),
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    openAnalyzer: false,
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false,
  }),
  new webpack.optimize.UglifyJsPlugin({
    beautify: false,
    mangle: {
      screw_ie8: true,
      keep_fnames: true,
    },
    compress: {
      warnings: false,
      screw_ie8: true,
    },
    comments: false,
  })
);

export default configuration;
