"use strict";
const config_1 = require('./config');
const winston = require('winston');
class LoggerModule {
    constructor(...args) {
        args.forEach(arg => {
            if (arg instanceof winston.Logger) {
                this.logger = arg;
                return false;
            }
            else if (arg instanceof config_1.ConfigModule) {
                this.configModule = arg;
            }
        });
        if (!this.logger) {
            this.config = this.configModule.defaults(LoggerDefaultConfig());
            this.transports = [];
            if (this.config.options.file) {
                this.transports.push(new (winston.transports.File)({ filename: this.config.options.file }));
            }
            if (this.config.options.console) {
                this.transports.push(new (winston.transports.Console)());
            }
            this.logger = new (winston.Logger)({
                level: this.config.options.level,
                transports: this.transports
            });
        }
    }
    getLogger() {
        return this.logger;
    }
}
exports.LoggerModule = LoggerModule;
function LoggerDefaultConfig() {
    let options = {
        level: process.env.LOGGERMODULE_LEVEL || 'info',
        file: process.env.LOGGERMODULE_FILE || false,
        console: process.env.LOGGERMODULE_CONSOLE ? false : true
    };
    let config = {
        module: 'LoggerModule',
        type: 'config',
        options: options
    };
    return config;
}
exports.LoggerDefaultConfig = LoggerDefaultConfig;
//# sourceMappingURL=logger.js.map