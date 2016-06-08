export default {
  on: true, //use html_cache
  type: 'memory', //cache content store type
  timeout: 1800,//秒
  callback: function(key){
    return think.md5(key);
  },
  rules: {
    // 'index_{page}' // get page paramter from GET
    // 'index_{:module}' // get module value
    // 'index_{:controller}' //get controller value
    // 'index_{:action}' //get action value
    // 'index_{cookie.xxx}' //get value from cookie
    'home/index/index': ['index_index', 1800 ],
    'home/help/index': ['help_{page}', 1800 ]
  },
  //adapter config
  adapter: {
    file: {
      path: think.ROOT_PATH + '/runtime/html'  //think.getPath('common', 'runtime') + '/html' //when type is file, set cache path
    }
  }
}