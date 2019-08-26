import { EventEmitter } from 'events';
import { W1Therm } from './w1-therm';
import { TemperatureMonitor, TemperatureCallback } from './TemperatureMonitor';
import { childLogger } from './Logger';
const logger = childLogger('DS18B20');

export class Ds18b20TemperatureMonitor implements TemperatureMonitor {
  private token: NodeJS.Timeout;
  private _current: number;
  private therm: W1Therm;
  private emitter: EventEmitter;
  constructor(public readonly probe: string) {
    this.therm = new W1Therm(probe);
    this.emitter = new EventEmitter();
  }
  start() {
    logger.info('started polling temperature');
    this.token = setInterval(async () => {
      try {
        const temp = await this.therm.read();
        if (temp) {
          this._current = temp;
          this.emitter.emit('temp', this._current);
        }
      } catch (err) {
        console.error('Error reading temperature', err);
      }
    }, 10000);
  }
  stop() {
    if (this.token) {
      logger.info('stopped polling temperature');
      clearInterval(this.token);
      this.token = null;
    }
  }
  current() {
    return this._current;
  }
  onTemperature(cb: TemperatureCallback) {
    logger.silly('temperature subscriber connected');
    this.emitter.on('temp', cb);
  }
}
