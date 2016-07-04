'use strict';

import Base from './base.js';
import fs from 'fs';
import _ from "underscore";
import ioRedis from "ioredis";
import captchaconfig from '../config/captcha.js';
import ioredis_config from "../config/ioredis.js";

export default class extends Base {
    init(http){
        super.init(http);
        this.imageOptions = captchaconfig;
    }

    /**
     * 获取验证码
     * @return {[type]} [description]
     */
    async indexAction(self){

        let goodsId =  self.param('goodsId') || '';
        if(goodsId != '5043' && goodsId != '5012' && goodsId != '5035' && goodsId !='5078' && goodsId != '1651' && goodsId != '015012' && goodsId != '015035' && goodsId != '015078'){
            return self.isJsonp() ? self.jsonp(null) : self.json(null);
        }
        this.rds = ioredis_config.rds.pos;
        self.createconnectredis(this.rds);
        //匹配商品抢购时间是否在时间段
        let goodsTime = await think.cache("fe_rush_"+goodsId, () => {
            return self.getredis('fe_rush_'+goodsId) || false;
        });


        console.log('goodsTime-----',goodsId,goodsTime);
        let currentTimemap = Date.now();
        //抢购商品判断是否在购买时间段
        if(goodsTime){
            let goodsisbuy = false;
            let timetype = null; //每个抢购时段用户只能抢一次

            let goodsTimearr = goodsTime.split(',');
            for(let i=0;i<goodsTimearr.length;i++){
                let vallist = goodsTimearr[i].split('-');
                if(currentTimemap > parseInt(vallist[0]) && currentTimemap < parseInt(vallist[1])){
                    timetype = parseInt(vallist[0])
                    goodsisbuy = true;
                    break;
                }
            }
            //不在购买时间内
            if(!goodsisbuy){
                console.log('不在购买时间内11');
                self.disconnectredis();
                return self.isJsonp() ? self.jsonp(null) : self.json(null);
            }
        }else{
            console.log('不在购买时间内22')
            self.disconnectredis();
            return self.isJsonp() ? self.jsonp(null) : self.json(null);
        }

        let num = self.param('v') || 4;
        let uid = self.param('hash') || self.cookie('userid') || think.uuid(12);

        //获取验证码
        let captcha = await self.generate(num);

        //传给用户id
        captcha.result.hash = uid;
        captcha.result.rds = this.rds;
        let data = await this.getredis('graprush_capt_'+uid);
        //检查是否使用过验证
        if( data && (Date.now() - parseInt(data.t)) < 1000){
            self.disconnectredis();
            let msg = {'errno':0,'errmsg':'query is to fast'};
            return self.isJsonp() ? self.jsonp(null) : self.json(null);
        }
        data = { validtime : 0 };
        data.validtime = parseInt(data.validtime) + 1;
        data = think.extend({}, data, captcha);
        data.t = Date.now();
        this._redis.set('graprush_capt_'+uid, JSON.stringify(data));
        self.disconnectredis();
        
        //返回结果
        self.isJsonp() ? self.jsonp(captcha.result) : self.json(captcha.result);
    }
    /**
     * 请求获取图片
     */
    async loadimgAction(self){
      let rds = self.param('rds') || '';
      let imghash = self.param("v") || '';
      let uid = self.param("hash") || self.cookie('userid');
      if(!imghash && !uid){
          return self.error('Param error');
      }

      //get redis user info
      self.createconnectredis(rds);
      let data = await self.getredis('graprush_capt_'+uid);
      self.disconnectredis();
      data = JSON.parse(data);
      if(!data || data.result.image != imghash){ return self.error('not fond'); }
      //img path
      let imgPath = think.RESOURCE_PATH +'/static/img/rush/captcha/'+data.validate.path;//.replace(/\.png/gi, '@2x.png');
      //test
      //let imgPath = think.RESOURCE_PATH +'/static/img/rush/captcha/cat@2x.png';
      
      //check file path
      if(!think.isFile(imgPath))
          return self.error('not fond');


      //获取文件流
      let stream = await fs.readFileSync(imgPath);
        self.type('image/png', false);
        self.write(stream, "binary");
        self.end();
    }
    /**
     * 验证 验证码
     * @return {[type]} [description]
     */
    async validateAction(self){
        let rds = self.param('rds') || '';
        let key = self.param('v') || null;
        let uid = self.param('hash') || self.cookie('userid');

        //非法请求
        if(!key && !uid){ 
          //return self.error('not fond');
            return (self.http.isJsonp()) ? this.jsonp('') : this.http.json('');
        }
        //reids
        self.createconnectredis(rds);
        let data = await self.getredis('graprush_capt_'+uid);
        if(!data){ 
          self.disconnectredis();
         // return self.error('error');
            return (self.http.isJsonp()) ? this.jsonp('') : this.http.json('');
        }
        data = JSON.parse(data);
        
        //验证条件不符合
        if(data.isvalid || (Date.now() - parseInt(data.t)) < 1000){
          self.disconnectredis();
          //return self.error('validate error');
            return (self.http.isJsonp()) ? this.jsonp('') : this.http.json('');
        }
        data.isvalid = 1;
        self._redis.set('graprush_capt_'+uid, JSON.stringify(data));
        self.disconnectredis();
        //验证不通过
        if(key !== data.validate.name ){
          //return self.error('validate errors')
            return (self.http.isJsonp()) ? this.jsonp('') : this.http.json('');
        }
        let token = await this.gettoken();
       // return self.success(token);
        return (self.http.isJsonp()) ? this.jsonp(token) : this.http.json(token);
    }

