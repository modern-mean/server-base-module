import { ModuleConfig  } from './base';
import { ExpressModule, ExpressModuleInterface } from './express';
import * as http from 'http';
import { Observable } from '@reactivex/rxjs';

export interface HttpServerConfigInterface extends ModuleConfig {
  options: {
    port: string,
    host: string
  }
}

export interface HttpServerModuleInterface extends ExpressModuleInterface {
  httpListen(): Observable<string>,
  httpClose(): Observable<string>,
  getHttpServer(): http.Server,
  getConfig(): HttpServerConfigInterface
}

export class HttpServerModule extends ExpressModule implements HttpServerModuleInterface {

  private _httpServer: http.Server;
  private _httpConfig: HttpServerConfigInterface;

  constructor(...args) {

    super(...args);

    this._httpConfig = httpServerDefaultConfig();
    this._httpServer = http.createServer(this.getExpressApp());

    //subscribe to config
    let configSub = this.config
      .filter(config => config.module === 'httpserver')
      .subscribe(config => this._httpConfig = config);
    this.subscriptions.next(configSub);

  }

  getHttpServer(): http.Server {
    return this._httpServer;
  }

  getConfig(): HttpServerConfigInterface {
    return this._httpConfig;
  }

  httpListen(): Observable<string> {
    return Observable.create((observer) => {
      try {

        observer.next('HttpServer::Starting');
        /* istanbul ignore next */
        this._httpServer.once('error', err => {
          observer.error(err);
        });

        this._httpServer.listen(this._httpConfig.options, () => {
          observer.next('HttpServer::Listening');
          this.logger.info(`HTTP Server:     ${this._httpServer.address().address}:${this._httpServer.address().port}`);
          observer.complete();
        });
      } catch(err) {
        observer.error(err);
      }
    });
  }

  httpClose(): Observable<string> {
    return Observable.create((observer) => {
      observer.next('HttpServer::Close');
      try {
          /* istanbul ignore next */
          this._httpServer.once('close', () => {
            observer.next('HttpServer::Destroyed');
            observer.complete();
          });

          this._httpServer.close();
        } catch(err) {
          observer.error(err);
        }
    });
  }

}

export function httpServerDefaultConfig(): HttpServerConfigInterface {
  return {
    module: 'httpserver',
    type: 'config',
    options: {
      host: process.env.SERVER_HTTP_HOST || '0.0.0.0',
      port: process.env.SERVER_HTTP_PORT || '8080',
    }
  };
}
