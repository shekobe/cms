'use strict';

import Base from './base.js';

/**
 * error controller
 */

export default class extends Base {

  async indexAction(self){
    let status = this.get('num');
    //监测
    if(!think.isNumber(status)) status = 404;
    return self.displayErrorPage(status);
  }
	/**
   * display error page
   * @param  {Number} status [default 404]
   * @return {Promise}        []
   */
  async displayErrorPage(status,msg){
    // let file = '/home/error/error.html';
    this.assign("status",status || 404);
    this.assign("errormsg",msg || '页面找不到了');
    // template url 'view/home/error/404.html'
    return this.display('error');
  }
  /**
   * Bad Request 
   * @param  {Object} self []
   * @return {Promise} []
   */
  async _400Action(self){
    return self.displayErrorPage(400);
  }
  /**
   * Forbidden 
   * @param  {Object} self []
   * @return {Promise} []
   */
  async _403Action(self){
    return self.displayErrorPage(403);
  }
  /**
   * Not Found 
   * @param  {Object} self []
   * @return {Promise}      []
   */
  async _404Action(self){
    return self.displayErrorPage(404);
  }
  /**
   * Internal Server Error
   * @param  {Object} self []
   * @return {Promise}      []
   */
  async _500Action(self){
    return self.displayErrorPage(500);
  }
  /**
   * Service Unavailable
   * @param  {Object} self []
   * @return {Promise}      []
   */
  async _503Action(self){
    return self.displayErrorPage(503);
  }

}