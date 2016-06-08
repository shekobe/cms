/**
 * redis 服务器列表
 */
export default {
  development:{
    //sentinels: [{ host: '10.1.21.201', port: 26379}],
    // sentinels: [{ host: '10.201.3.50', port: 26379 }, { host: '10.201.3.89', port: 26379 }],
    // name: 'master4'//测试环境用localhost,生产环境用master4
      port: 6379          // Redis port
      ,host: '127.0.0.1'   // Redis host
      ,family: 4           // 4 (IPv4) or 6 (IPv6)
      // //,password: 'auth'
      // ,db: 0
  },
  product:{
    sentinels: [{ host: '10.0.58.29', port: 26379 }, { host: '10.0.58.30', port: 26379 }],
    name: 'master2'//测试环境用localhost,生产环境用master4

  }
};