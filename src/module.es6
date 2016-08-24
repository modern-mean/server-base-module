import { MMLogger } from '@modern-mean/server-logger-module';
import { MMConfig } from '@modern-mean/server-config-module';

export class MMBase {

  constructor(...args) {

    if (args[0].config) {
      //Initiate config
      let configModule = new MMConfig(args[0].config);
      this.configModule = configModule;
    }

    if (args[0].logger) {
      //Initaite logger
      let loggerModule = new MMLogger(args[0].logger);
      this.loggerModule = loggerModule;
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
