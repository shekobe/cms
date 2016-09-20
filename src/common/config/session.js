'use strict';

/**
 * session configs
 */
export default {
  name: 'qkToken',
  type: 'file',//
  secret: 'GTBHR2NL',
  timeout: 3600 * 2,
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