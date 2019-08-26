import { EventEmitter } from 'events';
import { TemperatureMonitor, TemperatureCallback } from './TemperatureMonitor';
import { childLogger } from './Logger';
const logger = childLogger('FakeTemp');

export class FakeTemperatureMonitor implements TemperatureMonitor {
  private token: NodeJS.Timeout;
  private _current: number;
  private emitter: EventEmitter;
  constructor() {
    this.emitter = new EventEmitter();
  }
  start() {
    logger.info('started polling');
    this.token = setInterval(() => {
      this._current = 40 + Math.random() * 5;
      this.emitter.emit('temp', this._current);
    }, 5000);
  }
  stop() {
    logger.info('stopped polling');
    clearInterval(this.token);
  }
  current() {
    return this._current;
  }
  onTemperature(cb: TemperatureCallback) {
    logger.silly('temp subscriber connected');
    this.emitter.on('temp', cb);
  }
}
