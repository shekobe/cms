'use strict';

/**
 * 备件数据库
 *
 */

import Base from './base';
import Ssh2 from 'ssh2';
import Moment from 'moment';
let Client = Ssh2.Client;
export default class extends Base {



    /**
     * 入口判断
     *
     */
    async indexAction(self) {

        //self.http.redirect("/admin/menu/index");
        return self.display();


    }
    
    /**
     * 首页
     * @return {[type]}      [description]
     */
    async backupsAction(self){
       //显示首页
        var conn1 = new Client();

        var datastr = Moment().format('YYYYMMDDhhmmss');
      await conn1.on('ready', function() {
            //console.log('FIRST :: connection ready');
            conn1.exec('/usr/local/mongodb/bin/mongodump -h 10.100.7.64:28001 -d qiku -o /app/mongodb/database_'+datastr, function(err, stream) {
                if (err) {
                    self.fail(err);
                    console.log('FIRST :: exec error: ' + err);
                    return conn1.end();
                }
                stream.on('end', function() {
                    conn1.end(); // close parent (and this) connection
                    self.success('备份数据库成功');
                }).on('data', function(data) {
                    console.log(data.toString());

                });

            });
        }).connect({
            host: '10.100.7.64',
            username: 'root',
            password: '360qiku@qkcorpec'
        });
    }
  
}



