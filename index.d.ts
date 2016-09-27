import * as winston from 'winston';
import * as tsModule from './index';

/*
  module.ts
*/
declare class BaseModule {
  logger: winston.LoggerInstance;
  loggerModule: LoggerModule;
  configModule: ConfigModule;

  constructor(...args);
  getLogger: winston.LoggerInstance;
  getLoggerModule(): tsModule.LoggerModule;
  getConfigModule(): tsModule.ConfigModule;
}

/*
  logger.ts
*/
declare class LoggerModule {
  config: tsModule.ModuleConfig;
  configModule: tsModule.ConfigModule;
  transports: Array<winston.TransportInstance>;
  logger: winston.LoggerInstance;

  constructor(...args);
  getLogger: winston.LoggerInstance;
}

declare interface LoggerOptions {
  level: string
  file: string,
  console: boolean
}

declare function LoggerDefaultConfig(): ModuleConfig;

/*
  config.ts
*/
declare class ConfigModule {
  config: Array<ModuleConfig>;

  constructor(...args);
  get(): Array<ModuleConfig>;
  getModule(module: string): ModuleConfig;
  defaults(module: ModuleConfig): ModuleConfig;
}

declare interface ModuleConfig {
  module: string,
  type: string,
  options: any
}
