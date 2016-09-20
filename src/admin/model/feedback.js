'use strict';
/**
 * 问题反馈
 *
 */

import moment from 'moment';
import crypto from 'crypto';

export default class extends think.model.mongo{
    init(...args){
        super.init(...args);
        //设置字段
        this.fields = {
            url: {//链接接地址
                type: "string"
            },
            title: {//反馈类型
                type: "string"
            },
            content: {//反馈内容
                type: "string"
            },
            createtime: {//描述
                type: "string"
            },
            ip: {//ip地址
                type: "string"
            },
            cname: {//省份
                type: "string"
            },
            useragent:{//usetagent
                type:"string"
            }

        }
        //配置索引
        this.indexes = {
            title: 1
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
    async getList(page,nums,categoryids,search,order_){
        let data = null;
        let query = {};
        let order = order_ || 'updatetime DESC';
        if(categoryids.length){
            if(search){
                let queryReg = new RegExp(".*"+search+'.*');
                query = {categoryid: {"$in":categoryids},$or: [{title:queryReg}, {keywords:queryReg}]};
            }else{
                query = {categoryid: {"$in":categoryids}};
            }
            data = await this.where(query).order(order).page(page,nums).countSelect();
        }else{
            if(search){
                let queryReg = new RegExp(".*"+search+'.*');
                query = {$or: [{title:queryReg}, {keywords:queryReg}]};
            }else{
                query = {};
            }
            data = await this.where(query).order(order).page(page,nums).countSelect();
            //data = await this.order('time DESC').page(page,nums).countSelect();
        }
        return data || null;
    }
    
    /**
     * 通过id更新数据
     *
     */
    async updateData(obj){

        let res =  await this.where({_id:obj.id}).update({
            url:obj.url,
            title:obj.title,
            content:obj.content,
            createtime:obj.createtime,
            ip:obj.ip,
            cname:obj.cname,
            useragent:obj.useragent
        });
        return res;
    }



}

