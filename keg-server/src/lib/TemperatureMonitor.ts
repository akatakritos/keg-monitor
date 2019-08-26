export type TemperatureCallback = (temperature: number) => void;
export interface TemperatureMonitor {
  start(): void;
  stop(): void;
  current(): number;
  onTemperature(callback: TemperatureCallback): void;
}
