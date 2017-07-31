const webpack = require('webpack');
const baseConfiguration = require('./webpack.config.server');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

const configuration = baseConfiguration({
  development: true,
  css_bundle: true,
});

configuration.devtool = 'inline-source-map';

configuration.plugins.push(
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    openAnalyzer: false,
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development'),
    'process.env.BABEL_ENV': JSON.stringify('es6'),

    __CLIENT__: JSON.stringify(false),
    __SERVER__: JSON.stringify(true),
    __STAGING__: JSON.stringify(false),
    __DEVELOPMENT__: JSON.stringify(true),
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin()
);

export default configuration;
