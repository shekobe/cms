'use strict';

/**
 * 权限管理
 *
 */



import Base from './base.js';
import fs from 'fs';
import path from 'path';
export default class extends Base {
    init(http) {
        super.init(http);
        this.modelInstance_svnlogs = this.model('role');
    }
    /**
     * 入口判断
     *
     */
    async indexAction(self) {

        //self.http.redirect("/admin/menu/index");
        return self.display();


    }

    /**
     * 跳系统角色菜单授权
     *
     */
    async menuAction(self){
        return self.display();
    }


    /**
     * 通过用户名获取用户信息
     *
     */
    async getlistAction(self){
        await self.modelInstance_svnlogs.getData(function(o){
            self.success(o);
        });
    }

    /**
     * 通过roleif获取用户信息
     *
     */
    async getlistbyidAction(self){
        var id = self.http.param('id');
        var idArr = id.split(',');
        await self.modelInstance_svnlogs.getDataById(idArr,function(o){
            self.success(o);
        });
    }
    /**
     * 通过id删除svn日志表
     *
     */
    async deldataAction(self){
        await self.modelInstance_svnlogs.delData({
            id:self.http.param('id')
        },function(o){
            self.success(o)
        });
    }
    /**
     * 通获取svnlogs信息
     *
     */
    async addAction(self) {
        //auto render template file index_index.html
        if(self.http.isGet()){
        }else{
            self.modelInstance_svnlogs.addData({
                roleName:self.http.param('roleName'),
                info:self.http.param('info')

            },function(o){
                self.success(o);
            });
        }

    }




    /**
     * 更新角色名称或职责说明
     *
     */
    async updatedataAction(self){
        self.modelInstance_svnlogs.updateData({
            roleName:self.http.param('roleName'),
            id:self.http.param('id'),
            info:self.http.param('info')
        },function(o){
            //if (o != null) {
            //    self.success(o)
            //} else {
            //    self.fail(1000, "connect error"); //指定错误号和错误信息
            //}
            self.success(o);
        });
    }

    /**
     * 更新角色的授权菜单
     *
     */
    async updatedataroleAction(self){
        self.modelInstance_svnlogs.updatedatarole({
            id:self.http.param('id'),
            menuIds:self.http.param('menuIds')
        },function(o){
            //if (o != null) {
            //    self.success(o)
            //} else {
            //    self.fail(1000, "connect error"); //指定错误号和错误信息
            //}
            self.success(o);
        });
    }

}



