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
      throwOnUndefined: true
  	}
  }
};
