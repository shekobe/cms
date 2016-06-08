'use strict';

/**
 * 后台系统用户表业务逻辑
 *
 */

//var Base = require('./base.js');
//var si = require('../model/user');
//var mon = require('../model/mongoose.js');
//var svn = require('./runsvn');
//var svn2 = require('./runsvn_test');



import Base from './base.js';
import svn from './runsvn.js';
import svn2 from './runsvn_test.js';
export default class extends Base {
    init(http) {
        super.init(http);
        this.modelInstance = this.model('users');
        this.modelInstance_svnlogs = this.model('svnlogs');
    }
    /**
     * 入口判断
     *
     */
    async indexAction(self) {
        //self.assign('name', 'default');
        //self.assign('pos', '0-0');
        //self.assign('power', '1');
        //self.assign('username', 'logo');
        //let userinfoToken =  self.cookie('qkToken');//获取touken
        //let userinfo = await self.session(userinfoToken);//获取用户信息
        ////user is unlogin
        //if(!userinfo){//undefined null
        //   return self.http.redirect("/admin/user/login");
        //}else{
        //    // attempt automatic login //
        //    this.modelInstance.getAccountByName(userinfo.username, function (o) {
        //        if (o != null) {
        //            self.assign('name', o.styleName);
        //            self.assign('pos', o.leftpos);
        //            self.assign('power', o.power);
        //            self.assign('username', o.username);
        //            return self.display();
        //        } else {
        //            self.http.redirect("/admin/user/login");
        //        }
        //    });
        //}
        return self.display();
    }
    /**
     * 注册帐号
     *
     */
    async addAction(self) {
        let name = self.http.param('username');
        let pass = self.http.param('password');
        let power = self.http.param('power');
        let obj = {
            username: name,
            pass: pass,
            power: power
        };

        await this.modelInstance.addUser(obj, res => {
            if (res == 'username-taken') {
                self.success(res);
            } else {
                self.success();
            }

        });
    }
    /**
     * 登录
     *
     */
    async loginAction(self){
        let userinfoToken = await self.cookie('qkToken');//获取touken
        //console.log('userinfoToken', await userinfoToken)
        let userinfo = await self.session(userinfoToken);
        if(self.http.isGet()){
            if (!userinfo){
                return self.display();
            }else{
                console.log(userinfoToken);
                console.log("username");
                console.log(userinfo.username);
                console.log(userinfo.username);
                // attempt automatic login //
               await self.modelInstance.autoLogin(userinfo.username, userinfo.pass, function(o){
                    if (o != null){
                        //session user base info
                        let userinfo = self.session(userinfoToken, {
                            "username": o.username,
                            "pass": o.pass,
                            "styleName": o.styleName,
                            "leftpos": o.leftpos,
                            "power": o.power,
                            "data": o.data
                        });
                        console.log(userinfo);
                        if(userinfo)
                            self.http.redirect("/admin/index");
                        else
                            self.fail('404','system login error');
                    }else{
                        return self.display();
                    }
                });
            }

        }else{

            await self.modelInstance.manualLogin(self.http.param('user'), self.http.param('pass'), function(e, o){
                if (!o){
                    self.success(e);
                }else{
                   let userinfo = self.session(userinfoToken, {
                            "username": o.username,
                            "pass": o.pass,
                            "styleName": o.styleName,
                            "leftpos": o.leftpos,
                            "power": o.power,
                            "data": o.data
                        });
                    if (self.http.param('remember') == 'checked'){
                        //记住登录状态
                        // self.session(userinfoToken,[o.username , o.pass]);
                    }
                    self.success('ok');
                }
            });
        }
    }
    /**
     * 登出
     *
     */
    logoutAction(self){
        let userinfoToken = self.cookie('qkToken');//获取touken
        self.session(userinfoToken,'');
        self.http.redirect("/admin/index");
    }
    /**
     * 下载文件
     *
     */
    downloadAction(){
        var filepath = this.http.get("name");
        this.download(think.RESOURCE_PATH+'/upload/'+filepath+'/WebContent.tar.gz');

    }
    /**
     * 显示日志
     *
     */
    showlogAction(self){
        //svn.refreshInfoCache
        svn.log('',self.http.param('page'),function(a,b){
            if(b){
                self.success(b);
            }else{
                self.fail(1000, "connect error");
            }
        });
    }
    /**
     * 显示日志2
     *
     */
    showlog2Action(self){
        //svn.refreshInfoCache
        svn2.log('',self.http.param('page'),function(a,b){
            if(b){
                self.success(b);
            }else{
                self.fail(1000, "connect error");
            }
        });
    }
    /**
     * 通过用户名获取用户信息
     *
     */
    async getuserbynameAction(self){
         let userinfoToken = await self.cookie('qkToken');//获取touken
        await self.modelInstance.getAccountByName(userinfoToken.username,function(o){
            self.success(o);
        });
    }
    /**
     * 通过用户名获取用户信息
     *
     */
    async getuserbyname2Action(self){
         let userinfoToken = await self.cookie('qkToken');//获取touken
        // console.log('getuserbyname2Action',self.cookie("user"))
        await self.modelInstance_svnlogs.getData(userinfoToken.username,function(o){
            self.success(o);
        });
    }
    /**
     * 通过用户名获取用户信息
     *
     */
    async getuserbyname3Action(self){
        await self.modelInstance_svnlogs.getData2(function(o){
            self.success(o);
        });
    }
    /**
     * 通过id删除svn日志表
     *
     */
    async deldataAction(self){
        await self.modelInstance_svnlogs.delData(self.http.param('id'),function(o){
                self.success(o)
        });
    }
    /**
     * 通获取svnlogs信息
     *
     */
    async addlist2Action(self) {
        //auto render template file index_index.html
        if(self.http.isGet()){
        }else{
            self.modelInstance_svnlogs.addData({msg:self.http.param('msg'),name:self.http.param('username'),con:self.http.param('str')},function(o){
                self.success(o);
            });
        }

    }
    /**
     * 更新svnlogs表
     *
     */
    async updatedataAction(self){
        self.modelInstance_svnlogs.updateData({oldstatus:self.http.param('oldstatus'),id:self.http.param('id'),username:self.http.param('username'),status:self.http.param('status')},function(o){
            //if (o != null) {
            //    self.success(o)
            //} else {
            //    self.fail(1000, "connect error"); //指定错误号和错误信息
            //}
            self.success(o);
        });
    }
    //设置左侧菜单位置
    async setleftposAction(self){
        await this.modelInstance.setleftpos({str:self.http.param('str'),username:self.http.param('username')},function(o){
            //if (o != null) {
            //    self.success(o)
            //} else {
            //    self.fail(1000, "connect error"); //指定错误号和错误信息
            //}
            console.log('o',o);
            self.success(o);
        });
    }
    //获取左侧 前端发布 与 测试的文件更新 等待处理事件的个数
    async getfcountandtcountAction(self){
         let userinfoToken = await self.cookie('qkToken');//获取touken
        await self.modelInstance_svnlogs.getFcountandTcount(userinfoToken.username,function(o){
            self.success(o);
        });
    }
    //获取用户列表
    async getuserlistAction(self){
        await self.modelInstance.getUserList(function(o){
            self.success(o);
        });
    }

    //删除用户
    async deluserbyidAction(self){
        await self.modelInstance.delUserById(self.http.param('id'),function(o){
            self.success(o);
        });
    }
    //修改用户
    async updateuserbyidAction(self){
        await self.modelInstance.updateUserById({id:self.http.param('id'),power:self.http.param('power')},function(o){
            self.success(o);
        });
    }

    //修改用户权限
    async updateuserroleAction(self){
        var session = self.http.param('session');
        await self.modelInstance.updatedatarole({id:self.http.param('id'),roles:self.http.param('roles')},function(o){
            if(o){//更新用户session
                self.session("userinfo",{"username": session.username,
                    "pass": session.pass,
                    "styleName": session.styleName,
                    "leftpos": session.leftpos,
                    "power": session.power,
                    "date": session.date,
                    "roles":self.http.param('roles')
                });
            }
            self.success(o);
        });
    }
    /**
     * 设置用户样式
     *
     */
    async setstyleAction(self){
        await self.modelInstance.setStyle({name:self.http.param('name'),username:self.http.param('username')},function(o){
            self.success(o);
        });
    }

}



