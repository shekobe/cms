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

    }

    /*��ȡҳ������*/
    async getById(id){
        let data = await this.where({_id:id,status:"1"}).select();
        return data || null;
    }
    /**
     * ��ȡ��ҳ�б�����
     * page -- �ڼ�ҳ   nums ÿҳ��������
     * releasetype �ļ�����  defalult �����ļ� home  view/home�µ������ļ�
     * ��ѯ
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

