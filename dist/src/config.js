"use strict";
const lodash = require('lodash');
class ConfigModule {
    constructor(...args) {
        this.config = [];
        args.forEach(arg => {
            if (arg.module && arg.type === 'config') {
                this.config.push(arg);
            }
        });
    }
    get() {
        return this.config;
    }
    getModule(module) {
        return lodash.find(this.config, { module: module });
    }
    defaults(module) {
        let config = this.getModule(module.module);
        if (config) {
            lodash.defaultsDeep(this.config[this.config.indexOf(config)], module);
            return config;
        }
        else {
            this.config.push(module);
            return module;
        }
    }
}
exports.ConfigModule = ConfigModule;
//# sourceMappingURL=config.js.map