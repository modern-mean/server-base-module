import { HttpsServerModule } from './https';
import { ApiVersionRouter, ApiRequest } from './api';
import { RouterModule, RouterConfigInterface } from './router';

process.env.LOGGER_LEVEL = 'debug';

let routerConfig: RouterConfigInterface = {
  module: 'router',
  type: 'config',
  options: {
    name: 'customrouter',
    route: '/test'
  }
};

let customRouter = new RouterModule(routerConfig);
customRouter.getRouter().get('/', (req: ApiRequest, res) => {
  res.json('this is a test: ' + req.apiversion);
});
let api = new ApiVersionRouter(customRouter);

/*
let customRouter = new RouterModule(routerConfig);
customRouter.getRouter().get('/', (req, res) => {
  res.json('this is a test');
});
let api = new ApiRouter(customRouter);
*/

let server = new HttpsServerModule(api);

server.httpsListen()
  .subscribe();
