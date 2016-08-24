'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MMBase = undefined;

var _serverLoggerModule = require('@modern-mean/server-logger-module');

var _serverConfigModule = require('@modern-mean/server-config-module');

class MMBase {

  constructor(...args) {
    console.log(args);

    //Initiate config
    let configModule = new _serverConfigModule.MMConfig(config);
    configModule.merge(configMerge);
    this.config = configModule;

    //Initaite logger
    let loggerModule = new _serverLoggerModule.MMLogger(this.config.logs);
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
exports.MMBase = MMBase;