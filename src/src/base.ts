import * as winston from 'winston';
import * as Rx from '@reactivex/rxjs';

export interface ModuleConfig {
  module: string,
  type: string,
  options: any
}

export interface ServerModuleInterface {

  getLogger(): winston.LoggerInstance,
  getConfig(): Rx.Observable<ModuleConfig>

}

export class ServerModule implements ServerModuleInterface {

  protected config: Rx.Observable<ModuleConfig>;
  protected logger: winston.LoggerInstance;


  constructor(...args) {


    //Setup config Observable
    this.config = Rx.Observable.from([ loggerDefaultConfig(), ...args ])
      .filter(arg => isConfig(arg));



    //Create Logger
    this.config
      .filter(config => config.module === 'winston')
      .takeLast(1)
      .subscribe(config => {
        this.logger = new winston.Logger(config.options);
      });

  }

  getLogger(): winston.LoggerInstance {
    return this.logger;
  }

  getConfig(): Rx.Observable<ModuleConfig> {
    return this.config;
  }

}

export function isConfig(config: any): config is ModuleConfig {
  if (typeof config !== 'object' || !config.module || config.type !== 'config' || !config.options) {
    return false;
  }

  return true;
}

export function loggerDefaultConfig() {
  return {
    module: 'winston',
    type: 'config',
    options: {
      level: process.env.LOGGER_LEVEL || 'info',
      transports: [
        process.env.LOGGER_CONSOLE_DISABLE ? undefined : new (winston.transports.Console)()
      ]
    }
  };
}
