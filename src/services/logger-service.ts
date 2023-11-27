import { Inject, Singleton } from 'typescript-ioc';

import pino, { Level, Logger } from 'pino';
import { EnvService } from './env-service';

@Singleton
export class LoggerService {
  @Inject private envService: EnvService;
  private readonly logger: Logger;
  constructor() {
    this.logger = pino({
      level: this.envService.logLevel,
      timestamp: pino.stdTimeFunctions.isoTime
    });
  }
  get log(): Logger {
    return this.logger
  }
  enableLogging() {
    this.logger.level = this.envService.logLevel;
  }
  disableLogging() {
    this.logger.level = 'silent';
  }
  setLoggingLevel(level: Level) {
    this.logger.level = level;
  }
}
