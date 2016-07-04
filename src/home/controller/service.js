'use strict';

import path from 'path';
import Base from './base.js';

// var path  = require('path');

export default class extends Base {
  /**
   * index action
   * @return {[type]} [description]
   */
  async indexAction(){
    return this.display();
  }
  /**
   * 通用匹配
   * @param  {[type]} self [description]
   * @return {[type]}      [description]
   */
  async commonAction(self){
    let type = self.get('type');
    let file = self.http.module+'/'+ self.http.controller +'/'+type +'.html';
    let filecheck = path.join(think.ROOT_PATH+'/view',file);
    if(think.isFile(filecheck)){
      return self.display(type +'.html');
    }else{
      return self.redirect('/error/404.html');
    }
  }
  /**
   * help action
   * @return {Promise} []
   */
  async helpAction(self) {
    //获取model
    let page = self.get('page');//获取所在页面
    let file = self.http.module+'/help/help_'+ page +'.html';
    let filecheck = path.join(think.ROOT_PATH+'/view',file);
    //check file 是否存在
    if(think.isFile(filecheck)){
      return self.display('help/help_'+page);
    }else{
      return self.redirect('/error/404.html');
    }
  }
  /**
   * [aboutAction description]
   * @return {[type]} [description]
   */
  async aboutAction(self){
    let page = self.get('page') || 'index';
    let file = self.http.module+'/about/'+page +'.html';
    let filecheck = path.join(think.ROOT_PATH+'/view',file);
    //
    if(think.isFile(filecheck)){
      return self.display('about/'+page +'.html');
    }else{
      return self.redirect('/error/404.html');
    }
  }

}
