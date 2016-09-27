"use strict";
const test = require('blue-tape');
const indexTest = require('../src/index');
test('index.ts export BaseModule', (assert) => {
    assert.notEqual(indexTest.BaseModule, undefined, 'Should not be undefined');
    assert.end();
});
test('index.ts export LoggerModule', (assert) => {
    assert.notEqual(indexTest.LoggerModule, undefined, 'Should not be undefined');
    assert.end();
});
test('index.ts export LoggerDefaultConfig', (assert) => {
    assert.equal(typeof indexTest.LoggerDefaultConfig, 'function', 'should be a function');
    assert.end();
});
test('index.ts export ConfigModule', (assert) => {
    assert.notEqual(indexTest.ConfigModule, undefined, 'Should not be undefined');
    assert.end();
});
//# sourceMappingURL=index.spec.js.map