'use strict';

import path from 'path';
import Base from './base.js';

// var path  = require('path');

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction(self) {
    //获取model
    let page = self.get('page');//获取所在页面
    let file = self.http.module+'/'+self.http.controller+'/help_'+ page +'.html';
    let filecheck = path.join(think.ROOT_PATH+'/view',file);
    //check file 是否存在
    if(think.isFile(filecheck)){
      return self.display('help_'+page);
    }else{
      return self.redirect('/error/404.html');
    }
  }

}
