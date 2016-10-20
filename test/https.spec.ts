import * as test from 'blue-tape';
import * as moduleTest from '../src/https';
import { Observable } from '@reactivex/rxjs';
import * as https from 'https';

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
  let mod = new moduleTest.HttpsServerModule();

  let assertListen = new Observable(observer => {
    assert.equal(mod.getHttpsServer().address().address, '0.0.0.0', 'http server should be listening on default address');
    assert.equal(mod.getHttpsServer().address().port, 8443, 'http server should be listening on default port');
    observer.complete();
  });

  let listen = mod.httpsListen();
  let close = mod.httpsClose();
  assert.equal(listen instanceof Observable, true, 'listen should return observable');
  assert.equal(close instanceof Observable, true, 'close should return observable');

  return listen.concat(assertListen, close).toPromise();
});

test('https.ts listen/close custom config', (assert) => {
  let mod = new moduleTest.HttpsServerModule();
  let config = moduleTest.httpsServerDefaultConfig();
  config.options.port = '8444';
  mod.config.next(config);
  let assertListen = new Observable(observer => {
    assert.equal(mod.getHttpsServer().address().port, 8444, 'http server should be listening on custom port');
    observer.complete();
  });

  let listen = mod.httpsListen();
  let close = mod.httpsClose();
  return listen.concat(assertListen, close).toPromise();
});

