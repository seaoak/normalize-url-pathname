;(function() {
  'use strict';

  const MyURL = (function() {
    if (typeof URL !== 'undefined') return URL;
    if (typeof require !== 'undefined') return require('url').URL;
    throw new Error('Sorry! This environment is not supported.');
  })();

  function pipe() {
    const funcList = Array.from(arguments);
    const first = funcList.shift();
    Object.freeze(funcList); // just in case
    if (! first) throw new TypeError('too few arguments');
    if (! first.apply) throw new TypeError('invalid argument');
    return function pipeHelper() {
      const args = Array.from(arguments);
      return funcList.reduce((acc, func) => func(acc), first.apply(null, args));
    };
  }

  function reduceConsecutiveSeparators(str) {
    return str.replace(/\/{2,}/g, '/');
  }

  function normalizePercentEncoding(str) {
    return str.replace(/%[\s\S]{0,2}/g, str => str.match(/^%[0-9a-fA-F]{2}$/) ? str.toUpperCase() : '\0');
  }

  function removeInvalidCharacter(str) {
    return str.replace(/[^-._~a-zA-Z0-9%!$&''()*+,;=:@\/]/g, str => '\0'); // RFC3986
  }

  const cleaner = pipe(
    str => str.normalize(),
    removeInvalidCharacter,
    normalizePercentEncoding,
    reduceConsecutiveSeparators,
    str => str.includes('\0') ? undefined : str);

  function normalizeUrlPathname(argPathname, argBaseUrl) {
    console.log('I\'m here!');
    const baseUrl = argBaseUrl || 'https://localhost/';
    if (! argPathname) return '/';
    const cleaned = cleaner(argPathname);
    if (! cleaned) return undefined;
    const url = new MyURL(cleaned, baseUrl);
    const result = url.pathname;
    if (! result || result.includes('//')  || result.includes('/./') || result.includes('/../')) throw new Error('unexpected behavior of URL API: ' + url);
    return result;
  }

  if (typeof module !== 'undefined') {
    module.exports = normalizeUrlPathname;
  } else if (typeof exports !== 'undefined') {
    exports.normalizeUrlPathname = normalizeUrlPathname;
  } else if (typeof window !== 'undefined') {
    window.normalizeUrlPathname = normalizeUrlPathname;
  } else if (typeof global !== 'undefined') {
    global.normalizeUrlPathname = normalizeUrlPathname;
  } else {
    throw new Error('Sorry! This environment is not supported.');
  }
})();
