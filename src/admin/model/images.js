'use strict';
/**
 * ����users�û���ĸ��ֲ���
 *
 */

import moment from 'moment';
import crypto from 'crypto';
moment.locale('zh-cn');
export default class extends think.model.mongo {
    init(...args) {
        super.init(...args);
        //�����ֶ�
        this.fields = {
            filename: {
                type: "string"
            },
            url: {
                type: "string"
            },
            size: {
                type: "string"
            },
            time: {
                type: "string"
            },
            date: {
                type: "string"
            },
            operator: {
                type: "string"
            }


        }
    }
    /**
     * �������
     *
     */

    async addData(obj){
        let obj2 = {
            filename:obj.name,
            url:obj.url,
            size:obj.size,
            time:moment().format('LLLL'),
            date:moment().format(),
            operator:obj.operator
        };
        let re = await this.add(obj2);
        return re || '';
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
     * ��ȡ��ҳ�б�����
     * page -- �ڼ�ҳ   nums ÿҳ��������  DESC ABS range ��ѯ��Χ A:һ�� D:������ M:���ϴ��� operator �ϴ���
     */
    async getimageList(page,nums,range,operator){
        page = page || 1;
        nums = nums || 10;
        range = range || '';
        let data = null;
        if(range){
            switch (range){
                case "A":
                    data = await this.where({ date: { $gte:  moment().subtract(7, 'days').format(),$lte: moment().format() }  }).order('date DESC').page(page,nums).countSelect();
                    break;
                case "D":
                    data = await this.where({date: {$gte: moment().subtract(3, 'months').format(), $lte: moment().format()}}).order('date DESC').page(page,nums).countSelect();
                    break;
                case "M":
                    if(operator){
                        data = await this.where({operator:operator}).order('date DESC').page(page,nums).countSelect();
                    }else{
                        data = await this.order('date DESC').page(page,nums).countSelect();
                    }
                    break;
                default :
                    data = await this.order('date DESC').page(page,nums).countSelect();
            }
        }else{
            data = await this.order('date DESC').page(page,nums).countSelect();
        }
        return data || null;
    }

}