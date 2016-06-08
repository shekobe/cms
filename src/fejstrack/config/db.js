'use strict';
/**
 * db config
 * @type {Object}
 */
module.exports = {
  type: 'mongo',
  host: '101.198.161.117',
  // host: '127.0.0.1',
  port: '27017',
  database: 'fejstrack',
  // user: 'teenage',
  // password: '123456',
  user: 'fejstrack',//
  password: 'fejstrack123456',//123456
  prefix: '',
  encoding: 'utf8',
  nums_per_page: 20,
  log_sql: true,
  log_connect: true,
  cache: {
    on: true,
    type: '',//默认momory
    timeout: 3600
  },
  options: {
     authSource: 'fejstrack'
  }
};
