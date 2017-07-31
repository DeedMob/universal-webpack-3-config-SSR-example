import { client } from 'universal-webpack/config';
import settings from './universal-webpack-settings';
import configuration from './webpack.config';

export default function(options) {
  return client(configuration[0], settings, options);
}
