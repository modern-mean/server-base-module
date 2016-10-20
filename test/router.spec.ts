import * as test from 'blue-tape';
import * as express from 'express';
import * as sinon from 'sinon';
import * as moduleTest from '../src/router';

let noroute: moduleTest.MiddlewareInterface = {
  name: 'noroute',
  middleware: (req, res, next) => { }
};

let route: moduleTest.MiddlewareInterface = {
  name: 'route',
  middleware: (req, res, next) => { },
  route: '/test'
};

let notmid = { test: 'ok' };

test('router.ts export RouterModule', (assert) => {
  assert.notEqual(moduleTest.RouterModule, undefined, 'Should not be undefined');
  assert.end();
});



test('router.ts constructor with middleware args', (assert) => {
  let sandbox = sinon.sandbox.create();
  let router = express.Router();
  let routerStub = sandbox.stub(express, 'Router').returns(router);
  let useSpy = sandbox.spy(router, 'use');
  let mod = new moduleTest.RouterModule(route, noroute);
  assert.equal(useSpy.calledTwice, true, 'should call router use twice');
  assert.equal(useSpy.firstCall.calledWith(route.route, route.middleware), true, 'should call in order of passed in');
  assert.equal(useSpy.secondCall.calledWith(noroute.middleware), true, 'should call in order of passed in');
  sandbox.restore();
  assert.end();
});

test('router.ts constructor no middleare args', (assert) => {
  let sandbox = sinon.sandbox.create();
  let router = express.Router();
  let routerStub = sandbox.stub(express, 'Router').returns(router);
  let useSpy = sandbox.spy(router, 'use');
  let mod = new moduleTest.RouterModule(notmid);
  assert.equal(useSpy.called, false, 'should not call router use');
  sandbox.restore();
  assert.end();
});

test('router.ts middleware observable', (assert) => {
  let sandbox = sinon.sandbox.create();
  let mod = new moduleTest.RouterModule(route, noroute);
  let useSpy = sandbox.spy(mod.getRouter(), 'use');
  let mid: moduleTest.MiddlewareInterface = {
    name: 'newmiddleware',
    middleware: (req, res, next) => { }
  };
  mod.middleware.next(mid);
  assert.equal(useSpy.firstCall.calledWith(mid.middleware), true, 'should call router use with new middleware');
  mod.middleware.next(mid);
  assert.equal(useSpy.callCount, 1, 'should not call router use with duplicate middleware');
  sandbox.restore();
  assert.end();
});

test('router.ts isMiddleware', (assert) => {
  assert.equal(moduleTest.isMiddleware(route), true, 'should return true if object is middleware');
  assert.equal(moduleTest.isMiddleware(() => {}), false, 'should return true if object is not middleware');
  assert.equal(moduleTest.isMiddleware(notmid), false, 'should return false if object is not middleware');
  assert.equal(moduleTest.isMiddleware({ name: 'test' }), false, 'should return false if object is not middleware');
  assert.equal(moduleTest.isMiddleware({ name: 'test', middleware: 'test' }), false, 'should return false if object.middleware is not a function');
  assert.end();
});

