'use strict';
/**
 * 登录控制
 */

export default class extends think.controller.base {
  init(http){
    super.init(http);
    //model
    this.usersmodel = this.model("users");
  }
  async __before(){
    let token = await this.session("qkToken");
    this.assign({"qktoken": token});
  }
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {
    let userinfo = await this.session("userinfo");
    //已登录
    if(userinfo){
      this.redirect("/admin/index/");
    }
    return this.display();
  }
  /**
   * 登录接口
   * @return {[type]} [description]
   */
  async loginAction(self){
    //GET请求
    if(self.http.isGet()){
      return this.action("login","index");
    }
    //Post
    if(self.http.isPost()){
      let username = self.http.param('username') || null;
      let password = self.http.param('password') || null;
      let url = self.http.param('url') || null;
      if( username==null ){
        return self.fail(1002,'username is null,用户名不能为空');
      }
      if(password == null){
        return self.fail(1003,"passwords is null,密码不能为空");
      }
      //查询
      
      await this.usersmodel.manualLogin(username,password,function(msg,obj){
        if(msg){//错误
          return self.fail(1001,'login error。'+msg);
        }else{
          self.session("userinfo",{"username": obj.username,
                            "pass": obj.pass,
                            "styleName": obj.styleName,
                            "date": obj.date,
                            "roles":obj.roles
                          });
          //此处应该做url跳转判断
          //监测url是否合法
          // if(url) {
          //   let val = (/^(https?:\/\/)?[\w\-.]+\.(qiku\.com|360\.com|360\.cn)($|\/|\\)/i).test(url)||(/^(https?:\/\/)?(127\.0\.0\.1)($|\/|\\)/i).test(url)||(/^[\/\\][^\/\\]/i).test(url) ? true : false;
          //   if(val)
          //     return self.redirect(url);
          // }
            return self.success("ok");
        }
      });
    }
  }
  /**
   * 退出登录接口
   * @return {[type]} [description]
   */
  async logoutAction(){
    //回收用户session
    //await this.session();
    await this.session('userinfo', null);
    return this.display('index');
  }
  /**
   * 管理员添加用户
   * @return {[type]} [description]
   */
  async adduserAction(self){

  }
  /**
   * 用户注册
   */
  async registerAction(self){
    let name = self.http.param('username') || null;
    let pass = self.http.param('password') || null;
    let power = self.http.param('power') || null;
    if( name==null ){
      return self.fail(1002,'username is null,用户名不能为空');
    }
    if(pass == null){
      return self.fail(1003,"passwords is null,密码不能为空");
    }
    let obj = {"username": name,"pass": pass,"power": power};
    //写入数据库
    await this.usersmodel.addUser(obj, res => {
            if (res == 'username-taken') {
              return  self.fail(1002,'username is null,用户名不能为空');
            } else {
              return  self.success();
            }
        });
  }



};
