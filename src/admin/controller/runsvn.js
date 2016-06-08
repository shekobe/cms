var SVN = require ('./svn.js');
//E:/yulong/EC/web/WebContent   /usr/local/src/WebContent
var repo = {path: "E:/yulong/EC/web/WebContent", name: "svn://10.1.23.13/web/branches/founder/WebContent", username: "suguiyun", pw: "suguiyun"};

if (process.platform === 'win32') {
         repo = {path: "E:/qikusvn/trunk/front-web/WebContent", name: "https://10.100.13.10/svn/EC/ec-b2c/3.development/trunk/front-web/WebContent", username: "suguiyun", pw: "Shekobe1234567@"};
}else{
         repo = {path: "/home/tomcat/WebContent", name: "https://10.100.13.10/svn/EC/ec-b2c/3.development/trunk/front-web/WebContent", username: "suguiyun", pw: "Shekobe1234567@"};
}
var svn = new SVN(repo, function (err, info) {
       // console.log(err,info);
        if(!err){
                //svn.log('',2,function(a,b){
                //        console.log(b[0].changes)
                //});
        }
});


module.exports = svn;


