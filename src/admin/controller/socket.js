'use strict';


import Base from './base.js';
import child from 'child_process';
let exec = child.exec;
let execSync = child.execSync;
import ansiHTML from 'ansi-html';
import fs from 'fs';
import path from 'path';
import Ssh2 from 'ssh2';
let Client = Ssh2.Client;
import moment from 'moment';
let gb_username = '';
export default class extends Base {
    init(http) {
        super.init(http);
        this.modelInstance = this.model('svnlogs');
    }


    /**
     * index action
     * @return {Promise} []
     */
    indexAction(self) {
        //auto render template file index_index.html



    }
    //更新服务器svn
    updateproductsvnAction(){

    }
    //更新左侧菜单栏状态
    updateallAction(self) {
        //auto render template file index_index.html
        //console.log('-------gb_username',gb_username);
        this.modelInstance.getFcountandTcount(gb_username,function(o){
                if (o != null) {
                   // self.success(o)
                } else {
                   // self.fail(1000, "connect error"); //指定错误号和错误信息
                }
                self.broadcast('updataDataList', o);
        });


    }

    //发布到99生产环境//
    addlist2Action(self){//todo

        this.emit('abc', {
            message: '更新发布中，0-2分钟，请耐心等待'
        });
        var un = self.http.data.username;
        gb_username = un;
        if(!un){
            self.emit('abc', {
                message: '用户登录信息过期，请刷新页面重新登录'
            });
            return;
        }
        var file='',
            args=[],
            linuxargs_res=['-c','cd /usr/local/src/qikuweb_ && fis3 release rd -f fis-conf'+un+'.js'],
            linuxargs_html=['-c','cd /usr/local/src/qikuweb_ && fis3 release rd -f fis-conf'+un+'.js'],
            winargs = ['/s', '/c', 'cd /d E:\\qikusvn\\trunk\\front-web\\qikuweb && fis3 release rd -f fis-conf'+un+'.js'],
            options = {};
        if (process.platform === 'win32') {
            file = process.env.comspec || 'cmd.exe';
            args = ['/s', '/c', 'cd /d E:\\qikusvn\\trunk\\front-web\\qikuweb'];
// Make a shallow copy before patching so we don't clobber the user's
// options object.
            //options = util._extend({}, options);
            //options.windowsVerbatimArguments = true;
        } else {
            file = '/bin/sh';
            args = ['-c','cd /usr/local/src/qikuweb'];
        }



        var grunt = child.spawn(file,args, {
            env: process.env,
            maxBuffer: 500*1024 //default:200*1024
        });

        grunt.stdout.on('data', function (chunk) {
            ////console.log('' + chunk);
            self.emit('abc', {
                message: ansiHTML(('' + chunk).replace(/\r\n|\r|\n/img, '<br/>'))
            });
        });
        var isSuccess = 1;//1:发布成功 0：发布失败
        grunt.stderr.on('data', function (chunk) {
            ////console.log('stderr--' + chunk);
            isSuccess = 0;
            self.emit('abc', {
                message: '远端机器端口无法访问，发布失败'+chunk
            });
        });

        grunt.on('error', function (err) {
            ////console.log('child process exited with error ' + err);
            self.emit('abc', {
                message: 'child process exited with error ' + err
            });

        });

        grunt.on('close', function (code) {

           // //console.log('child process exited with code ' + code,isSuccess);
            if(isSuccess){
                if (process.platform === 'win32') {
                    self.emit('abc', {
                        message: '此功能不能本地项目使用！'
                    });
                    return;
                    //window 先动态生成fis-conf.js再推送文件
                    var strw = self.http.data.res;
                    var arrw = strw.toString().substring(1,strw.toString().length-1).split(',');
                    if(arrw.length == 1){// match一个目标的时候不用加 “{　}”
                        strw = arrw[0];
                    }

                    var arr2w = '';
                    for(var i=0; i<arrw.length;i++){
                        arr2w += '\"\.' + arrw[i] + '\"'+ ',';
                    }
                    arr2w = arr2w.substring(0,arr2w.toString().length-1);
                    ////console.log(arr2w);
                    ////console.log(strw);
                    var sendStrw = 'fis.media("rd").set("project.files",['+arr2w+']).set("project.ignore", ["{node_modules}/**",".*","package.json","fis-conf.js","gulpfile.js"]).match("'+strw+'", {deploy:fis.plugin("http-push", {receiver:"http://10.1.21.201:8999/receiver",to:"/usr/local/sugy/res"})});';
                    //写入文件
                    fs.writeFile('E:\\qikusvn\\trunk\\front-web\\qikuweb\\fis-conf'+un+'.js', sendStrw, function (err) {
                        if (err) {
                            ////console.log('Error', err);
                            self.emit('abc', {
                                message: '成功配置文件出错！'
                            });
                            return;
                        }
                        self.emit('abc', {
                            message: '推送文件：'+sendStrw
                        });
                        //self.emit('abc', {
                        //    message: '成功生成配置文件！'
                        //});
                        self.emit('abc', {
                            message: '开始推送文件'
                        });
                        var grunt2w = child.spawn(file, winargs, {
                            //env: process.env
                        });

                        grunt2w.stdout.on('data', function (chunk) {
                            ////console.log('' + chunk);
                            self.emit('abc', {
                                message: ansiHTML(('' + chunk).replace(/\r\n|\r|\n/img, '<br/>'))
                            });
                        });
                        var isSuccess2w = 1;//1:发布成功 0：发布失败
                        grunt2w.stderr.on('data', function (chunk) {
                           // //console.log('stderr--' + chunk);
                            isSuccess2w = 0;
                            self.emit('abc', {
                                message: '远端机器端口无法访问，发布失败'+chunk
                            });
                        });

                        grunt2w.on('error', function (err) {
                            ////console.log('child process exited with error ' + err);
                            self.emit('abc', {
                                message: 'child process exited with error ' + err
                            });

                        });
                        grunt2w.on('close', function (code) {

                           // //console.log('child process exited with code ' + code,isSuccess2w);
                            if(isSuccess2w){
                                self.emit('abc', {
                                    message: '资源文件发布成功<img width="64" height="64" src="/static/admin/theme/assets/admin/pages/img/iconfont-ok.png"/>'
                                });
                                //self.emit('result',self.http.data.id);
                                //通知所有客户端自动更新
                                //self.updateallAction();
                            }else{
                                self.emit('abc', {
                                    message: '资源文件发布失败<img width="64" height="64" src="/static/admin/theme/assets/admin/pages/img/iconfont-shibai.png"/>'
                                });
                            }
                            //发布html文件
                            var strw_ = self.http.data.html;
                            var arrw_ = strw_.toString().substring(1,strw_.toString().length-1).split(',');
                            if(arrw_.length == 1){// match一个目标的时候不用加 “{　}”
                                strw_ = arrw_[0];
                            }

                            var arr2w_ = '';
                            for(var i=0; i<arrw_.length;i++){
                                arr2w_ += '\"\.' + arrw_[i] + '\"'+ ',';
                            }
                            arr2w_ = arr2w_.substring(0,arr2w_.toString().length-1);
                            ////console.log(arr2w_);
                            ////console.log(strw_);
                            var sendStrw_ = 'fis.media("rd").set("project.files",['+arr2w_+']).set("project.ignore", ["{node_modules}/**",".*","package.json","fis-conf.js","gulpfile.js"]).match("'+strw_+'", {deploy:fis.plugin("http-push", {receiver:"http://10.1.21.201:8999/receiver",to:"/usr/local/sugy/html"})});';
                            //写入文件
                            fs.writeFile('E:\\qikusvn\\trunk\\front-web\\qikuweb\\fis-conf'+un+'.js', sendStrw_, function (err) {
                                if (err) {
                                   // //console.log('Error', err);
                                    self.emit('abc', {
                                        message: '成功配置文件出错！'
                                    });
                                    return;
                                }
                                self.emit('abc', {
                                    message: '推送文件：'+sendStrw_
                                });
                                //self.emit('abc', {
                                //    message: '成功生成配置文件！'
                                //});
                                self.emit('abc', {
                                    message: '开始推送文件'
                                });
                                var grunt2w_ = child.spawn(file, winargs, {
                                    //env: process.env
                                });

                                grunt2w_.stdout.on('data', function (chunk) {
                                   // //console.log('' + chunk);
                                    self.emit('abc', {
                                        message: ansiHTML(('' + chunk).replace(/\r\n|\r|\n/img, '<br/>'))
                                    });
                                });
                                var isSuccess2w_ = 1;//1:发布成功 0：发布失败
                                grunt2w_.stderr.on('data', function (chunk) {
                                    ////console.log('stderr--' + chunk);
                                    isSuccess2w_ = 0;
                                    self.emit('abc', {
                                        message: '远端机器端口无法访问，发布失败'+chunk
                                    });
                                });

                                grunt2w_.on('error', function (err) {
                                   // //console.log('child process exited with error ' + err);
                                    self.emit('abc', {
                                        message: 'child process exited with error ' + err
                                    });

                                });
                                grunt2w_.on('close', function (code) {

                                   // //console.log('child process exited with code ' + code,isSuccess2w_);
                                    if(isSuccess2w_){
                                        self.emit('abc', {
                                            message: 'html或jsp文件发布成功<img width="64" height="64" src="/static/admin/theme/assets/admin/pages/img/iconfont-ok.png"/>'
                                        });
                                        self.emit('result',{
                                            id:self.http.data.id,
                                            oldstatus:self.http.data.status,
                                            status:'close'
                                        });
                                        //通知所有客户端自动更新
                                        self.updateallAction();
                                    }else{
                                        self.emit('abc', {
                                            message: 'html文件发布失败<img width="64" height="64" src="/static/admin/theme/assets/admin/pages/img/iconfont-shibai.png"/>'
                                        });
                                    }
                                });

                            });
                        });

                    });
                }else{//linux是先更新再发布文件
                    var allflag = 0;//1:html,res都要发，0：表示 非1
                    function pushres(){
                        //linux 先动态生成fis-conf.js再推送文件
                        var str = self.http.data.res;
                        if(!str){
                            return;
                        }
                        var arr = str.toString().substring(1,str.toString().length-1).split(',');
                        ////console.log(arr.length,arr[0],arr[1],arr[2]);
                        if(arr.length == 1){// match一个目标的时候不用加 “{　}”
                            str = arr[0];
                        }
                        var arr2 = '';
                        for(var i=0; i<arr.length;i++){
                            arr2 += '\"\.' + arr[i] + '\"'+ ',';
                        }
                        arr2 = arr2.substring(0,arr2.toString().length-1);

                        var sendStr = 'fis.media("rd").set("project.files",['+arr2+']).set("project.ignore", ["{node_modules}/**",".*","package.json","fis-conf.js","gulpfile.js"]).match("'+str+'", {deploy:fis.plugin("http-push", {receiver:"http://10.100.7.64:8999/receiver",to:"/usr/local/qikuweb"})});';
                        //写入文件
                        fs.writeFile('/usr/local/src/qikuweb_/fis-conf'+un+'.js', sendStr, function (err) {
                            if (err) {
                               // //console.log('Error', err);
                                self.emit('abc', {
                                    message: err+'成功配置文件出错！'
                                });
                                return;
                            }
                            //self.emit('abc', {
                            //    message: '推送文件：'+sendStr
                            //});
                            //self.emit('abc', {
                            //    message: '成功生成配置文件！'
                            //});
                            self.emit('abc', {
                                message: '开始推送文件'
                            });
                            var grunt2 = child.spawn(file, linuxargs_res, {
                                //env: process.env
                            });

                            grunt2.stdout.on('data', function (chunk) {
                               // //console.log('' + chunk);
                                self.emit('abc', {
                                    message: ansiHTML(('' + chunk).replace(/\r\n|\r|\n/img, '<br/>'))
                                });
                            });
                            var isSuccess2 = 1;//1:发布成功 0：发布失败
                            grunt2.stderr.on('data', function (chunk) {
                                ////console.log('stderr--' + chunk);
                                isSuccess2 = 0;
                                self.emit('abc', {
                                    message: '远端机器端口无法访问，发布失败'+chunk
                                });
                            });

                            grunt2.on('error', function (err) {
                               // //console.log('child process exited with error ' + err);
                                self.emit('abc', {
                                    message: 'child process exited with error ' + err
                                });

                            });
                            grunt2.on('close', function (code) {

                               // //console.log('child process exited with code ' + code,isSuccess2);
                                if(isSuccess2){
                                    self.emit('abc', {
                                        message: '资源文件发布成功<img width="64" height="64" src="/static/admin/theme/assets/admin/pages/img/iconfont-ok.png"/>'
                                    });
                                    if(!allflag){
                                        self.emit('result',{
                                            id:self.http.data.id,
                                            oldstatus:self.http.data.status,
                                            status:'close'
                                        });
                                       // 通知所有客户端自动更新
                                         self.updateallAction();
                                    }

                                }else{
                                    self.emit('abc', {
                                        message: '资源文件发布失败<img width="64" height="64" src="/static/admin/theme/assets/admin/pages/img/iconfont-shibai.png"/>'
                                    });
                                }
                                if(allflag){
                                    pushhtml();
                                }


                            });

                        });
                    }

                    function pushhtml(){
                        //推送html文件
                        ////console.log('推送html文件');
                        var str__ = self.http.data.html;
                        ////console.log('str__',str__);
                        var arr__ = str__.toString().substring(1,str__.toString().length-1).split(',');
                        ////console.log(arr.length,arr[0],arr[1],arr[2]);
                        if(arr__.length == 1){// match一个目标的时候不用加 “{　}”
                            str__ = arr__[0];
                        }
                        var arr2__ = '';
                        for(var i=0; i<arr__.length;i++){
                            arr2__ += '\"\.' + arr__[i] + '\"'+ ',';
                        }
                        arr2__ = arr2__.substring(0,arr2__.toString().length-1);

                        var sendStr__ = 'fis.media("rd").set("project.files",['+arr2__+']).set("project.ignore", ["{node_modules}/**",".*","package.json","fis-conf.js","gulpfile.js"]).match("'+str__+'", {deploy:fis.plugin("http-push", {receiver:"http://10.100.7.64:8999/receiver",to:"/usr/local/qikuweb"})});';
                        //写入文件
                        fs.writeFile('/usr/local/src/qikuweb_/fis-conf'+un+'.js', sendStr__, function (err) {
                            if (err) {
                               // //console.log('Error', err);
                                self.emit('abc', {
                                    message: '成功配置文件出错！'
                                });
                                return;
                            }
                            //self.emit('abc', {
                            //    message: '推送文件：'+sendStr
                            //});
                            //self.emit('abc', {
                            //    message: '成功生成配置文件！'
                            //});
                            self.emit('abc', {
                                message: '开始推送文件'
                            });
                            var grunt2__ = child.spawn(file, linuxargs_html, {
                                //env: process.env
                            });

                            grunt2__.stdout.on('data', function (chunk) {
                                //console.log('' + chunk);
                                self.emit('abc', {
                                    message: ansiHTML(('' + chunk).replace(/\r\n|\r|\n/img, '<br/>'))
                                });
                            });
                            var isSuccess2__ = 1;//1:发布成功 0：发布失败
                            grunt2__.stderr.on('data', function (chunk) {
                                //console.log('stderr--' + chunk);
                                isSuccess2__ = 0;
                                self.emit('abc', {
                                    message: '远端机器端口无法访问，发布失败'+chunk
                                });
                            });

                            grunt2__.on('error', function (err) {
                                //console.log('child process exited with error ' + err);
                                self.emit('abc', {
                                    message: 'child process exited with error ' + err
                                });

                            });
                            grunt2__.on('close', function (code) {

                                //console.log('child process exited with code ' + code,isSuccess2__);
                                if(isSuccess2__){
                                    self.emit('abc', {
                                        message: 'html或jsp文件发布成功<img width="64" height="64" src="/static/admin/theme/assets/admin/pages/img/iconfont-ok.png"/>'
                                    });
                                    self.emit('result',{
                                        id:self.http.data.id,
                                        oldstatus:self.http.data.status,
                                        status:'close'
                                    });
                                    //通知所有客户端自动更新
                                    self.updateallAction();
                                }else{
                                    self.emit('abc', {
                                        message: 'html文件发布失败<img width="64" height="64" src="/static/admin/theme/assets/admin/pages/img/iconfont-shibai.png"/>'
                                    });
                                }
                            });

                        });
                    }
                    if(self.http.data.res && !self.http.data.html){
                        pushres();
                        return;
                    }
                    if(!self.http.data.res && self.http.data.html){
                        pushhtml();
                        return;
                    }
                    if(!self.http.data.res && !self.http.data.html){
                        self.emit('abc', {
                            message: '没有可发布的资源文件与html文件'
                        });
                        return;
                    }
                    if(self.http.data.res && self.http.data.html){
                        allflag = 1;
                        pushres();
                        return;
                    }

                }


            }else{

                if (process.platform === 'win32') {
                    self.emit('abc', {
                        message: '文件发布失败<img width="64" height="64" src="/static/admin/theme/assets/admin/pages/img/iconfont-shibai.png"/>'
                    });
                }else{
                    self.emit('abc', {
                        message: '文件更新失败<img width="64" height="64" src="/static/admin/theme/assets/admin/pages/img/iconfont-shibai.png"/>'
                    });
                }

            }



        });

    }

