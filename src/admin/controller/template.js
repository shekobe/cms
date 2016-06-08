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
        this._model = this.model('template');
    }

    /** 入口 **/
    async indexAction(self) {
        return self.display();
    }

    /*显示详情页或修改内容*/
    async detailAction(self) {
        let id = self.http.param("id") || '';
        let type = self.http.param("releaseType") || '';
        let data = {"_id": '', "pageName": "", "path": "", "releaseType": "", "content": ""};
        if (id) data = await self.gettempbyid(id);
        data._id = id;
        if (type) {
            data.releaseType = type;
        }
        this.assign({"template": data});
        return self.display();
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
        let data = (await this._model.getById(id))[0];
        if (data.releaseType == 'default') {//默认查询数据库
            // self.success(data);
        } else if (data.releaseType == 'home') {//查询前台物理页面
            data.content = await this.getviewfiles(data.path);
        }
        return data;
    }

    /* 获取前端模板 */
    async frontAction(self) {
        return self.display();
    }

    /** 获取模板列表 **/
    async gettepmlistAction(self) {
        let page = self.http.param("page") || 1;
        let nums = self.http.param("nums") || 10;
        let type = self.http.param("type") || '';
        let search = self.http.param("search") || '';
        let data = await self._model.getList(page, nums, type, search);
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


    /** home 物理页面预览 **/
    async previewhomeAction(self){//
        let id = self.http.param('pageId');
        let tmplObj = (await this._model.getById(id))[0];
        return self.display(path.join(think.ROOT_PATH,tmplObj.path));
    }

    /** default 虚拟页面预览 **/
    async previewdefaultAction(self){
        let id = self.http.param('pageId');
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
                pageName: self.http.param('pageName'),
                path: self.http.param('path'),
                content: self.http.param('content'),
                releaseType: self.http.param('releaseType'),
                useLayout: self.http.param('useLayout'),
                updateBy: self.http.param('updateBy')
            });
            self.success(result);
        }

    }

    /**
     * 生成admin类型静态文件
     *
     */
    createtempfile(_type, _path, _con) {

        if (_type == 'home') {
            let root = path.join(think.ROOT_PATH, _path);//'view/home/'
            fs.writeFile(root, _con, function (err) {
                if (err) {
                    console.log('Error', err);
                    return;
                }
                console.log('成功修改物理文件');
            });
        } else if (_type == 'default') {
            var apath = '/static/admin/template';
            //think.uuid(length)  length {Number} 生成字符串的长度，默认为 32
            //console.log('是否可写：',think.isWritable(path));
            var getPath = _path; // /aaaa/aaa/aaa.html
            var strArr = getPath.match(/\/.*\/+/g) || [];
            var newpath = '';
            if (strArr.length) {
                newpath = apath + strArr[0];
            } else {
                newpath = apath;
            }
            if (!think.isDir(path.join(think.RESOURCE_PATH, newpath))) {
                think.mkdir(path.join(think.RESOURCE_PATH, newpath));
            }

            fs.writeFile(path.join(think.RESOURCE_PATH, apath + getPath), _con, function (err) {
                if (err) {
                    console.log('Error', err);
                    return;
                }
                console.log('成功生成预览静态文件');
            });
        }

    }

    /**
     * 更新svnlogs表
     *
     */
    async updatedataAction(self) {
        var res = await self._model.updateData({
            pageName: self.http.param('pageName'),
            path: self.http.param('path'),
            releaseType: self.http.param('releaseType'),
            id: self.http.param('id'),
            updateBy: self.http.param('updateBy'),
            useLayout: self.http.param('useLayout'),
            content: self.http.param('content')
        });
        await self.createtempfile(self.http.param('releaseType'), self.http.param('path'), self.http.param('content'));
        self.success(res);
    }

    //获取左侧 前端发布 与 测试的文件更新 等待处理事件的个数
    async getfcountandtcountAction(self) {
        await self._model.getFcountandTcount(self.cookie("user"), function (o) {
            self.success(o);
        });
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



