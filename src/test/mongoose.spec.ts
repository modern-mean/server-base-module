import * as test from 'blue-tape';
import * as sinon from 'sinon';
import * as Rx from '@reactivex/rxjs';
import * as mongoose from 'mongoose';
import * as moduleTest from '../src/mongoose';

test('mongoose.ts constructor args', (assert) => {
  let mod = new moduleTest.MongooseModule();
  assert.deepEqual(mod.getMongooseConfig(), moduleTest.MongooseDefaultConfig(), 'should defaulty configure the module');
  assert.end();
});

test('mongoose.ts constructor args', (assert) => {
  let customConfig = moduleTest.MongooseDefaultConfig();
  customConfig.options.debug = true;
  let mod = new moduleTest.MongooseModule(customConfig);
  assert.equal(mod.getMongooseConfig(), customConfig, 'should custom configure the module');
  assert.end();
});

test('mongoose.ts connect()', (assert) => {
  let sandbox = sinon.sandbox.create();
  let mod = new moduleTest.MongooseModule();
  let config = mod.getMongooseConfig();

  //spies
  let connectSpy = sandbox.spy(mongoose, 'connect');

  //execute
  mod.connect().subscribe();

  //assert
  assert.equal(connectSpy.calledWith(config.options.uri, config.options.options), true, 'should call mongoose connect with configuration');

  sandbox.restore();
  return mod.disconnect().toPromise();
});

test('mongoose.ts connect() already connected', (assert) => {
  let mod = new moduleTest.MongooseModule();
  let config = mod.getMongooseConfig();

  //execute
  mod.connect()
    .concat(mod.connect())
    .subscribe(idk => undefined, err => {
      assert.equal(err, 'Already Connected', 'should error with already connected');
      mod.disconnect().subscribe();
      assert.end();
    });
});


