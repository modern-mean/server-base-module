import { ConfigModule, ModuleConfig } from './config';
import * as winston from 'winston';

export class LoggerModule {

  private config: ModuleConfig;
  private configModule: ConfigModule;
  private transports: Array<winston.TransportInstance>;
  private logger: winston.LoggerInstance;


  constructor(...args) {

    args.forEach(arg => {
      if (arg instanceof winston.Logger) {
        this.logger = arg;
        return false;
      }
      else if (arg instanceof ConfigModule) {
        this.configModule = arg;
      }
    });

    if (!this.logger) {

      this.config = this.configModule.getModule('LoggerModule') || this.configModule.defaults(LoggerDefaultConfig());

      this.transports = [];
      if (this.config.options.file) {
        this.transports.push(new (winston.transports.File)({ filename: this.config.options.file }));
      }

      if (this.config.options.console) {
        this.transports.push(new (winston.transports.Console)());
      }

      this.logger = new (winston.Logger)({
        level: this.config.options.level,
        transports: this.transports
      });
    }

  }

  getLogger(): winston.LoggerInstance {
    return this.logger;
  }

}

export interface LoggerOptions {
  level: string
  file: string,
  console: boolean
}

export function LoggerDefaultConfig() {
  let options: LoggerOptions = {
    level: process.env.LOGGERMODULE_LEVEL || 'info',
    file: process.env.LOGGERMODULE_FILE || false,
    console: process.env.LOGGERMODULE_CONSOLE ? false : true
  };
  let config: ModuleConfig = {
    module: 'LoggerModule',
    type: 'config',
    options: options
  };
  return config;
}
