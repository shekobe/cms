'use strict';
/**
 * 后台模板控制
 *
 */
import Base from './base.js';
import fs from 'fs';
import mongodb from 'mongodb';
import path from 'path';
import Ssh2 from 'ssh2';
import moment from 'moment';
import SshPool from 'ssh-pool';
import child from 'child_process';
let Client = Ssh2.Client;
export default class extends Base {
    init(http) {
        super.init(http);
        this._model = this.model('article');
    }


    /** 入口 **/
    async indexAction(self) {

        return self.display();
    }

    //显示文章列表
    async listAction(self) {
        let page = self.http.param('page') || 1;
        //获取文章列表
        let articleList2 = await self._model.getList(page, 5,'','','createtime DESC');
        //获取热门文章列表
        let articleList = await self._model.getList(1, 6,'','');
        self.assign({
            "articleListObj": articleList.data,
            "articleListObj2": articleList2
        });
        console.log(articleList2);
        return self.display(path.join(think.ROOT_PATH,'view/home/news/index.html'));
    }

    //更新热门文章
    async updatehostlistAction(self){
        let qktoken = 'qiku123456';
        //    post请求
        let con = 'curl -G -d "qktoken='+qktoken+ '\"'+' http://localhost/home/news/updatehostlist';
        self.sshexec(con,function(flag){
             if(flag){
                 self.success('更新成功！');
             }else{
                 self.fail('更新失败！');
             }
        });


    }

    async sshexec(_str,call){
        //标记当前时间
        var time = new Date().getTime();
        let ip = this.http.hostname;
        console.log('sshexec ip',ip);
        var pool = new SshPool.ConnectionPool(['root@'+ip,'root@10.100.7.64']);
        try{

            pool.run(_str)
                .then(function (results) {
                    for(var jj=0;jj<results.length;jj++){
                        if(results[jj].stderr){
                            console.log(':error'+results[jj].stderr);

                        }
                        if(results[jj].stdout){
                            console.log(':ok'+results[jj].stdout);
                            let res = JSON.parse(results[jj].stdout);
                            if(res.errno == '0'){
                                //return call(1);
                            }else{
                               // return call(0);
                            }

                        }

                    }
                    var time1 = new Date().getTime() - time;
                    console.log(results.length+'台远程服务器成功接收命令！用时：'+time1/1000+'s');
                    return call(1);

                });
        }
        catch(e){
            console.log('new sshPool.ConnectionPool error:'+e);
        }
    }

    //更新单个文章详情，同时会更新文章所在列表等相关缓存 todo
    async updatenewslistAction(self){
        let cateid = self.http.param('categoryid');
        let qktoken = 'qiku123456';
        let articleid = self.http.param('articleid');
        let pagenum = self.http.param('pagenum');
        var con = 'curl -G -d "categoryid='+cateid+'&articleid='+articleid+'&pagenum='+pagenum+'&qktoken='+qktoken+ '\"'+' http://localhost/home/news/updatenewslist';
        self.sshexec(con,function(flag){
            if(flag){
                self.success('更新成功！');
            }else{
                self.fail('更新失败！');
            }
        });
    }




