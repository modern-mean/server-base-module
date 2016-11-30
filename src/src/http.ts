import { ModuleConfig } from './base';
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
  httpListen(): Observable<void>,
  httpClose(): Observable<void>,
  getHttpServer(): http.Server,
  getHttpServerConfig(): HttpServerConfigInterface
}

export class HttpServerModule extends ExpressModule implements HttpServerModuleInterface {

  private _httpServer: http.Server;
  private _httpConfig: ModuleConfig;

  constructor(...args) {

    super(httpServerDefaultConfig(), ...args);

    this._httpServer = http.createServer(this.getExpressApp());

    let configObserver = {
      next: config => this._httpConfig = config,
      error: err => this.logger.error('HttpServerModule::Constructor::Configure', err),
      complete: () => this.logger.debug('HttpServerModule::Constructor::Configure::Done')
    };

    this.config
      .filter(config => config.module === 'httpserver')
      .takeLast(1)
      .subscribe(configObserver);

  }

  getHttpServer(): http.Server {
    return this._httpServer;
  }

  getHttpServerConfig(): HttpServerConfigInterface {
    return this._httpConfig;
  }

  httpListen(): Observable<void> {
    let listen = Observable.create((observer) => {
      try {
        this.logger.debug('HttpServer::Listen::Start');
        /* istanbul ignore next */
        this._httpServer.once('error', err => {
          observer.error(err);
        });

        this._httpServer.listen(this._httpConfig.options, () => {
          this.logger.info(`HTTP Server:     ${this._httpServer.address().address}:${this._httpServer.address().port}`);
          observer.complete();
        });
      } catch(err) {
        observer.error(err);
      }
    });

    return this.enableExpress().concat(listen);
  }

  httpClose(): Observable<void> {
    return Observable.create((observer) => {
      this.logger.debug('HttpServer::Close::Start');
      try {
        /* istanbul ignore next */
        this._httpServer.once('close', () => {
          this.logger.debug('HttpServer::Close::Done');
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
