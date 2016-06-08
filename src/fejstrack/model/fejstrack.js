'use strict';
/**
 * model
 */
import mongodb from 'mongodb';
export default class extends think.model.mongo{
    init(...args){
        super.init(...args);

        //设置字段
        this.fields = {
            profile: {//错误类型
                type: "string"
            },
            url :{ //页面链接地址
                type:"string"
            },
            ip:{//用户ip
                type:"string"
            },
            ref :{ //页面来源地址
                type:"string"
            },
            clnt :{ //用户浏览器简写
                type:"string"
            },
            ua:{//用户地址浏览器全部信息
                type:"string"
            },
            cookie:{//用户cookie
                type:"string"
            },
            msg: {//消息描述
                type: "string"
            },
            file: {//文件
                type: "string"
            },
            line: {//错误行数
                type: "string"
            },
            num: {//错误列数
                type: "string"
            },
            stack:{//堆栈信息
                type:"string"
            },
            lost:{//丢失链接信息多个用，分开
                type:"string"
            },
            servertime:{
                type:"string"
            },
            time:{//上报时间
                type:"string"
            },//当前状态
            status:{// done--已处理,doing--处理中,pending--准备处理(挂起),untest--待验证,
                type:"string"// difficult --疑难问题 , nottodo --不需处理 , 空 ---刚收集问题
            }

        }

    }
    /**
     * 获取表数据
     */
    async getlist(page,type,search,msg){
        //20条每页
        let data =  null;
        let obj ={};
        if(type && type != 'other'){
            obj.status = type;
            if(search != '' && msg != '') obj[search] = msg;
            data = await this.where(obj).order("servertime DESC").page(page,20).countSelect();
        }else if(type == 'other'){
            obj.status = ["!=","done"];//{'$not':'done'}
            if(search != '' && msg != '') obj[search] = msg;
            data = await this.where(obj).order("status ASC,servertime DESC").page(page,20).countSelect();
        }else{//默认选择非已处理分页
            obj.status = '';
            if(search != '' && msg != '') obj[search] = msg;
            data = await this.where(obj).order("servertime DESC").page(page,20).countSelect();
        }
        return data;
    }
    /**
     * 修改状态
     * @param  {[type]} id     [description]
     * @param  {[type]} status [description]
     * @return {[type]}        [description]
     */
    async updateData(obj){
        let res =  await this.where({"_id":obj._id}).update({"status":obj.status});
        return res;
    }
    /**
     * 批量修改
     * @param  {[type]} status   [description]
     * @param  {[type]} search [description]
     * @param  {[type]} msg    [description]
     */
    async updateList(status,search,msg){
        let res = await this.where({search:msg}).update({"status":status});
        return res;
    }
    /**
     * 新添加数据
     * @param {[type]} obj [description]
     */
    async addData(obj){
        obj.servertime = 1*new Date();
        let result = await this.add(obj);
        return result || '';
    }
    /**
     * 删除
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    async delData(obj){
        let result = await this.delete({where:obj});
        return result ||'';
    }

}