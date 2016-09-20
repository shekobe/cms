'use strict';
/**
 * db config
 * @type {Object}
 */
module.exports = {
  type: 'mongo',
  host: '10.100.7.64',
  port: '28001',
  database: 'qiku',
  //user: 'qiku',
  //password: '123456',
  prefix: 'qkadmin_',
  //prefix: '',
  encoding: 'utf8',
  nums_per_page: 10,
  log_sql: true,
  log_connect: true,
  cache: {
    on: true,
    type: '',//默认momory
    timeout: 3600
  },
  options: {
    authSource: 'qiku'
  }
};
//create db
//db.createUser({user:"teenage",pwd:"214365",roles:[{role:"userAdminAnyDatabase",db:"admin"}]})