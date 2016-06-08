/**
 *
 * 定时执行
 */
import crontab from 'node-crontab'
import Moment from 'moment';
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
    //think.http('/admin/images/gettepmlist', true); //模拟访问 /admin/images/gettepmlist
    var date = new Date();
    var hour = date.getHours();
    if(hour == 23){//每天晚上十一点执行备份数据库
        think.http('/admin/database/backups',true);
    }
    //think.http('/rush/index/refreshcache',true);
}
// 1 小时执行一次
let jobId = crontab.scheduleJob('0 * * * *', fn);
//开发环境下立即执行一次看效果
if(think.env === 'development'){
    fn();
}