'use strict';

import test from 'ava';

const normalizer = require('./');

const assert = require('assert');

console.log(typeof URL);
console.log(typeof normalizer);

test('simple normalization', async t => {
  t.plan(8);
  t.is(normalizer('/'), '/'); // root
  t.is(normalizer('/aaa'), '/aaa'); // simple file
  t.is(normalizer('/aaa/'), '/aaa/'); // simple directory
  t.is(normalizer('/aaa/./bbb'), '/aaa/bbb'); // simple "single-dot"
  t.is(normalizer('/aaa/../bbb'), '/bbb'); // simple "double-dot"
  t.is(normalizer('/aaa/././bbb'), '/aaa/bbb'); // a sequence of "single-dot"
  t.is(normalizer('/aaa/bbb/ccc/../../ddd'), '/aaa/ddd'); // a sequence of "double-dot"
  t.is(normalizer('/aaa/.././bbb/./ccc/././ddd/./.././eee/../../fff/./'), '/bbb/fff/'); // a mixed sequence of "single-dot" and "double-dot"
});

test('edge case of normalization: relative path', async t => {
  t.plan(4);
  t.is(normalizer(''), '/');
  t.is(normalizer('aaa'), '/aaa');
  t.is(normalizer('./'), '/');
  t.is(normalizer('./aaa'), '/aaa');
});

test('edge case of normalization: dot file', async t => {
  t.plan(4);
  t.is(normalizer('/.'), '/');
  t.is(normalizer('/..'), '/');
  t.is(normalizer('/aaa/bbb/.'), '/aaa/bbb/');
  t.is(normalizer('/aaa/bbb/..'), '/aaa/');
});

test('edge case of normalization: parent of root', async t => {
  t.plan(5);
  t.is(normalizer('/../'), '/');
  t.is(normalizer('/../../'), '/');
  t.is(normalizer('/../../aaa'), '/aaa');
  t.is(normalizer('/aaa/bbb/../../../'), '/');
  t.is(normalizer('/aaa/bbb/../../../ccc'), '/ccc');
});

test('edge case of normalization: consecutive separators ("/")', async t => {
  t.plan(5);
  t.is(normalizer('//'), '/');
  t.is(normalizer('//aaa'), '/aaa');
  t.is(normalizer('/aaa//'), '/aaa/');
  t.is(normalizer('/aaa//bbb'), '/aaa/bbb');
  t.is(normalizer('/aaa///bbb///..///.///./ccc'), '/aaa/ccc');
});

test('reserved character treatment', async t => {
  t.plan(17);
  t.is(normalizer('/aaa?bbb'), undefined);
  t.is(normalizer('/aaa#bbb'), undefined);
  t.is(normalizer('/aaa[bbb'), undefined);
  t.is(normalizer('/aaa]bbb'), undefined);

  t.is(normalizer('/aaa\\bbb'), undefined);
  t.is(normalizer('/aaa\"bbb'), undefined);

  t.is(normalizer('/aaa!bbb'), '/aaa!bbb');
  t.is(normalizer('/aaa$bbb'), '/aaa$bbb');
  t.is(normalizer('/aaa&bbb'), '/aaa&bbb');
  t.is(normalizer('/aaa\'bbb'), '/aaa\'bbb');
  t.is(normalizer('/aaa(bbb'), '/aaa(bbb');
  t.is(normalizer('/aaa)bbb'), '/aaa)bbb');
  t.is(normalizer('/aaa*bbb'), '/aaa*bbb');
  t.is(normalizer('/aaa+bbb'), '/aaa+bbb');
  t.is(normalizer('/aaa,bbb'), '/aaa,bbb');
  t.is(normalizer('/aaa;bbb'), '/aaa;bbb');
  t.is(normalizer('/aaa=bbb'), '/aaa=bbb');
});

test('specially allowed character treatment', async t => {
  t.plan(2);
  t.is(normalizer('/aaa:bbb'), '/aaa:bbb');
  t.is(normalizer('/aaa@bbb'), '/aaa@bbb');
});

test('unreserved sign character treatment', async t => {
  t.plan(4);
  t.is(normalizer('/aaa-bbb'), '/aaa-bbb');
  t.is(normalizer('/aaa.bbb'), '/aaa.bbb');
  t.is(normalizer('/aaa_bbb'), '/aaa_bbb');
  t.is(normalizer('/aaa~bbb'), '/aaa~bbb');
});

test('control character treatment', async t => {
  t.plan(8);
  t.is(normalizer('/aaa\0bbb'), undefined);
  t.is(normalizer('/aaa\nbbb'), undefined);
  t.is(normalizer('/aaa\rbbb'), undefined);
  t.is(normalizer('/aaa\vbbb'), undefined);
  t.is(normalizer('/aaa\tbbb'), undefined);
  t.is(normalizer('/aaa\bbbb'), undefined);
  t.is(normalizer('/aaa\fbbb'), undefined);
  t.is(normalizer('/aaa bbb'), undefined);
});

test('suspicious UNICODE character treatment', async t => {
  t.plan(14);
  t.is(normalizer('/aaa\u007Fbbb'), undefined); // "DELETE"
  t.is(normalizer('/aaa\u007Fbbb'), undefined); // "LEFT-TO-RIGHT EMBEDDING"
  t.is(normalizer('/aaa\u200Cbbb'), undefined); // "ZERO WIDTH NON-JOINER"
  t.is(normalizer('/aaa\u200Dbbb'), undefined); // "ZERO WIDTH JOINER"
  t.is(normalizer('/aaa\uFFFDbbb'), undefined); // "REPLACEMENT CHARACTER"
  t.is(normalizer('/aaa\uFDD0bbb'), undefined); // noncharacter code point
  t.is(normalizer('/aaa\uFDD1bbb'), undefined); // noncharacter code point
  t.is(normalizer('/aaa\uFDEFbbb'), undefined); // noncharacter code point
  t.is(normalizer('/aaa\uFFFEbbb'), undefined); // noncharacter code point
  t.is(normalizer('/aaa\uFFFFbbb'), undefined); // noncharacter code point
  t.is(normalizer('/aaa\uD800bbb'), undefined); // surrogate
  t.is(normalizer('/aaa\uD801bbb'), undefined); // surrogate
  t.is(normalizer('/aaa\uDFFFbbb'), undefined); // surrogate
  t.is(normalizer('/aaa\uDFFEbbb'), undefined); // surrogate
});
