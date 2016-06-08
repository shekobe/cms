'use strict';
/**
 * 处理users用户表的各种操作
 *
 */

import moment from 'moment';
import crypto from 'crypto';

export default class extends think.model.mongo{
    init(...args){
        super.init(...args);
        //设置字段
        this.fields = {
            username: {
                type: "string"
            },
            pass: {
                type: "string"
            }
            ,
            power: {
                type: "string"
            }
            ,
            date: {
                type: "string"
            }
            ,
            showLogList: {
                type: "string"
            }
            ,
            leftpos: {
                type: "string"
            }
            ,
            styleName: {
                type: "string"
            },
            roles:{
                type: "string"
            }
        }
    }
    /**
     * 获取用户信息
     *
     */
    async getAccountByName(name,callback){
        let obj = await this.where({username:name}).find();
        if(!think.isEmpty(obj)){
           callback(obj);
        }else{
           callback(null);
        }
    }
    /**
     * 获取用户列表
    */
    async getUserList(callback){
        let res = await this.select();
        callback(res);

    }
    /**
     * 添加用户
     *
     */
    async addUser(obj,callback){
        let len = await this.where({username:obj.username}).find();
        //console.log('addUser len',len);
        let self = this;

        if(!think.isEmpty(len)){
            callback('username-taken');
        }else{
            saltAndHash(obj.pass, function(hash){
                obj.pass = hash;
            });
            // append date stamp when record was created //
            obj.date = moment().format('YYYY-MM-DD, HH:mm:ss');
            obj.power = obj.power || '0';
            obj.showLogList = [];
            obj.leftpos = obj.leftpos || '0-0';
            obj.styleName = obj.styleName || 'default';
            obj.roles = obj.roles || '';
            let re = await self.add(obj);
            callback(re);
        }
    }
    /**
     * 自动登录处理
     *
     */
    async autoLogin(user, pass, callback){
      let obj = await this.where({username:user}).find();
        if(!think.isEmpty(obj)){
            obj.pass == pass ? callback(obj) : callback(null);
        }else{
            callback(null);
        }

    }
    /**
     * 登录处理
     *
     */
    async manualLogin(user, pass, callback){

        let obj = await this.where({username:user}).find();
        if(!think.isEmpty(obj)){
            validatePassword(pass, obj.pass, function(err, res) {
                if (res){
                    callback(null, obj);
                }else{
                    callback('invalid-password');
                }
            });
        }else{
            callback('user-not-found');
        }


    }
    
    /**
     * 设置用户左侧菜单位置
     *
     */
    async setleftpos(obj,callback){
        let res = await this.where({username:obj.username}).update({leftpos:obj.str});
        callback(res);
    }

     
    //删除用户
    async delUserById(id,callback){

        let res = await this.where({_id:id}).delete();
        callback(res);
    }
    //修改用户
    async updateUserById(obj,callback){

        let res = await this.where({_id:obj.id}).update({power: obj.power});
        callback(res);
    }

    //修改用户权限
    async updatedatarole(obj,callback){

        let res = await this.where({_id:obj.id}).update({roles: obj.roles});
        callback(res);
    }

    /**
     * 设置用户样式
     *
     */
    async setStyle(obj,callback){// obj = {name,  username}

        let res = await this.where({username:obj.username}).update({styleName: obj.name});
        callback(res);

    }


}




/* private encryption & validation methods */

var generateSalt = function()
{
    var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
    var salt = '';
    for (var i = 0; i < 10; i++) {
        var p = Math.floor(Math.random() * set.length);
        salt += set[p];
    }
    return salt;
}

var md5 = function(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback)
{
    var salt = generateSalt();
    callback(salt + md5(pass + salt));
}

var validatePassword = function(plainPass, hashedPass, callback)
{
    var salt = hashedPass.substr(0, 10);
    var validHash = salt + md5(plainPass + salt);
    callback(null, hashedPass === validHash);
}

/* auxiliary methods */

var getObjectId = function(id)
{
    return new require('mongodb').ObjectID(id);
}

var findById = function(id, callback)
{
    accounts.findOne({_id: getObjectId(id)},
        function(e, res) {
            if (e) callback(e)
            else callback(null, res)
        });
};


var findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
    accounts.find( { $or : a } ).toArray(
        function(e, results) {
            if (e) callback(e)
            else callback(null, results)
        });
}
