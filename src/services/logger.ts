import { Singleton } from 'typescript-ioc';

import { ICommandResult } from '../interfaces';

@Singleton
export class LoggerService {
  constructor() {
    this.watchGlobalUncaughtExceptions();
  }

  log(...args: (string | ICommandResult)[]) {
    console.log(this.timeStamp(), ...args);
  }

  logCommandResult(result: ICommandResult) {
    if (!result || (!result.result && !result.resultString)) { return; }
    this.log(result);
  }

  error(...args: Error[]) {
    console.error(this.timeStamp(), ...args);
  }

  private timeStamp() {
    return new Date();
  }

  private watchGlobalUncaughtExceptions() {
    process.on('uncaughtException', (e) => {
      this.error(e);
      process.exit(0);
    });
  }
}
