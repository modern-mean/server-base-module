"use strict";
const test = require('blue-tape');
const module_1 = require('../src/module');
const config_1 = require('../src/config');
const Logger = require('../src/logger');
const winston = require('winston');
test('module.ts constructor with no args', (assert) => {
    let moduleTest = new module_1.BaseModule();
    assert.pass('run without failure');
    assert.notEqual(moduleTest.getLogger(), undefined, 'should instatiate logger');
    assert.notEqual(moduleTest.getLoggerModule(), undefined, 'should instatiate loggerModule');
    assert.notEqual(moduleTest.getConfigModule(), undefined, 'should instatiate configModule');
    assert.end();
});
test('module.ts constructor with args', (assert) => {
    let moduleTest = new module_1.BaseModule();
    assert.pass('run without failure');
    assert.notEqual(moduleTest.getLogger(), undefined, 'should instatiate logger');
    assert.notEqual(moduleTest.getLoggerModule(), undefined, 'should instatiate loggerModule');
    assert.notEqual(moduleTest.getConfigModule(), undefined, 'should instatiate configModule');
    assert.end();
});
test('module.ts getLogger', (assert) => {
    let moduleTest = new module_1.BaseModule();
    assert.equal(moduleTest.getLogger() instanceof winston.Logger, true, 'return instance of winston logger');
    assert.end();
});
test('module.ts getLoggerModule', (assert) => {
    let moduleTest = new module_1.BaseModule();
    assert.equal(moduleTest.getLoggerModule() instanceof Logger.LoggerModule, true, 'return instance of LoggerModule');
    assert.end();
});
test('module.ts getConfigModule', (assert) => {
    let moduleTest = new module_1.BaseModule();
    assert.equal(moduleTest.getConfigModule() instanceof config_1.ConfigModule, true, 'return instance of ConfigModule');
    assert.end();
});
//# sourceMappingURL=module.spec.js.map