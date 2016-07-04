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

    }

    /*获取页面内容*/
    async getById(id){
        let data = await this.where({_id:id,status:"1"}).select();
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
                query = {categoryid: {"$in":categoryids},$or: [{pageName:queryReg}, {path:queryReg}],status:"1"};
            }else{
                query = {categoryid: {"$in":categoryids},status:"1"};
            }
            data = await this.where(query).order(order).page(page,nums).countSelect();
        }else{
            if(search){
                let queryReg = new RegExp(".*"+search+'.*');
                query = {$or: [{pageName:queryReg}, {path:queryReg}],status:"1"};
            }else{
                query = {status:"1"};
            }
            data = await this.where(query).order(order).page(page,nums).countSelect();
            //data = await this.order('time DESC').page(page,nums).countSelect();
        }
        return data || null;
    }



}

