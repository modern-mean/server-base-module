import { LoggerModule } from '@modern-mean/server-logger-module';
import { ConfigModule } from '@modern-mean/server-config-module';

export class BaseModule {

  constructor(...args) {

    this.configModule = new ConfigModule(...args);
    this.config = this.configModule.get();

    this.loggerModule = new LoggerModule(this.configModule);
    this.logger = this.loggerModule.get();

  }

  getConfigModule() {
    return this.configModule;
  }

  getLoggerModule() {
    return this.loggerModule;
  }

  getConfig() {
    return this.configModule.get();
  }

  getLogger() {
    return this.loggerModule.get();
  }

}
