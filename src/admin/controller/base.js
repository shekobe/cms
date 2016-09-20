'use strict';
import fs from "fs";
import mongodb from 'mongodb';
//import domain from "../../common/config/whitelist.js";

export default class extends think.controller.base {
    /**
     * [__before description]
     * @return {[type]} [description]
     */
    async __before() {
        //初始化
        this.assign({"name": "default", "username": "logo"});
        let token = await this.session("qkToken") || "";
        this.assign({"qktoken": token});
        //checklogin and user premission
        let auth = await this.checkauth();
        this.assign("userinfo", JSON.stringify(auth));
    }

    /**
     * get layout content
     */
    async gethomelayout(content) {
        let path = path.join(think.ROOT_PATH, 'view/home/layout/layout.html');
        let html = getfilecontent(path);
        return html.replace('<div class="container">', '<div class="container">' + content);
    }

    /*
     *get file content
     */
    async getfilecontent(filepath) {
        //将readFile方法包装成Promise
        let readFilePromise = think.promisify(fs.readFile, fs);
        //读取文件内容
        return readFilePromise(filePath, "utf8");
    }

    /**
     * 检测用户登录状态
     * @return {[type]} [description]
     */
    async checkauth() {
        let user_session = await this.session("userinfo");
        let userinfo = user_session || null;
        //用户认证
        if (!userinfo) {
            let url = this.http.url;
            let urlcallback = "";
            //console.log(url);
            if (!/(\/login)/g.test(url) && url != undefined) urlcallback = '?url=' + encodeURIComponent(url);
            return this.redirect('/admin/login/index/' + urlcallback);
        }
        //权限认证
        var msg = '抱歉，您没有权限访问此页';
         if (!userinfo.roles) {
             return this.fail(1001, '新用户请联系管理员开通权限');
         }
        let menuArr = await this.checkroles(userinfo.roles);
         if (!menuArr.length) {
             return this.fail(1001,msg );
         }

         if(!this.checkurl(menuArr)){
             return this.fail(1001, msg);
         }
        userinfo.leftMenuArr=  menuArr;
        return userinfo;
    }

    /**
     * 链接地址合法性检测
     */
    checkurl(arr) {
        var flag = false;
        var pathname = '/'+this.http.module+'/'+this.http.controller;

        if(({"/admin/index":1,"/admin/ueditor":1,'/admin/socket':1})[pathname]){
            flag = true;
        }else{
            pathname = pathname + (({"preview":1,"previewhome":1,'previewdefault':1,'index':1,'detail':1})[this.http.action] ? '' : '/'+this.http.action);
            for(var i=0;i<arr.length;i++){
                if(arr[i].href && arr[i].href == pathname ){
                    flag = true;
                }
            }

        }
        if(this.http.isAjax()){//todo
            return true;
        }
        return flag;
    }

    /**
     * 链接地址访问权限检测
     */
    async checkroles(role) {
        let arr = [];
        let obj2= [];
        let obj = await this.model("role").getDataById2(role.split(','));
        arr = obj.toString().split(',');
        Array.prototype.unique4 = function () {
            this.sort();
            var re = [this[0]];
            for (var i = 1; i < this.length; i++) {
                if (this[i] !== re[re.length - 1]) {
                    re.push(this[i]);
                }
            }
            return re;
        };
        arr = arr.unique4();
        obj2 = await this.model("menu").getDataById2(arr);
        // console.log(obj2);
        return obj2;

    }
}