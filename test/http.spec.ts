import * as test from 'blue-tape';
import * as moduleTest from '../src/http';
import { Observable } from '@reactivex/rxjs';
import * as http from 'http';

test('http.ts export HttpServerModule', (assert) => {
  assert.notEqual(moduleTest.HttpServerModule, undefined, 'Should not be undefined');
  assert.end();
});

test('http.ts constructor', (assert) => {
  let mod = new moduleTest.HttpServerModule();
  assert.equal(typeof mod.getHttpServer().listen, 'function', 'create http server instance');
  assert.end();
});


test('http.ts listen/close default config', (assert) => {
  let mod = new moduleTest.HttpServerModule();

  let assertListen = new Observable(observer => {
    assert.equal(mod.getHttpServer().listening, true, 'http server should be listening');
    assert.equal(mod.getHttpServer().address().address, '0.0.0.0', 'http server should be listening on default address');
    assert.equal(mod.getHttpServer().address().port, 8080, 'http server should be listening on default port');
    observer.complete();
  });

  let assertClose = new Observable(observer => {
    assert.equal(mod.getHttpServer().listening, false, 'http server should not be listening');
    observer.complete();
  });

  let listen = mod.httpListen();
  let close = mod.httpClose();
  assert.equal(listen instanceof Observable, true, 'listen should return observable');
  assert.equal(close instanceof Observable, true, 'close should return observable');

  return listen.concat(assertListen, close, assertClose).toPromise();
});

test('http.ts listen/close custom config', (assert) => {
  let config = moduleTest.httpServerDefaultConfig();
  config.options.port = '8081';
  let mod = new moduleTest.HttpServerModule(config);

  let assertListen = new Observable(observer => {
    assert.equal(mod.getHttpServer().listening, true, 'http server should be listening');
    assert.equal(mod.getHttpServer().address().port, 8081, 'http server should be listening on custom port');
    observer.complete();
  });

  let assertClose = new Observable(observer => {
    assert.equal(mod.getHttpServer().listening, false, 'http server should not be listening');
    observer.complete();
  });

  let listen = mod.httpListen();
  let close = mod.httpClose();
  return listen.concat(assertListen, close, assertClose).toPromise();
});

