import webpack from 'webpack';
import baseConfiguration from './webpack.config.client';
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

const configuration = baseConfiguration({
  development: true,
  css_bundle: true,
});

configuration.devtool = 'inline-source-map';

configuration.devServer = {
  port: 3001,
  publicPath: 'http://localhost:3001/dist/',
  headers: { 'Access-Control-Allow-Origin': '*' },
  compress: true,
  hot: true,
  clientLogLevel: "error",
  stats: {
    // minimal logging
    assets: false,
    colors: true,
    version: false,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false,
    children: false
  }
};

configuration.output.publicPath = 'http://localhost:3001/dist/';

configuration.plugins.push(
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    openAnalyzer: false,
  }),
  new webpack.DefinePlugin({
    // DefinePlugin will stringify anyways, but this is clearer
    'process.env.NODE_ENV': JSON.stringify('development'),
    'process.env.BABEL_ENV': JSON.stringify('es6'),

    __CLIENT__: JSON.stringify(true),
    __SERVER__: JSON.stringify(false),
    __STAGING__: JSON.stringify(false),
    __DEVELOPMENT__: JSON.stringify(true),
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin()
);

export default configuration;
