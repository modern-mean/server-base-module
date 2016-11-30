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
  httpsListen(): Observable<void>,
  httpsClose(): Observable<void>,
  getHttpsServer(): https.Server,
  getHttpsServerConfig(): HttpsServerConfigInterface
}

export class HttpsServerModule extends HttpServerModule implements HttpsServerModuleInterface {

  private _httpsServer: https.Server;
  private _httpsConfig: HttpsServerConfigInterface;

  constructor(...args) {

    super(httpsServerDefaultConfig(), ...args);

    let configObserver = {
      next: config => this._httpsConfig = config,
      error: err => this.logger.error('HttpsServerModule::Constructor::Configure', err),
      complete: () => this.logger.debug('HttpsServerModule::Constructor::Configure::Done')
    };

    this.config
      .filter(config => config.module === 'httpsserver')
      .takeLast(1)
      .subscribe(configObserver);

  }

  getHttpsServer(): https.Server {
    return this._httpsServer;
  }

  getHttpsServerConfig(): HttpsServerConfigInterface {
    return this._httpsConfig;
  }

  httpsListen(): Observable<void> {
    let observe = Observable.create((observer) => {
      try {
        this.logger.debug('HttpsServer::Read certificates', this._httpsConfig.options.options);
        this._httpsConfig.options.options.key = fs.readFileSync(this._httpsConfig.options.options.key);
        this._httpsConfig.options.options.cert = fs.readFileSync(this._httpsConfig.options.options.cert);

        this.logger.debug('HttpsServer::Create');
        this._httpsServer = https.createServer(this._httpsConfig.options.options, this.getExpressApp());


        /* istanbul ignore next */
        this._httpsServer.once('error', err => {
          observer.error(err);
        });

        this.logger.debug('HttpsServer::Listen');
        this._httpsServer.listen(this._httpsConfig.options, () => {
          this.logger.info(`HTTPS Server:     ${this._httpsServer.address().address}:${this._httpsServer.address().port}`);
          observer.complete();
        });
      } catch(err) {
        observer.error(err);
      }
    });

    return this.httpListen().merge(observe);

  }

  httpsClose(): Observable<void> {
    let observe = Observable.create((observer) => {
      this.logger.debug('HttpsServer::Close');
      try {
        /* istanbul ignore next */
        this._httpsServer.once('close', () => {
          this.logger.debug('HttpsServer::Closed');
          observer.complete();
        });

        this._httpsServer.close();
      } catch(err) {
        observer.error(err);
      }
    });

    return this.httpClose().merge(observe);
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
        key: process.env.SERVER_HTTPS_KEY || __dirname + '/../../ssl/key.pem',
        cert: process.env.SERVER_HTTPS_CERT || __dirname + '/../../ssl/cert.pem'
      }
    }
  };
}
