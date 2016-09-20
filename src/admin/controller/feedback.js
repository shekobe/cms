'use strict';
/**
 * 后台模板控制
 *
 */
import Base from './base.js';
import fs from 'fs';
import mongodb from 'mongodb';
import path from 'path';
import Ssh2 from 'ssh2';
import moment from 'moment';
import SshPool from 'ssh-pool';
import child from 'child_process';
let Client = Ssh2.Client;
export default class extends Base {
    init(http) {
        super.init(http);
        this._model = this.model('feedback');
    }


    /** 入口 **/
    async indexAction(self) {
        return self.display();
    }

    async sshexec(_str,call){
        //标记当前时间
        var time = new Date().getTime();
        let ip = this.http.hostname;
        console.log('sshexec ip',ip);
        var pool = new SshPool.ConnectionPool(['root@'+ip,'root@10.100.7.64']);
        try{

            pool.run(_str)
                .then(function (results) {
                    for(var jj=0;jj<results.length;jj++){
                        if(results[jj].stderr){
                            console.log(':error'+results[jj].stderr);

                        }
                        if(results[jj].stdout){
                            console.log(':ok'+results[jj].stdout);
                            let res = JSON.parse(results[jj].stdout);
                            if(res.errno == '0'){
                                //return call(1);
                            }else{
                               // return call(0);
                            }

                        }

                    }
                    var time1 = new Date().getTime() - time;
                    console.log(results.length+'台远程服务器成功接收命令！用时：'+time1/1000+'s');
                    return call(1);

                });
        }
        catch(e){
            console.log('new sshPool.ConnectionPool error:'+e);
        }
    }

    /** 获取模板列表 **/
    async gettepmlistAction(self) {
        let page = self.http.param("page") || 1;
        let nums = self.http.param("nums") || 10;
        let ids = '';
        var newArr = [];
        let id = self.http.param("cateId") || '1';
        if(id == '1'){//查询所有文章
            newArr = [];
            //dataList = await this._model.order('time DESC').page(page,nums).countSelect();
        }else{
            let obj =  await self.getarticleidlist(id);
            if(obj.children_dd){
                ids = id+','+ obj.children_dd;
            }else{
                ids = id;
            }

            let idArr = ids.split(',');

            for(var i=0;i<idArr.length;i++){
                if(idArr[i]){
                    let item = idArr[i] || mongodb.ObjectID(idArr[i]);
                    newArr.push(item);
                }

            }

        }
        let search = self.http.param("search") || '';
        let data = await self._model.getList(page, nums, newArr, search);
        self.success(data);
    }


    /**
     * 通获取svnlogs信息
     */
    async addlistAction(self) {
        //auto render template file index_index.html
        if (self.http.isPost()) {
            let result = await self._model.addData({
                url:self.http.param('url'),
                title: self.http.param('title'),
                content: self.http.param('content'),
                createtime: self.http.param('createtime'),
                ip: self.http.param('ip'),
                cname: self.http.param('cname'),
                useragent: self.http.param('useragent')

            });
            self.success(result);
        }

    }



    /**
     * 更新svnlogs表
     *
     */
    async updatedataAction(self) {
        var res = await self._model.updateData({
            url:self.http.param('url'),
            title: self.http.param('title'),
            content: self.http.param('content'),
            createtime: self.http.param('createtime'),
            ip: self.http.param('ip'),
            cname: self.http.param('cname'),
            useragent: self.http.param('useragent')

        });
        self.success(res);
    }

    /**
     * 获取物理文件路径
     */
    async getviewfiles(dir_path) {
        let root = path.join(think.ROOT_PATH, dir_path);//'view/home/'
        //监测是否上传成功
        if (!think.isFile(root)) {
            return this.fail(404, "你访问的文件不存在");
        }
        return fs.readFileSync(root, 'utf-8');
    }
}



