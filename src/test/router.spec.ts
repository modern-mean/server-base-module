import * as test from 'blue-tape';
import * as express from 'express';
import * as sinon from 'sinon';
import * as Rx from '@reactivex/rxjs';
import * as moduleTest from '../src/router';
import { isConfig } from '../src/base';

//All setup globals
let childRouter1, childRouterConfig1, childRouter2, childRouterConfig2, childRouter3, childRouterConfig3,
  middleware1, middleware2, middleware3,
  router, routerStub,
  sandbox, config;

function setupConfig() {
  config = {
    module: 'router',
    type: 'config',
    options: {
      name: 'testrouter',
      route: '/testy'
    }
  };
  return config;
}

function setupRouters() {
  childRouterConfig1 = {
    module: 'router',
    type: 'config',
    options: {
      name: 'childrouter1',
      route: '/childrouter1'
    }
  };

  childRouterConfig2 = {
    module: 'router',
    type: 'config',
    options: {
      name: 'childrouter2',
      route: '/childrouter2'
    }
  };

  childRouterConfig3 = {
    module: 'router',
    type: 'config',
    options: {
      name: 'childrouter2',
      route: '/childrouter3'
    }
  };

  //Router Spies
  childRouter1 = new moduleTest.RouterModule(childRouterConfig1);
  sandbox.spy(childRouter1, 'toMiddleware');
  childRouter2 = new moduleTest.RouterModule(childRouterConfig2);
  sandbox.spy(childRouter2, 'toMiddleware');
  childRouter3 = new moduleTest.RouterModule(childRouterConfig2);
  sandbox.spy(childRouter3, 'toMiddleware');

  return [ childRouter1, childRouter2, childRouter3 ];
}

function setupMiddleware() {
  middleware1 = {
    name: 'noroute',
    middleware: (req, res, next) => { }
  };

  middleware2 = {
    name: 'route',
    middleware: (req, res, next) => { },
    route: '/middleware2'
  };

  middleware3 = {
    name: 'route',
    middleware: (req, res, next) => { },
    route: '/middleware3'
  };

  //Middleware Spies
  sandbox.spy(middleware1, 'middleware');
  sandbox.spy(middleware2, 'middleware');
  sandbox.spy(middleware3, 'middleware');

  return [ middleware1, middleware2, middleware3 ];
}

function setupExpress() {
  //Express Stubs/Spies
  router = express.Router();
  routerStub = sandbox.stub(express, 'Router').returns(router);
  sandbox.spy(router, 'use');
}

function setupFullTest() {
  sandbox = sinon.sandbox.create();
  setupExpress();
  return [ setupConfig(), ...setupRouters(), ...setupMiddleware() ];
}

let notMiddleware = { test: 'ok' };

test('router.ts constructor with no config', (assert) => {
  try {
    new moduleTest.RouterModule();
  } catch (err) {
    assert.equal(err.message, 'Router Module requires a RouterConfigInterface passed into the constructor', 'should throw error if no configuration');
    assert.end();
  }
});


test('router.ts constructor with middleware and router args', (assert) => {
  let args = setupFullTest();
  new moduleTest.RouterModule(...args);
  assert.equal(childRouter1.toMiddleware.called, false, 'should not call childRouter.toMiddleware()');
  assert.equal(router.use.called, false, 'should not call router use');
  sandbox.restore();
  assert.end();
});


test('router.ts getRouterConfig()', (assert) => {
  let mod = new moduleTest.RouterModule(config);
  assert.equal(isConfig(mod.getRouterConfig()), true, 'should return ModuleConfig');
  assert.equal(mod.getRouterConfig() === config, true, 'should return config from arguments');
  assert.end();
});

test('router.ts getMiddleware()', (assert) => {
  let mod = new moduleTest.RouterModule(config);
  assert.equal(mod.getMiddleware() instanceof Rx.Observable, true, 'should return Observable');
  assert.end();
});

test('router.ts getRouters()', (assert) => {
  let mod = new moduleTest.RouterModule(config);
  assert.equal(mod.getRouters() instanceof Rx.Observable, true, 'should return Observable');
  assert.end();
});

test('router.ts getRouter()', (assert) => {
  let mod = new moduleTest.RouterModule(config);
  assert.equal(typeof mod.getRouter().use, 'function', 'should return instanceof express.Router');
  assert.end();
});

test('router.ts toMiddleware()', (assert) => {
  let args = setupFullTest();
  let mod = new moduleTest.RouterModule(...args);
  mod.toMiddleware();


  //Router Assertions
  assert.equal(childRouter1.toMiddleware.called, true, 'should call childRouter1.toMiddleware()');
  assert.equal(childRouter2.toMiddleware.called, true, 'should call childRouter2.toMiddleware()');
  assert.equal(childRouter3.toMiddleware.called, true, 'should call childRouter3.toMiddleware()');

  //Express Assertions
  assert.equal(router.use.getCall(0).calledWith(middleware1.middleware), true, 'should call router.use with middleware1 first');
  assert.equal(router.use.getCall(1).calledWith(middleware2.route, middleware2.middleware), true, 'should call router.use with middleware2 second');
  assert.equal(router.use.neverCalledWith(middleware3.route, middleware3.middleware), true, 'should never call router.use with middleware3 because it is duplicate');
  assert.equal(router.use.getCall(2).calledWith(childRouterConfig1.options.route, childRouter1.getRouter()), true, 'should call router.use with childRouter1 third');
  assert.equal(router.use.getCall(3).calledWith(childRouterConfig2.options.route, childRouter2.getRouter()), true, 'should call router.use with childRouter2 fourth');
  assert.equal(router.use.neverCalledWith(childRouterConfig3.options.route, childRouter3.getRouter()), true, 'should never call router.use with childRouter3 because it is duplicate');

  sandbox.restore();
  assert.end();
});

test('router.ts isMiddleware', (assert) => {
  assert.equal(moduleTest.isMiddleware(middleware1), true, 'should return true if object is middleware');
  assert.equal(moduleTest.isMiddleware(() => {}), false, 'should return true if object is not middleware');
  assert.equal(moduleTest.isMiddleware(notMiddleware), false, 'should return false if object is not middleware');
  assert.equal(moduleTest.isMiddleware({ name: 'test' }), false, 'should return false if object is not middleware');
  assert.equal(moduleTest.isMiddleware({ name: 'test', middleware: 'test' }), false, 'should return false if object.middleware is not a function');
  assert.end();
});

test('router.ts isRouter', (assert) => {
  let childRouter = new moduleTest.RouterModule(config);
  assert.equal(moduleTest.isRouter(childRouter), true, 'should return true if object is instanceof RouterModule');
  assert.equal(moduleTest.isRouter(middleware1), false, 'should return false if object is not instanceof RouterModule');
  assert.end();
});

