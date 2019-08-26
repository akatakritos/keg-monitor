import fs from 'fs';
import util from 'util';
import { childLogger } from './Logger';
const logger = childLogger('W1Therm');

const readFile = util.promisify(fs.readFile);

function convertToFahrenheit(value: number) {
  const celcius = value / 1000;
  return celcius * 1.8 + 32;
}

export class W1Therm {
  private path: string;

  constructor(public readonly device: string) {
    this.path = `/sys/bus/w1/devices/${device}/w1_slave`;
  }

  async read(): Promise<number> {
    logger.silly('read from %s', this.path);

    const contents = await readFile(this.path, 'utf8');
    const match = /t=(\d+)/.exec(contents);

    if (match) {
      logger.silly('matched "%s"', match[1]);
      return convertToFahrenheit(Number(match[1]));
    }

    throw new Error(`Could not find a temperature inside of "${this.path}"`);
  }
}
