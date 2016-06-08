'use strict';
/**
 * db config
 * @type {Object}
 */
export default {
  type: 'mysql',
  host: '127.0.0.1',
  port: '',
  database: '',
  user: '',
  pwd: '',
  prefix: '',
  encoding: 'utf8',
  nums_per_page: 20,
  log_sql: true,
  log_connect: true,
  cache: {
    on: true,
    type: '',
    timeout: 3600
  },
  adapter: {
    mysql: {},
    mongo: {}
  }
};