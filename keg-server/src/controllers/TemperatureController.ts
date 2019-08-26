import { Request, Response } from 'express';
import { monitor } from '../lib/PlatformMonitor';

export function getTemperature(req: Request, res: Response) {
  const temp = monitor.current();

  return res.send({ temperature: temp });
}
