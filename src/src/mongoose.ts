import { ServerModule, ModuleConfig } from './base';
import * as mongoose from 'mongoose';
import { Observable } from '@reactivex/rxjs';

export interface MongooseConfigInterface extends ModuleConfig {
  module: 'mongoose',
  type: 'config',
  options: {
    debug: boolean,
    uri: string,
    options: mongoose.ConnectionOptions
  }
}

export interface MongooseModuleInterface {
  getMongoose(): mongoose.Mongoose,
  getMongooseConfig(): MongooseConfigInterface
}

export class MongooseModule extends ServerModule implements MongooseModuleInterface {

  private _mongooseConfig: MongooseConfigInterface;

  constructor(...args) {

    super(MongooseDefaultConfig(), ...args);

    let configObserver = {
      next: config => this._mongooseConfig = config,
      error: err => this.logger.error('MongooseModule::Constructor::Configure', err),
      complete: () => this.logger.debug('MongooseModule::Constructor::Configure::Done')
    };

    //Setup module based on config
    this.config
      .filter(isMongooseConfig)
      .takeLast(1)
      .subscribe(configObserver);

    //Set Debug
    mongoose.set('debug', this._mongooseConfig.options.debug);

    this.logger.debug('MongooseModule::Constructor::Finished');
  }

  getMongoose(): mongoose.Mongoose {
    return mongoose;
  }

  getMongooseConfig(): MongooseConfigInterface {
    return this._mongooseConfig;
  }

  connect(): Observable<void> {
    return Observable.create(observer => {
      this.logger.debug('MongooseModule::Connect::Starting', this._mongooseConfig.options.uri);

      if (mongoose.connection.readyState !== 0) {
        this.logger.debug('MongooseModule::Connect::Already Connected');
        return observer.error('Already Connected');
      }

      /* istanbul ignore next */
      mongoose.connection.once('error', err => { //Can't mock the process emit error
        this.logger.error('Mongoose::Error', err);
        observer.error(err);
      });

      mongoose.connection.once('open', () => {
        this.logger.debug('Mongoose::Connect::Success');
        return observer.complete();
      });

      mongoose.connect(this._mongooseConfig.options.uri, this._mongooseConfig.options.options);
    });
  }

  disconnect(): Observable<void> {
    return Observable.create(observer => {
      this.logger.debug('Mongoose::Disconnect::Start');

      if (mongoose.connection.readyState === 0) {
        this.logger.debug('Mongoose::Disconnect::Not Connected');
        observer.error('Not Connected');
      }

      mongoose.connection.once('disconnected', () => {
        this.logger.debug('Mongoose::Disconnect::Success');
        observer.complete();
      });

      mongoose.disconnect();
    });

  }

}

export function isMongooseConfig(config: ModuleConfig): config is MongooseConfigInterface {
  return config.module === 'mongoose';
}

export function MongooseDefaultConfig(): MongooseConfigInterface {
  let config: MongooseConfigInterface = {
    module: 'mongoose',
    type: 'config',
    options: {
      debug: process.env.MONGOOSEMODULE_DEBUG ? true : false,
      uri: process.env.MONGOOSEMODULE_URI || 'mongodb://localhost/modern-mean-dev',
      options: {
        user: process.env.MONGOOSEMODULE_USER || undefined,
        pass: process.env.MONGOOSEMODULE_PASSWORD || undefined
      }
    }
  };
  return config;
}
