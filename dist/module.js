'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MMBase = undefined;

var _serverLoggerModule = require('@modern-mean/server-logger-module');

var _serverConfigModule = require('@modern-mean/server-config-module');

class MMBase {

  constructor(...args) {

    //Initiate config
    let configModule = new _serverConfigModule.MMConfig(args[0]);
    configModule.merge();
    this.config = configModule;

    //Initaite logger
    let loggerModule = new _serverLoggerModule.MMLogger(args[1]);
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