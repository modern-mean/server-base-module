import { LoggerModule } from './logger';
import { ConfigModule } from './config';
import * as winston from 'winston';

export class BaseModule {

  protected logger: winston.LoggerInstance;
  protected loggerModule: LoggerModule;
  protected configModule: ConfigModule;


  constructor(...args) {

    //Config Module
    this.configModule = new ConfigModule(...args);

    //Logger Module.
    this.loggerModule = new LoggerModule(this.configModule, ...args);
    this.logger = this.loggerModule.getLogger();
  }

  getLogger(): winston.LoggerInstance {
    return this.logger;
  }

  getLoggerModule(): LoggerModule {
    return this.loggerModule;
  }

  getConfigModule(): ConfigModule {
    return this.configModule;
  }

}
