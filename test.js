'use strict';

const normalizer = require('./');

const assert = require('assert');

console.log(typeof URL);
console.log(typeof normalizer);

assert.strictEqual(normalizer('/aaa'), '/aaa');
assert.strictEqual(normalizer('/bbb/../../ccc/./../ddd/././eee'), '/ddd/eee');
