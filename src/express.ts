import { ServerModule, ServerModuleInterface } from './base';
import { RouterModule, MiddlewareInterface, isMiddleware, isRouter } from './router';
import * as express from 'express';
import * as Rx from '@reactivex/rxjs';

//Default middleware
import * as helmet from 'helmet';
import * as morgan from 'morgan';

export interface ExpressModuleInterface extends ServerModuleInterface {
  getExpressApp(): express.Application
}

export class ExpressModule extends ServerModule implements ExpressModuleInterface {

  protected middleware: Rx.Observable<MiddlewareInterface>;
  protected routers: Rx.Observable<RouterModule>;
  private _app: express.Application = express();

  constructor(...args) {

    super(...args);

    //Middleware Observable
    this.middleware = Rx.Observable.from(args)
      .filter(isMiddleware)
      .concat(expressDefaultMiddleware());

    //Routers Observable
    this.routers = Rx.Observable.from(args)
      .filter(isRouter);
  }

  enableExpress(): Rx.Observable<void> {

    return this.middleware
      .concat(this.routers.map(arg => arg.toMiddleware()))
      .distinct(arg => arg.name)
      .do(mid => this.logger.debug('Express::Middleware::Enabled', { name: mid.name, route: mid.route }))
      .map(mid => mid.route ? this._app.use(mid.route, mid.middleware) : this._app.use(mid.middleware))
      .map(mid => undefined);
  }

  getExpressApp(): express.Application {
    return this._app;
  }

}

export function expressDefaultMiddleware(): Rx.Observable<MiddlewareInterface> {
  return new Rx.Observable(observer => {
    if(!process.env.EXPRESS_HELMET_DISABLE) {
      observer.next({
        name: 'helmet',
        middleware: helmet()
      });
    }

    if(!process.env.EXPRESS_MORGAN_DISABLE) {
      observer.next({
        name: 'morgan',
        middleware: morgan(process.env.EXPRESSMODULE_MORGAN_FORMAT || 'short')
      });
    }



    observer.complete();
  });
}

