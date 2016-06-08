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

//log4js��־���

// import log4js from 'log4js';
// log4js.configure({
//     //"customBaseDir" :"logs/",
//     "customDefaultAtt" :{
//        // "type": "dateFile",
//         "absolute": true,
//         "alwaysIncludePattern": true
//     },
//     appenders: [
//         {"type": "console", "category": "console"}, //����̨���
//         {
//             type: 'file', //�ļ����
//             filename: 'logs/debug/log.log',
//             maxLogSize: 1024,
//             backups:3,
//             "category":  'logDebug'             // ��¼����
//         },
//         {
//             type: 'file', //�ļ����
//             filename: 'logs/err/log.log',
//             maxLogSize: 1024,
//             backups:3,
//             "category":  'logErr'            // ��¼����
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
let Queues = QueueFun.Queue();//��ʼ��Promise�첽������
let q = QueueFun.Q; //���ʹ�õ�Promise���̿����࣬Ҳ����ʹ��q.js����
global.queueObj = new Queues(maxNum,{
    //�ɹ�
    "event_succ":function(data,obj){
        //console.log('�ɹ�')

    } 
    //ʧ��   
    ,"event_err":function(){
        // return this.http.redirect("http/");
    }  
    //���п�ʼ
    ,"event_begin":function(){
         console.log('���п�ʼ')

    } 
     //�������
    ,"event_end":function(){
        //glTime = new Date().getTime() - glTime;
        console.log('�������');
       // glTime = 0;

    }   
    //��ִ������ӽ�ִ�е�Ԫ��ִ��,ע��go��jump���ᴥ��  
    ,"event_add":function(){
       // console.log('event_add',this.isStart,this.lins.length);
        //if(!this.isStart && this.lins.length >= 5){ //�������10�����,���ж���
        //    console.log(">> �����Զ���������")
        //    this.start();
        //}

    } 
    //���е�Ԫ�������Դ���
    ,"retryON":0                 
    //����ģʽtrue/false(����/����)ִ��
    ,"retryType":0               
    //<=0�޳�ʱ ��ʱ����'timeout'Ϊ���ɾܾ�
    ,"timeout":0                 
});
//����һ��Promise�����첽����
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
 * ����ȥ��
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

