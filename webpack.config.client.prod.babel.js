import webpack from 'webpack';
import baseConfiguration from './webpack.config.client';
import SWPrecacheWebpackPlugin from 'sw-precache-webpack-plugin';
import WebpackPwaManifest from 'webpack-pwa-manifest';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import path from 'path';
// FIXME chunkhash caching
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const configuration = baseConfiguration({
  development: false,
  css_bundle: true,
});
// TODO add DLLs
import { PUBLIC_PATH } from './webpack.config';
configuration.devtool = 'hidden-source-map';

configuration.plugins.push(
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env.BABEL_ENV': JSON.stringify('es6'),

    __CLIENT__: JSON.stringify(true),
    __SERVER__: JSON.stringify(false),
    __STAGING__: JSON.stringify(false),
    __DEVELOPMENT__: JSON.stringify(false),
  }),
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    openAnalyzer: false,
  }),
  new webpack.NamedModulesPlugin(),
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
  }),
  new SWPrecacheWebpackPlugin({
    cacheId: 'deedmob-com',
    dontCacheBustUrlsMatching: /\.\w{8}\./,
    filename: 'service-worker.js',
    minify: false,
    navigateFallback: PUBLIC_PATH,
    staticFileGlobsIgnorePatterns: [/\.map$/, /manifest\.json$/],
    runtimeCaching: [
      {
        handler: 'fastest',
        urlPattern: /^https:\/\/(www\.)?deedmob.com$/,
      },
    ],
  }),
  new WebpackPwaManifest({
    name: 'DeedMob',
    short_name: 'DeedMob',
    description: 'Find volunteering nearby!',
    background_color: '#43CBFD',
    display: 'standalone',
    orientation: 'portrait',
    theme_color: '#43CBFD',
    'theme-color': '#43CBFD',
    start_url: './index.html',
    icons: [
      {
        src: path.resolve('static/icon-sq.png'),
        sizes: [96, 128, 192, 256, 384, 512],
        destination: path.join('assets', 'icons'),
      },
    ],
    inject: false,
    fingerprints: false,
  }),
  new HtmlWebpackPlugin()
);

export default configuration;
