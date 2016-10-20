import { ModuleConfig  } from './base';
import { MiddlewareInterface  } from './router';
import { HttpServerModule, HttpServerModuleInterface, HttpServerConfigInterface } from './http';
import * as https from 'https';
import { Observable } from '@reactivex/rxjs';
import * as fs from 'fs';

export interface HttpsServerConfigInterface extends HttpServerConfigInterface {
  options: {
    port: string,
    host: string,
    options: https.ServerOptions
  }
}

export interface HttpsServerModuleInterface extends HttpServerModuleInterface {
  httpsListen(): Observable<string>,
  httpsClose(): Observable<string>,
  getHttpsServer(): https.Server,
  getHttpsConfig(): HttpsServerConfigInterface
}

export class HttpsServerModule extends HttpServerModule implements HttpsServerModuleInterface {

  private _httpsServer: https.Server;
  private _httpsConfig: HttpsServerConfigInterface;

  constructor(...args) {

    super(...args);

    this._httpsConfig = httpsServerDefaultConfig();

    //subscribe to config
    let configSub = this.config
      .filter(config => config.module === 'httpsserver')
      .subscribe(config => this._httpsConfig = config);
    this.subscriptions.next(configSub);

  }

  getHttpsServer(): https.Server {
    return this._httpsServer;
  }

  getHttpsConfig(): HttpsServerConfigInterface {
    return this._httpsConfig;
  }

  httpsListen(): Observable<string> {
    return Observable.create((observer) => {
      try {
        observer.next('HttpsServer::Read certificates');
        this._httpsConfig.options.options.key = fs.readFileSync(this._httpsConfig.options.options.key);
        this._httpsConfig.options.options.cert = fs.readFileSync(this._httpsConfig.options.options.cert);

        observer.next('HttpServer::Create');
        this._httpsServer = https.createServer(this._httpsConfig.options.options, this.getExpressApp());

        observer.next('HttpServer::Starting');
        /* istanbul ignore next */
        this._httpsServer.once('error', err => {
          observer.error(err);
        });

        this._httpsServer.listen(this._httpsConfig.options, () => {
          observer.next('HttpServer::Listening');
          this.logger.info(`HTTP Server:     ${this._httpsServer.address().address}:${this._httpsServer.address().port}`);
          observer.complete();
        });
      } catch(err) {
        observer.error(err);
      }
    });
  }

  httpsClose(): Observable<string> {
    return Observable.create((observer) => {
      observer.next('HttpServer::Close');
      try {
          /* istanbul ignore next */
          this._httpsServer.once('close', () => {
            observer.next('HttpServer::Destroyed');
            observer.complete();
          });

          this._httpsServer.close();
        } catch(err) {
          observer.error(err);
        }
    });
  }

}

export function httpsServerDefaultConfig(): HttpsServerConfigInterface {
  return {
    module: 'httpsserver',
    type: 'config',
    options: {
      host: process.env.SERVER_HTTPS_HOST || '0.0.0.0',
      port: process.env.SERVER_HTTPS_PORT || '8443',
      options: {
        key: process.env.SERVER_HTTPS_KEY || process.cwd() + '/ssl/key.pem',
        cert: process.env.SERVER_HTTPS_CERT || process.cwd() + '/ssl/cert.pem'
      }
    }
  };
}
