import * as test from 'blue-tape';
import * as sinon from 'sinon';
import * as winston from 'winston';
import * as Rx from '@reactivex/rxjs';
import * as moduleTest from '../src/base';

let loggerConfig: moduleTest.ModuleConfig = {
  module: 'winston',
  type: 'config',
  options: {
    level: 'debug'
  }
};

test('base.ts constructor args', (assert) => {
  let mod = new moduleTest.ServerModule();
  assert.equal(mod.getConfig() instanceof Rx.Observable, true, 'config should be public and instace of rx observable');
  assert.equal(mod.getLogger().level, 'info', 'should initialize default logger');
  assert.end();
});


test('base.ts constructor with config args', (assert) => {
  let mod = new moduleTest.ServerModule(loggerConfig);
  assert.equal(mod.getLogger().level, 'debug', 'should reconfigure logger');
  assert.end();
});
