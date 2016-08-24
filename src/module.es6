import { MMLogger } from '@modern-mean/server-logger-module';
import { MMConfig } from '@modern-mean/server-config-module';

export class MMBase {

  constructor(...args) {


    //Initiate config
    let configModule = new MMConfig(args[0]);
    configModule.merge();
    this.config = configModule;

    //Initaite logger
    let loggerModule = new MMLogger(args[1]);
    this.logger = loggerModule;

  }

  getConfigModule() {
    return this.config;
  }

  getConfig() {
    return this.config.get();
  }

  getLoggerModule() {
    return this.logger;
  }

}
