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

  get(filter?: string): ModuleConfig[] {
    if (!filter) {
      return this.config;
    }

    return this.config
      .filter(item => item.module === filter);
  }

  defaults(module: ModuleConfig): ModuleConfig {
    let config = this.get(module.module);
    if (config.length) {
      lodash.defaultsDeep(this.config[this.config.indexOf(config[0])], module);
      return config[0];
    } else {
      this.config.push(module);
      return module;
    }
  }

  merge(module: ModuleConfig): ModuleConfig {
    let config = this.get(module.module);
    if (config.length) {
      lodash.merge(this.config[this.config.indexOf(config[0])], module);
      return config[0];
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
