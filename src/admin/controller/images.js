'use strict';
/**
 * 后台模板控制
 *
 */
import Base from './base.js';
import fs from 'fs';
import path from 'path';
export default class extends Base {
    init(http) {
        super.init(http);
        this._model = this.model('images');
    }
    /** 入口 **/
    async indexAction(self) {
        return self.display();
    }

    /** 通过用户名获取用户信息 **/
    async gettepmlistAction(self){
        let page = self.http.param("page") || 1;
        let nums = self.http.param("nums") || 10;
        let range = self.http.param("range");
        let operator = self.http.param("operator");
        let data = await self._model.getimageList(page,nums,range,operator);

        //let p1 = self._model.order('date DESC').countSelect();
        //let p2 = self._model.order('date ABS').countSelect();
        //let [p1Data, p2Data] = await Promise.all([p1, p2]);
        //console.log('------',p1Data);
        //console.log('++++++',p2Data);
        self.success(data);
    }
    /** 通过id删除 **/
    async deldataAction(self){
        let id = self.http.param('id');
        //
        if(!id)  return self.fail(606,'param is null');
        let result = await self._model.delData(id);
        self.success(result);
    }


}



