'use strict';
/**
 * 菜单管理
 *
 */

import moment from 'moment';
import mongodb from 'mongodb';
export default class extends think.model.mongo{
    init(...args){
        super.init(...args);
        //设置字段
        this.fields = {
            //_id 自己id
            parent:{//父级id
                type: "string"
            },
            name: {//名称
                type: "string"
            },
            icon: {//图标
                type: "string"
            },
            href: {//链接地址
                type: "string"
            },
            info: {//备注信息
                type: "string"
            },
            sort:{//排序
                type:"Integer"
            },
            target:{//打开方式
                type:"string"
            },
            time:{//创建时间
                type:"Timestamp"
            },
            type:{ //所属内别 menu /category /
                type:"string"
            },
            price:{//价格
                type:"string"
            },
            pic:{//图片链接
                type:"string"
            },
            other:{//其他信息或 购买链接
                type:"string"
            }
        }
    }
    //查询1条数据
    async getData(id){
        let result = await this.where({_id:id}).select();
        return result;
    }
    //按条件分页查询列表
    async getList(query,page){
        //按照父id升序，sort降序排序
        let result = await this.where(query).order("parent ASC , sort DESC ").page(page).countSelect();
        return result;
    }
    //按条件获取列表
    async getAllList(query){
         let result = await this.where(query).order("parent ASC , sort DESC ").select();
        return result;
    }
    //添加数据
    async addData(query){
        query.time = new Date().getTime();
        let result = await this.add(query);
        return result || '';
    }
    //修改数据
    async updateData(query){
        query.time = new Date().getTime();
        let result = await this.where({_id:query._id}).update(query);
        return result;
    }
    //删除数据
    async delData(id){
        let result = await this.where({_id:id}).delete();
        return result;
    }

}

