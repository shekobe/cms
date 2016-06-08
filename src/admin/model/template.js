'use strict';
/**
 * 处理users用户表的各种操作
 *
 */

import moment from 'moment';
import crypto from 'crypto';

export default class extends think.model.mongo{
    init(...args){
        super.init(...args);
        //设置字段
        this.fields = {
            pageName: {
                type: "string"
            },
            pageTitle: {
                type: "string"
            },
            path: {
                type: "string"
            },
            releaseType: {
                type: "string"
            },
            releaseStatus: {
                type: "string"
            },
            time: {
                type: "string"
            },
            timeformat:{
                type:"string"
            },
            updateBy:{
                type:"string"
            },
            content:{
                type:"string"
            },
            useLayout:{
                type:"string"
            }

        }
    }
    /**
     * 用过用户名获取表数据
     *
     */
    async getData(username,callback){
        var obj = await this.where({user:username}).limit(50).order('time DESC').select();
        if(!think.isEmpty(obj)){
            callback(obj);
        }else{
            callback(null);
        }
    }
    /*获取页面内容*/
    async getById(id){
        let data = await this.where({_id:id}).select();
        return data || null;
    }
    /**
     * 获取分页列表数据
     * page -- 第几页   nums 每页多少数据  
     * releasetype 文件类型  defalult 虚拟文件 home  view/home下的物理文件
     * 查询
     */
    async getList(page,nums,releasetype,search){
        let data = null;
        let query = {};
        if(releasetype){
            if(search){
                let queryReg = new RegExp(".*"+search+'.*');
                query = {"releaseType":releasetype,$or: [{pageName:queryReg}, {path:queryReg}]};
            }else{
                query = {"releaseType":releasetype};
            }
            data = await this.where(query).order('time DESC').page(page,nums).countSelect();
        }else{
            data = await this.order('time DESC').page(page,nums).countSelect();
        }
        return data || null;
    }
    /**
     * 通过id删除数据
     *
     */
    async delData(id){
        let res = await this.where({_id:id}).delete();
        return res;
    }
    /**
     * 添加数据
     *
     */
    async addData(obj){
        let obj2 = {
            pageName:obj.pageName,
            pageTitle:'',
            path:obj.path,
            releaseType:obj.releaseType,
            releaseStatus:'',
            useLayout:obj.useLayout,
            time:new Date().getTime(),
            timeformat:moment().format('LLLL'),
            content:obj.content,
            updateBy:obj.updateBy
        };
        let re = await this.add(obj2);
        // callback(re);
        return re || '';
    }
    /**
     * 通过id更新数据
     *
     */
    async updateData(obj){

        let res =  await this.where({_id:obj.id}).update({
            pageName:obj.pageName,
            path:obj.path,
            time:moment().format(),
            timeformat:moment().format('LLLL'),
            content:obj.content,
            useLayout:obj.useLayout,
            updateBy:obj.updateBy
        });
        return res;
    }

    ////获取左侧 前端发布 与 测试的文件更新 等待处理事件的个数
    async getFcountandTcount(user,callback){
        var obj = {};
        let count1 = await this.where({user:user,status:{$in:['open','close27']}}).count() || 0;
        let count2 = await this.where({status:{$in:['open','close27']}}).count() || 0;
        obj.fcount = count1;
        obj.tcount = count2;
        callback(obj);
    }

}

