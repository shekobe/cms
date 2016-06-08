'use strict';
/**
 * 处理svnlogs数据表的各种操作
 *
 */

import moment from 'moment';
moment.locale('zh-cn');
export default class extends think.model.mongo {
    init(...args) {
        super.init(...args);
        //设置字段
        this.fields = {
            user: {
                type: "string"
            },
            msg: {
                type: "string"
            }
            ,
            operator: {
                type: "string"
            }
            ,
            con: {
                type: "string"
            }
            ,
            data: {
                type: "string"
            }
            ,
            status: {
                type: "string"
            }
            ,
            time: {
                type: "string"
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
    /**
     * 获取所有表数据
     *
     */
    async getData2(callback){
        var obj = await this.limit(50).order('time DESC').select();
        if(!think.isEmpty(obj)){
            callback(obj);
        }else{
            callback(null);
        }
    }
    /**
     * 通过id删除数据
     *
     */
    async delData(id,callback){

        let res = await this.where({_id:id}).delete();
        callback(res);
    }
    /**
     * 添加数据
     *
     */
    async addData(obj,callback){

        let obj2 = {
            user: obj.name,
            msg:obj.msg,
            operator:'',
            con:obj.con,
            time:moment().format(),
            data:moment().format('LLLL'),
            status:'open'
        };
        let re = await this.add(obj2);
        callback(re);
    }
    /**
     * 通过id更新数据
     *
     */
    async updateData(obj,callback){
        var ss = obj.status;
        if(obj.oldstatus == 'close'){
            ss = 'close';
        }
        let res = await this.where({_id:obj.id}).update({status: ss, operator:obj.username});
        callback(res);
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

};