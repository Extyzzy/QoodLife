'use strict';

// Use bluebird Promise.
window.Promise = require('bluebird');

// Enable Promise cancellation
Promise.config({ cancellation: true });

Promise.onPossiblyUnhandledRejection(function(error){
  // Skip silenced errors
  if ( ! (error || {}).silenced) {
    throw error;
  }
});

// Force to use fetch() polyfill.
window.fetch = null;

// fetch() polyfill for making API calls.
require('whatwg-fetch');

// Object.assign() is commonly used with React.
// It will use the native implementation if it's present and isn't buggy.
Object.assign = require('object-assign');
