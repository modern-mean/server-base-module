"use strict";
const logger_1 = require('./logger');
const config_1 = require('./config');
class BaseModule {
    constructor(...args) {
        //Config Module
        this.configModule = new config_1.ConfigModule(...args);
        //Logger Module.
        this.loggerModule = new logger_1.LoggerModule(this.configModule, ...args);
        this.logger = this.loggerModule.getLogger();
    }
    getLogger() {
        return this.logger;
    }
    getLoggerModule() {
        return this.loggerModule;
    }
    getConfigModule() {
        return this.configModule;
    }
}
exports.BaseModule = BaseModule;
//# sourceMappingURL=module.js.map