'use strict';

import Base from './base.js';
import request  from 'request';
import ioRedis from "ioredis";
import ioredis_config from "../config/ioredis.js";
import fs from 'fs';


export default class extends Base {
  init(http) {
    super.init(http);
    this.that = this;
  }
  //action 前置操作
  async __before(){

    //用户请求来源
    this.referrers  = this.http.referrer() || '';
    //用户客户端 判断
    this.isphone = this.checkMobile(this.http.userAgent()) || false;
    //生成页面token
   // this.token = await this.session("qkToken");
    //console.log('__before set qkToken',this.token);
    //传给页面
   // this.assign({"qktoken": this.token});
    this.rds = ioredis_config.rds.pos;
    this.assign({"rds": this.rds});

  }

  async ifrAction(){
    return this.display('ifr');
  }


  async gosuccess(objparam,accesstoken){
    console.log('gosuccess')
    let self = this;
    let obj_param = objparam;
    //购买条件不正确
    if((parseInt(obj_param.saleCount<1) || parseInt(obj_param.saleCount>5)) || obj_param.goodsId == '' || isNaN(obj_param.saleCount)){
      return self.errors('buy');
    }
    //检测购买运行情况
    self.createconnectredis();

    //缓存抢购的时间
    self.sale_count = await think.cache("graprush_"+obj_param.goodsId, () => {
      return  self.getredis("graprush_"+obj_param.goodsId) || 0;
    });

    //合并参数
    let params = 'goodsType='+obj_param.goodsType+'&goodsId='+obj_param.goodsId+'&combo='+obj_param.combo+'&saleCount='+obj_param.saleCount+'&presale='+obj_param.presale;

    //匹配商品抢购时间是否在时间段
    let goodsTime = await think.cache("fe_rush_"+obj_param.goodsId, () => {
      return self.getredis('fe_rush_'+obj_param.goodsId) || false;
    });

    console.log('goodsTime',obj_param.goodsId,goodsTime);
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
        self.disconnectredis();
        return self.errors('nostart')
      }
    }

    //token
    obj_param.token =  self.token;//await self.getredis('qkToken');
    //用户获取排队号码牌
    let user_num = await self.incrredis('graprush_queue_'+obj_param.goodsId);
    try{
      self._redis.set("graprush_userqueue_"+self.token,user_num+'_'+Date.now());
    }catch(err){
      console.log('set graprush_userqueue_',err);
    }
    queueObj.push(global.testfun, [obj_param]).then(function(obj){
      self.myqueues(obj);
    });
    //未开始就让队列开始
    if (!queueObj.isStart) {
      queueObj.start();
    }
    //
    self.disconnectredis();
    return self.errors('queue');
  }

  async goerror(self){
    console.log('goerror')
    return self.errors('rusherror');
  }


  /**
   * indexold action
   * @return {Promise} []
   */
  async indexAction(self){


    let token = self.http.param('token');
    if(!token){
      this.assign({"qktoken":"invalid"});
      return self.errors('rusherror');
    }
    this.token = token;
    console.log('__before2 set qkToken',this.token);
    //传给页面b
    this.assign({"qktoken": this.token});

    //前台提交参数
    let obj_param ={
      combo : self.http.param('combo') || '',
      goodsId : self.http.param('goodsId') || '',
      goodsType : self.http.param('goodsType') || '',
      presale  :  self.http.param('presale') || '',
      saleCount : self.http.param('saleCount') || 1
      // titleApk : self.http.param('titleApk') || ''
    };

    var getR = function(token){
      var pro = think.promisify(global.TokenApi.verify, global.TokenApi);
      return pro(token);
    }
    getR(token).then(function(count){
      //if (!err) {
      if (count) {
        global.TokenApi.decline(token, function(err, count) {
          //
          console.log('1111')
          self.gosuccess(obj_param,token);
        })

        // return 1;
      } else {
        global.TokenApi.remove(token, function(rmErr, rmFlag) {
          // cb(err, false);
          console.log('2222')
          return self.errors('rusherror');
        })

        // return 2;
      }
      //} else {
      //cb(err, false);
      // console.log('0000')
      //return 0;
      // }
    }).catch(function(err){
      console.log('0000')
      return self.errors('rusherror');
    });

  }

/**
 * 排队页面
 */
