'use strict';

/**
 * 后台系统用户表业务逻辑
 *
 */

import Base from './base.js';
import fs from 'fs';
import path from 'path';
export default class extends Base {
    init(http) {
        super.init(http);
        this._model = this.model('category');
    }
    /**
     * 入口判断
     *
     */
    async indexAction(self) {
        //self.http.redirect("/admin/menu/index");
        return self.display();


    }

    /**
     * 通过用户名获取用户信息
     *
     */
    async getlistAction(self){
        await self._model.getData(function(o){
            self.success(o);
        });
    }

    /**
     * 通过roleid获取用户信息
     *
     */
    async getlistbyidAction(self){
        var id = self.http.param('id');
        var idArr = id.split(',');
        await self._model.getDataById(idArr,function(o){
            self.success(o);
        });
    }

    /**
     * 通过id删除svn日志表
     *
     */
    async deldataAction(self){
        var id = self.http.param('id');
        var idArr = id.split(',');
        await self._model.delData(idArr,function(o){
            self.success(o)
        });
    }
    /**
     * 通获取svnlogs信息
     *
     */
    async addlistAction(self) {
        //auto render template file index_index.html
        if(self.http.isGet()){
        }else{
            self._model.addData({
                parent:self.http.param('parent'),
                name:self.http.param('text'),
                text:self.http.param('text')

            },function(o){
                self.success(o);
            });
        }

    }




    /**
     * 更新svnlogs表
     *
     */
    async updatedataAction(self){
        self._model.updateData({
            text:self.http.param('text'),
            name:self.http.param('text'),
            id:self.http.param('id'),
            href:self.http.param('href'),
            url:self.http.param('href'),
            dir:self.http.param('dir'),
            parent:self.http.param('parent'),
            children_dd:self.http.param('children_d'),
            icon:self.http.param('icon'),
            description:self.http.param('description'),
            order_:self.http.param('order'),
            status:self.http.param('status')
        },function(o){
            //if (o != null) {
            //    self.success(o)
            //} else {
            //    self.fail(1000, "connect error"); //指定错误号和错误信息
            //}
            self.success(o);
        });
    }

    /**
     * 更新svnlogs表
     *
     */
    async updatedatatextAction(self){
        self._model.updateDatatext({
            text:self.http.param('text'),
            name:self.http.param('text'),
            children_d:self.http.param('children_d') || '',
            nav:self.http.param('nav') || '',
            id:self.http.param('id')

        },function(o){
            //if (o != null) {
            //    self.success(o)
            //} else {
            //    self.fail(1000, "connect error"); //指定错误号和错误信息
            //}
            self.success(o);
        });
    }

}



