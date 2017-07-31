import 'source-map-support/register';

import startServer from 'universal-webpack/server';
import settings from './universal-webpack-settings';
// `configuration.context` and `configuration.output.path` are used
import configuration from './webpack.config';

startServer(configuration[1], settings);
