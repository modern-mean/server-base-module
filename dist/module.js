'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MMBase = undefined;

var _serverLoggerModule = require('@modern-mean/server-logger-module');

var _serverConfigModule = require('@modern-mean/server-config-module');

class MMBase {

  constructor(...args) {

    if (args[0].config) {
      //Initiate config
      let configModule = new _serverConfigModule.MMConfig(args[0].config);
      this.configModule = configModule;
    }

    if (args[0].logger) {
      //Initaite logger
      let loggerModule = new _serverLoggerModule.MMLogger(args[0].logger);
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
exports.MMBase = MMBase;