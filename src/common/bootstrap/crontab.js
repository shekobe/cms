/**
 *
 * 定时执行
 */
import crontab from 'node-crontab'
import fs from 'fs';
import path from 'path';
import child from 'child_process';
//crontab范例
//每五分钟执行  */5 * * * *
//
//每小时执行     0 * * * *
//
//每天执行        0 0 * * *
//
//每周执行       0 0 * * 0
//
//每月执行        0 0 1 * *
//
//每年执行       0 0 1 1 *

let fn = () => {
    //定时任务具体逻辑
    //调用一个 Action
    //think.http('/admin/images/gettepmlist', true); //模拟访问
    let date = new Date();
    let hour = date.getHours();
    if(hour == 23){//每天晚上十一点执行备份数据库
        think.http('/admin/database/backups',true);
    }
}

//轮询更新文章相关缓存数据 home/news
let updatenews = () => {

    let file = path.join(think.ROOT_PATH,'www/static/admin/newscache/anyone.json');
    //console.log('file',file);
    //读取文件
    fs.readFile(file,'utf8',function(err,data){
        if(err){
            //console.log('读文件出错',err);
            return;
        }
        data = JSON.parse(data);
        //console.log('读文件成功,返回：',data);
        let arr = data.arr || [];
        if(!arr.length){
            //console.log('cache is empty');
            return;
        }
        for(var i=0;i<arr.length;i++){
            think.cache(arr[i],null);
            //console.log('cache key:',arr[i]);
        }

        setTimeout(function(){//
            //console.log('delete newscacheArr');
            // 判断a文件夹是否存在
            fs.exists(file, function(exists){
                if(exists){
                    //console.log("文件存在");
                    let exec = child.exec;

                    exec('rm -rf '+file,function(err,out) {

                        //console.log('删除成功：',out); err && console.log('删除失败',err);

                    });
                }else{
                    //console.log("文件不存在")
                }
            });

        },3000);
        //data = JSON.stringify(data);
        //console.log(data);
    });






}
// 1 小时执行一次
let jobId = crontab.scheduleJob('0 * * * *', fn);
// 1 分钟执行一次
let jobId2 = crontab.scheduleJob('*/1 * * * *', updatenews);
//开发环境下立即执行一次看效果
if(think.env === 'development'){
    fn();
    updatenews();
}