;(function() {
  'use strict';

  const MyURL = (function() {
    if (typeof URL !== 'undefined') return URL;
    if (typeof require !== 'undefined') return require('url').URL;
    throw new Error('Sorry! This environment is not supported.');
  })();

  function normalizeUrlPathname(argPathname, argBaseUrl) {
    console.log('I\'m here!');
    const baseUrl = argBaseUrl || 'https://localhost/';
    const url = new MyURL(argPathname, baseUrl);
    return url.pathname;
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
