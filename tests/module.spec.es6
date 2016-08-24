'use strict';

import { MMBase } from '../src/module.es6';
import { MMConfig } from '@modern-mean/server-config-module';
import { MMLogger } from '@modern-mean/server-logger-module';

let sandbox,
  moduleTest,
  config,
  loggerConfig;

loggerConfig = {
  winston: {
    level:  process.env.MM_EXPRESS_LOG_LEVEL || process.env.MM_LOG_LEVEL || 'info', //{ error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
    file: process.env.MM_EXPRESS_LOG_FILE || process.env.MM_LOG_FILE || 'false',
    console: process.env.MM_EXPRESS_LOG_CONSOLE || process.env.MM_LOG_CONSOLE || 'true'
  }
};

describe('/src/module', () => {

  beforeEach(() => {
    return sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    return sandbox.restore();
  });

  describe('constructor', () => {

    it('should return an object', () => {
      config = { okie: 'dokie' };
      moduleTest = new MMBase({ MMConfig: config, MMLogger: loggerConfig });
      return moduleTest.should.be.an('object');
    });

    it('should create configuration module', () => {
      config = { okie: 'dokie' };
      moduleTest = new MMBase({ MMConfig: config, MMLogger: loggerConfig });
      return expect(moduleTest.getConfigModule() instanceof MMConfig).to.equal(true);
    });

    it('should create a logger module', () => {
      config = { okie: 'dokie' };
      moduleTest = new MMBase({ MMConfig: config, MMLogger: loggerConfig });
      return expect(moduleTest.getLoggerModule() instanceof MMLogger).to.equal(true);
    });

  });

  describe('getConfigModule', () => {

    it('should create configuration module', () => {
      config = { okie: 'dokie' };
      moduleTest = new MMBase({ MMConfig: config, MMLogger: loggerConfig });
      return expect(moduleTest.getConfigModule() instanceof MMConfig).to.equal(true);
    });

  });

  describe('getLoggerModule', () => {

    it('should return a logger module', () => {
      config = { okie: 'dokie' };
      moduleTest = new MMBase({ MMConfig: config, MMLogger: loggerConfig });
      return expect(moduleTest.getLoggerModule() instanceof MMLogger).to.equal(true);
    });

  });

  describe('getConfig', () => {

    it('should return configuration object', () => {
      config = { okie: 'dokie' };
      moduleTest = new MMBase({ MMConfig: config, MMLogger: loggerConfig });
      moduleTest.getConfig().okie.should.be.equal('dokie');
    });

  });

});
