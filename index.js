;(function() {
  'use strict';

  function createURL(href) {
    if (typeof URL !== 'undefined') return new URL(href);
    if (typeof require !== 'undefined') return require('url').parse(href);
    throw new Error('Sorry! This environment is not supported.');
  }

  function normalizeUrlPathname(argPathname, argBaseUrl) {
    console.log('I\'m here!');
    const url = createURL(argBaseUrl || 'https://localhost/');
    url.pathname = argPathname;
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
