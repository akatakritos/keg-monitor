import errorHandler from 'errorhandler';
import ioFactory from 'socket.io';

import app from './app';
import { monitor } from './lib/PlatformMonitor';
import { logger } from './lib/Logger';

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
const server = app.listen(app.get('port'), () => {
  logger.info('App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
  // console.log('  App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
  // console.log('  Press CTRL-C to stop\n');
});

const io = ioFactory(server);

monitor.onTemperature((temperature: number) => {
  logger.debug('emit %d on socket.io', temperature);
  io.emit('temp', { temperature });
});

monitor.start();

export default server;
