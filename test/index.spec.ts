import * as test from 'blue-tape';
import * as indexTest from '../src/index';

test('index.ts export BaseModule', (assert) => {
  assert.notEqual(indexTest.BaseModule, undefined, 'Should not be undefined');
  assert.end();
});

test('index.ts export LoggerModule', (assert) => {
  assert.notEqual(indexTest.LoggerModule, undefined, 'Should not be undefined');
  assert.end();
});

test('index.ts export ConfigModule', (assert) => {
  assert.notEqual(indexTest.ConfigModule, undefined, 'Should not be undefined');
  assert.end();
});

test('index.ts export createConfig', (assert) => {
  assert.equal(typeof indexTest.createConfig, 'function', 'should be a function');
  assert.end();
});
