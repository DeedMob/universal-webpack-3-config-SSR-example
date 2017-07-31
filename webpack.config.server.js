import { server } from 'universal-webpack/config';
import settings from './universal-webpack-settings';
import baseConfiguration from './webpack.config';

export default function(options) {
  return server(baseConfiguration[1], settings, options);
}
