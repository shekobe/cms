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
        this._model = this.model('outlets');
    }

    /**
     * 获取网点省市数据
     * @param  {[type]} self [description]
     * @return {[type]}      [description]
     */
    async outletsarea(self){
        let result = await this.model('outletsarea').select();
        return result;
    }


    /** 入口 **/
    async indexAction(self) {
        let city = self.param('cityId') || '';
        let province = self.param('provId') || '';
        let page = self.param("page") || 1;

        let area = await self.outletsarea();
        //console.log('area',area);
        area.unshift({
            "cityCode" : "0",
            "cityId" : "0",
            "cityName" : "-- 所有城市 --",
            "provinceCode" : "0",
            "provinceId" : "0",
            "provinceName" : "全国"
        });
        //获取省份
        let provlist = function(){
            let result =[],string = '';
            for(let i in area){
                if(area[i].provinceId){
                    let temp = [area[i].provinceId,area[i].provinceName];
                    if(string.indexOf(area[i].provinceName) < 0){
                        string += area[i].provinceName+',';
                        result.push(temp);
                    }
                }

            }
            return result;
        }();

        //确定省市地区
        if(city != ''){//取cityid
            let itcity = null;
            for(let i in area){
                if(city == area[i].cityId){
                    itcity = area[i]; break;
                }
            }
            if(itcity == null){
                province = '0'; city = '0';//默认广东深圳
            }else{
                province = itcity.provinceId; city = itcity.cityId;
            }
        }else{//取默认provenct
            if(province == '' || provlist.toString().indexOf(province) < 0 ){//设置默认省份
                province = '0'; city = '0';//默认广东深圳
            }
        }
        //获取城市列表
        let citylist = function(){
            let result = [];
            for(let i in area){
                if(area[i].provinceId == province)
                    result.push(area[i]);
            }
            return result;
        }();
        //防止疏漏设置默认
        if(city == ''){
            city = citylist[0].cityId;
        }
        self.assign("currentprov", province);
        self.assign("currentcity", city);
        self.assign("provlist", provlist);
        self.assign("citylist", citylist);
        self.assign("area", JSON.stringify(area));
          //  console.log(citylist);
        return self.display();
    }

    //显示文章列表
    async listAction(self) {
        let page = self.http.param('page') || 1;
        //获取文章列表
        let articleList2 = await self._model.getList(page, 5,'','','createtime DESC');
        //获取热门文章列表
        let data = await self._model.getList(1, 6,'','');

        self.success(data);

    }

    async gettepmlistAction(self) {
        let page = self.http.param("page") || 1;
        let nums = self.http.param("nums") || 10;

        let provId = self.http.param("provId") || '';
        let cityId = self.http.param("cityId") || '';
        let search = self.http.param("search") || '';
        let data = await self.getList(page, nums, search,provId,cityId);
        //console.log('data',data);
        self.success(data);
    }

    /**
     * 获取分页列表数据
     * page -- 第几页   nums 每页多少数据
     * releasetype 文件类型  defalult 虚拟文件 home  view/home下的物理文件
     * 查询
     */
    async getList(page,nums,search,provId,cityId,order_){
        let data = null;
        let self = this;
        let query = {};
        let order = order_ || 'PK ASC';

        if(search){
            let queryReg = new RegExp(".*"+search+'.*');
            query = {$or: [{PK:queryReg}, {businessAddress:queryReg},
            {netName:queryReg},
            {provinceName:queryReg},
                {cityName:queryReg}]};
        }
        if(provId && provId !=0 ){
            query.provinceId = provId;
        }
        if(cityId && cityId !=0){
            query.cityId = cityId;
        }
        data = await self._model.where(query).order(order).page(page,nums).countSelect();


        return data || null;
    }




    /*显示详情页或修改内容*/
    async detailAction(self) {
        let city = self.param('cityId') || '';
        let province = self.param('provId') || '';
        let id = self.http.param("networkid") || '';
        let data =  {"cityId":'280',"provinceId":'260'};
        if(id){//修改
            data = await this._model.where({_id:id}).find();


        }else{//新增

        }

        let area = await self.outletsarea();

        //获取省份
        let provlist = function(){
            let result =[],string = '';
            for(let i in area){
                if(area[i].provinceId){
                    let temp = [area[i].provinceId,area[i].provinceName];
                    if(string.indexOf(area[i].provinceName) < 0){
                        string += area[i].provinceName+',';
                        result.push(temp);
                    }
                }

            }
            return result;
        }();

        //
        //确定省市地区
        if(city != ''){//取cityid
            let itcity = null;
            for(let i in area){
                if(city == area[i].cityId){
                    itcity = area[i]; break;
                }
            }
            if(itcity == null){
                province = data.provinceId; city = data.cityId;//默认广东深圳
            }else{
                province = itcity.provinceId; city = itcity.cityId;
            }
        }else{//取默认provenct
            if(province == '' || provlist.toString().indexOf(province) < 0 ){//设置默认省份
                province = data.provinceId; city = data.cityId;//默认广东深圳
            }
        }
        //
        //获取城市列表
        let citylist = function(){
            let result = [];
            for(let i in area){
                if(area[i].provinceId == province)
                    result.push(area[i]);
            }
            return result;

        }();
        //防止疏漏设置默认
        if(city == ''){
            city = citylist[0].cityId;
        }
        self.assign("currentprov", province);
        self.assign("currentcity", city);
        self.assign("provlist", provlist);
        self.assign("citylist", citylist);
        self.assign("area", JSON.stringify(area));

        this.assign({"template": data});
        return self.display();
    }

    /*根据类型Id返回类型列表*/




    /** 获取页面内容 **/
    async gettempAction(self) {
        let id = self.http.param("id");
        let data = await self.gettempbyid(id);
        self.success(data);
    }


    //启用 禁用 内容

    async setstatusAction(self){
        let ids = self.http.param("ids");
        let status = self.http.param("status");
        let idArr = ids.split(',');
        let newArr = [];
        for(var i=0;i<idArr.length;i++){
            if(idArr[i]){
                let item = mongodb.ObjectID(idArr[i]);
                newArr.push(item);
            }

        }
        let result = await self.setStatus_(newArr,status);
        self.success(result);

    }

    async setStatus_(ids,status){
        let obj = {};
        obj.enabledFlag = status;
        let res = await this._model.where({_id: {"$in":ids}}).update(obj);
        return res;
    }
    //多选删除
    async delmutiAction(self){
        let ids = self.http.param("ids");
        let updateby = self.http.param("updateby");
        let idArr = ids.split(',');
        let newArr = [];
        for(var i=0;i<idArr.length;i++){
            if(idArr[i]){
                let item = mongodb.ObjectID(idArr[i]);
                newArr.push(item);
            }

        }
        let result = await self._model.where({_id: {"$in":newArr}}).delete();
        self.success(result);
    }



    /** 通过id删除 **/
    async deldataAction(self) {
        let id = self.http.param('id');
        //
        if (!id)  return self.fail(606, 'param is null');
        let result = await self._model.where({_id:id}).delete();
        self.success(result);
    }

    /* update Geocoder by id*/
    async updategeoAction(self){
        let id = self.http.param('id');
        let lat = self.http.param('lat');
        let lng = self.http.param('lng');
        if (!id || !lat || !lng)  return self.fail(606, 'param is null');
        let result = await self._model.where({_id:id}).update({"latitude":lat,
            "longitude" :lng});
        self.success(result);
    }



    /**
     * 通获取svnlogs信息
     */
    async addlistAction(self) {
        //auto render template file index_index.html
        if (self.http.isPost()) {
            let result = await self._model.add({
                "PK" : self.http.param('id'),
                "id" : self.http.param('id'),
                "buildLevel" : self.http.param('buildLevel'),
                "businessAddress" : self.http.param('businessAddress'),
                "businessHours" : self.http.param('businessHours'),
                "cityCode" : self.http.param('cityCode'),
                "cityId" : self.http.param('cityId'),
                "cityName" : self.http.param('cityName'),
                "createdBy" : self.http.param('createdBy'),
                "creationDate" :self.http.param('creationDate'),
                "img" : self.http.param('img'),
                "isDeleted" :self.http.param('isDeleted'),
                "latitude" : self.http.param('latitude'),
                "longitude" :self.http.param('longitude'),
                "maintainType" : self.http.param('maintainType'),
                "netCode" : self.http.param('netCode'),
                "netName" : self.http.param('netName'),
                "netType" : self.http.param('netType'),
                "servicePhone" : self.http.param('servicePhone'),
                "provinceCode" :self.http.param('provinceCode'),
                "provinceId" :  self.http.param('provinceId'),
                "provinceName" :self.http.param('provinceName'),
                "updatedBy" : self.http.param('updatedBy'),
                "time" : self.http.param('time'),
                "enabledFlag" :self.http.param('enabledFlag')
            });
            self.success(result);
        }

    }



    /**
     * 更新svnlogs表
     *
     */
    async updatedataAction(self) {
        var res = await self._model.where({_id:self.http.param('_id')}).update({
            "PK" : self.http.param('id'),
            "id" : self.http.param('id'),
            "buildLevel" : self.http.param('buildLevel'),
            "businessAddress" : self.http.param('businessAddress'),
            "businessHours" : self.http.param('businessHours'),
            "cityCode" : self.http.param('cityCode'),
            "cityId" : self.http.param('cityId'),
            "cityName" : self.http.param('cityName'),
            "createdBy" : self.http.param('createdBy'),
            "creationDate" :self.http.param('creationDate'),
            "img" : self.http.param('img'),
            "isDeleted" :self.http.param('isDeleted'),
            "latitude" : self.http.param('latitude'),
            "longitude" :self.http.param('longitude'),
            "maintainType" : self.http.param('maintainType'),
            "netCode" : self.http.param('netCode'),
            "netName" : self.http.param('netName'),
            "netType" : self.http.param('netType'),
            "servicePhone" : self.http.param('servicePhone'),
            "provinceCode" :self.http.param('provinceCode'),
            "provinceId" :  self.http.param('provinceId'),
            "provinceName" :self.http.param('provinceName'),
            "updatedBy" : self.http.param('updatedBy'),
            "time" : self.http.param('time'),
            "enabledFlag" :self.http.param('enabledFlag')

        });
        self.success(res);
    }


}



