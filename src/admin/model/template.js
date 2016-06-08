'use strict';
/**
 * ����users�û���ĸ��ֲ���
 *
 */

import moment from 'moment';
import crypto from 'crypto';

export default class extends think.model.mongo{
    init(...args){
        super.init(...args);
        //�����ֶ�
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
    /*��ȡҳ������*/
    async getById(id){
        let data = await this.where({_id:id}).select();
        return data || null;
    }
    /**
     * ��ȡ��ҳ�б�����
     * page -- �ڼ�ҳ   nums ÿҳ��������  
     * releasetype �ļ�����  defalult �����ļ� home  view/home�µ������ļ�
     * ��ѯ
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
     * ͨ��idɾ������
     *
     */
    async delData(id){
        let res = await this.where({_id:id}).delete();
        return res;
    }
    /**
     * �������
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
     * ͨ��id��������
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

    ////��ȡ��� ǰ�˷��� �� ���Ե��ļ����� �ȴ������¼��ĸ���
    async getFcountandTcount(user,callback){
        var obj = {};
        let count1 = await this.where({user:user,status:{$in:['open','close27']}}).count() || 0;
        let count2 = await this.where({status:{$in:['open','close27']}}).count() || 0;
        obj.fcount = count1;
        obj.tcount = count2;
        callback(obj);
    }

}

