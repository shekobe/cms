/**
 * this file will be loaded before server started
 * you can define global functions used in controllers, models, templates
 */

/**
 * use global.xxx to define global functions
 *
 * global.fn1 = function(){
 *     
 * }
 */

//log4js日志输出

// import log4js from 'log4js';
// log4js.configure({
//     //"customBaseDir" :"logs/",
//     "customDefaultAtt" :{
//        // "type": "dateFile",
//         "absolute": true,
//         "alwaysIncludePattern": true
//     },
//     appenders: [
//         {"type": "console", "category": "console"}, //控制台输出
//         {
//             type: 'file', //文件输出
//             filename: 'logs/debug/log.log',
//             maxLogSize: 1024,
//             backups:3,
//             "category":  'logDebug'             // 记录器名
//         },
//         {
//             type: 'file', //文件输出
//             filename: 'logs/err/log.log',
//             maxLogSize: 1024,
//             backups:3,
//             "category":  'logErr'            // 记录器名
//         }

// ],
//     "levels":{ "logDebug": "DEBUG", "logErr": "ERROR"},
//     replaceConsole: true
// });

// global.logger = name => {
//     var logger = log4js.getLogger(name);
//    // logger.setLevel('ERROR');
//     return logger;
// };

  
/**
 * this file will be loaded before server started
 * you can define global functions used in controllers, models, templates
 */

/**
 * use global.xxx to define global functions
 *
 * global.fn1 = function(){
 *     
 * }
 */
import QueueFun from 'queue-fun';

let time = 170;
let maxNum = 1;
let Queues = QueueFun.Queue();//初始化Promise异步队列类
let q = QueueFun.Q; //配合使用的Promise流程控制类，也可以使用q.js代替
global.queueObj = new Queues(maxNum,{
    //成功
    "event_succ":function(data,obj){
        //console.log('成功')

    } 
    //失败   
    ,"event_err":function(){
        // return this.http.redirect("http/");
    }  
    //队列开始
    ,"event_begin":function(){
         console.log('队列开始')

    } 
     //队列完成
    ,"event_end":function(){
        //glTime = new Date().getTime() - glTime;
        console.log('队列完成');
       // glTime = 0;

    }   
    //有执行项添加进执行单元后执行,注意go及jump不会触发  
    ,"event_add":function(){
       // console.log('event_add',this.isStart,this.lins.length);
        //if(!this.isStart && this.lins.length >= 5){ //当添加了10个项后,运行队列
        //    console.log(">> 触发自动运行条件")
        //    this.start();
        //}

    } 
    //队列单元出错重试次数
    ,"retryON":0                 
    //重试模式true/false(优先/搁置)执行
    ,"retryType":0               
    //<=0无超时 超时后以'timeout'为理由拒绝
    ,"timeout":0                 
});
//定义一个Promise风格的异步方法
global.testfun = function(i){
    var deferred = q.defer();
    setTimeout(function(){
        deferred.resolve(i)
    },time)
    return deferred.promise;

}
global.testfn = function(i){
    let deferred = think.defer();
    setTimeout(function(){
        deferred.resolve(i)
    },time)
    return deferred.promise;
}
/**
 * 数组去重
 * @param objArr
 * @returns {Array objarr}
 */
/* global unique */
global.uniqueObjArr = function(objArr) {
    var result = [];

    for(var item in objArr){
        if(objArr[item].ip && objArr[item].name){
            //console.log('objArr',objArr[item].ip,objArr[item].name);
            result[objArr[item].ip +':'+objArr[item].name] = objArr[item].info;
        }

    };
    return result;
}

