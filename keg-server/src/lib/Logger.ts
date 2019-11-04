import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
const logFolder = 'logs';
import { format } from 'logform';

const childName = format(info => {
  if (info.childName) {
    info.message = `[${info.childName}] ${info.message}`;
    info.childName = undefined;
  }

  return info;
});

const transports: any[] = [];

if (process.env.NODE_ENV !== 'test') {
  transports.push(
    new winston.transports.Console({
      level: 'silly',
      format: winston.format.combine(
        winston.format.splat(),
        winston.format.colorize(),
        childName(),
        winston.format.simple()
      ),
    })
  );
}

if (process.env.NODE_ENV === 'production') {
  transports.push(
    new DailyRotateFile({
      filename: path.join(logFolder, 'log'),
      datePattern: 'YYYY-MM-DD-HH',
      level: 'verbose',
      format: winston.format.combine(winston.format.splat(), childName(), winston.format.simple()),
    })
  );
}

export const logger = winston.createLogger({
  level: 'silly',
  transports,
});

export function childLogger(childName: string) {
  return logger.child({ childName });
}
