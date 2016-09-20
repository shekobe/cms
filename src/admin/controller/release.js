'use strict';

/**
 * 后台系统
 *
 */
import request from "superagent";
import Base from './base';

export default class extends Base {
    init(http) {
        super.init(http);

    }
    /**
     * 首页
     * @return {[type]}      [description]
     */
    async indexAction(self){
       //显示首页
       return this.display();
    }

    async listAction(self){
        //显示首页
       //let res = await self.updatefiledir(null,0);
        //console.log('out',res);

        return this.display();

    }

    async deletecdntokenAction(self){
        think.cache('360cdntoke',null);
        self.success('ok');
    }

    //刷新目录或文件
    async updatefiledirAction(self){//type 1:文件，0：目录
        let str =self.http.param('str');
        let type =self.http.param('type');
        let strArr = str.split(';');
        let url = type == 0 ? "https://api.cdn.cloud.360.cn/content/purge/addDir":"https://api.cdn.cloud.360.cn/content/purge/add";
        let  data = {};
        if(type == 0){//目录
             data.dirs = [];
             for(var i=0;i<strArr.length;i++){
                 if(strArr[i]){
                     data.dirs[i] = (strArr[i]);
                 }

             }
        }else{
            data.files = [];
            for(var i=0;i<strArr.length;i++){
                if(strArr[i]){
                    data.files[i] = {};
                    data.files[i].url_name = strArr[i];
                }

            }
        }

        let token = await think.cache('360cdntoke',()=>{
                return this.getcdntoken();
        });
        data.access_token = token;
        let result = await this.apiquery("refreshcdndir",url,data);
        self.success(result);
    }
    //获取cdn token
    async getcdntoken(self){
        let url = "https://api.cdn.cloud.360.cn/token/get",
            data = {
                "appid":"a5fd31526fc09f5",
                "appsecret":"cq4YmBtIUrBEOj4V6TOXtJvxKkIW1txw",
                "grant_type":"client_credentials"
            };
        let result  = await this.apiquery("getcdnToken",url,data);
        return result.data.access_token;
    }
    //api request
    async apiquery(name,url,data){
        let result = await think.await(name,()=>{
            let req = request.post(url).send(data);
            let fn = think.promisify(req.end, req);
            return fn();
        });
        let info = JSON.parse(result.text);
        return info;
  } 

}



