import { FakeTemperatureMonitor } from './FakeTemperatureMonitor';
import { TemperatureMonitor } from './TemperatureMonitor';
import { Ds18b20TemperatureMonitor } from './Ds18b20TemperatureMonitor';

export const monitor: TemperatureMonitor =
  process.platform === 'win32' ? new FakeTemperatureMonitor() : new Ds18b20TemperatureMonitor('28-0516c025cbff');
