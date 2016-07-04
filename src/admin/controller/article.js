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

        return self.display();
    }

    //��ʾ�����б�
    async listAction(self) {
        let page = self.http.param('page') || 1;
        //��ȡ�����б�
        let articleList2 = await self._model.getList(page, 5,'','','createtime DESC');
        //��ȡ���������б�
        let articleList = await self._model.getList(1, 6,'','');
        self.assign({
            "articleListObj": articleList.data,
            "articleListObj2": articleList2
        });
        console.log(articleList2);
        return self.display(path.join(think.ROOT_PATH,'view/home/news/index.html'));
    }

    /*��ʾ����ҳ���޸�����*/
    async detailAction(self) {
        let id = self.http.param("articleid") || '';
        let categoryid = self.http.param("categoryid") || '';
        let data =  {"url":'',"description":'',"keywords":'',"_id": '',"contents":"",'title':"","thumb":"",'images':'',"categoryid":'',status:'',order:'',"author":''};
        if(id){//�޸�
            data = await this._model.where({_id:id}).find();
            if(data.categoryid){
                let obj2 =  await self.getarticleidlist(data.categoryid);
                data.nav = obj2.nav.replace(/\//g,' / ');
                data._id = id;
            }else{
                data.nav = '';
                data._id = '';
            }

        }else{//����
            let obj2 =  await self.getarticleidlist(categoryid);
            data.nav = obj2.nav.replace(/\//g,' / ');
        }
        data.nav = data.nav || '';
        this.assign({"template": data});
        return self.display();
    }

    /*��������Id���������б�*/



    async getarticleidlist(_id){
      return await this.model('category').where({_id:_id}).find();
    }

    /** ��ȡҳ������ **/
    async gettempAction(self) {
        let id = self.http.param("id");
        let data = await self.gettempbyid(id);
        self.success(data);
    }

    /*��ȡҳ��������Ϣ*/
    async gettempbyid(id) {
        if (!id) return this.fail(606, 'param is null');
        let data = await this._model.getById(id);

        return data;
    }

    /* ��ȡǰ��ģ�� */
    async frontAction(self) {
        return self.display();
    }

    //���� ���� ����

    async setstatusAction(self){
        let ids = self.http.param("ids");
        let updateby = self.http.param("updateby");
        let status = self.http.param("status");
        let idArr = ids.split(',');
        let newArr = [];
        for(var i=0;i<idArr.length;i++){
            if(idArr[i]){
                let item = mongodb.ObjectID(idArr[i]);
                newArr.push(item);
            }

        }
        let result = await self._model.setStatus(newArr,updateby,status);
        self.success(result);

    }
    //��ѡɾ��
    async delmutiAction(self){
        let ids = self.http.param("ids");
        let updateby = self.http.param("updateby");
        let idArr = ids.split(',');
        let newArr = [];
        for(var i=0;i<idArr.length;i++){
            if(idArr[i]){
                let item = mongodb.ObjectID(idArr[i]);
                newArr.push(item);
            }

        }
        let result = await self._model.where({_id: {"$in":newArr}}).delete();
        self.success(result);
    }

    /** ��ȡģ���б� **/
    async gettepmlistAction(self) {
        let page = self.http.param("page") || 1;
        let nums = self.http.param("nums") || 10;
        let ids = '';
        var newArr = [];
        let id = self.http.param("cateId") || '1';
        if(id == '1'){//��ѯ��������
            newArr = [];
            //dataList = await this._model.order('time DESC').page(page,nums).countSelect();
        }else{
            let obj =  await self.getarticleidlist(id);
            if(obj.children_dd){
                ids = id+','+ obj.children_dd;
            }else{
                ids = id;
            }

            let idArr = ids.split(',');

            for(var i=0;i<idArr.length;i++){
                if(idArr[i]){
                    let item = idArr[i] || mongodb.ObjectID(idArr[i]);
                    newArr.push(item);
                }

            }

        }
        let search = self.http.param("search") || '';
        let data = await self._model.getList(page, nums, newArr, search);
        self.success(data);
    }

    /** ͨ��idɾ�� **/
    async deldataAction(self) {
        let id = self.http.param('id');
        //
        if (!id)  return self.fail(606, 'param is null');
        let result = await self._model.delData(id);
        self.success(result);
    }


    /** ��������ҳԤ�� **/
    async previewAction(self){//
        let id = self.http.param('articleid');

        //��ȡ��������
        let tmplObj = (await this._model.getById(id))[0];
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

    /** default ����ҳ��Ԥ�� **/
    async previewdefaultAction(self){
        let id = self.http.param('articleid');
        let tmplObj = (await this._model.getById(id))[0];
        let html ='';
        let content = tmplObj.content;
        if(tmplObj.useLayout == '1'){
            html = await this.fetch(path.join(think.ROOT_PATH,"view/home/layout/layout.html"));
            html = html.replace('<div class="container">', '<div class="container">' + content);
        }else{
            html = content;
        }
        self.end(html);
    }
    /**
     * ͨ��ȡsvnlogs��Ϣ
     */
    async addlistAction(self) {
        //auto render template file index_index.html
        if (self.http.isPost()) {
            let result = await self._model.addData({
                title: self.http.param('title'),
                thumb: self.http.param('thumb'),
                updateby:self.http.param('updateby'),
                keywords:self.http.param('keywords'),
                description:self.http.param('description'),

                url:self.http.param('url'),
                status:self.http.param('status'),
                order:self.http.param('order'),
                author:self.http.param('author'),

                categoryid:self.http.param('categoryid'),
                contents: self.http.param('contents'),
                images: self.http.param('images')
            });
            self.success(result);
        }

    }



    /**
     * ����svnlogs��
     *
     */
    async updatedataAction(self) {
        var res = await self._model.updateData({
            id: self.http.param('id'),
            title: self.http.param('title'),
            updateby:self.http.param('updateby'),
            keywords:self.http.param('keywords'),
            description:self.http.param('description'),
            url:self.http.param('url'),
            status:self.http.param('status'),
            order:self.http.param('order'),
            author:self.http.param('author'),
            categoryid:self.http.param('categoryid'),
            thumb: self.http.param('thumb'),
            contents: self.http.param('contents'),
            images: self.http.param('images')

        });
        self.success(res);
    }


    /**
     * ��ȡ�����ļ�·��
     */
    async getviewfiles(dir_path) {
        let root = path.join(think.ROOT_PATH, dir_path);//'view/home/'
        //����Ƿ��ϴ��ɹ�
        if (!think.isFile(root)) {
            return this.fail(404, "����ʵ��ļ�������");
        }
        return fs.readFileSync(root, 'utf-8');
    }
}



