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
            title: {//标题
                type: "string"
            },
            thumb: {//封面
                type: "string"
            },
            keywords: {//关键词
                type: "string"
            },
            description: {//描述
                type: "string"
            },
            contents: {//内容
                type: "string"
            },
            url: {//链接接地址
                type: "string"
            },
            status:{//状态
                type:"string"
            },
            createtime:{//创建时间
                type:"string"
            },
            updatetime:{//更新时间
                type:"string"
            },
            order:{//排序
                type:"string"
            }
            ,
            author:{//作者
                type:"string"
            }
            ,
            images:{//图组
                type:"string"
            },
            pageviews:{//浏览量
                type:"string"
            },
            commentsnum:{//评论数
                type:"string"
            },
            priority:{//优先级
                type:"string"
            },
            categoryid:{//文章类型id
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
    async getList(page,nums,categoryids,search,order_){
        let data = null;
        let query = {};
        let order = order_ || 'updatetime DESC';
        if(categoryids.length){
            if(search){
                let queryReg = new RegExp(".*"+search+'.*');
                query = {categoryid: {"$in":categoryids},$or: [{pageName:queryReg}, {path:queryReg}]};
            }else{
                query = {categoryid: {"$in":categoryids}};
            }
            data = await this.where(query).order(order).page(page,nums).countSelect();
        }else{
            if(search){
                let queryReg = new RegExp(".*"+search+'.*');
                query = {$or: [{pageName:queryReg}, {path:queryReg}]};
            }else{
                query = {};
            }
            data = await this.where(query).order(order).page(page,nums).countSelect();
            //data = await this.order('time DESC').page(page,nums).countSelect();
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

    async setStatus(ids,updateby,status){
        let obj = {};
        obj.status = status;
        obj.updateby = updateby;
        obj.updatetime = moment().format();
        let res = await this.where({_id: {"$in":ids}}).update(obj);
        return res;
    }
    /**
     * 添加数据
     *
     */
    async addData(obj){
        let obj2 = {
            title:obj.title,
            thumb:obj.thumb,
            description:obj.description,
            url:obj.url,
            status:1,
            order:obj.order,
            author:obj.author,
            createtime:moment().format(),
            updatetime:moment().format(),
            categoryid:obj.categoryid,
            keywords:obj.keywords,
            updateby:obj.updateby,
            contents:obj.contents,
            images:obj.images
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
            title:obj.title,
            thumb:obj.thumb,
            keywords:obj.keywords,
            description:obj.description,
            url:obj.url,
            status:obj.status,
            updatetime:moment().format(),
            updateby:obj.updateby,
            order:obj.order,
            author:obj.author,
            categoryid:obj.categoryid,
            contents:obj.contents,
            images:obj.images
        });
        return res;
    }



}

