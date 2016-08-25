import { MMLogger } from '@modern-mean/server-logger-module';
import { MMConfig } from '@modern-mean/server-config-module';
import { merge } from 'lodash';


let loggerModule,
  configModule;

export class MMBase {

  constructor(...args) {

    configModule = new MMConfig(this.parseArgs('MMConfig', args));
    loggerModule = new MMLogger(this.parseArgs('MMLogger', args));

  }

  getConfigModule() {
    return configModule;
  }

  getLoggerModule() {
    return loggerModule;
  }

  getConfig() {
    return configModule.get();
  }

  getLogger() {
    return loggerModule.get();
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
