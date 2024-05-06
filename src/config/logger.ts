import { hostname } from 'os';
import pino from 'pino';
import { pid } from 'process';

const logger = pino({
  level: 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'dd-mm-yyyy HH:MM:ss.l',
        }
      },
      {
        level: 'error',
        target: 'pino/file',
        options: {
          destination: 'error.log',
          translateTime: 'dd-mm-yyyy HH:MM:ss.l',
            pid: pid,
            hostname: hostname(),
        }
      },
      {
        level: 'info',
        target: 'pino/file',
        options: {
          destination: 'combined.log',
          translateTime: 'dd-mm-yyyy HH:MM:ss.l',
          pid: pid,
          hostname: hostname(),
        }
      }
    ]
  }
});

export const stream = {
  write: (message: string) => logger.info(message.trim())
};

export default logger;
