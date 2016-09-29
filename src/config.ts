import * as lodash from 'lodash';

export class ConfigModule {

  private config: Array<ModuleConfig>;

  constructor(...args) {
    this.config = [];
    args.forEach(arg => {
      if (arg.module && arg.type === 'config') {
        this.defaults(arg);
      }
    });
  }

  get(): Array<ModuleConfig> {
    return this.config;
  }

  getModule(module: string): ModuleConfig {
    return lodash.find(this.config, { module: module });
  }

  defaults(module: ModuleConfig): ModuleConfig {
    let config = this.getModule(module.module);
    if (config) {
      lodash.defaultsDeep(this.config[this.config.indexOf(config)], module);
      return config;
    } else {
      this.config.push(module);
      return module;
    }
  }

  merge(module: ModuleConfig): ModuleConfig {
    let config = this.getModule(module.module);
    if (config) {
      lodash.merge(this.config[this.config.indexOf(config)], module);
      return config;
    } else {
      this.config.push(module);
      return module;
    }
  }

}

export interface ModuleConfig {
  module: string,
  type: string,
  options: any
}

export function createConfig(name: string): ModuleConfig {
  let config: ModuleConfig = {
    module: name,
    type: 'config',
    options: {}
  };
  return config;
}
