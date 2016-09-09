import { BaseModule } from '../src/module';
import { ConfigModule } from '@modern-mean/server-config-module';
import { LoggerModule } from '@modern-mean/server-logger-module';

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

      moduleTest = new BaseModule({ config: config, logger: loggerConfig });
      return moduleTest.should.be.an('object');
    });

    describe('ConfigModule', () => {

      it('should create ConfigModule module', () => {
        config = { okie: 'dokie' };
        moduleTest = new BaseModule();
        return expect(moduleTest.getConfigModule() instanceof ConfigModule).to.equal(true);
      });

      it('should set configuration based on config key', () => {
        moduleTest = new BaseModule({ config: config });
        return moduleTest.getConfigModule().get().okie.should.be.equal('dokie');
      });

    });

    describe('LoggerModule', () => {

      it('should create a LoggerModule module', () => {
        config = { okie: 'dokie' };
        moduleTest = new BaseModule();
        return expect(moduleTest.getLoggerModule() instanceof LoggerModule).to.equal(true);
      });

      it('should set configuration based on logger key', () => {
        moduleTest = new BaseModule({ logger: loggerConfig });
        return moduleTest.getLoggerModule().config.winston.console.should.be.equal('false');
      });

    });

  });

  describe('getConfigModule', () => {

    it('should create configuration module', () => {
      config = { okie: 'dokie' };
      moduleTest = new BaseModule({ config: config, logger: loggerConfig });
      return expect(moduleTest.getConfigModule() instanceof ConfigModule).to.equal(true);
    });

  });

  describe('getLoggerModule', () => {

    it('should return a logger module', () => {
      config = { okie: 'dokie' };
      moduleTest = new BaseModule({ config: config, logger: loggerConfig });
      return expect(moduleTest.getLoggerModule() instanceof LoggerModule).to.equal(true);
    });

  });

  describe('getConfig', () => {

    it('should return configuration object', () => {
      config = { okie: 'dokie' };
      moduleTest = new BaseModule({ config: config, logger: loggerConfig });
      moduleTest.getConfig().okie.should.be.equal('dokie');
    });

  });

  describe('getLogger', () => {

    it('should return winston object', () => {
      moduleTest = new BaseModule({ logger: loggerConfig });
      moduleTest.getLogger().debug.should.be.a('function');
    });

  });

});
