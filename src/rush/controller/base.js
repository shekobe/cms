'use strict';

export default class extends think.controller.base {
  /**
   * 检查是否正常
   */
  async __before() {

  }
  /**
 * 验证是否为智能手机
 * @ param {string} userAgent;
 * @ return {bool}
 */
 checkMobile(userAgent){
    if(!userAgent) userAgent = this.http.userAgent();
    let flag = false;
    // mobile
    let regmobile = /iPad|iPod|iPhone|Android|BlackBerry|SymbianOS|SCH-M\d+|Opera Mini|Windows (CE|Phone)|Nokia|SonyEricsson|webOS|PalmOS|phone|wap|MQQBrowser|Mobile/ig;
    //pc
    let regpc =/Macintosh|windows NT/ig;
    //手机判断
    if(regmobile.test(userAgent.toLowerCase())) flag = true;
    return flag;
 }
 /**
  * 模板渲染方法
  * @return {[type]} [description]
  */
 renderc(file){
  if(file){
    let len = file.split('/').length;
    if(len == 1 || len == 2){
      return this.display(file);
    }else{
      return this.display('${this.http.module}'+file);
    }
  }else{
    return this.display();
  }
 }


}