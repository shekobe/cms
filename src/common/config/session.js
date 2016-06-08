'use strict';

/**
 * session configs
 */
export default {
  name: 'qkToken',
  type: 'memory',//
  secret: 'GTBHR2NL',
  timeout: 24 * 3600,
  cookie: { // cookie options
    length: 32,
    httponly: true
  },
  adapter: {
    file: {
      path: think.getPath('common', 'runtime') + '/session',
    }
  }
};