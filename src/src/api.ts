import { RouterModule, RouterInterface, MiddlewareInterface, RouterConfigInterface } from './router';
import { ModuleConfig } from './base';
import * as express from 'express';
import { Observable } from '@reactivex/rxjs';

//Default Middleware
import * as cors from 'cors';

export interface ApiRouterConfigInterface extends RouterConfigInterface {
  options: {
    name: 'apirouter',
    welcome: string,
    route: string
  }
}

export interface ApiRequest extends express.Request {
  apiversion: number
}

export interface ApiRouterInterface extends RouterInterface {
  getApiRouterConfig(): ApiRouterConfigInterface
}

export class ApiRouter extends RouterModule implements ApiRouterInterface {

  private _apiRouterConfig: ApiRouterConfigInterface;

  constructor(...args) {

    super(apiRouterDefaultConfig(), ...args);

    let configObserver = {
      next: config => this._apiRouterConfig = config,
      error: err => this.logger.error('ApiRouter::Constructor::Configure', err),
      complete: () => this.logger.debug('ApiRouter::Constructor::Configure::Done')
    };

    //Setup module based on config
    this.config
      .filter(isApiRouterConfig)
      .takeLast(1)
      .subscribe(configObserver);


    //Setup Default Route
    this.getRouter()
      .get('/', (req, res) => {
        res.json(`${this._apiRouterConfig.options.welcome}`);
      });


    //concat default middleware
    this.middleware = this.middleware.concat(apiRouterDefaultMiddleware());

  }

  getApiRouterConfig() {
    return this._apiRouterConfig;
  }

}

export interface ApiVersionRouterInterface extends ApiRouterInterface {

}

export class ApiVersionRouter extends ApiRouter {

  private _baseRouter: express.Router = express.Router();

  constructor(...args) {

    super(...args);

    //Add version param if on route
    this._baseRouter
      .param('apiversion', (req: ApiRequest, res, next, id) => {
        req.apiversion = id;
        next();
      });



    /*
      Override the default to middleware function from router.ts.  Basically we need to flop this._router and this._baseRouter
      //TODO Prolly a better way to do this
    */
    //Save toMiddleware
    let saveFunc = this.toMiddleware;


    this.toMiddleware = function () {
      saveFunc.bind(this)();
      this._baseRouter.use('/v:apiversion', this._router);

      return {
        name: this.getRouterConfig().options.name,
        middleware: this._baseRouter,
        route: this.getRouterConfig().options.route
      };
    };
  }

}

export function apiRouterDefaultConfig():ApiRouterConfigInterface {
  return {
    module: 'router',
    type: 'config',
    options: {
      name: 'apirouter',
      welcome: process.env.API_ROUTER_WELCOME || 'Welcome to the modern-mean api router.',
      route: process.env.API_ROUTER_ROUTE || '/api'
    }
  };
}

export function isApiRouterConfig(config: ModuleConfig): config is ApiRouterConfigInterface {
  return (config.module === 'router' && config.options.name === 'apirouter');
}

export function apiRouterDefaultMiddleware(): Observable<MiddlewareInterface> {
  return new Observable(observer => {
    if (!process.env.API_CORS_DISABLE) {
      observer.next({
        name: 'cors',
        middleware: cors()
      });
    }

    if (!process.env.API_SSL_DISABLE) {
      observer.next({
        name: 'forcessl',
        middleware: (req, res, next) => {
          if (req.secure) {
            next();
          }
          res.status(500).json('SSL is required');
        }
      });
    }

    observer.complete();
  });
}


