/**
 * redis 服务器列表
 */
export default {
  development:{
      port: 6379          // Redis port
      ,host: 'localhost'   // Redis host
      ,family: 4           // 4 (IPv4) or 6 (IPv6)
      // //,password: 'auth'
      // ,db: 0
  },

    rds:{
        pos:0,
        group:'a'
    },

    product:[
        {
            port: 6379          // Redis port
            ,host: '10.0.58.138'   // Redis host a 0
            ,family: 4
        },
        {
            port: 6379          // Redis port
            ,host: '10.0.58.139'   // Redis host b 1
            ,family: 4
        },
        {
            port: 6379          // Redis port
            ,host: '10.0.58.140'   // Redis host c 2
            ,family: 4
        },
        {
            port: 6379          // Redis port
            ,host: '10.0.58.142'   // Redis host d 3
            ,family: 4
        }


    ]

};