'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseModule = undefined;

var _serverLoggerModule = require('@modern-mean/server-logger-module');

var _serverConfigModule = require('@modern-mean/server-config-module');

var _lodash = require('lodash');

class BaseModule {

  constructor(...args) {

    this.configModule = new _serverConfigModule.ConfigModule(this.parseArgs('config', args));
    this.loggerModule = new _serverLoggerModule.LoggerModule(this.parseArgs('logger', args));
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
        config = (0, _lodash.merge)(config, obj[key]);
      }
    });
    return Object.keys(config).length ? config : undefined;
  }

}
exports.BaseModule = BaseModule;