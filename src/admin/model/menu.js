'use strict';
/**
 * �˵�����
 *
 */

import moment from 'moment';
import mongodb from 'mongodb';
export default class extends think.model.mongo{
    init(...args){
        super.init(...args);

        //�����ֶ�
        this.fields = {

            parent: {
                type: "string"
            },
            text: {
                type: "string"
            },
            level: {
                type: "string"
            },
            href: {
                type: "string"
            },
            info: {
                type: "string"
            },
            sortId:{
                type:"string"
            },
            open:{
                type:"string"
            },
            time:{
                type:"string"
            },
            icon:{
                type:"string"
            }

        }

    }
    /**
     * �ù��û�����ȡ������
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
     * �ù�ids��ȡ������
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
        let obj = await this.where({_id: {"$in":newArr}}).select();
        if(!think.isEmpty(obj)){
            return obj;
        }else{
            return null;
        }
    }


    /**
     * ͨ��idɾ������
     *
     */
    async delData(idArr,callback){
        var newArr = [];
        for(var i=0;i<idArr.length;i++){
            var item = mongodb.ObjectID(idArr[i]);
            newArr.push(item);
        }
        let res = await this.where({_id: {"$in":newArr}}).delete();
        callback(res);
    }
    /**
     * �������
     *
     */
    async addData(obj,callback){
        let obj2 = {
            parent:obj.parent,
            text:obj.text,
            time:moment().format()
        };
        let re = await this.add(obj2);
        let res = await this.where({_id:re.toString()}).find();

        callback(res);
    }
    /**
     * ͨ��id��������
     *
     */
    async updateData(obj,callback){
        obj.time = moment().format();
        let res = await this.where({_id:obj.id}).update(obj);
        callback(res);
    }

    async updateDatatext(obj,callback){

        let res = await this.where({_id:obj.id}).update({
            time:moment().format(),
            text:obj.text
        });
        callback(res);
    }


}