    /*显示详情页或修改内容*/
    async detailAction(self) {
        let id = self.http.param("articleid") || '';
        let categoryid = self.http.param("categoryid") || '';
        let data =  {"url":'',"description":'',"keywords":'',"_id": '',"contents":"",'title':"","thumb":"",'images':'',"categoryid":'',status:'',order_:'',"author":'',createtime:''};
        if(id){//修改
            data = await this._model.where({_id:id}).find();
            if(data.categoryid){
                let obj2 =  await self.getarticleidlist(data.categoryid);
                data.nav = obj2.nav.replace(/\//g,' / ');
                data._id = id;
            }else{
                data.nav = '';
                data._id = '';
            }

        }else{//新增
            let obj2 =  await self.getarticleidlist(categoryid);
            data.nav = obj2.nav.replace(/\//g,' / ');
        }
        data.nav = data.nav || '';
        this.assign({"template": data});
        return self.display();
    }

    /*根据类型Id返回类型列表*/



    async getarticleidlist(_id){
      return await this.model('category').where({_id:_id}).find();
    }

    /** 获取页面内容 **/
    async gettempAction(self) {
        let id = self.http.param("id");
        let data = await self.gettempbyid(id);
        self.success(data);
    }

    /*获取页面详情信息*/
    async gettempbyid(id) {
        if (!id) return this.fail(606, 'param is null');
        let data = await this._model.getById(id);

        return data;
    }

    /* 获取前端模板 */
    async frontAction(self) {
        return self.display();
    }

    //启用 禁用 内容

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
    //多选删除
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

    /** 获取模板列表 **/
    async gettepmlistAction(self) {
        let page = self.http.param("page") || 1;
        let nums = self.http.param("nums") || 10;
        let ids = '';
        var newArr = [];
        let id = self.http.param("cateId") || '1';
        if(id == '1'){//查询所有文章
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

    /** 通过id删除 **/
    async deldataAction(self) {
        let id = self.http.param('id');
        //
        if (!id)  return self.fail(606, 'param is null');
        let result = await self._model.delData(id);
        self.success(result);
    }

    /*两类热门新闻列表*/
    async gethostlist(){
        //获取排序靠前的两种类型文章
        let hostlist1 = {};
        let hostlist2 = {};
        let cateObjList = await this.model('category').page(1,2).order('order_ DESC').select();
        let cateid1 = cateObjList[0].id || '';
        hostlist1.cateid = cateid1 || '';
        hostlist1.title = cateObjList[0].name || '';
        if(cateid1){
            let artObjList1 = await this._model.getList(1, 4,[cateid1],'','order_ DESC') || null;
            //console.log('artObjList1',artObjList1);
            hostlist1.data = artObjList1.data;
        }
        let cateid2 = cateObjList[1].id || '';
        hostlist2.cateid = cateid2 || '';
        hostlist2.title = cateObjList[1].name || '';
        if(cateid2){
            let artObjList2 = await this._model.getList(1, 4,[cateid2],'','order_ DESC') || null;
            //console.log('artObjList2',artObjList2);
            hostlist2.data = artObjList2.data;
        }
        //console.log('hostlist2',hostlist2);
        return {
            hot1:hostlist1,
            hot2:hostlist2
        }

    }


    /** 文章详情页预览 **/
    async previewAction(self){//
        let id = self.http.param('articleid');

        //获取文章详情
        let tmplObj = (await this._model.getById(id))[0];
        let cate_id = tmplObj.categoryid;
        //获取文章所属分类
        let cateObj =  await self.getarticleidlist(cate_id);
        tmplObj.nav = cateObj.nav || '';
        //获取热门文章列表
        let hot  = await self.gethostlist();


        //获取上一条下一条
        //上一条DESC ABS
        let preObj = await self._model.where(
            {
                createtime: {
                    '$lt': tmplObj.createtime
                },
                categoryid:cate_id,
            }).order('createtime DESC').find();

        //下一条
        let nextObj = await self._model.where(
            {
                createtime: {
                    '$gt': tmplObj.createtime
                },
                categoryid:cate_id,
            }).order('createtime ABS').find();


        self.assign({
            "hostobjlist1":hot.hot1,
            "hostobjlist2":hot.hot2,
            "articleObj":tmplObj
            ,"preObj": preObj,"nextObj": nextObj,
        "title": tmplObj.title,"keywords":tmplObj.keywords,"description":tmplObj.description});
        return self.display(path.join(think.ROOT_PATH,'view/home/news/detail.html'));
    }

    /** default 虚拟页面预览 **/
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
     * 通获取svnlogs信息
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
                createtime:self.http.param('createtime'),
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
     * 更新svnlogs表
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
            createtime:self.http.param('createtime'),
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
     * 获取物理文件路径
     */
    async getviewfiles(dir_path) {
        let root = path.join(think.ROOT_PATH, dir_path);//'view/home/'
        //监测是否上传成功
        if (!think.isFile(root)) {
            return this.fail(404, "你访问的文件不存在");
        }
        return fs.readFileSync(root, 'utf-8');
    }
}



