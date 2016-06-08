'use strict';

/**
 * 后台系统
 *
 */

import Base from './base';

export default class extends Base {
    
    /**
     * 首页
     * @return {[type]}      [description]
     */
    async indexAction(){
       //显示首页
       return this.display();
    }
  
}



