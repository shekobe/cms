'use strict';

/**
 * ��̨ϵͳ�û���ҵ���߼�
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
     * ����ж�
     *
     */
    async indexAction(self) {

        //self.http.redirect("/admin/menu/index");
        return self.display();


    }

    /**
     * ͨ���û�����ȡ�û���Ϣ
     *
     */
    async getlistAction(self){
        await self._model.getData(function(o){
            self.success(o);
        });
    }

    /**
     * ͨ��roleid��ȡ�û���Ϣ
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
     * ͨ��idɾ��svn��־��
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
     * ͨ��ȡsvnlogs��Ϣ
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
     * ����svnlogs��
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
            order:self.http.param('order'),
            status:self.http.param('status')
        },function(o){
            //if (o != null) {
            //    self.success(o)
            //} else {
            //    self.fail(1000, "connect error"); //ָ������źʹ�����Ϣ
            //}
            self.success(o);
        });
    }

    /**
     * ����svnlogs��
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
            //    self.fail(1000, "connect error"); //ָ������źʹ�����Ϣ
            //}
            self.success(o);
        });
    }

}



