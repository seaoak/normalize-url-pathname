'use strict';

const normalizer = require('./');

const assert = require('assert');

console.log(typeof URL);
console.log(typeof normalizer);

// simple normalization
assert.strictEqual(normalizer('/'), '/'); // root
assert.strictEqual(normalizer('/aaa'), '/aaa'); // simple file
assert.strictEqual(normalizer('/aaa/'), '/aaa/'); // simple directory
assert.strictEqual(normalizer('/aaa/./bbb'), '/aaa/bbb'); // simple "single-dot"
assert.strictEqual(normalizer('/aaa/../bbb'), '/bbb'); // simple "double-dot"
assert.strictEqual(normalizer('/aaa/././bbb'), '/aaa/bbb'); // a sequence of "single-dot"
assert.strictEqual(normalizer('/aaa/bbb/ccc/../../ddd'), '/aaa/ddd'); // a sequence of "double-dot"
assert.strictEqual(normalizer('/aaa/.././bbb/./ccc/././ddd/./.././eee/../../fff/./'), '/bbb/fff/'); // a mixed sequence of "single-dot" and "double-dot"

// edge case of normalization: relative path
assert.strictEqual(normalizer(''), '/');
assert.strictEqual(normalizer('aaa'), '/aaa');
assert.strictEqual(normalizer('./'), '/');
assert.strictEqual(normalizer('./aaa'), '/aaa');

// edge case of normalization: dot file
assert.strictEqual(normalizer('/.'), '/');
assert.strictEqual(normalizer('/..'), '/');
assert.strictEqual(normalizer('/aaa/bbb/.'), '/aaa/bbb/');
assert.strictEqual(normalizer('/aaa/bbb/..'), '/aaa/');

// edge case of normalization: parent of root
assert.strictEqual(normalizer('/../'), '/');
assert.strictEqual(normalizer('/../../'), '/');
assert.strictEqual(normalizer('/../../aaa'), '/aaa');
assert.strictEqual(normalizer('/aaa/bbb/../../../'), '/');
assert.strictEqual(normalizer('/aaa/bbb/../../../ccc'), '/ccc');

// edge case of normalization: consecutive separators ("/")
assert.strictEqual(normalizer('//'), '/');
assert.strictEqual(normalizer('//aaa'), '/aaa');
assert.strictEqual(normalizer('/aaa//'), '/aaa/');
assert.strictEqual(normalizer('/aaa//bbb'), '/aaa/bbb');
assert.strictEqual(normalizer('/aaa///bbb///..///.///./ccc'), '/aaa/ccc');

// reserved character treatment
assert.strictEqual(normalizer('/aaa?bbb'), undefined);
assert.strictEqual(normalizer('/aaa#bbb'), undefined);
assert.strictEqual(normalizer('/aaa[bbb'), undefined);
assert.strictEqual(normalizer('/aaa]bbb'), undefined);

assert.strictEqual(normalizer('/aaa\\bbb'), undefined);
assert.strictEqual(normalizer('/aaa\"bbb'), undefined);

assert.strictEqual(normalizer('/aaa!bbb'), '/aaa!bbb');
assert.strictEqual(normalizer('/aaa$bbb'), '/aaa$bbb');
assert.strictEqual(normalizer('/aaa&bbb'), '/aaa&bbb');
assert.strictEqual(normalizer('/aaa\'bbb'), '/aaa\'bbb');
assert.strictEqual(normalizer('/aaa(bbb'), '/aaa(bbb');
assert.strictEqual(normalizer('/aaa)bbb'), '/aaa)bbb');
assert.strictEqual(normalizer('/aaa*bbb'), '/aaa*bbb');
assert.strictEqual(normalizer('/aaa+bbb'), '/aaa+bbb');
assert.strictEqual(normalizer('/aaa,bbb'), '/aaa,bbb');
assert.strictEqual(normalizer('/aaa;bbb'), '/aaa;bbb');
assert.strictEqual(normalizer('/aaa=bbb'), '/aaa=bbb');

// specially allowed character treatment
assert.strictEqual(normalizer('/aaa:bbb'), '/aaa:bbb');
assert.strictEqual(normalizer('/aaa@bbb'), '/aaa@bbb');

// unreserved sign character treatment
assert.strictEqual(normalizer('/aaa-bbb'), '/aaa-bbb');
assert.strictEqual(normalizer('/aaa.bbb'), '/aaa.bbb');
assert.strictEqual(normalizer('/aaa_bbb'), '/aaa_bbb');
assert.strictEqual(normalizer('/aaa~bbb'), '/aaa~bbb');

// control character treatment
assert.strictEqual(normalizer('/aaa\0bbb'), undefined);
assert.strictEqual(normalizer('/aaa\nbbb'), undefined);
assert.strictEqual(normalizer('/aaa\rbbb'), undefined);
assert.strictEqual(normalizer('/aaa\vbbb'), undefined);
assert.strictEqual(normalizer('/aaa\tbbb'), undefined);
assert.strictEqual(normalizer('/aaa\bbbb'), undefined);
assert.strictEqual(normalizer('/aaa\fbbb'), undefined);
assert.strictEqual(normalizer('/aaa bbb'), undefined);

// suspicious UNICODE character treatment
assert.strictEqual(normalizer('/aaa\u007Fbbb'), undefined); // "DELETE"
assert.strictEqual(normalizer('/aaa\u007Fbbb'), undefined); // "LEFT-TO-RIGHT EMBEDDING"
assert.strictEqual(normalizer('/aaa\u200Cbbb'), undefined); // "ZERO WIDTH NON-JOINER"
assert.strictEqual(normalizer('/aaa\u200Dbbb'), undefined); // "ZERO WIDTH JOINER"
assert.strictEqual(normalizer('/aaa\uFFFDbbb'), undefined); // "REPLACEMENT CHARACTER"
assert.strictEqual(normalizer('/aaa\uFDD0bbb'), undefined); // noncharacter code point
assert.strictEqual(normalizer('/aaa\uFDD1bbb'), undefined); // noncharacter code point
assert.strictEqual(normalizer('/aaa\uFDEFbbb'), undefined); // noncharacter code point
assert.strictEqual(normalizer('/aaa\uFFFEbbb'), undefined); // noncharacter code point
assert.strictEqual(normalizer('/aaa\uFFFFbbb'), undefined); // noncharacter code point
assert.strictEqual(normalizer('/aaa\uD800bbb'), undefined); // surrogate
assert.strictEqual(normalizer('/aaa\uD801bbb'), undefined); // surrogate
assert.strictEqual(normalizer('/aaa\uDFFFbbb'), undefined); // surrogate
assert.strictEqual(normalizer('/aaa\uDFFEbbb'), undefined); // surrogate
