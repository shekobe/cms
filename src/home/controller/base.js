'use strict';
import fs from 'fs';
import path from 'path';
import whitelist from "../../common/config/whitelist.js";//白名单

export default class extends think.controller.base {
  /**
   * 前面前置处理(公共头部文件)
   * @return {[type]} [description]
   */
  async __before() {
    // let userinfo = yield this.session("user");
    // 默认头部seo信息
    //this.assign({
    //  title: "360奇酷网-360奇酷商城官网，提供360奇酷智能手机、大神手机、360奇酷智能硬件等产品的购买和预约",
    //  keywords: "360奇酷,奇酷官网,奇酷手机,360奇酷手机,大神手机,奇酷社区,奇酷青春版,奇酷旗舰版,双摄像头,双微信,360周鸿祎,老周",
    //  description: "奇酷手机商城官网是提供奇酷手机系列（奇酷青春版、奇酷旗舰版）、大神手机系列（大神F1、大神F2、大神Note、大神X7、大神1S）、奇酷智能硬件的销售，手机皮套、贴膜、电池、保护壳、移动电源、有线耳机、蓝牙耳机、智能手环、自拍杆、USB数据线均有销售）"
    //});
    ////菜单信息
    //let category = await think.cache("category", function(){
    //   return fs.readFileSync(path.join(__dirname, '../config/category.json'),'utf-8');
    //});
    ////将json 转换
    //category = JSON.parse(category);
    //this.assign(category);
  }

  /**
   * some base method in here
   */
  async indexAction() {
    
  }
  /**
   * 验证请求中的 token
   * @param  {[type]} self [description]
   * @return {[type]}      [description]
   */
  async checkToken(self){
    let cookie = self.cookie('qkToken');

    //let session = sel.session();

    // HttpServletRequest req = (HttpServletRequest)request; 
    //  HttpSession s = req.getSession(); 

    //  // 从 session 中得到 csrftoken 属性
    //  String sToken = (String)s.getAttribute(“csrftoken”); 
    //  if(sToken == null){ 

    //     // 产生新的 token 放入 session 中
    //     sToken = generateToken(); 
    //     s.setAttribute(“csrftoken”,sToken); 
    //     chain.doFilter(request, response); 
    //  } else{ 

    //     // 从 HTTP 头中取得 csrftoken 
    //     String xhrToken = req.getHeader("csrftoken"); 

    //     // 从请求参数中取得 csrftoken 
    //     String pToken = req.getParameter(“csrftoken”); 
    //     if(sToken != null && xhrToken != null && sToken.equals(xhrToken)){ 
    //         chain.doFilter(request, response); 
    //     }else if(sToken != null && pToken != null && sToken.equals(pToken)){ 
    //         chain.doFilter(request, response); 
    //     }else{ 
    //         request.getRequestDispatcher(“error.jsp”).forward(request,response); 
    //     } 
    //  }
  }
  /**
   * js api请求处理
   * @param  {[type]} self [description]
   * @return {[type]}      [description]
   */
  async apicheckReferer(self){
    // 从 HTTP 头中取得 Referer 值
   let referer=self.referrer(); 
   // 判断 Referer 
   if(referer != null){
      whitelist.forEach( function(element, index) {
         if(element.test(referer)){
          return true;
         }
       });
      return false;
   }else{
    return  false;//self.fail(405,"Invalid requests , Operation Not Permitted ! ")
   }
  }
  /**
  * 模板渲染方法
  * @return {[type]} [description]
  */
  renderc(file){
  if(file){
    let len = file.split('/').length;
    if(len == 1 || len == 2){
      return this.display(file);
    }else{
      return this.display('${this.http.module}'+file);
    }
  }else{
    return this.display();
  }
 }
 /**
 * 验证是否为智能手机
 * @ return {bool}
 */
 checkMobile(agent){
    let userAgent = agent || this.http.userAgent();
    let flag = false;
    // mobile
    let regmobile = /iPad|iPod|iPhone|Android|BlackBerry|SymbianOS|SCH-M\d+|Opera Mini|Windows (CE|Phone)|Nokia|SonyEricsson|webOS|PalmOS|phone|wap|MQQBrowser|Mobile/ig;
    //pc
    let regpc =/Macintosh|windows NT/ig;
    //手机判断
    if(regmobile.test(userAgent.toLowerCase())) flag = true;
    return flag;
 }
}
