'use strict';
/**
 * 中间件接口展示与校验
 **/
import Base from './base.js';
import fs from 'fs';
import path from 'path';
import request from "superagent";

export default class extends Base {
    init(http) {
        super.init(http);
        this._model = this.model('interface');
    }
    /**
     * 获取接口列表
     * @return {[type]} [description]
     */
    async indexAction(self){
        let data = await this.getlist({},1);
        this.assign('data', data);
        // console.log(data);
        return this.display();
    }
    /**
     * 接口详情
     * @param  {[type]} self [description]
     * @return {[type]}      [description]
     */
    async detailAction(self){
        let id = self.get('id')||'';
        let result ={};
        //新添加
        if(id){
            result = await self._model.getData(id);
        } 
        // console.log(result);
        this.assign("data", result[0]);
        return this.display();
    }
    /**
     * 按条件获取列表
     * @return {[type]} [description]
     */
    async querylistAction(){

    }
    /**
     * 查询列表
     * @param  {[type]} data [description]
     * @param  {[type]} page [description]
     * @return {[type]}      [description]
     */
    async getlist(data,page) {
        data = data || {};
        page = page || 1;
        return await this._model.getList(data,page);
    }
    /**
     * 添加/更新接口数据
     * @param  {[type]} self [description]
     * @return {[type]}      [description]
     */
    async updateAction(self){
        let data = {};
        let result={};
        let id = this.post('_id') ||'';
        data.name = this.post('name')||'';
        data.description = this.post('description')||'';
        data.type = this.post('type')||'';
        data.url = this.post('url')||'';
        //错误返回
        if(data.name=='') return self.fail('参数错误,接口名称不能为空');
        if(data.description=='') return self.fail('参数错误,接口功能描述不能为空');
        if(data.type=='') return self.fail('参数错误,请求方式不能为空');
        if(data.url=='') return self.fail('参数错误,请求地址不能为空');
        //其他非必要信息
        data.data = this.post('data')||'';
        data.datainfo = this.post('datainfo')||'';
        data.token = this.post('token')||'';
        data.pass = this.post('pass')||'';
        data.info = this.post('info')||'';
        data.sort = this.post('sort')||'1';
        data.status = this.post('status')||'open';

        if(id ==''){
            result = await self._model.addData(data);
        }else{
            data._id =id;
            result = await self._model.updateData(data);
        }
        //成功
        if(result){
            return this.redirect('/admin/interface/index')
        }else{
            return this.fail("save error")
        }
    }
    /**
     * http接口自定测试
     * @return {[type]} [description]
     */
    async httptestAction(self){
        return this.display();
    }
    /**
     * 测试接口状态
     * @return {[type]} [description]
     */
    async testAction(self){
        let type = this.param('type') || 'GET';
        let url = this.param('url') || '';
        let data = this.param('data') || '';
        if(url == '') return this.fail('请求地址不能为空');
        console.log('interface/test doing , '+type);

        let result = await think.await("superagent", () => {
            //
            let req = null;
            //请求方式
            if(/get/i.test(type)){
                req = request.get(url);
            }else if(/post|put/i.test(type)){
                req = request.post(url);
            }else if(/Delete/i.test(type)){
                req = request.del(url);
            }else if(/Head/i.test(type)){
                req = request.head(url);
            }
            req.send(data);
            // }else if(/Trace/i.test(type)){
            //     req = request.get('url'+(data?'?'+data:''));
            // }else if(/Options/i.test(type)){
            //     req = request.get('url'+(data?'?'+data:''));
            // }

            //set header cookie 
            // .send({ name: 'Manny', species: 'cat' })
            // .set('Accept', 'application/json')
            let fn = think.promisify(req.end, req);
            return fn();
        });
        return this.success(result);
    }
}