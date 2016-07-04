'use strict';
/**
 * ��̨ģ�����
 *
 */
import Base from './base.js';
import fs from 'fs';
import mongodb from 'mongodb';
import path from 'path';
import moment from 'moment';
export default class extends Base {
    init(http) {
        super.init(http);
        this._model = this.model('article');
    }


    /** ��� **/
    async indexAction(self) {
        let page = self.http.param('page') || 1;
        //��ȡ�����б�
        let articleList2 = await self._model.getList(page, 5,'','','createtime DESC');
        //��ȡ���������б�
        let articleList = await self._model.getList(1, 6,'','');
        self.assign({
            "articleListObj": articleList.data,
            "articleListObj2": articleList2
        });
        return self.display();
    }


    /*��������Id���������б�*/



    async getarticleidlist(_id){
        return await this.model('category').where({_id:_id}).find();
    }





    /** ��������ҳԤ�� **/
    async previewAction(self){//
        let id = self.http.param('articleid');

        //��ȡ��������
        let tmplObj = (await this._model.getById(id))[0];
        if(!tmplObj){
            return self.redirect('/error/404.html');
        }
        let cate_id = tmplObj.categoryid;
        //��ȡ������������
        let cateObj =  await self.getarticleidlist(cate_id);
        tmplObj.nav = cateObj.nav || '';
        //��ȡ���������б�
        let articleList = await self._model.getList(1, 6,'','','createtime DESC');

        //��ȡ��һ����һ��
        //��һ��DESC ABS
        let preObj = await self._model.where(
            {
                createtime: {
                    '$lt': tmplObj.createtime
                }
            }).order('createtime DESC').find();

        //��һ��
        let nextObj = await self._model.where(
            {
                createtime: {
                    '$gt': tmplObj.createtime
                }
            }).order('createtime ABS').find();


        self.assign({
            "articleObj":tmplObj
            ,"preObj": preObj,"nextObj": nextObj,
            "articleListObj": articleList.data,"title": tmplObj.title,"keywords":tmplObj.keywords,"description":tmplObj.description});
        return self.display(path.join(think.ROOT_PATH,'view/home/news/detail.html'));
    }



}



