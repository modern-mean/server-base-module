import * as test from 'blue-tape';
import * as sinon from 'sinon';
import { ConfigModule, ModuleConfig } from '../src/config';
import * as lodash from 'lodash';

test('config.ts constructor with no args', (assert) => {
  let moduleTest = new ConfigModule();
  assert.pass('run without failure');
  assert.equal(moduleTest.get().length, 0, 'should be empty array');
  assert.end();
});

test('config.ts constructor with args', (assert) => {
  let testconfig: ModuleConfig = {
    module: 'TestModule',
    type: 'config',
    options: {
      test: 'option'
    }
  };
  let moduleTest = new ConfigModule(testconfig, { okie: 'dokie' }, { yes: 'sir' });
  assert.pass('run without failure');
  assert.equal(moduleTest.get().length, 1, 'should be array with 1 length');
  assert.end();
});

test('config.ts defaults', (assert) => {
  let sandbox = sinon.sandbox.create();
  let spy = sandbox.spy(lodash, 'defaultsDeep');
  let testconfig: ModuleConfig = {
    module: 'TestModule',
    type: 'config',
    options: {
      test: 'option'
    }
  };
  let moduleTest = new ConfigModule(testconfig);
  moduleTest.defaults(testconfig);
  assert.equal(spy.called, true, 'should call lodash.defaultsDeep');
  assert.deepEqual(spy.args[0], [moduleTest.getModule('TestModule'), testconfig], 'should call lodash.defaultsDeep with arguments');
  sandbox.restore();
  assert.end();
});

test('config.ts defaults', (assert) => {
  let testconfig: ModuleConfig = {
    module: 'TestModule',
    type: 'config',
    options: {
      test: 'option'
    }
  };
  let moduleTest = new ConfigModule();
  moduleTest.defaults(testconfig);
  assert.deepEqual(moduleTest.getModule('TestModule'), testconfig, 'push configuration to array if it doesnt exit');
  assert.end();
});

test('config.ts merge', (assert) => {
  let testconfig: ModuleConfig = {
    module: 'TestModule',
    type: 'config',
    options: {
      test: 'option'
    }
  };
  let moduleTest = new ConfigModule();
  moduleTest.merge(testconfig);
  assert.deepEqual(moduleTest.getModule('TestModule'), testconfig, 'push configuration to array if it doesnt exit');
  assert.end();
});

test('config.ts merge', (assert) => {
  let sandbox = sinon.sandbox.create();
  let spy = sandbox.spy(lodash, 'merge');
  let testconfig: ModuleConfig = {
    module: 'TestModule',
    type: 'config',
    options: {
      test: 'option'
    }
  };
  let moduleTest = new ConfigModule(testconfig);
  moduleTest.merge(testconfig);
  assert.equal(spy.called, true, 'should call lodash.merge');
  assert.deepEqual(spy.args[0], [moduleTest.getModule('TestModule'), testconfig], 'should call lodash.merge with arguments');
  sandbox.restore();
  assert.end();
});

