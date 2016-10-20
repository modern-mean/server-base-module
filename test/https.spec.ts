import * as test from 'blue-tape';
import * as moduleTest from '../src/https';
import { Observable } from '@reactivex/rxjs';
import * as sinon from 'sinon';

test('https.ts export HttpsServerModule', (assert) => {
  assert.notEqual(moduleTest.HttpsServerModule, undefined, 'Should not be undefined');
  assert.end();
});

test('https.ts constructor', (assert) => {
  let mod = new moduleTest.HttpsServerModule();

  assert.equal(typeof mod.getHttpServer().listen, 'function', 'create http server instance');


  assert.end();
});


test('https.ts listen/close default config', (assert) => {
  let sandbox = sinon.sandbox.create();
  let mod = new moduleTest.HttpsServerModule();

  let listenSpy = sandbox.spy(mod, 'httpListen');
  let closeSpy = sandbox.spy(mod, 'httpClose');

  let assertListen = new Observable(observer => {
    assert.equal(mod.getHttpsServer().address().address, '0.0.0.0', 'https server should be listening on default address');
    assert.equal(mod.getHttpsServer().address().port, 8443, 'https server should be listening on default port');
    assert.equal(listenSpy.called, true, 'should call httpListen');
    observer.complete();
  });

  let assertClose = new Observable(observer => {
    assert.equal(closeSpy.called, true, 'should call httpClose');
    observer.complete();
  });

  let listen = mod.httpsListen();
  let close = mod.httpsClose();
  assert.equal(listen instanceof Observable, true, 'listen should return observable');
  assert.equal(close instanceof Observable, true, 'close should return observable');

  return listen.concat(assertListen, close, assertClose).toPromise();
});

test('https.ts listen/close custom config', (assert) => {
  let mod = new moduleTest.HttpsServerModule();
  let config = moduleTest.httpsServerDefaultConfig();
  config.options.port = '8444';
  mod.config.next(config);
  let assertListen = new Observable(observer => {
    assert.equal(mod.getHttpsServer().address().port, 8444, 'https server should be listening on custom port');
    observer.complete();
  });

  let listen = mod.httpsListen();
  let close = mod.httpsClose();
  return listen.concat(assertListen, close).toPromise();
});

