import { MMLogger } from '@modern-mean/server-logger-module';
import { MMConfig } from '@modern-mean/server-config-module';

export class MMBase {

  constructor(...args) {

    this.configModule = new MMConfig();

    if (args[0] !== undefined && typeof args[0] === 'object') {

      if (args[0].config) {
        //Initiate config
        this.configModule.set(args[0].config);
      }

      if (args[0].logger) {
        //Initaite logger
        let loggerModule = new MMLogger(args[0].logger);
        this.loggerModule = loggerModule;
      }

    }

  }

  getConfigModule() {
    return this.configModule;
  }

  getConfig() {
    return this.configModule.get();
  }

  getLoggerModule() {
    return this.loggerModule;
  }

}
