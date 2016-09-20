var path = require('path');
var SVN = require ('./svn.js');
//E:/yulong/EC/web/WebContent   /usr/local/src/WebContent
var repo = {path: "E:/360shoujisvn2/trunk/front-web/qikuweb", name: "https://10.100.13.10/svn/EC/ec-b2c/3.development/trunk/front-web/qikuweb", username: "suguiyun", pw: "Shekobe123456@"};

if (process.platform === 'win32') {
    repo = {path: path.join(think.ROOT_PATH), name: "https://10.100.13.10/svn/EC/ec-b2c/3.development/trunk/front-web/qikuweb", username: "suguiyun", pw: "Shekobe0123456@"};
}else{
    repo = {path:'/usr/local/src/qikuweb', name: "https://10.100.13.10/svn/EC/ec-b2c/3.development/trunk/front-web/WebContent", username: "suguiyun", pw: "Shekobe0123456@"};
}
var svn = new SVN(repo, function (err, info) {
    console.log(err,info);
    if(!err){
        //svn.log('',2,function(a,b){
        //        console.log(b[0].changes)
        //});
    }
});


module.exports = svn;


