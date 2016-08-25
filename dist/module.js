'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MMBase = undefined;

var _serverLoggerModule = require('@modern-mean/server-logger-module');

var _serverConfigModule = require('@modern-mean/server-config-module');

var _lodash = require('lodash');

let loggerModule, configModule;

class MMBase {

  constructor(...args) {

    configModule = new _serverConfigModule.MMConfig(this.parseArgs('MMConfig', args));
    loggerModule = new _serverLoggerModule.MMLogger(this.parseArgs('MMLogger', args));
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
        config = (0, _lodash.merge)(config, obj[key]);
      }
    });
    return Object.keys(config).length ? config : undefined;
  }

}
exports.MMBase = MMBase;