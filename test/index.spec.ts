import * as test from 'blue-tape';
import * as indexTest from '../src/index';

test('index.ts export BaseModule', (assert) => {
  assert.notEqual(indexTest.ServerModule, undefined, 'Should not be undefined');
  assert.end();
});

test('index.ts export RouterModule', (assert) => {
  assert.notEqual(indexTest.RouterModule, undefined, 'Should not be undefined');
  assert.end();
});

