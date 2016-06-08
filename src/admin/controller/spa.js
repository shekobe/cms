'use strict';
/**
 * 单页制作 活动页面制作
 */
import Base from './base';

export default class extends Base {
    init(http) {
        super.init(http);
        this._model = this.model('template');
    }
    /**
     * 首页
     * @return {[type]}      [description]
     */
    async indexAction(){
        var id = this.http.get('id');
        let data={"_id":'', "pageName": "", "path": "","content":""}
        if(id) data = (await this._model.getById(id))[0];
        this.assign({"pagetemp":data});
       //显示首页
       return this.display();
    }
  
}