async myqueues(obj){
  if(!obj) return false;
  //添加动态签名
  obj.key = think.uuid(10);
  let self = this;
  let usertoken = obj.token;
  obj.group = ioredis_config.rds.group;
  delete obj.token;
  //json对象按照key排序
  let ordered = Object.keys(obj).sort().reduce((r, k) => (r[k] = obj[k], r), {});

  self.createconnectredis();
  //生成请求参数字符串

  let parame_s = await think.cache('graprush_param', () =>{
    return this.getredis('graprush_param') || "liud02870jcheng9fa703452ca62f9f87d8cxxf05bf0bc6f9";
}) || "liud02870jcheng9fa703452ca62f9f87d8cxxf05bf0bc6f9";


let parame_string = 'http://grap.360shouji.com/'+(this.isphone?'wap/':'')+parame_s+'/addFast_rush.htm?';
//对象排序
Object.keys(ordered).forEach(function(key,index){
  if(index >0) parame_string +='&';
  parame_string += key + '=' + ordered[key];
});
//加密串
let str = think.md5(parame_string + 'webqiku!@#');
//添加新信息
obj.url = parame_string+'&sign='+str;
obj.isbuy = 1;

//检测购买运行情况
let current_count = 0;
try{
  current_count = (this.current_count)?this.current_count:await this.getredis('graprush_buy_'+obj.goodsId) || 0;
}catch(err){
  console.log('检测购买运行情况',err);
}
//判断是否售罄
if( parseInt(current_count) >= parseInt(this.sale_count) ){
  try{
    self._redis.set("graprush_user_"+usertoken,JSON.stringify({
      "goodsId":obj.goodsId,
      "t":Date.now(),
      "status":"soldout"}));
  }catch(err){
    console.log('set graprush_user_',err);
  }

}else{
  //用户排队成功
  try{
    self._redis.set("graprush_user_"+usertoken,JSON.stringify(obj));
  }catch(err){
    console.log('用户排队成功set graprush_user_',err);
  }
  //更新redis 购买用户数量
  let current_count = await this.incrredis("graprush_buy_"+obj.goodsId);//+当前使用库存
  //记录用户出队列时间
  try{
    self._redis.set('graprush_userqueue_'+usertoken,(await this.getredis('graprush_userqueue_'+usertoken))+'_'+current_count+'_'+Date.now());
  }catch(err){
    console.log('记录用户出队列时间set graprush_userqueue_',err);
  }

}
self.disconnectredis();
console.log('out myqueues graprush_buy_'+obj.goodsId,current_count);
}
/**
 * 进入排队后轮询查询
 */
async pollAction(self){
  let token = this.http.param("qktoken")||'';
  let goodsId = this.http.param("goodsId")||'';
  let rds =  this.http.param("rds");
  console.log('get pollAction qkToken',token);
  let result ={};
  if(!token || rds === ''){
    result = {"status":"error","msg":"非法请求!"};
  }else{
    self.createconnectredis(rds);
    //获取token
    let userinfo = '';
    try{
      userinfo = await this.getredis('graprush_user_'+token) || '';
    }catch(err){
      console.log('检测购买运行情况',err);
    }
    if(userinfo && userinfo != ''){
      result = JSON.parse(userinfo);
      //返回状态
      if(!result.url) result.status = "wait";
    }
    //获取排队情况
    if(result){
      let myqueue = 0;
      let current = 0;
      let saleCount = 0;
      try{
        myqueue = parseInt((await self.getredis('graprush_userqueue_'+token)).split('_')[0]) || 0;
        current = parseInt(await self.getredis("graprush_buy_"+goodsId));
        saleCount = parseInt(await think.cache("graprush_"+goodsId, () => {
          return  self.getredis("graprush_"+goodsId) || 0;
      }) || 0);
    }catch(err){
      console.log('获取排队情况',err);
    }
    //当前是否卖完
    if(saleCount){
      if(current >= saleCount){
        result.status = 'soldout';
      }
    }
    //排队人数
    if(myqueue-current >=0){
      result.queue = myqueue-current;
    }else{
      result.queue  = 0;
    }
  }
  self.disconnectredis();

}
//返回时间
result.t = Date.now();
result.rds = rds;
console.log('result',result);
return this.http.end(result);
//返回结构
//return (this.http.isJsonp()) ? this.jsonp(result) : this.http.json(result);

}

