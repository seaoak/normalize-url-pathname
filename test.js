'use strict';

import test from 'ava';

const normalizer = require('./');

const assert = require('assert');

function macro(t, pairs) {
  t.plan(pairs.length);
  pairs.forEach(pair => t.is(normalizer(pair[0]), pair[1]));
}

test('simple normalization', macro, [
  ['/', '/'], // root
  ['/aaa', '/aaa'], // simple file
  ['/aaa/', '/aaa/'], // simple directory
  ['/aaa/./bbb', '/aaa/bbb'], // simple "single-dot"
  ['/aaa/../bbb', '/bbb'], // simple "double-dot"
  ['/aaa/././bbb', '/aaa/bbb'], // a sequence of "single-dot"
  ['/aaa/bbb/ccc/../../ddd', '/aaa/ddd'], // a sequence of "double-dot"
  ['/aaa/.././bbb/./ccc/././ddd/./.././eee/../../fff/./', '/bbb/fff/'], // a mixed sequence of "single-dot" and "double-dot"
]);

test('edge case of normalization: relative path', macro, [
  ['', '/'],
  ['aaa', '/aaa'],
  ['./', '/'],
  ['./aaa', '/aaa'],
]);

test('edge case of normalization: dot file', macro, [
  ['/.', '/'],
  ['/..', '/'],
  ['/aaa/bbb/.', '/aaa/bbb/'],
  ['/aaa/bbb/..', '/aaa/'],
]);

test('edge case of normalization: parent of root', macro, [
  ['/../', '/'],
  ['/../../', '/'],
  ['/../../aaa', '/aaa'],
  ['/aaa/bbb/../../../', '/'],
  ['/aaa/bbb/../../../ccc', '/ccc'],
]);

test('edge case of normalization: consecutive separators ("/")', macro, [
  ['//', '/'],
  ['//aaa', '/aaa'],
  ['/aaa//', '/aaa/'],
  ['/aaa//bbb', '/aaa/bbb'],
  ['/aaa///bbb///..///.///./ccc', '/aaa/ccc'],
]);

test('reserved character treatment', macro, [
  ['/aaa?bbb', undefined],
  ['/aaa#bbb', undefined],
  ['/aaa[bbb', undefined],
  ['/aaa]bbb', undefined],

  ['/aaa\\bbb', undefined],
  ['/aaa\"bbb', undefined],

  ['/aaa!bbb', '/aaa!bbb'],
  ['/aaa$bbb', '/aaa$bbb'],
  ['/aaa&bbb', '/aaa&bbb'],
  ['/aaa\'bbb', '/aaa\'bbb'],
  ['/aaa(bbb', '/aaa(bbb'],
  ['/aaa)bbb', '/aaa)bbb'],
  ['/aaa*bbb', '/aaa*bbb'],
  ['/aaa+bbb', '/aaa+bbb'],
  ['/aaa,bbb', '/aaa,bbb'],
  ['/aaa;bbb', '/aaa;bbb'],
  ['/aaa=bbb', '/aaa=bbb'],
]);

test('specially allowed character treatment', macro, [
  ['/aaa:bbb', '/aaa:bbb'],
  ['/aaa@bbb', '/aaa@bbb'],
]);

test('unreserved sign character treatment', macro, [
  ['/aaa-bbb', '/aaa-bbb'],
  ['/aaa.bbb', '/aaa.bbb'],
  ['/aaa_bbb', '/aaa_bbb'],
  ['/aaa~bbb', '/aaa~bbb'],
]);

test('control character treatment', macro, [
  ['/aaa\0bbb', undefined],
  ['/aaa\nbbb', undefined],
  ['/aaa\rbbb', undefined],
  ['/aaa\vbbb', undefined],
  ['/aaa\tbbb', undefined],
  ['/aaa\bbbb', undefined],
  ['/aaa\fbbb', undefined],
  ['/aaa bbb', undefined],
]);

test('suspicious UNICODE character treatment', macro, [
  ['/aaa\u007Fbbb', undefined], // "DELETE"
  ['/aaa\u007Fbbb', undefined], // "LEFT-TO-RIGHT EMBEDDING"
  ['/aaa\u200Cbbb', undefined], // "ZERO WIDTH NON-JOINER"
  ['/aaa\u200Dbbb', undefined], // "ZERO WIDTH JOINER"
  ['/aaa\uFFFDbbb', undefined], // "REPLACEMENT CHARACTER"
  ['/aaa\uFDD0bbb', undefined], // noncharacter code point
  ['/aaa\uFDD1bbb', undefined], // noncharacter code point
  ['/aaa\uFDEFbbb', undefined], // noncharacter code point
  ['/aaa\uFFFEbbb', undefined], // noncharacter code point
  ['/aaa\uFFFFbbb', undefined], // noncharacter code point
  ['/aaa\uD800bbb', undefined], // surrogate
  ['/aaa\uD801bbb', undefined], // surrogate
  ['/aaa\uDFFFbbb', undefined], // surrogate
  ['/aaa\uDFFEbbb', undefined], // surrogate
]);
