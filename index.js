;(function() {
  'use strict';

  function normalizeUrlPathname(argPathname, argBaseUrl) {
    console.log('I\'m here!');
    const baseUrl = argBaseUrl || 'https://localhost/';
    const url = (function() {
      if (typeof URL !== 'undefined') return new URL(argPathname, baseUrl);
      if (typeof require === 'undefined') throw new Error('Sorry! This environment is not supported.');
      const url = require('url');
      return url.parse(url.resolve(baseUrl, argPathname));
    })();
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
