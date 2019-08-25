import errorHandler from 'errorhandler';
import ioFactory from 'socket.io';

import app from './app';
import { FakeTemperatureMonitor } from './controllers/temperature-controller';

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
const server = app.listen(app.get('port'), () => {
  console.log('  App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

const io = ioFactory(server);

const monitor = new FakeTemperatureMonitor();
monitor.on('temp', temperature => {
  console.log('broadcasting temp', temperature);
  io.emit('temp', { temperature });
});

monitor.start();

export default server;
