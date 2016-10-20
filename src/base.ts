import * as winston from 'winston';
import * as Rx from '@reactivex/rxjs';

export interface ModuleConfig {
  module: string,
  type: string,
  options: any
}

export interface ServerModuleInterface {
  config: Rx.ReplaySubject<ModuleConfig>,
  subscriptions: Rx.Subject<Rx.Subscription>,
  done(): void,
  getLogger(): winston.LoggerInstance,
  getSubscriptions(): Rx.Subscription[]
}

export class ServerModule implements ServerModuleInterface {

  public config: Rx.ReplaySubject<ModuleConfig> = new Rx.ReplaySubject<ModuleConfig>(50);
  public subscriptions: Rx.Subject<Rx.Subscription> = new Rx.Subject<Rx.Subscription>();
  protected logger: winston.LoggerInstance;
  private _subscriptions: Rx.Subscription[] = [];

  constructor(...args) {

    //Subscribe to subscriptions.  Funny I know
    let mainSub = this.subscriptions.subscribe(sub => this._subscriptions.push(sub));
    this.subscriptions.next(mainSub);

    //Default Logger
    this.logger = new winston.Logger({
      level: process.env.LOGGERMODULE_LEVEL || 'info'
    });

    //Logger Subscription
    this.subscriptions.next(
      this.config
        .filter(config => config.module === 'winston')
        .pluck('options')
        .subscribe(config => {
          this.logger.debug('Logger Reconfigure::', config);
          this.logger.configure(config);
        })
    );

    //Call config.next for any configurations passed in.
    Rx.Observable.from(args)
      .filter(arg => arg.type === 'config')
      .subscribe(config => this.config.next(config));

  }

  getLogger(): winston.LoggerInstance {
    return this.logger;
  }

  getSubscriptions(): Rx.Subscription[] {
    return this._subscriptions;
  }

  done(): void {
    Rx.Observable.from(this._subscriptions)
      .subscribe(sub => sub.unsubscribe());
  }

}
