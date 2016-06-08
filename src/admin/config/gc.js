//缓存、Session等垃圾处理配置
export default {
  on: false, //是否开启垃圾回收处理
  interval: 24*3600, // 处理时间间隔，默认为一个小时
  filter: function(){ //如果返回 true，则进行垃圾回收处理
    let hour = (new Date()).getHours();
    if(hour === 4){
      return false;
    }
  }
};