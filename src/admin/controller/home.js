'use strict';
/**
 * 前台内容管理
 **/
import Base from './base.js';
import fs from 'fs';
import path from 'path';
export default class extends Base {
    init(http) {
        super.init(http);
        this._model = this.model('homemenu');
    }
    //入口
    async indexAction(){
       return this.display();
    }
    //顶部 menu category 
    //get 获取，post 存储
    async menuAction(){
        if(this.http.isGet()){//获取列表
            let id = this.http.get('id')|| '';
            let menutype = this.http.get('type')|| 'menu';
            let page  = this.http.get('page') || 1;//percount
            let menu ='';
            if(id){//单条数据
                menu = await this._model.getData(id);
            }else if(page == 0){
                menu = await this._model.getAllList({'type':menutype}) //获取列表
            }else{//获取列表
                menu = await this._model.getList({'type':menutype},page) //获取列表
            }
            return this.success(menu);//只渲染menu部分
        }else if(this.http.isPost()){
            let menu ={};
            menu ={
            parent:this.http.post('parent')||0,//父级
            name:this.http.post('name'),//名称
            href:this.http.post('href'),//链接
            target:this.http.post('target')||'_self',//打开方式
            sort:parseInt(this.http.post('sort'))|| 1,//排序
            info:this.http.post('info')|| '',//备注信息
            pic:this.http.post('pic')|| '',//图片链接
            price:this.http.post('price')|| '',//价格
            icon:this.http.post('icon')||'',//图标
            other:this.http.post('other')||'',//其他信息或购买链接
            type:this.http.post('type')||'category' };
            //参数缺失
            if(menu.name == '' || menu.href =='') return this.fail('保存失败，参数缺失，请检查所传参数项！');

            let result ='';
            if(this.http.post('id')){//修改
                menu._id = this.http.post('id');
                result = await this._model.updateData(menu);
            }else{//新加
                result = await this._model.addData(menu);
            }
            return result? this.success(result):this.fail(result);
        }
    }
    //删除
    async menudelAction(){
        if(this.http.isGet()){//获取列表
            let id = this.http.get('id')|| '';
            let menu ='';
            if(id){//单条数据
                menu = await this._model.delData(id);
            }
            return this.success(menu);//只渲染menu部分
        }
    }
    //logo更换
    //get 获取，post 存储
    async logoAction(){

    }
    //首页 商品类处理
    async productAction(){
        let menutype = this.http.get('type')|| 'index';
        let parent = this.http.get('search')|| '';
        let page  = this.http.get('page') || 1;//percount
        let menu = '';
        if(page == 0){
            menu = await this._model.getAllList({'type':menutype,"parent":parent}) //获取列表
        }else{//获取列表
            menu = await this._model.getList({'type':menutype,"parent":parent},page) //获取列表
        }
        return this.success(menu);//只渲染menu部分
    }
    //菜单生成更新
    async webmenuAction(){
        let menu = await this._model.getAllList({'type':'menu'});
        let category = await this._model.getAllList({'type':'category'});
        let json = {"menu":menu.data,"category":category.data};
        let result = await this.filedata('category.json',json);
        return this.success(result);
    }//think.cache("category",null); //强制清楚缓存
    //更新首页数据
    async webindexAction(){
        let index = await this._model.getAllList({'type':'index'});
        let result = await this.filedata('category.json',index);
        return this.success(result);
    }
    async refreshcacheAction(){
        let type  = this.http.get('type') || 'category';
        let data = await this.filedata(type+'.json');
        think.cache(type, data);
        return this.success("refresh cache "+type+" true");
    }
    //获取或写入json
    async filedata(file,content){
        if(!content)
            return fs.readFileSync(path.join(__dirname, '../../home/config/'+file),'utf-8');
        //写入文件
        fs.writeFileSync(path.join(__dirname, '../../home/config/'+file),content,'utf-8');
    }
}