    //发布到102测试环境
    //静态文件、jsp推 /opt/tomcat3(123) /opt/tomcat_grap(124、131)
    //资源文件推 、/usr/local/resource(124)
    async addlistAction(self){//todo
        console.log(5555)
        this.emit('abc', {
            message: '更新发布中，0-2分钟，请耐心等待'
        });

        var un = self.http.data.username;
        gb_username = un;
        if(!un){
            self.emit('abc', {
                message: '用户登录信息过期，请刷新页面重新登录'
            });
            return;
        }
        var linuxcwdpath = '/usr/local/src/qikuweb';
        var file='',
            args=[],
            linuxargs=['-c','fis3 release rd -f fis-conf'+un+'.js'],
            winargs = ['/s', '/c', 'fis3 release rd -f fis-conf'+un+'.js'],
            options = {};
        if (process.platform === 'win32') {
            file = process.env.comspec || 'cmd.exe';
            args = ['/s', '/c'];
// Make a shallow copy before patching so we don't clobber the user's
// options object.  ss
            //options = util._extend({}, options);
            //options.windowsVerbatimArguments = true;
        } else {
            file = '/bin/sh';
            args = ['-c','cd '+linuxcwdpath+' && svn update'];
        }


        var grunt = child.spawn(file,args,{cwd:path.join(think.ROOT_PATH)}, {
            env: process.env,
            maxBuffer: 500*1024 //default:200*1024
        });

        grunt.stdout.on('data', function (chunk) {
            console.log('' + chunk);
            self.emit('abc', {
                message: ansiHTML(('' + chunk).replace(/\r\n|\r|\n/img, '<br/>'))
            });
        });
        var isSuccess = 1;//1:发布成功 0：发布失败
        grunt.stderr.on('data', function (chunk) {
            console.log('stderr--' + chunk);
            isSuccess = 0;
            self.emit('abc', {
                message: '远端机器端口无法访问，发布失败'+chunk
            });
        });

        grunt.on('error', function (err) {
            console.log('child process exited with error ' + err);
            self.emit('abc', {
                message: 'child process exited with error ' + err
            });

        });

        grunt.on('close', function (code) {

            console.log('child process exited with code ' + code,isSuccess);
            if(isSuccess){
                if (process.platform === 'win32') {

                    //window 先动态生成fis-conf.js再推送文件
                    var allflag = 0;//1:html,res都要发，0：表示 非1
                    function pushres(){
                        var strw = self.http.data.res;
                        var arrw = strw.toString().substring(1,strw.toString().length-1).split(',');
                        if(arrw.length == 1){// match一个目标的时候不用加 “{　}”
                            strw = arrw[0];
                        }

                        var arr2w = '';
                        for(var i=0; i<arrw.length;i++){
                            arr2w += '\"\.' + arrw[i] + '\"'+ ',';
                        }
                        arr2w = arr2w.substring(0,arr2w.toString().length-1);
                        //console.log(arr2w);
                        //console.log(strw);
                        var sendStrw = 'fis.media("rd").set("project.files",['+arr2w+']).set("project.ignore", ["{node_modules}/**",".*","package.json","fis-conf.js","gulpfile.js"]).match("'+strw+'", {deploy:[fis.plugin("http-push", {receiver:"http://10.100.21.102:8999/receiver",to:"/usr/local/qikuweb"}),fis.plugin("http-push", {receiver:"http://10.100.7.19:8999/receiver",to:"/usr/local/qikuweb"})]});';

                        //写入文件
                        //self.emit('abc', {
                        //    message: 'username：'+self.http.data.username
                        //});
                        fs.writeFile(path.join(think.ROOT_PATH,'fis-conf'+un+'.js'), sendStrw, function (err) {
                            if (err) {
                                //console.log('Error', err);
                                self.emit('abc', {
                                    message: '成功配置文件出错！'
                                });
                                return;
                            }
                            //self.emit('abc', {
                            //    message: '推送文件：'+sendStrw
                            //});
                            //self.emit('abc', {
                            //    message: '成功生成配置文件！'
                            //});
                            self.emit('abc', {
                                message: '开始推送文件'
                            });
                            var grunt2w = child.spawn(file, winargs,{cwd:path.join(think.ROOT_PATH)}, {
                                //env: process.env
                            });

                            grunt2w.stdout.on('data', function (chunk) {
                                //console.log('' + chunk);
                                self.emit('abc', {
                                    message: ansiHTML(('' + chunk).replace(/\r\n|\r|\n/img, '<br/>'))
                                });
                            });
                            var isSuccess2w = 1;//1:发布成功 0：发布失败
                            grunt2w.stderr.on('data', function (chunk) {
                                //console.log('stderr--' + chunk);
                                isSuccess2w = 0;
                                self.emit('abc', {
                                    message: '远端机器端口无法访问，发布失败'+chunk
                                });
                            });

                            grunt2w.on('error', function (err) {
                                //console.log('child process exited with error ' + err);
                                self.emit('abc', {
                                    message: 'child process exited with error ' + err
                                });

                            });
                            grunt2w.on('close', function (code) {

                                //console.log('child process exited with code ' + code,isSuccess2w);
                                if(isSuccess2w){
                                    self.emit('abc', {
                                        message: '资源文件发布成功<img width="64" height="64" src="/static/admin/theme/assets/admin/pages/img/iconfont-ok.png"/>'
                                    });
                                    //self.emit('result',self.http.data.id);
                                    //通知所有客户端自动更新
                                    //self.updateallAction();
                                }else{
                                    self.emit('abc', {
                                        message: '资源文件发布失败<img width="64" height="64" src="/static/admin/theme/assets/admin/pages/img/iconfont-shibai.png"/>'
                                    });
                                }
                                if(allflag){
                                    pushhtml();
                                }

                            });

                        });

                    }

                    function pushhtml(){
                        //发布html文件
                        var strw_ = self.http.data.html;
                        var arrw_ = strw_.toString().substring(1,strw_.toString().length-1).split(',');
                        if(arrw_.length == 1){// match一个目标的时候不用加 “{　}”
                            strw_ = arrw_[0];
                        }

                        var arr2w_ = '';
                        for(var i=0; i<arrw_.length;i++){
                            arr2w_ += '\"\.' + arrw_[i] + '\"'+ ',';
                        }
                        arr2w_ = arr2w_.substring(0,arr2w_.toString().length-1);
                        //console.log(arr2w_);
                        //console.log(strw_);
                        var sendStrw_ = 'fis.media("rd").set("project.files",['+arr2w_+']).set("project.ignore", ["{node_modules}/**",".*","package.json","fis-conf.js","gulpfile.js"]).match("'+strw_+'", {deploy:[fis.plugin("http-push", {receiver:"http://10.100.21.102:8999/receiver",to:"/usr/local/qikuweb"}),fis.plugin("http-push", {receiver:"http://10.100.7.19:8999/receiver",to:"/usr/local/qikuweb"})]});';
                        //写入文件
                        fs.writeFile(path.join(think.ROOT_PATH,'fis-conf'+un+'.js'), sendStrw_, function (err) {
                            if (err) {
                                //console.log('Error', err);
                                self.emit('abc', {
                                    message: '成功配置文件出错！'
                                });
                                return;
                            }
                            //self.emit('abc', {
                            //    message: '推送文件：'+sendStrw_
                            //});
                            //self.emit('abc', {
                            //    message: '成功生成配置文件！'
                            //});
                            self.emit('abc', {
                                message: '开始推送文件'
                            });
                            var grunt2w_ = child.spawn(file, winargs,{cwd:path.join(think.ROOT_PATH)}, {
                                //env: process.env
                            });

                            grunt2w_.stdout.on('data', function (chunk) {
                                //console.log('' + chunk);
                                self.emit('abc', {
                                    message: ansiHTML(('' + chunk).replace(/\r\n|\r|\n/img, '<br/>'))
                                });
                            });
                            var isSuccess2w_ = 1;//1:发布成功 0：发布失败
                            grunt2w_.stderr.on('data', function (chunk) {
                                //console.log('stderr--' + chunk);
                                isSuccess2w_ = 0;
                                self.emit('abc', {
                                    message: '远端机器端口无法访问，发布失败'+chunk
                                });
                            });

                            grunt2w_.on('error', function (err) {
                                //console.log('child process exited with error ' + err);
                                self.emit('abc', {
                                    message: 'child process exited with error ' + err
                                });

                            });
                            grunt2w_.on('close', function (code) {

                                //console.log('child process exited with code ' + code,isSuccess2w_);
                                if(isSuccess2w_){
                                    self.emit('abc', {
                                        message: 'html或jsp文件发布成功<img width="64" height="64" src="/static/admin/theme/assets/admin/pages/img/iconfont-ok.png"/>'
                                    });
                                    self.emit('result',{
                                        id:self.http.data.id,
                                        oldstatus:self.http.data.status,
                                        status:'close27'
                                    });
                                    //通知所有客户端自动更新
                                    self.updateallAction();
                                }else{
                                    self.emit('abc', {
                                        message: 'html文件发布失败<img width="64" height="64" src="/static/admin/theme/assets/admin/pages/img/iconfont-shibai.png"/>'
                                    });
                                }
                            });

                        });


                    }
                    if(self.http.data.res && !self.http.data.html){
                        pushres();
                        return;
                    }
                    if(!self.http.data.res && self.http.data.html){
                        pushhtml();
                        return;
                    }
                    if(!self.http.data.res && !self.http.data.html){
                        self.emit('abc', {
                            message: '没有可发布的资源文件与html文件'
                        });
                        return;
                    }
                    if(self.http.data.res && self.http.data.html){
                        allflag = 1;
                        pushres();
                        return;
                    }


                }else{//linux是先更新再发布文件
                    var allflag = 0;//1:html,res都要发，0：表示 非1
                    function pushres(){
                        //linux 先动态生成fis-conf.js再推送文件
                        var str = self.http.data.res;
                        if(!str){
                            return;
                        }
                        var arr = str.toString().substring(1,str.toString().length-1).split(',');
                        ////console.log(arr.length,arr[0],arr[1],arr[2]);
                        if(arr.length == 1){// match一个目标的时候不用加 “{　}”
                            str = arr[0];
                        }
                        var arr2 = '';
                        for(var i=0; i<arr.length;i++){
                            arr2 += '\"\.' + arr[i] + '\"'+ ',';
                        }
                        arr2 = arr2.substring(0,arr2.toString().length-1);

                        //var sendStr = 'fis.media("rd").set("project.files",['+arr2+']).set("project.ignore", ["{node_modules}/**",".*","package.json","fis-conf.js","gulpfile.js"]).match("'+str+'", {deploy:fis.plugin("local-deliver", {to:"/usr/local/resource"})});';

                        //var sendStr = 'fis.media("rd").set("project.files",['+arr2+']).set("project.ignore", ["{node_modules}/**",".*","package.json","fis-conf.js","gulpfile.js"]).match("'+str+'", {deploy:fis.plugin("http-push", {receiver:"http://10.1.21.201:8999/receiver",to:"/usr/local/sugy/res"})});';

                        var sendStr = 'fis.media("rd").set("project.files",['+arr2+']).set("project.ignore", ["{node_modules}/**",".*","package.json","fis-conf.js","gulpfile.js"]).match("'+str+'", {deploy:[fis.plugin("local-deliver",{to:"'+path.join(think.ROOT_PATH)+'"}),fis.plugin("http-push", {receiver:"http://10.100.7.19:8999/receiver",to:"'+path.join(think.ROOT_PATH)+'"}),fis.plugin("local-deliver",{to:"/usr/local/src/qikuweb_"})]});';
                        //写入文件

                        fs.writeFile('/usr/local/src/qikuweb/fis-conf'+un+'.js', sendStr, function (err) {
                            if (err) {
                                //console.log('Error', err);
                                self.emit('abc', {
                                    message: '成功配置文件出错！'
                                });
                                return;
                            }
                            //self.emit('abc', {
                            //    message: '推送文件：'+sendStr
                            //});
                            //self.emit('abc', {
                            //    message: '成功生成配置文件！'
                            //});
                            self.emit('abc', {
                                message: '开始推送文件'
                            });
                            var grunt2 = child.spawn(file, linuxargs,{cwd:linuxcwdpath}, {
                                //env: process.env
                            });

                            grunt2.stdout.on('data', function (chunk) {
                               // //console.log(chunk,'++++++++++++++++++++++++++++',ansiHTML(('' + chunk).replace(/\r\n|\r|\n/img, '<br/>')));

                                self.emit('abc', {
                                    message: ansiHTML(('' + chunk).replace(/\r\n|\r|\n/img, '<br/>'))
                                });
                            });
                            var isSuccess2 = 1;//1:发布成功 0：发布失败
                            grunt2.stderr.on('data', function (chunk) {
                                //console.log('stderr--------------------------' + chunk);
                                isSuccess2 = 0;
                                self.emit('abc', {
                                    message: '远端机器端123口无法访问，发布失败'+chunk
                                });
                            });

                            grunt2.on('error', function (err) {
                                //console.log('child process exited with error ' + err);
                                self.emit('abc', {
                                    message: 'child process exited with error ' + err
                                });

                            });
                            grunt2.on('close', function (code) {

                                //console.log('child process exited with code ' + code,isSuccess2);
                                if(isSuccess2){
                                    self.emit('abc', {
                                        message: '资源文件发布成功<img width="64" height="64" src="/static/admin/theme/assets/admin/pages/img/iconfont-ok.png"/>'
                                    });
                                    if(!allflag){
                                        self.emit('result',{
                                            id:self.http.data.id,
                                            oldstatus:self.http.data.status,
                                            status:'close27'
                                        });
                                        //通知所有客户端自动更新
                                        self.updateallAction();
                                    }

                                }else{
                                    self.emit('abc', {
                                        message: '资源文件发布失败<img width="64" height="64" src="/static/admin/theme/assets/admin/pages/img/iconfont-shibai.png"/>'
                                    });
                                }
                                if(allflag){
                                    pushhtml();
                                }


                            });

                        });
                    }

                    function pushhtml(){
                        //推送html文件
                        //console.log('推送html文件');
                        var str__ = self.http.data.html;
                        //console.log('str__',str__);
                        var arr__ = str__.toString().substring(1,str__.toString().length-1).split(',');
                        ////console.log(arr.length,arr[0],arr[1],arr[2]);
                        if(arr__.length == 1){// match一个目标的时候不用加 “{　}”
                            str__ = arr__[0];
                        }
                        var arr2__ = '';
                        for(var i=0; i<arr__.length;i++){
                            arr2__ += '\"\.' + arr__[i] + '\"'+ ',';
                        }
                        arr2__ = arr2__.substring(0,arr2__.toString().length-1);

                        var sendStr__ = 'fis.media("rd").set("project.files",['+arr2__+']).set("project.ignore", ["{node_modules}/**",".*","package.json","fis-conf.js","gulpfile.js"]).match("'+str__+'", {deploy:[fis.plugin("local-deliver",{to:"'+path.join(think.ROOT_PATH)+'"}),fis.plugin("http-push", {receiver:"http://10.100.7.19:8999/receiver",to:"'+path.join(think.ROOT_PATH)+'"}),fis.plugin("local-deliver",{to:"/usr/local/src/qikuweb_"})]});';
                        //写入文件
                        fs.writeFile('/usr/local/src/qikuweb/fis-conf'+un+'.js', sendStr__, function (err) {
                            if (err) {
                                //console.log('Error', err);
                                self.emit('abc', {
                                    message: '成功配置文件出错！'
                                });
                                return;
                            }
                            //self.emit('abc', {
                            //    message: '推送文件：'+sendStr
                            //});
                            //self.emit('abc', {
                            //    message: '成功生成配置文件！'
                            //});
                            self.emit('abc', {
                                message: '开始推送文件'
                            });
                            var grunt2__ = child.spawn(file, linuxargs,{cwd:linuxcwdpath}, {
                                //env: process.env
                            });

                            grunt2__.stdout.on('data', function (chunk) {
                                //console.log('' + chunk);
                                self.emit('abc', {
                                    message: ansiHTML(('' + chunk).replace(/\r\n|\r|\n/img, '<br/>'))
                                });
                            });
                            var isSuccess2__ = 1;//1:发布成功 0：发布失败
                            grunt2__.stderr.on('data', function (chunk) {
                                //console.log('stderr--' + chunk);
                                isSuccess2__ = 0;
                                self.emit('abc', {
                                    message: '远端机器端口无法访问，发布失败'+chunk
                                });
                            });

                            grunt2__.on('error', function (err) {
                                //console.log('child process exited with error ' + err);
                                self.emit('abc', {
                                    message: 'child process exited with error ' + err
                                });

                            });
                            grunt2__.on('close', function (code) {

                                //console.log('child process exited with code ' + code,isSuccess2__);
                                if(isSuccess2__){
                                    self.emit('abc', {
                                        message: 'html或jsp文件发布成功<img width="64" height="64" src="/static/admin/theme/assets/admin/pages/img/iconfont-ok.png"/>'
                                    });
                                    self.emit('result',{
                                        id:self.http.data.id,
                                        status:'close27'
                                    });
                                    //通知所有客户端自动更新
                                    self.updateallAction();
                                }else{
                                    self.emit('abc', {
                                        message: 'html文件发布失败<img width="64" height="64" src="/static/admin/theme/assets/admin/pages/img/iconfont-shibai.png"/>'
                                    });
                                }
                            });

                        });
                    }
                    if(self.http.data.res && !self.http.data.html){
                        pushres();
                        return;
                    }
                    if(!self.http.data.res && self.http.data.html){
                        pushhtml();
                        return;
                    }
                    if(!self.http.data.res && !self.http.data.html){
                        self.emit('abc', {
                            message: '没有可发布的资源文件与html文件'
                        });
                        return;
                    }
                    if(self.http.data.res && self.http.data.html){
                        allflag = 1;
                        pushres();
                        return;
                    }

                }


            }else{

                if (process.platform === 'win32') {
                    self.emit('abc', {
                        message: '文件发布失败<img width="64" height="64" src="/static/admin/theme/assets/admin/pages/img/iconfont-shibai.png"/>'
                    });
                }else{
                    self.emit('abc', {
                        message: '文件更新失败<img width="64" height="64" src="/static/admin/theme/assets/admin/pages/img/iconfont-shibai.png"/>'
                    });
                }

            }



        });

    }
    execserverAction(self){

        var file='',
            args=[],
            linuxargs=['-c','cd /usr/local/src/qikuweb && fis3 release rd'],
            winargs = ['/s', '/c', 'cd /d E:\\qikusvn\\trunk\\front-web\\qikuweb && fis3 release rd'],
            options = {};
        if (process.platform === 'win32') {
            file = process.env.comspec || 'cmd.exe';
            args = ['/s', '/c', 'cd /d E:\\qikusvn\\trunk\\front-web\\qikuweb'];
// Make a shallow copy before patching so we don't clobber the user's
// options object.
            //options = util._extend({}, options);
            //options.windowsVerbatimArguments = true;
        } else {
            file = '/bin/sh';
            //args = ['-c','ssh -l root 10.1.21.201 /bin/bash /usr/upload/start-tomcat.sh'];
            args =  ['-c','cd /usr/local/src/qikuweb && svn update']

        }
        var ipArr = self.http.data.ipArr;
        var spath = self.http.data.scriptPath;
        var userArr = self.http.data.userArr;
        var passArr = self.http.data.passArr;
        var groupArr = self.http.data.groupArr;
        var count = ipArr.length;
        //标记当前时间
        var time = new Date().getTime();


        //self.emit('abc', {
        //    message: 'ip列表：'+ipArr
        //});
        self.emit('abc', {
            message: '命令脚本：/bin/sh /root/'+spath
        });
        self.emit('abc', {
            message: '命令执行中，请耐心等待,远程连接服务器个数：'+count
        });


        var sshPool = require('ssh-pool');
        var i = 0;
        var useripArr = [];
        for(i;i<count;i++){
            useripArr.push(userArr[i]+"@"+ipArr[i]);
        }
        var pool = new sshPool.ConnectionPool(useripArr);
        try{

            pool.run('/bin/sh /root/'+spath)
                .then(function (results) {
                    ////console.log(results)
                    for(var jj=0;jj<results.length;jj++){
                        ////console.log(results[jj].stdout); // 'server1'
                        // //console.log(results[1].stdout); // 'server2'
                        if(results[jj].stderr){
                            self.emit('abc', {
                                message: '<span style="color:red">'+userArr[jj]+"@"+ipArr[jj]+':error'+results[jj].stdout+'</span>'
                            });
                        }else{
                            self.emit('abc', {
                                message: '<span style="color:green">'+userArr[jj]+"@"+ipArr[jj]+':ok'+'</span>'
                            });
                        }

                    }
                    var time1 = new Date().getTime() - time;
                    self.emit('abc', {
                        message:results.length+'台远程服务器成功接收命令！用时：'+time1/1000+'s'
                    });

                });
        }
        catch(e){
            self.emit('abc', {
                message: 'new sshPool.ConnectionPool error:'+e
            });
        }



        return;

        var sshPool = require('ssh-pool');

       // var pool = new sshPool.ConnectionPool(['root@10.1.21.28','root@10.1.21.27']);

        var connection = new sshPool.Connection({remote: {user: 'root', host: '10.1.21.27',key:'/root/authorized_keys'}});
        var pool = new sshPool.ConnectionPool([connection]);
        pool.run('hostname')
            .then(function (results) {
                //console.log(results[0]); // 'server1'
                //console.log(results[0].stdout); // 'server1'
                ////console.log(results[1].stdout); // 'server2'
                self.emit('abc', {
                    message: results[0].stdout
                });
                //self.emit('abc', {
                //    message: results[1].stdout
                //});
            });
        return;
        //---------------------------------------------------------------------------------
        var i=0;
        var ii = 0;

        var cobjArr = [];
        for(i;i<count;i++){
            cobjArr.push(new Client());
        }
        //console.log(cobjArr.length);
        //console.log(123456)
            var conn1 = new Client();
        var conn2 = new Client();
            conn1.on('ready', function() {
                //console.log('FIRST :: connection ready');
                self.emit('abc', {
                    message:'FIRST :: connection ready1:'+ ipArr[ii]
                });
                conn1.exec('/bin/sh /root/'+spath, function(err, stream) {

                    if (err) {
                        //console.log('FIRST :: exec error: ' + err);
                        self.emit('abc', {
                            message:'FIRST :: exec error: '+err
                        });
                        return conn1.end();
                    }
                    stream.on('end', function() {
                        conn1.end(); // close parent (and this) connection


                            var time1 = new Date().getTime() - time;
                            self.emit('abc', {
                                message:'1执行完毕时间'+time1/1000+'s'
                            });
                    }).on('data', function(data) {
                        //console.log(data.toString());
                        self.emit('abc', {
                            message:data.toString()
                        });

                    });

                });
            }).connect({
                host: ipArr[0],
                username: userArr[0],
                password: passArr[0]
            });



        conn2.on('ready', function() {
            //console.log('FIRST :: connection ready');
            self.emit('abc', {
                message:'FIRST :: connection ready: 2'
            });
            conn2.exec('/bin/sh /root/'+spath, function(err, stream) {

                if (err) {
                    //console.log('FIRST :: exec error: ' + err);
                    self.emit('abc', {
                        message:'FIRST :: exec error: '+ err
                    });
                    return conn2.end();
                }
                stream.on('end', function() {
                    conn2.end(); // close parent (and this) connection


                    var time1 = new Date().getTime() - time;
                    self.emit('abc', {
                        message:'2执行完毕时间'+time1/1000+'s'
                    });
                }).on('data', function(data) {
                    //console.log(data.toString());
                    self.emit('abc', {
                        message:data.toString()
                    });

                });

            });
        }).connect({
            host: ipArr[1],
            username: userArr[1],
            password: passArr[1]
        });


       return;
        //---------------------------------------------------------------------------------
        //for(i;i<ipArr.length;i++){
        //   // (function (i) {
        //    //console.log('out',i,ipArr[i]);
        //    exec('/bin/sh /usr/upload/start-tomcat.sh', function (error, stdout, stderr) {
        //        //console.log('in',i,ipArr[i]);
        //        ii++;
        //        self.emit('abc', {
        //            message: 'ii' +ii
        //        });
        //        if (error !== null) {
        //
        //            self.emit('abc', {
        //                message: '<span style="color:red">'+ipArr[i]+':error'+error+'</span>' +i
        //            });
        //        }else{
        //            self.emit('abc', {
        //                message: '<span style="color:green">'+ipArr[i]+':ok'+'</span>'+i
        //            });
        //
        //        }
        //        if(ii == ipArr.length){
        //            self.emit('abc', {
        //                message:'服务器个数'+ipArr.length
        //            });
        //            var time1 = new Date().getTime() - time;
        //            self.emit('abc', {
        //                message:'执行完毕时间'+time1/1000+'s'
        //            });
        //        }
        //    });
        // //   })(i);
        //
        //}


return;

        //---------------------------------------------------------------------------------

        var conn1 = new Client();

        conn1.on('ready', function() {
            //console.log('FIRST :: connection ready');
            self.emit('abc', {
                message:'FIRST :: connection ready'
            });
            conn1.exec('/bin/sh /root/'+spath, function(err, stream) {
                if (err) {
                    //console.log('FIRST :: exec error: ' + err);
                    self.emit('abc', {
                        message:'FIRST :: exec error: ' + err
                    });
                    return conn1.end();
                }
                stream.on('end', function() {
                    conn1.end(); // close parent (and this) connection
                    var time1 = new Date().getTime() - time;
                    self.emit('abc', {
                        message:'执行完毕时间'+time1/1000+'s'
                    });
                }).on('data', function(data) {
                    //console.log(data.toString());
                    self.emit('abc', {
                        message:data.toString()
                    });

                });

            });
        }).connect({
            host: '10.1.21.27',
            username: 'root',
            password: '!qaz2wsx'
        });
        //---------------------------------------------------------------------------------
        return;
        //下面是递归
        var j = 0;
        do_(spath);
        function do_(_spath){

            if(j >= count){
                var time1 = new Date().getTime() - time;
                self.emit('abc', {
                    message:'执行完毕时间'+time1/1000+'s'
                });
                return;
            }
            //console.log('out',j,ipArr[j]);
         //   exec('ssh -l root '+ipArr[j]+' /bin/sh /usr/upload/start-tomcat.sh', function (error, stdout, stderr) {
                exec('/bin/sh /usr/upload/start-tomcat.sh', function (error, stdout, stderr) {
                //console.log('in',j,ipArr[j]);
                if (error !== null) {

                    self.emit('abc', {
                        message: '<span style="color:red">'+ipArr[j]+':error'+error+'</span>' +(j+1)
                    });
                }else{
                    self.emit('abc', {
                        message: '<span style="color:green">'+ipArr[j]+':ok'+'</span>'+(j+1)
                    });

                }
                j ++;
                do_(_spath);
            });
        }

        return;
        //---------------------------------------------------------------------------------
        //console.log('args',args)
        var cmd =  '/bin/sh /usr/upload/start-tomcat.sh';
        var grunt = child.spawn('ssh', ['-p 22','root@10.1.21.201',cmd], {
            env: process.env,
            maxBuffer: 500*1024 //default:200*1024
        });

        grunt.stdout.on('data', function (chunk) {
            //console.log('' + chunk);
            self.emit('abc', {
                message: ansiHTML(('' + chunk).replace(/\r\n|\r|\n/img, '<br/>'))
            });
        });
        var isSuccess = 1;//1:发布成功 0：发布失败
        grunt.stderr.on('data', function (chunk) {
            //console.log('stderr--' + chunk);
            isSuccess = 0;
            self.emit('abc', {
                message: '远端机器端口无法访问，发布失败'+chunk
            });
        });

        grunt.on('error', function (err) {
            //console.log('child process exited with error ' + err);
            self.emit('abc', {
                message: 'child process exited with error ' + err
            });

        });

        grunt.on('close', function (code) {
            //console.log('close' + code,isSuccess);
                if(isSuccess){
                    if (process.platform === 'win32') {

                    }else{

                    }
                }else{

                }

        });
    }
    downloadlistAction(self){
        //console.log('发送下载中。。。0-2分钟，请耐心等待')
        var filepath = moment().format('YYYYMMDD.h.mm.ss.SSS');//文件夹名

        var file='',
            args=[],
            linuxargs=['-c','cd /usr/local/src/qikuweb && fis3 release rd'],
            winargs = ['/s', '/c', 'cd /d E:\\qikusvn\\trunk\\front-web\\qikuweb && fis3 release rd'],
            args2 = [],//打包fis-conf
            options = {};
        if (process.platform === 'win32') {
            file = process.env.comspec || 'cmd.exe';
            args = ['/s', '/c', 'md E:\\qikusvn\\trunk\\front-web\\qikucms\\www\\upload\\'+filepath];
            args2 = ['/s', '/c', 'cd /d E:\\qikusvn\\trunk\\front-web\\qikucms\\www\\upload\\'+filepath+ ' && fis release -Dompd publish'];


        } else {
            file = '/bin/sh';
            args = ['-c','cd /usr/local/src/qikuweb && svn update'];
            args2 = ['-c', 'cd /usr/local/qikucms/www/upload/'+filepath+ ' && fis release -Dompd publish'];
        }

        //console.log('args',args);

        var grunt = child.spawn(file,args, {
            env: process.env,
            maxBuffer: 500*1024 //default:200*1024
        });

        grunt.stdout.on('data', function (chunk) {
            //console.log('' + chunk);

        });
        var isSuccess = 1;//1:发布成功 0：发布失败
        grunt.stderr.on('data', function (chunk) {
            //console.log('stderr--' + chunk);
            isSuccess = 0;

        });

        grunt.on('error', function (err) {
            //console.log('child process exited with error ' + err);


        });

        grunt.on('close', function (code) {

            //console.log('child process exited with code ' + code,isSuccess);
            if(isSuccess){
                if (process.platform === 'win32') {

                    //window 先动态生成fis-conf.js再推送文件
                    var strw = self.http.data.str;
                    var arrw = strw.toString().substring(1,strw.toString().length-1).split(',');
                    if(arrw.length == 1){// match一个目标的时候不用加 “{　}”
                        strw = arrw[0];
                    }

                    var arr2w = '';
                    for(var i=0; i<arrw.length;i++){
                        arr2w += '\"\.' + arrw[i] + '\"'+ ',';
                    }
                    arr2w = arr2w.substring(0,arr2w.toString().length-1);
                    var sendStrw = 'fis.media("rd").set("project.files",['+arr2w+']).set("project.ignore", ["{node_modules}/**",".*","package.json","fis-conf.js","gulpfile.js"]).match("'+strw+'", {deploy:[fis.plugin("tar", {filename: "qikuweb.tar.gz"}),fis.plugin("local-deliver", {to: "E:/yulong/EC/web/qikucms/www/upload/'+filepath+'"})]});';

                    //var sendStrw = 'fis.media("rd").set("project.files",['+arr2w+']).set("project.ignore", ["{node_modules}/**",".*","package.json","fis-conf.js","gulpfile.js"]).match("'+strw+'", {deploy:fis.plugin("local-deliver",{to:"E:/yulong/EC/web/qikucms/www/upload/'+filepath+'"})});';
                    //写入文件
                    fs.writeFile('E:\\qikusvn\\trunk\\front-web\\qikuweb\\fis-conf.js', sendStrw, function (err) {
                        if (err) {
                            //console.log('Error', err);

                            return;
                        }

                        var grunt2w = child.spawn(file, winargs, {
                            //env: process.env
                        });

                        grunt2w.stdout.on('data', function (chunk) {
                            //console.log('' + chunk);

                        });
                        var isSuccess2w = 1;//1:发布成功 0：发布失败
                        grunt2w.stderr.on('data', function (chunk) {
                            //console.log('stderr--' + chunk);
                            isSuccess2w = 0;

                        });

                        grunt2w.on('error', function (err) {
                            //console.log('child process exited with error ' + err);

                        });
                        grunt2w.on('close', function (code) {

                            //console.log('child process exited with code ' + code,isSuccess2w);
                            if(isSuccess2w){
                                //上传成功后打包文件

                                    //console.log('成功生成压缩文件',think.RESOURCE_PATH+'/upload/'+filepath+'/qikuweb.tar.gz')
                                    //self.download('/upload/'+filepath+'/qikuweb.tar.gz');
                                    self.emit('downloadpath',{
                                        path:filepath,
                                        id:self.http.data.id
                                    });


                            }else{

                            }
                        });

                    });


                }else{//linux是先更新再发布文件
                    //window 先动态生成fis-conf.js再推送文件
                    var strw = self.http.data.str;
                    var arrw = strw.toString().substring(1,strw.toString().length-1).split(',');
                    if(arrw.length == 1){// match一个目标的时候不用加 “{　}”
                        strw = arrw[0];
                    }

                    var arr2w = '';
                    for(var i=0; i<arrw.length;i++){
                        arr2w += '\"\.' + arrw[i] + '\"'+ ',';
                    }
                    arr2w = arr2w.substring(0,arr2w.toString().length-1);
                    var sendStrw = 'fis.media("rd").set("project.files",['+arr2w+']).set("project.ignore", ["{node_modules}/**",".*","package.json","fis-conf.js","gulpfile.js"]).match("'+strw+'", {deploy:[fis.plugin("tar", {filename: "qikuweb.tar.gz"}),fis.plugin("local-deliver", {to: "/usr/local/qikucms/www/upload/'+filepath+'"})]});';
                    //写入文件
                    fs.writeFile('/usr/local/src/qikuweb/fis-conf.js', sendStrw, function (err) {
                        if (err) {
                            //console.log('Error', err);

                            return;
                        }
                        //console.log('生成发布文件');
                        var grunt2w = child.spawn(file, linuxargs, {
                            //env: process.env
                        });

                        grunt2w.stdout.on('data', function (chunk) {
                            //console.log('' + chunk);

                        });
                        var isSuccess2w = 1;//1:发布成功 0：发布失败
                        grunt2w.stderr.on('data', function (chunk) {
                            //console.log('stderr--' + chunk);
                            isSuccess2w = 0;

                        });

                        grunt2w.on('error', function (err) {
                            //console.log('child process exited with error ' + err);

                        });
                        grunt2w.on('close', function (code) {

                            //console.log('开始压缩打包文件 ' + code,isSuccess2w);
                            if(isSuccess2w){
                                //上传成功后打包文件
                                //console.log('成功生成压缩文件',think.RESOURCE_PATH+'/upload/'+filepath+'/qikuweb.tar.gz')
                                //self.download('/upload/'+filepath+'/qikuweb.tar.gz');
                                self.emit('downloadpath',{
                                    path:filepath,
                                    id:self.http.data.id
                                });

                            }else{

                            }
                        });

                    });

                }


            }else{

                if (process.platform === 'win32') {

                }else{

                }

            }



        });

    }

};