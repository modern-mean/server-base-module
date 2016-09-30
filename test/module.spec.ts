import * as test from 'blue-tape';
import * as sinon from 'sinon';
import { BaseModule } from '../src/module';
import { ConfigModule, createConfig, ModuleConfig } from '../src/config';
import * as Logger from '../src/logger';
import * as winston from 'winston';

test('module.ts constructor with no args', (assert) => {
  let moduleTest = new BaseModule();
  assert.pass('run without failure');
  assert.notEqual(moduleTest.getLogger(), undefined, 'should instatiate logger');
  assert.notEqual(moduleTest.getLoggerModule(), undefined, 'should instatiate loggerModule');
  assert.notEqual(moduleTest.getConfigModule(), undefined, 'should instatiate configModule');
  assert.end();
});

test('module.ts constructor with args', (assert) => {
  let moduleTest = new BaseModule();
  assert.pass('run without failure');
  assert.notEqual(moduleTest.getLogger(), undefined, 'should instatiate logger');
  assert.notEqual(moduleTest.getLoggerModule(), undefined, 'should instatiate loggerModule');
  assert.notEqual(moduleTest.getConfigModule(), undefined, 'should instatiate configModule');
  assert.end();
});

test('module.ts getLogger', (assert) => {
  let moduleTest = new BaseModule();
  assert.equal(moduleTest.getLogger() instanceof winston.Logger, true, 'return instance of winston logger');
  assert.end();
});

test('module.ts getLoggerModule', (assert) => {
  let moduleTest = new BaseModule();
  assert.equal(moduleTest.getLoggerModule() instanceof Logger.LoggerModule, true, 'return instance of LoggerModule');
  assert.end();
});

test('module.ts getConfigModule', (assert) => {
  let moduleTest = new BaseModule();
  assert.equal(moduleTest.getConfigModule() instanceof ConfigModule, true, 'return instance of ConfigModule');
  assert.end();
});

test.only('module.ts constructor with LoggerModule config in args', (assert) => {
  let config: ModuleConfig = createConfig('LoggerModule');
  config.options.level = 'silly';
  let moduleTest = new BaseModule(config);
  assert.equal(moduleTest.getLogger().level, 'silly', 'should have log level silly');
  assert.end();
});
