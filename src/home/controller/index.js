'use strict';

import fs from 'fs';
import path from 'path';
import Base from './base.js';

export default class extends Base {

  /**
   * index actions
   * @return {Promise} []
   */
  async indexAction(self) {
    //auto render template file index_index.html
    //think.cache("index",null); //强制清楚缓存
    let index = await think.cache("index", function(){
     // 获取文件内容
      return fs.readFileSync(path.join(__dirname, '../config/index.json'),'utf-8');//think.config("index");
    });
    //将json 转换
    index = JSON.parse(index);
    this.assign(index);
    return this.display();

  }
  //获取文件内容
  getContent(filePath){
    //将readFile方法包装成Promise
    let readFilePromise = think.promisify(fs.readFile, fs);
    //读取文件内容
    return readFilePromise(filePath, "utf8");
   
  }
    
}
