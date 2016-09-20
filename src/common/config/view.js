'use strict';
/**
 * template config
 */
export default {
  type: 'nunjucks',
  content_type: 'text/html',
  file_ext: '.html',
  file_depr: '/',
  root_path: think.ROOT_PATH + '/view',
  adapter: {   
  	nunjucks: {
  	  autoescape: true,
      watch: false,
      noCache: true,
      tags:{
        variableStart: '{$',
        variableEnd: '$}',
      },
      throwOnUndefined: true,
      prerender:(nunjucks,env) => {

        /**
         * 格式化时间  date :时间戳  formate 格式
         */
        env.addFilter("format_time", function (date, format) {
            if(!date){
                return '';
            }
            if(typeof date ==='string' && /!(:+-)/g.test(date)) date = parseInt(date);
              date = new Date(date);
              var map = {
                  "M": date.getMonth() + 1, //月份 
                  "d": date.getDate(), //日 
                  "h": date.getHours(), //小时 
                  "m": date.getMinutes(), //分 
                  "s": date.getSeconds(), //秒 
                  "q": Math.floor((date.getMonth() + 3) / 3), //季度 
                  "S": date.getMilliseconds() //毫秒 
              };
              format || (format = "yyyy-MM-dd hh:mm:ss");
              return format.replace(/([yMdhmsqS])+/g, function(all, t){
                  var v = map[t];
                  if(v !== undefined){
                      if(all.length > 1){
                          v = '0' + v;
                          v = v.substr(v.length-2);
                      }
                      return v;
                  }else if(t === 'y'){
                      return (date.getFullYear() + '').substr(4 - all.length);
                  }
                  return all;
              });
        })

        /**
         * 格式化详情页导航
         */
        env.addFilter("format_random", function (nav, sec) {

            return new Date().getTime()+'_'+Math.random();
        })

      }
  	}
  }
};
