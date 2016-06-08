'use strict';
/**
 * ����svnlogs���ݱ�ĸ��ֲ���
 *
 */

import moment from 'moment';
moment.locale('zh-cn');
export default class extends think.model.mongo {
    init(...args) {
        super.init(...args);
        //�����ֶ�
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
     * �ù��û�����ȡ������
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
     * ��ȡ���б�����
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
     * ͨ��idɾ������
     *
     */
    async delData(id,callback){

        let res = await this.where({_id:id}).delete();
        callback(res);
    }
    /**
     * �������
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
     * ͨ��id��������
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

     ////��ȡ��� ǰ�˷��� �� ���Ե��ļ����� �ȴ������¼��ĸ���
    async getFcountandTcount(user,callback){

        var obj = {};
        let count1 = await this.where({user:user,status:{$in:['open','close27']}}).count() || 0;
        let count2 = await this.where({status:{$in:['open','close27']}}).count() || 0;
        obj.fcount = count1;
        obj.tcount = count2;
        callback(obj);
    }

};