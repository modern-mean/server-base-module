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
    level:  'info',
    file: 'false',
    console: 'false'
  }
};

config = { okie: 'dokie' };

describe('/src/module', () => {

  beforeEach(() => {
    return sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    return sandbox.restore();
  });

  describe('constructor', () => {

    it('should return an object', () => {

      moduleTest = new MMBase({ MMConfig: config, MMLogger: loggerConfig });
      return moduleTest.should.be.an('object');
    });

    describe('MMConfig', () => {

      it('should create MMConfig module', () => {
        config = { okie: 'dokie' };
        moduleTest = new MMBase();
        return expect(moduleTest.getConfigModule() instanceof MMConfig).to.equal(true);
      });

      it('should set configuration based on MMConfig key', () => {
        moduleTest = new MMBase({ MMConfig: config });
        return moduleTest.getConfigModule().get().okie.should.be.equal('dokie');
      });

    });

    describe('MMLogger', () => {

      it('should create a MMLogger module', () => {
        config = { okie: 'dokie' };
        moduleTest = new MMBase();
        return expect(moduleTest.getLoggerModule() instanceof MMLogger).to.equal(true);
      });

      it('should set configuration based on MMLogger key', () => {
        moduleTest = new MMBase({ MMLogger: loggerConfig });
        return moduleTest.getLoggerModule().getConfig().winston.console.should.be.equal('false');
      });

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
