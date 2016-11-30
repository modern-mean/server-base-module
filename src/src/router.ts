import * as express from 'express';
import * as Rx from '@reactivex/rxjs';
import { ServerModule, ServerModuleInterface, ModuleConfig } from './base';

export interface MiddlewareInterface {
  name: string,
  middleware: express.RequestHandler,
  route?: string
}

export interface RouterConfigInterface extends ModuleConfig {
  module: 'router',
  type: 'config',
  options: {
    name: string,
    route: string
  }
}

export interface RouterInterface extends ServerModuleInterface {
  getRouter(): express.Router,
  getRouterConfig(): ModuleConfig,
  getMiddleware(): Rx.Observable<MiddlewareInterface>,
  toMiddleware(): MiddlewareInterface
}

export class RouterModule extends ServerModule implements RouterInterface {

  protected middleware: Rx.Observable<MiddlewareInterface>;
  protected routers: Rx.Observable<RouterModule>;
  protected _router: express.Router = express.Router();
  private _routerConfig: ModuleConfig;

  constructor(...args) {

    super(...args);

    let configObserver = {
      next: config => this._routerConfig = config,
      error: err => this.logger.error('RouterModule::Constructor::Configure', err),
      complete: () => {
        if (!this._routerConfig) {
          throw new Error('Router Module requires a RouterConfigInterface passed into the constructor');
        }
      }
    };

    this.config
      .filter(config => config.module === 'router')
      .takeLast(1)
      .subscribe(configObserver);

    //Middleware Observable
    this.middleware = Rx.Observable.from(args)
      .filter(isMiddleware);

    //Routers Observable
    this.routers = Rx.Observable.from(args)
      .filter(isRouter);

  }

  getRouterConfig(): ModuleConfig {
    return this._routerConfig;
  }

  getMiddleware(): Rx.Observable<MiddlewareInterface> {
    return this.middleware;
  }

  getRouters(): Rx.Observable<RouterModule> {
    return this.routers;
  }

  getRouter(): express.Router {
    return this._router;
  }

  toMiddleware(): MiddlewareInterface {

    let observer = {
      next: mid => mid.route ? this._router.use(mid.route, mid.middleware) : this._router.use(mid.middleware),
      error: err => this.logger.error('ApiVersionRouter::toMiddleware', err),
      complete: () => this.logger.debug(`RouterModule(${this._routerConfig.options.name})::toMiddleware::Complete`),
    };

    //Apply middleware and routers distinctly
    this.middleware
      .concat(this.routers.map(arg => arg.toMiddleware()))
      .distinct(arg => arg.name)
      .do(mid => this.logger.debug(`Router(${this._routerConfig.options.name})::Middleware::Enable`, { name: mid.name, route: mid.route || '*' }))
      .subscribe(observer);

    return {
      name: this._routerConfig.options.name,
      middleware: this._router,
      route: this._routerConfig.options.route
    };


  }

}

export function isMiddleware(middleware: any): middleware is MiddlewareInterface {
  if (typeof middleware !== 'object' || !middleware.name || typeof middleware.middleware !== 'function') {
    return false;
  }

  return true;
}

export function isRouter(router: any): router is RouterInterface {
  if (router instanceof RouterModule) {
    return true;
  }

  return false;
}

