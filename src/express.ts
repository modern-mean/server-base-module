import { ServerModule, ServerModuleInterface } from './base';
import { RouterModule, MiddlewareInterface, isMiddleware } from './router';
import * as express from 'express';
import * as Rx from '@reactivex/rxjs';

export interface ExpressModuleInterface extends ServerModuleInterface {
  middleware: Rx.Subject<MiddlewareInterface>,
  routers: Rx.Subject<RouterModule>,
  getExpressApp(): express.Application,
  getRouters(): RouterModule[]
}

export class ExpressModule extends ServerModule implements ExpressModuleInterface {

  public middleware: Rx.Subject<MiddlewareInterface> = new Rx.Subject<MiddlewareInterface>();
  public routers: Rx.Subject<RouterModule> = new Rx.Subject<RouterModule>();
  private _app: express.Application = express();
  private _routers: RouterModule[] = [];

  constructor(...args) {

    super(...args);

    //Subscribe to routers and push to array
    this.subscriptions.next(
      this.routers
        .filter(arg => arg instanceof RouterModule)
        .subscribe(
          router => this._routers.push(router)
        )
    );

    //Subscribe to middleware and call app.use
    this.subscriptions.next(
      this.middleware
        .filter(mid => isMiddleware(mid))
        .distinctKey('name')
        .subscribe(mid => mid.route ? this._app.use(mid.route, mid.middleware): this._app.use(mid.middleware))
    );

    Rx.Observable.from(args)
      .filter(arg => arg instanceof RouterModule)
      .subscribe(router => this.routers.next(router));

  }

  getExpressApp(): express.Application {
    return this._app;
  }

  getRouters(): RouterModule[] {
    return this._routers;
  }

}