//定时任务更新购买时间的cache
async refreshcacheAction(self){
  let num = this.http.param("num") || '';
  let fn = think.promisify(request.get, request);
  let response = await fn('http://js.360shouji.com/data/buybookMD.js?v='+Date.now());
  let data = response.body.replace(/^(var\s?buybookMD\s?=\s?)/,'').replace(/;$/,'');
  let idArr = [];
  //取到数据才处理
  self.createconnectredis(num);
  if(data){
    // console.log(typeof data);
    let json = eval("("+data+")");//(typeof data === 'string')? JSON.parse(data) : data;
    json.list.forEach(function(obj){
      let arr = obj.buy;//抢购时间
      let times = '';
      arr.forEach(function(obj2,index){
        if(index > 0) times += ','
        times +=  new Date(obj2.begin)*1 +'-'+ new Date(obj2.end)*1;
      });
      //更新cache
      try{
        self._redis.set('fe_rush_'+obj.sku,times);
        idArr.push(obj.sku);
      }catch(err){
        console.log('更新cache set fe_rush_',err);
      }
      // think.cache('fe_rush_'+obj.sku,times);
    });
  }
  await self.getgoods(idArr);
  self.disconnectredis();
  //return this.http.end("ok",'utf-8');
}
async getgoods(idArr){
  let self = this;
  let num = '';
  if(idArr.length){
    for(let i=0;i<idArr.length;i++){
      try{
        let time = await self.getredis("fe_rush_"+idArr[i]);
        let str = '';
        let currentTimemap = Date.now();
        let goodsTimearr = time.split(',');
        for(let j=0;j<goodsTimearr.length;j++){
          let vallist = goodsTimearr[j].split('-');
          if(currentTimemap < parseInt(vallist[1])){
            str += new Date(parseInt(vallist[0])).toString() + ' '+new Date(parseInt(vallist[0])).toString()+'至'+new Date(parseInt(vallist[1])).toString() + ' '+new Date(parseInt(vallist[1])).toString()+',';
            // break;
          }
        }

        num += '<p>'+idArr[i]+':'+str+'</p>';
      }catch(err){
        console.log('get fe_rush_'+goodsId,err);
      }
    }
  }

  return self.http.end("ok"+num,'utf-8');
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
  //disconnectredis();
}
/**
 * error action
 * @return {[type]} [description]
 */
async errorAction(){
  let type = this.http.param("error") || '';

  return this.errors(type);
}
/**
 * 错误页面
 * type 错误类型
 */
async errors(type,num){
  //默认错误为：400 ，错误的请求
  let msg = {"errornum":num||400,"url":'http://www.360shouji.com/index.html'}
  if(this.isphone) msg.url = 'http://m.360shouji.com/'
  switch (type) {
    case 'rusherror':
      think.extend(msg ,{"errornum":400,'msg':"请求错误，请返回重试！"});
      break;
    case 'buy':// 购买条件错误
      think.extend(msg , {"errornum":401.4,'msg':"订单提交错误，请返回重新购买","url":this.referrers});
      break;
    case 'nostart':// 抢购还没开始 /抢购时间未到
      think.extend(msg ,{"errornum":411,'msg':"抢购还没开始，先去逛逛再来吧"});
      break;
    case 'buyend':// 抢购已经结束
      think.extend(msg ,{"errornum":412,'msg':"抢购已经结束，去看看其他的商品吧"});
      break;
    case 'soldout':// 已经售罄
      think.extend(msg ,{"errornum":423,'msg':"您购买的商品已经售罄，去看看其他的"});
      break;
    case 'buyed':// 已经买过了
      think.extend(msg ,{"errornum":416,'msg':"你已经购买过了，下次再来吧"});
      break;
    case 'queue'://排队中
      think.extend(msg ,{"errornum":510,'msg':"排队中,请稍候……"});
      break
    default:// 默认错误
      think.extend(msg ,{'msg':"请求错误，请返回重试！","url":this.referrers});
      break;
  }
  //传递参数给页面
  this.assign(msg);
  if(this.isphone){
    return this.display('merror');
  }else{
    return this.display('error');
  }
}
// 1、排队中     排队中，请您耐心排队等候
// 2、账号限制   每账号只能抢购一次！
// 3、数量限制   抢购数量超标了哦！
// 4、预约限制   本次抢购仅限预约用户参与！
// 5、预购限制   本次预购已结束！
// 6、时间限制   抢购还没开始，先去逛逛再来吧/先登录账号/先填写设置默认收货地址
// 7             本次抢购已结束！
// 8、商品售罄   本次抢购已经结束！
// 9、系统问题   系统繁忙，请稍后再试！
// 10、订单问题  订单提交不成功！
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

/**
 * 创建redis连接
 */
async createconnectredis(_num){
  let num = _num || this.rds;
  try{
    if(think.env == 'development'){//开发环境

      this._redis = new ioRedis(ioredis_config.development);//
    }else{
      this._redis = new ioRedis(ioredis_config.product[parseInt(num)]);
    }
  }catch(err){
    console.log('createconnectredis  err',err)
  }


}


/**
 * 后置操作
 */
async __after(){
  console.log('__after redis.disconnect');
  this.disconnectredis();
}
}