    async gettoken(self){

        let tok = '';
        let getR = function(tiems,count){
          var pro = think.promisify(global.TokenApi.issue, global.TokenApi);
          return pro(tiems,count);
        };
        tok = await getR(150,1).then(function(token){
          return token;
        }).catch(function(err){
          console.log('0000')
          return 'err'
        });
        return tok;
    }

    /**
     * [generate 生成随机图片和问题]
     * @return {[type]} [返回选项个数]
     */
    async generate ( num ){
        let imgnames =[];
        let obj ={};
        //强制转换成数字
        num = parseInt(num, 10);
        //初始化个数
        if( !num || !_.isNumber(num) || isNaN(num) || num < 4) {
            num = 4;
        }
        //打乱排列顺序
        //this.imageOptions = _.shuffle( this.imageOptions );
        //从数组中选取指定个数
        let imgList = _.sample( this.imageOptions, num );
        //选取前端使用图片
        imgList.forEach( (el, index)=>{
            //let name = escape(el.name).replace(/%u/g,'\\u');
            imgnames.push( el.name );
            // imgList[ index ].value = think.uuid();
        });
        // 选择出正确的选项
        obj.validate = _.sample( _.without( imgList, obj.validate ));
        //前端获取的值
        obj.result = {
            values:imgnames,
            image:think.uuid()
        };
        obj.isvalid = 0;
        return obj;
    }
    

    /**
     * 创建redis连接
     */
    async createconnectredis(_num){
        let num = _num || this.rds;
        try{
            if(think.env == 'development'){//开发环境
           console.log('num',num);
                console.log('ioredis_config.development',ioredis_config.development);
                this._redis = new ioRedis(ioredis_config.development);//
            }else{
                this._redis = new ioRedis(ioredis_config.product[parseInt(num)]);
            }
        }catch(err){
            console.log('createconnectredis  err',err)
        }
    }
    /**
     *get redis
     */
    async getredis(key){
      //createconnectredis();
      let iRedis = null;
      try{
        iRedis = think.promisify(this._redis.get,this._redis);
        return iRedis(key) || null;
      }catch(err){
        console.log('getredis key err',key,err);
        return null;
      }
      //disconnectredis();
    }
    /**
     *incr redis
     */
    async incrredis(key){
      //createconnectredis();
      let iRedis = null;
      try{
        iRedis = think.promisify(this._redis.incr,this._redis);
        return iRedis(key) || null;
      }catch(err){
        console.log('incrredis key err',key,err);
        return null;
      }
    }
    /**
     * 关闭redis连接
     */
    async disconnectredis(){
      try{
        await this._redis.disconnect();
      }catch(err){
        console.log('关闭redis连接',err);
      }
    }
}