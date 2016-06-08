'use strict';
/*接收上传文件的处理*/
import fs from 'fs';
import path from 'path';
import moment from "moment";
import Base from './base.js';
import config from '../config/upload.js';

export default class extends Base {
  /** 入口 **/
  async indexAction(self) {
    return self.display();
  }

  /**
   * 图片上传功能
   * @return {Promise} [pic or listofpic]
   */
  async uploadAction(self) {
  	//这里的 key 需要和 form 表单里的 name 值保持一致
    let file = null;
    let type = 'image';//默认image
    if(this.file('image') !== undefined ){//图片
      type ="image";
      file = think.extend({}, this.file('image'));
    }else if(this.file('video') !== undefined){//视频
      type ="video";
      file = think.extend({}, this.file('video'));
    }else if(this.file('file') !== undefined){//文件
      type ="file";
      file = think.extend({}, this.file('file'));
    }

    if(file[0] !== undefined){//多个文件
      let arr=[];
      for(let item in file)
        arr.push(await this.filehandle(type,file[item]));
      file = arr;
    }else{
      file = await this.filehandle(type,file)
    }
    return file;
  }

  /**
   * 文件上传写入功能
   * type 上传类型   file 上传的文件  option 配置操作
   */
  async filehandle(type,file,option){
    //上传类型判断的配置
    if(type == ""|| type == undefined){
      return {"state": "fail","code":901,"msg":"上传的文件类型错误"};
    }
  	//文件大小判断
  	if(file.size > config[type+'MaxSize']){
  		return {"state": "fail","code":602,"msg":"文件大小超出上传限制"+config[type+'MaxSize']};
  	}
  	 //文件路径
    let filepath = file.path;
    console.log(filepath);
    let momentpath = moment().format('YYYY/MM/DD');
    //文件上传后，存放路径
    let uploadPath = think.RESOURCE_PATH + '/static/upload/' + momentpath;
    //检测存放路径,否则创建
    if(!think.isDir(uploadPath)) think.mkdir(uploadPath);
    //文件保存路径和名称
    file.path = uploadPath + '/' + path.basename(filepath);
    console.log(file.path);
    //保存文件
    fs.renameSync(filepath, file.path);
    //监测是否上传成功
    if(!think.isFile(file.path)){
    	return this.fail(505,"服务器保存文件时出错");
    }
    //去除物理路径 前缀部分
    file.path = file.path.replace(think.RESOURCE_PATH,'');
    //存储图片
   // console.log('file',file);
    //返回文件保存信息
    return file;

  }

  /*读取文件//todo
  *
  */

}