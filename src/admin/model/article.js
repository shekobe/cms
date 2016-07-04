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
            title: {//����
                type: "string"
            },
            thumb: {//����
                type: "string"
            },
            keywords: {//�ؼ���
                type: "string"
            },
            description: {//����
                type: "string"
            },
            contents: {//����
                type: "string"
            },
            url: {//���ӽӵ�ַ
                type: "string"
            },
            status:{//״̬
                type:"string"
            },
            createtime:{//����ʱ��
                type:"string"
            },
            updatetime:{//����ʱ��
                type:"string"
            },
            order:{//����
                type:"string"
            }
            ,
            author:{//����
                type:"string"
            }
            ,
            images:{//ͼ��
                type:"string"
            },
            pageviews:{//�����
                type:"string"
            },
            commentsnum:{//������
                type:"string"
            },
            priority:{//���ȼ�
                type:"string"
            },
            categoryid:{//��������id
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
     * ͨ��idɾ������
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
     * �������
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
     * ͨ��id��������
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

