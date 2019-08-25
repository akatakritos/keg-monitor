import { Request, Response } from 'express';
import { EventEmitter } from 'events';

export interface TemperatureMonitor {
  start(): void;
  stop(): void;
  current(): number;
}

export class Ds18b20TemperatureMonitor extends EventEmitter implements TemperatureMonitor {
  constructor(public readonly probe: string) {
    super();
  }

  start() {}

  stop() {}

  current() {
    return 0;
  }
}

export class FakeTemperatureMonitor extends EventEmitter implements TemperatureMonitor {
  private token: NodeJS.Timeout;
  private _current: number;

  constructor() {
    super();
  }

  start() {
    this.token = setInterval(() => {
      this._current = 40 + Math.random() * 5;
      this.emit('temp', this._current);
    }, 5000);
  }

  stop() {
    clearInterval(this.token);
  }

  current() {
    return this._current;
  }
}

const monitor = new FakeTemperatureMonitor();
monitor.start();

export function getTemperature(req: Request, res: Response) {
  const temp = monitor.current();

  return res.send({ temperature: temp });
}
