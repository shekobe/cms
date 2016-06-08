'use strict';
/**
 * db config
 * @type {Object}
 */
module.exports = {
  type: 'mongo',
  host: '10.1.21.27',
  port: '27017',
  database: 'qiku',
  user: 'qiku2',
  password: '123456',
  prefix: 'qkweb_',
  encoding: 'utf8',
  nums_per_page: 10,
  log_sql: true,
  log_connect: true,
  cache: {
    on: true,
    type: '', //默认momory
    timeout: 3600
  },
  options: {
    authSource: 'qiku'
  }
};
//create db
//db.createUser({user:"teenage",pwd:"214365",roles:[{role:"userAdminAnyDatabase",db:"admin"}]})
