'use strict';
/**
 * 网点查询、
 *
 *
 */
import Base from './base.js';
import fs from 'fs';
import mongodb from 'mongodb';
import moment from 'moment';
export default class extends Base {
    init(http) {
        super.init(http);
        this._model = this.model('users');
        this.usersmodel = this.model("users");
    }



    /** 入口 **/
    async indexAction(self) {

        return self.display();
    }





    /**
     * 更新svnlogs表
     *
     */
    async updatepasswordAction(self) {
        //Post
        if(self.http.isPost()){
            let userinfo = await this.session("userinfo");
            console.log('userinfo', userinfo)
            if (!userinfo){
               return self.fail(1000, "用户已登出，请重新登录。");
            }else{

                var res = await self._model.updatepassword(userinfo.username,self.http.param('oldpassword'),self.http.param('newpassword'));

                console.log('res',res);
                if(res == 1){
                    await self.session('userinfo', null);
                    self.success(res);
                }else{
                    if(res == 'error'){
                        self.fail("原密码不正确");

                    }else{
                        self.fail("用户帐号异常，请联系管理员");
                    }

                }

            }

        }

    }


}



