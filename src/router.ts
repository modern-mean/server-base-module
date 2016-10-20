import * as express from 'express';
import * as Rx from '@reactivex/rxjs';
import { ServerModule, ServerModuleInterface, ModuleConfig } from './base';

export interface MiddlewareInterface {
  name: string,
  middleware: express.RequestHandler,
  route?: string
}

export interface RouterModuleInterface extends ServerModuleInterface {
  middleware: Rx.Subject<MiddlewareInterface>,
  getRouter(): express.Router
}

export class RouterModule extends ServerModule implements RouterModuleInterface {

  public middleware: Rx.Subject<MiddlewareInterface> = new Rx.Subject<MiddlewareInterface>();
  private _router: express.Router = express.Router();

  constructor(...args) {

    super(...args);

    //Subscribe to middleware
    this.subscriptions.next(
      this.middleware
        .filter(mid => isMiddleware(mid))
        .distinctKey('name')
        .subscribe(mid => mid.route ? this._router.use(mid.route, mid.middleware) : this._router.use(mid.middleware))
    );

    Rx.Observable.from(args)
      .filter(mid => isMiddleware(mid))
      .subscribe(mid => this.middleware.next(mid));

  }

  getRouter(): express.Router {
    return this._router;
  }

}

export function isMiddleware(middleware: any): middleware is MiddlewareInterface {
  if (typeof middleware !== 'object' || !middleware.name || typeof middleware.middleware !== 'function') {
    return false;
  }

  return true;
}

