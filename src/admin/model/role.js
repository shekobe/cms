'use strict';
/**
 * 角色管理
 *
 */

import moment from 'moment';
import mongodb from 'mongodb';
export default class extends think.model.mongo{
    init(...args){
        super.init(...args);

        //设置字段
        this.fields = {

            roleName: {
                type: "string"
            }
            ,
            info: {
                type: "string"
            },

            menuIds: {
                type: "string"
            },

            time:{
                type:"string"
            }

        }

    }
    /**
     * 用过用户名获取表数据
     *
     */
    async getData(callback){
        var obj = await this.select();
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
    async delData(obj,callback){

        let res = await this.where({_id:obj.id}).delete();
        callback(res);
    }
    /**
     * 添加数据
     *
     */
    async addData(obj,callback){
        let obj2 = {
            roleName:obj.roleName,
            info:obj.info,
            menuIds:[],
            time:moment().format()
        };
        let re = await this.add(obj2);
        let res = await this.where({_id:re.toString()}).find();

        callback(res);
    }
    /**
     * 用过ids获取表数据
     *
     */
    async getDataById(idArr,callback){

        var newArr = [];
        for(var i=0;i<idArr.length;i++){
            var item = mongodb.ObjectID(idArr[i]);
            newArr.push(item);
        }
        let obj = await this.where({_id: {"$in":newArr}}).select();
        if(!think.isEmpty(obj)){
            callback(obj);
        }else{
            callback(null);
        }
    }
    async getDataById2(idArr){

        var newArr = [];
        for(var i=0;i<idArr.length;i++){
            var item = mongodb.ObjectID(idArr[i]);
            newArr.push(item);
        }
        let obj = await this.where({_id: {"$in":newArr}}).distinct('menuIds').select();
        if(!think.isEmpty(obj)){
            return obj;
        }else{
            return null;
        }
    }
    /**
     * 通过id更新数据
     *
     */
    async updateData(obj,callback){

        let res = await this.where({_id:obj.id}).update({
            time:moment().format(),
            roleName:obj.roleName,
            info:obj.info
        });
        callback(res);
    }

    /**
     * 通过id更新数据
     *
     */
    async updatedatarole(obj,callback){
        let res = await this.where({_id:obj.id}).update({
            menuIds:obj.menuIds || ''
        });
        callback(res);
    }


}

