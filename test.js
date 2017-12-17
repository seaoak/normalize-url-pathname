'use strict';

const normalizer = require('./');

const assert = require('assert');

console.log(typeof URL);
console.log(typeof normalizer);

const result = normalizer('/aaa');
assert(result === '/aaa');
