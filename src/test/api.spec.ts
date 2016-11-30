import * as test from 'blue-tape';
import * as request from 'supertest';
import * as moduleTest from '../src/api';
import { RouterModule } from '../src/router';
import { ExpressModule } from '../src/express';

let childRouter;

function createChildRouter() {
  let config = {
    module: 'router',
    type: 'config',
    options: {
      name: 'child1',
      route: '/child1'
    }
  };

  childRouter = new RouterModule(config);
  childRouter.getRouter().get('/', (req, res) => {
    res.json('child test');
  });

  return childRouter;
}

test('api.ts isApiRouterConfig()', (assert) => {
  let config = moduleTest.apiRouterDefaultConfig();
  assert.equal(moduleTest.isApiRouterConfig(config), true, 'should return true if correct config');
  assert.equal(moduleTest.isApiRouterConfig({ module: 'test', type: 'config', options: { name: 'apirouter' } }), false, 'should return false if module is not router');
  assert.equal(moduleTest.isApiRouterConfig({ module: 'router', type: 'config', options: { name: 'testy' } }), false, 'should return false if options.name is not apirouter');
  assert.end();
});

test('api.ts ApiRouter constructor no arguments', (assert) => {
  let mod = new moduleTest.ApiRouter();
  assert.deepEqual(mod.getApiRouterConfig(), moduleTest.apiRouterDefaultConfig(), 'should be defaultly configured');
  mod.getMiddleware().count().subscribe(i => assert.equal(i, 2, 'should add default middleware to the middleware observable'));
  assert.end();
});

test('api.ts ApiRouter constructor custom configuration', (assert) => {
  let config = moduleTest.apiRouterDefaultConfig();
  config.options.route = '/apitest';
  let mod = new moduleTest.ApiRouter(config);
  assert.deepEqual(mod.getApiRouterConfig(), config, 'should be customly configured');
  assert.end();
});

test('api.ts ApiRouter constructor middleware arguments', (assert) => {
  let middleware = {
    name: 'testmiddleware',
    middleware: function (req, res, next) {}
  };

  let mod = new moduleTest.ApiRouter(middleware);
  mod.getMiddleware().count().subscribe(i => assert.equal(i, 3, 'should have 3 middlewares because one passed in is a duplicate of a default middleware'));
  assert.end();
});

test('api.ts ApiRouter constructor environment variable configuration', (assert) => {
  process.env.API_ROUTER_WELCOME = 'test message';
  process.env.API_ROUTER_ROUTE = '/apitest';
  let config = moduleTest.apiRouterDefaultConfig();
  assert.equal(config.options.welcome, 'test message', 'should override welcome message');
  assert.equal(config.options.route, '/apitest', 'should override api route');

  process.env.API_SSL_DISABLE = '1';
  process.env.API_CORS_DISABLE = '1';
  let mod = new moduleTest.ApiRouter();
  mod.getMiddleware().count().subscribe(i => assert.equal(i, 0, 'should override default middleware'));

  delete process.env.API_ROUTER_WELCOME;
  delete process.env.API_ROUTER_ROUTE;
  delete process.env.API_SSL_DISABLE;
  delete process.env.API_CORS_DISABLE;
  assert.end();
});


test('api.ts ApiRouter supertest default config', (assert) => {

  assert.plan(2);

  let config = moduleTest.apiRouterDefaultConfig();
  let mod = new moduleTest.ApiRouter(createChildRouter());
  let app = new ExpressModule(mod);
  app.enableExpress().subscribe();

  request(app.getExpressApp())
      .get('/api')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        assert.equal(res.body, config.options.welcome, 'should respond with welcome message');
      });

  request(app.getExpressApp())
      .get('/api/child1')
      .expect('Content-Type', /json/)
      .expect('Access-Control-Allow-Origin', '*')
      .expect(500)
      .end(function(err, res) {
        assert.equal(res.body, 'SSL is required', 'should respond with message ssl is required');
      });
});

test('api.ts ApiVersion supertest', (assert) => {
  process.env.API_SSL_DISABLE = '1';
  process.env.API_CORS_DISABLE = '1';

  let mod = new moduleTest.ApiRouter(createChildRouter());
  let app = new ExpressModule(mod);
  app.enableExpress().subscribe();

  request(app.getExpressApp())
      .get('/api/child1')
      .expect('Content-Type', /json/)
      .expect('Access-Control-Allow-Origin', undefined)
      .expect(200)
      .end(function(err, res) {
        assert.equal(res.body, 'child test', 'should respond with message from child');
        assert.end();
      });

  delete process.env.API_SSL_DISABLE;
  delete process.env.API_CORS_DISABLE;
});


test('api.ts ApiVersionRouter supertest', (assert) => {

  assert.plan(2);

  process.env.API_SSL_DISABLE = '1';
  process.env.API_CORS_DISABLE = '1';

  let crouter = createChildRouter();
  crouter.getRouter().get('/vtest', (req: moduleTest.ApiRequest, res) => {
    res.json('vtest: ' + req.apiversion);
  });
  let mod = new moduleTest.ApiVersionRouter(crouter);
  let app = new ExpressModule(mod);
  app.enableExpress().subscribe();

  request(app.getExpressApp())
      .get('/api/v1/child1/vtest')
      .expect('Content-Type', /json/)
      .expect('Access-Control-Allow-Origin', undefined)
      .expect(200)
      .end(function(err, res) {
        assert.equal(res.body, 'vtest: 1', 'should respond with message with version');
      });

  request(app.getExpressApp())
    .get('/api/v2/child1/vtest')
    .expect('Content-Type', /json/)
    .expect('Access-Control-Allow-Origin', undefined)
    .expect(200)
    .end(function(err, res) {
      assert.equal(res.body, 'vtest: 2', 'should respond with message with version');
    });

  delete process.env.API_SSL_DISABLE;
  delete process.env.API_CORS_DISABLE;
});



