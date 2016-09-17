import { BaseModule } from '../src/module';
import { ConfigModule } from '@modern-mean/server-config-module';
import { LoggerModule } from '@modern-mean/server-logger-module';

let sandbox,
  moduleTest,
  config;

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
      moduleTest = new BaseModule();
      return moduleTest.should.be.an('object');
    });

    describe('ConfigModule', () => {

      it('should create ConfigModule module', () => {
        moduleTest = new BaseModule();
        return expect(moduleTest.getConfigModule() instanceof ConfigModule).to.equal(true);
      });

      it('should set config', () => {
        moduleTest = new BaseModule({ TestModule: { okie: 'dokie' } });
        return moduleTest.config.TestModule.okie.should.be.equal('dokie');
      });

      it('should set initialize configuration module', () => {
        moduleTest = new BaseModule({ TestModule: { okie: 'dokie' } });
        return moduleTest.getConfigModule().get().TestModule.okie.should.be.equal('dokie');
      });

    });

    describe('LoggerModule', () => {

      it('should create a LoggerModule module', () => {
        moduleTest = new BaseModule();
        return expect(moduleTest.getLoggerModule() instanceof LoggerModule).to.equal(true);
      });

      it('should set configuration based on logger key', () => {
        moduleTest = new BaseModule({ LoggerModule: { console: false } });
        return moduleTest.getLoggerModule().config.console.should.be.equal(false);
      });

    });

  });

  describe('getConfigModule', () => {

    it('should return configuration module', () => {
      moduleTest = new BaseModule();
      return expect(moduleTest.getConfigModule() instanceof ConfigModule).to.equal(true);
    });

  });

  describe('getLoggerModule', () => {

    it('should return a logger module', () => {
      moduleTest = new BaseModule();
      return expect(moduleTest.getLoggerModule() instanceof LoggerModule).to.equal(true);
    });

  });

  describe('getConfig', () => {

    it('should return configuration object', () => {
      config = { okie: 'dokie' };
      moduleTest = new BaseModule({ TestModule: config });
      return moduleTest.getConfig().TestModule.okie.should.be.equal('dokie');
    });

  });

  describe('getLogger', () => {

    it('should return winston object', () => {
      moduleTest = new BaseModule();
      return moduleTest.getLogger().debug.should.be.a('function');
    });

  });

});
