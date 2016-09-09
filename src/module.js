import { LoggerModule } from '@modern-mean/server-logger-module';
import { ConfigModule } from '@modern-mean/server-config-module';
import { merge } from 'lodash';

export class BaseModule {

  constructor(...args) {

    this.configModule = new ConfigModule(this.parseArgs('config', args));
    this.loggerModule = new LoggerModule(this.parseArgs('logger', args));

  }

  getConfigModule() {
    return this.configModule;
  }

  getLoggerModule() {
    return this.loggerModule;
  }

  getConfig() {
    return this.configModule.get();
  }

  getLogger() {
    return this.loggerModule.get();
  }

  parseArgs(key, args) {
    let config = {};
    args.map(function (obj) {
      if (obj[key]) {
        config = merge(config, obj[key]);
      }
    });
    return ((Object.keys(config).length) ? config : undefined);
  }

}
