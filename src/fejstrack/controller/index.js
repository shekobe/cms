'use strict';

import Base from './base.js';

export default class extends Base {
    init(http) {
        super.init(http);
        this._model = this.model('fejstrack');
    }
    /**
     * 前置操作
     * @return {[type]} [description]
     */
    async __before(){
        let token = await this.session("qkToken") || 'notuse';
        this.assign({"qktoken": token});
    }
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction(self){
        if(self.http.isGet()){
            // console.log('i get your http get');
            let obj = {};
            obj.url = self.http.param("url");//页面链接地址
            obj.msg = self.http.param("msg");//消息描述
            obj.file = self.http.param("file");//文件
            obj.stack = self.http.param("stack");//堆栈信息
            if(obj.msg != '' && obj.file !=''){//错误文件和信息不能为空
                //存储信息
                obj.profile = self.http.param("profile");//错误类型
                obj.ip = self.http.ip();//获取用户的ip地址
                obj.line = self.http.param("line");//错误行数
                obj.num = self.http.param("num");//错误列数
                obj.ref = self.http.param("ref");//页面来源地址
                obj.clnt = self.http.param("clnt");//用户浏览器概述
                obj.lost = self.http.param("lost");//丢失链接信息多个用，分开
                obj.time = self.http.param("time");//上报时间
                obj.status = self.http.param("status") || '';//当前状态
                obj.ua = self.http.userAgent();//浏览器信息
                var name = self.http.cookie("rememberUserNickName") || '';
                if(name){
                    obj.cookie = "user:"+(name)+'/login:'+(self.http.cookie('isHasLogin')||'');//用户的信息
                }
                if(obj.ref != 'http://www.baidu.com/s?wd=a' && obj.ip != '221.192.180.7'){//排除baidu爬虫,uc 浏览器错误
                    let data = await self._model.addData(obj);
                }
            }
            self.http.header("access-control-allow-origin","*");
            self.http.header("accept-ranges","bytes");
            self.http.type("image/gif",false);
            self.http.end("data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==");
        }
        // return this.http.end('你访问的页面不存在！')
    }
    //结果页面
    async detailAction(){
        //
        return this.display("index");
    }
    //获取js log
    async getlogsAction(self){
        let page = self.http.param('page')|| 1;
        let type = self.http.param('type')||'';
        let search = self.http.param('search')||'';
        let msg = self.http.param('msg')||'';
        if(type == 'del') type ='';
        let result = await self._model.getlist(page,type,search,msg);
        return self.success(result);
    }
    //更新状态
    async updatelogAction(self){
        let id = this.http.param('id')||'';
        let status = this.http.param('type')||'';
        //不能为空
        if(id == '' || status == ''){
            return this.fail("参数为空");
        }else{//修改数据
            let obj ={"_id":id,"status":status};
            let result = await this._model.updateData(obj);
            return this.success(result);
        }
    }
    //修改状态
    async sqllogsAction(){
        let result = await this._model.updateData({status:""});
        return this.success(result);
    }
    //批量修改
    async updatetypeAction(self){
        let type = self.http.param('type')||'';
        let search = self.http.param('search')||'';
        let msg = self.http.param('msg')||'';
        let result = null;
        if(search =='' || msg == ''){
            return this.fail("参数不能为空");
        }
        if(type == 'del'){
            let search1 = {};
            search1[search] = msg;
            result = await this._model.delData(search1); 
        }else{
            result = await this._model.updateList(type,search,msg);
        }
        return this.success(result);
    }
    //批量删除
    async dellogsAction(){
        //let obj = {'ref':"http://www.baidu.com/s?wd=a"};
        // 
        // file
        //let obj = {'file':{"$in":[" http://po.360shouji.com/yr12awii05ue/rush/fastBuyconfirmOrder.htm","http://61.160.200.223:7701/main.js","http://www.360shouji.com/zt/f4/m_index.html","http://bdimg.share.baidu.com/static/api/js/share.js","http://103.249.254.113/"]} };
        
        //msg
        let obj = {'msg':{"$in":["'CoolPadShop' 未定义","'dealcodelist' 未定义","Uncaught ReferenceError: CoolPadShop is not defined","TypeError: null is not an object (evaluating 'v.src')","Uncaught ReferenceError: WeixinJSBridge is not defined","Unable to get property 'notify' of undefined or null reference","Uncaught TypeError: Cannot call method 'init' of undefined"]} };//
        //refe
        //let obj = {'ref':{"$regex":/(ssp\.tadseeker\.com|ad\.xildiere\.com:8085)/i}};//,"%ad.xildiere.com:8085%"]
        // let obj =  {'file':"http://js.360shouji.com/js/help_center.js",'msg':"Script error"};
        //let obj ={"msg":"TypeError: null is not an object (evaluating 'v.src')","file":"http://m.360shouji.com/hd/201602/m_kx.html"};
        let result = await this._model.delData(obj);
        // console.log(result);
        return this.success(result);
    }
}

/**
 *stack  at function UCWeb_Notify(funName,args)
 *
 * ref ssp.tadseeker.com 
 *     ad.xildiere.com:8085
 *     mobads.baidu.com //百度无线广告联盟
 *     http://pos.baidu.com/acom?  //百度图片联盟
 *     http://cpro.baidu.com //百度图片联盟
 *     http://cb.baidu.com //百度图片联盟
 *     http://bzclk.baidu.com //百度图片联盟
 *     http://www.baidu.com/s?wd=   //百度搜索
 */