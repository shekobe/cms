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
    let product = self.get('product')|| 'index';//获取所在页面
    let page = self.get('page')||'index';

    let file = self.http.module+'/'+self.http.controller+'/'+ product+'/'+ page +'.html';
    let filemobile = self.http.module+'/'+self.http.controller+'/m_'+ product+'/'+ page +'.html';
    let filecheck = path.join(think.ROOT_PATH+'/view',file);
    
    //mobile file
    if(self.checkMobile() && think.isFile(path.join(think.ROOT_PATH+'/view',filemobile))){
      return self.display(self.http.controller+'/m_'+product+'/'+ page +'.html');
    //check file 是否存在
    }else if(think.isFile(filecheck)){
      return self.display(self.http.controller+'/'+product+'/'+ page +'.html');
    }else{
      return self.redirect('/error/404.html');
    }
  }

}
