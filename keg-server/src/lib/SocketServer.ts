import { childLogger } from './Logger';

const logger = childLogger('socket');

interface ISocket {
  io: SocketIO.Server;
  emitTemp(temperature: number): void;
  emitRefresh(): void;
}

export const SocketServer: ISocket = {
  io: null,

  emitTemp(temperature: number) {
    logger.debug('emit temperature %d', temperature);
    this.io.emit('temp', { temperature });
  },

  emitRefresh() {
    logger.debug('emit refresh');
    this.io.emit('refresh');
  },
};
