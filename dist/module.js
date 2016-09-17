'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseModule = undefined;

var _serverLoggerModule = require('@modern-mean/server-logger-module');

var _serverConfigModule = require('@modern-mean/server-config-module');

class BaseModule {

  constructor(...args) {

    this.configModule = new _serverConfigModule.ConfigModule(...args);
    this.config = this.configModule.get();

    this.loggerModule = new _serverLoggerModule.LoggerModule(this.configModule);
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

}
exports.BaseModule = BaseModule;