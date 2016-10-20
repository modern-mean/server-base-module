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
  assert.equal(mod.config instanceof Rx.Subject, true, 'config should be public and instace of rx subject');
  assert.equal(mod.getSubscriptions().length, 2, 'should have two subscriptions');
  assert.equal(mod.getLogger().level, 'info', 'should initialize default logger');
  assert.end();
});


test('base.ts constructor with config args', (assert) => {
  let mod = new moduleTest.ServerModule(loggerConfig);
  assert.equal(mod.getLogger().level, 'debug', 'should reconfigure logger');
  assert.end();
});

test('base.ts config', (assert) => {
  let mod = new moduleTest.ServerModule();
  mod.config.next(loggerConfig);
  assert.equal(mod.getLogger().level, 'debug', 'should reconfigure logger');
  assert.end();
});

test('base.ts done()', (assert) => {
  let sandbox = sinon.sandbox.create();
  let mod = new moduleTest.ServerModule();
  mod.getSubscriptions().push(
    mod.config.subscribe(test => {})
  );

  let subs = mod.getSubscriptions();

  let sub1Spy = sandbox.spy(subs[0], 'unsubscribe');
  let sub2Spy = sandbox.spy(subs[1], 'unsubscribe');
  mod.done();

  assert.equal(sub1Spy.called, true, 'should call unsubscribe');
  assert.equal(sub2Spy.called, true, 'should call unsubscribe');

  sandbox.restore();
  assert.end();
});


