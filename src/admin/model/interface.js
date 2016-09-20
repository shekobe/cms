'use strict';
/**
 * 菜单管理
 *
 */
import moment from 'moment';

export default class extends think.model.mongo{
    init(...args){
        super.init(...args);
        //设置字段
        this.fields = {
            //_id 自己id
            name:{//接口名称
                type: "string"
            },
            description: {//接口功能描述
                type: "string"
            },
            type:{//打开方式 GET POST 
                type:"string"
            },
            url: {//接口请求地址
                type: "string"
            },
            data: {//参数信息或数据
                type: "string"
            },
            token:{//发起请求必备的token或username
                type: "string"
            },
            pass:{//发起请求密码或随机数
                type: "string"
            },
            datainfo:{//数据包说明
                type: "string"
            },
            info: {//备注信息
                type: "string"
            },
            status:{//接口状态
                type:"string"
            },
            sort:{//排序
                type:"Integer"
            },
            time:{//创建时间
                type:"Timestamp"
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
        let result = await this.where(query).order("sort DESC ,time DESC").page(page).countSelect();
        return result;
    }
    //按条件获取列表
    async getAllList(query){
         let result = await this.where(query).order("sort DESC ,time DESC").select();
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

