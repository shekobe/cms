'use strict';
/**
 * 处理linux运维业务逻辑
 *
 */


import Base from './base.js';
import fs from 'fs';
import path from 'path';
import moment from 'moment';
moment.locale('zh-cn');
export default class extends Base {
    init(http) {
        super.init(http);
        this.modelInstance_servers = this.model('servers');
        this.modelInstance_serverscripts = this.model('serverscripts');
        this.modelInstance_serverorders = this.model('serverorders');
    }

    /**
     * index action
     * @return {Promise} []
     */
    indexAction(self) {
        //auto render template file index_index.html

    }
    /**
     * 添加服务器信息
     *
     */
    async addserverAction(self) {
        let re = await this.modelInstance_servers.add({
            ip: self.http.param('ip'),
            port: self.http.param('port'),
            time: moment().format(),
            user: self.http.param('user'),
            pass: self.http.param('pass'),
            group: self.http.param('group')
        });
        self.success(re);

    }
    /**
     * 更新执行脚本
     *
     */
    updatescriptAction(self) {

        var file = this.file('image');
        var filepath = file.path;
        //文件上传后，需要将文件移动到项目其他地方，否则会在请求结束时删除掉该文件
        var uploadPath = think.RESOURCE_PATH + '/static/admin/upload';
        think.mkdir(uploadPath);
        var basename = self.http.param('name');
        fs.rename(filepath, uploadPath + '/' + basename, function (err) {
            if (err) {
                self.fail(1000, "upload error");
            } else {
                // self.success(basename);
                self.success('ok');
            }
        });
        return false;
    }
    /**
     * 添加执行脚本
     *
     */
    async addscriptAction(self) {
        console.log('addscriptAction');
        var file = this.file('image');
        var filepath = file.path;

        //文件上传后，需要将文件移动到项目其他地方，否则会在请求结束时删除掉该文件
        var uploadPath = think.RESOURCE_PATH + '/static/admin/upload';
        think.mkdir(uploadPath);
        var basename = path.basename(filepath);
        var fg = fs.rename(filepath, uploadPath + '/' + basename, function (err) {
            if (err) {
                console.log('22222');
                self.fail(1000, "upload error");
                return false;
            } else {
                console.log('11111');

                return true;
            }
        });

        var re = await self.modelInstance_serverscripts.add({
            name: self.http.param('name'),
            time: moment().format(),
            path: basename

        });
        var re2 = await self.modelInstance_serverscripts.select();
        let [a,b,c] = await Promise.all([fg,re,re2]);

        self.success(c);

        return false;

    }
    /**
     * 获取执行脚本列表
     *
     */
    async getscriptlistAction(self) {
        var obj = await self.modelInstance_serverscripts.select();
        self.success(obj);
    }
    /**
     * 获取服务器列表
     *
     */
    async getserverlistAction(self) {
        var obj = await self.modelInstance_servers.select();
        self.success(obj);

    }
    /**
     * 通过Id删除服务器信息
     *
     */
    async delserverbyidAction(self) {
        let res = await self.modelInstance_servers.where({_id: self.http.param('id')}).delete();
        self.success(res);

    }
    /**
     * 通过id删除执行脚本
     *
     */
    async delscriptbyidAction(self) {

        let res = await self.modelInstance_serverscripts.where({_id: self.http.param('id')}).delete();
        self.success(res);

    }
    /**
     * 通过id更新执行脚本
     *
     */
    async updateserverbyidAction(self) {

        var obj = {
            ip: self.http.param('ip'),
            port: self.http.param('port'),
            user: self.http.param('user'),
            pass: self.http.param('pass'),
            group: self.http.param('group')
        };
        if (!self.http.param('id')) {//如果没有id,就是新增数据
            obj.time = moment().format();
            let re = await this.modelInstance_servers.add(obj);
            self.success(re);
            return;
        }
        let res = await this.modelInstance_servers.where({_id: self.http.param('id')}).update(obj);
        self.success(res);

    }

    //增加一个命令
    async addserverorderAction(self) {
        console.log('addserverorderAction', self.http.param('name'));
        let re = await this.modelInstance_serverorders.add({
            name: self.http.param('name'),
            scriptPath: self.http.param('scriptPath'),
            time: moment().format(),
            userArr: self.http.param('userArr'),
            passArr: self.http.param('passArr'),
            groupArr: self.http.param('groupArr'),
            serverArr: self.http.param('serverArr')
        });
        self.success(re);

    }

    //删除命令
    async delscriptorderbyidAction(self) {
        let res = await self.modelInstance_serverorders.where({_id: self.http.param('id')}).delete();
        self.success(res);

    }

    //修改命令
    async updateserverorderbyidAction(self) {
        var obj = {
            name: self.http.param('name'),
            scriptPath: self.http.param('scriptPath'),
            userArr: self.http.param('userArr'),
            passArr: self.http.param('passArr'),
            groupArr: self.http.param('groupArr'),
            serverArr: self.http.param('serverArr')
        };
        let res = await this.modelInstance_serverorders.where({_id: self.http.param('id')}).update(obj);
        self.success(res);

    }

    //获取命令合集
    async getscriptorderlistAction(self) {

        var obj = await self.modelInstance_serverorders.select();
        self.success(obj);

    }

};