'use strict';
/**
 * 后台模板控制
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


    /** 入口 **/
    async indexAction(self) {
        let page = self.http.param('page') || 1;
        //获取文章列表
        let articleList2 = await self._model.getList(page, 5,'','','createtime DESC');
        //获取热门文章列表
        let articleList = await self._model.getList(1, 6,'','');
        self.assign({
            "articleListObj": articleList.data,
            "articleListObj2": articleList2
        });
        return self.display();
    }


    /*根据类型Id返回类型列表*/



    async getarticleidlist(_id){
        return await this.model('category').where({_id:_id}).find();
    }





    /** 文章详情页预览 **/
    async previewAction(self){//
        let id = self.http.param('articleid');

        //获取文章详情
        let tmplObj = (await this._model.getById(id))[0];
        if(!tmplObj){
            return self.redirect('/error/404.html');
        }
        let cate_id = tmplObj.categoryid;
        //获取文章所属分类
        let cateObj =  await self.getarticleidlist(cate_id);
        tmplObj.nav = cateObj.nav || '';
        //获取热门文章列表
        let articleList = await self._model.getList(1, 6,'','','createtime DESC');

        //获取上一条下一条
        //上一条DESC ABS
        let preObj = await self._model.where(
            {
                createtime: {
                    '$lt': tmplObj.createtime
                }
            }).order('createtime DESC').find();

        //下一条
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



