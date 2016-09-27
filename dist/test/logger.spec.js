"use strict";
const test = require('blue-tape');
const logger_1 = require('../src/logger');
const config_1 = require('../src/config');
const winston = require('winston');
test('logger.ts constructor with no args', (assert) => {
    let configModule = new config_1.ConfigModule();
    let moduleTest = new logger_1.LoggerModule(configModule);
    assert.pass('run without failure');
    assert.equal(moduleTest.getLogger() instanceof winston.Logger, true, 'instantiate winston instance');
    assert.equal(moduleTest.getLogger().level, 'info', 'have default level');
    assert.equal('console' in moduleTest.getLogger().transports, true, 'have console transport');
    assert.end();
});
test('logger.ts constructor with winston instance in args', (assert) => {
    let logger = new (winston.Logger)({
        level: 'silly'
    });
    let config = [logger, { sure: 'thing' }];
    let moduleTest = new logger_1.LoggerModule(...config);
    assert.equal(moduleTest.getLogger(), logger, 'should set logger to the given winston instance');
    assert.end();
});
test('logger.ts constructor environment variable configuration', (assert) => {
    process.env.LOGGERMODULE_LEVEL = 'silly';
    process.env.LOGGERMODULE_CONSOLE = '1';
    process.env.LOGGERMODULE_FILE = './log/all.log';
    let configModule = new config_1.ConfigModule();
    let moduleTest = new logger_1.LoggerModule(configModule);
    assert.equal(moduleTest.getLogger().level, 'silly', 'should configure LoggerModule based on passed configuration');
    assert.equal('console' in moduleTest.getLogger().transports, false, 'should not have console transport');
    assert.equal('file' in moduleTest.getLogger().transports, true, 'should have file transport');
    delete process.env.LOGGERMODULE_LEVEL;
    delete process.env.LOGGERMODULE_CONSOLE;
    delete process.env.LOGGERMODULE_FILE;
    assert.end();
});
//# sourceMappingURL=logger.spec.js.map