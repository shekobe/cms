export default {
  type: "memory", //缓存类型 memory、file、memcache、redis
  timeout: 900, //失效时间，单位：秒
  adapter: { //不同 adapter 下的配置
    file: {
      path: think.getPath(undefined, think.dirname.runtime) + "/cache", //缓存文件的根目录
      path_depth: 2, //缓存文件生成子目录的深度
      file_ext: ".json" //缓存文件的扩展名
    },
    redis: {
      prefix: ""
    },
    memcache: {
      prefix: ""
    }
  }
};