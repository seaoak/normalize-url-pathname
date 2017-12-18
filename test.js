'use strict';

const normalizer = require('./');

const assert = require('assert');

console.log(typeof URL);
console.log(typeof normalizer);

assert.strictEqual(normalizer('/'), '/'); // root
assert.strictEqual(normalizer('/aaa'), '/aaa'); // simple file
assert.strictEqual(normalizer('/aaa/'), '/aaa/'); // simple directory
assert.strictEqual(normalizer('/aaa/./bbb'), '/aaa/bbb'); // simple "single-dot"
assert.strictEqual(normalizer('/aaa/../bbb'), '/bbb'); // simple "double-dot"
assert.strictEqual(normalizer('/aaa/././bbb'), '/aaa/bbb'); // a sequence of "single-dot"
assert.strictEqual(normalizer('/aaa/bbb/ccc/../../ddd'), '/aaa/ddd'); // a sequence of "double-dot"
assert.strictEqual(normalizer('/aaa/.././bbb/./ccc/././ddd/./.././eee/../../fff/./'), '/bbb/fff/'); // a mixed sequence of "single-dot" and "double-dot"
