import { Injectable, LoggerService, Global } from '@nestjs/common';
import { createLogger, transports, format } from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private readonly logger;

  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
      ),
      transports: [
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        }),
        new transports.DailyRotateFile({
          filename: 'logs/%DATE%-logs.log', // Rotate logs daily
          datePattern: 'YYYY-MM-DD',
          maxFiles: '7d', // Keep logs for 7 days
        }),
      ],
    });
  }

  log(message: string, requestId: string) {
    const logMessage = `Request ID: ${requestId} - ${message}`;
    this.logger.info(logMessage);
  }

  error(message: string, trace: string, requestId: string) {
    const logMessage = `Request ID: ${requestId} - ${message} - ${trace}`;
    this.logger.error(logMessage);
  }

  warn(message: string, requestId: string) {
    const logMessage = `Request ID: ${requestId} - ${message}`;
    this.logger.warn(logMessage);
  }

  debug(message: string, requestId: string) {
    const logMessage = `Request ID: ${requestId} - ${message}`;
    this.logger.debug(logMessage);
  }
}
