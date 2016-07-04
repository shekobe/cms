'use strict';

import fs from "fs";
import path from "path";
import moment from "moment";
import Math from "mathjs";
import Base from "./base.js";
import uploads from "./upload.js";
import config from '../config/upload.js';

export default class extends Base {
    init(http) {
        super.init(http);
        this._model = this.model('images');
    }

    /**
     * ueditor 默认action
     * @return {[type]} [description]
     */
    async indexAction(self) {
        //
        let upload = new uploads();
        if (this.get('action') === 'image') {//uploadimage
            let file = think.extend({}, this.file('upfile'));
            file = await upload.filehandle('image', file);
            //返回错误
            if (file.state == "fail")
                return this.json(file);
            let userinfo = await self.session("userinfo");
            let data = {
                "name": file.originalFilename,
                "url": file.path,
                "size": file.size,
                "type": file.headers["content-type"],
                "operator":userinfo.username || '',
                "state": "SUCCESS"
            };
            this.json(data);

            this._model.addData(data);
        } else if (this.get('action') === 'listimage') {
            //let file = think.extend({}, this.file('image'));
            //if (file[0] !== undefined) {//多个文件
            //    let arr = [];
            //    for (let item in file)
            //        arr.push(await upload.filehandle(type, file[item]));
            //    file = arr;
            //} else {
            //    file = await upload.filehandle(type, file)
            //}
            //this.json(file);

            let start = parseInt(self.http.param('start')) + 1;
            let size = self.http.param('size');
            let page = Math.ceil(start/size);
            let objlist = await this._model.getimageList(page,size) || [];
            self.json({
                "state": "SUCCESS",
                "list": objlist.data,
                "start": parseInt(self.http.param('start')),
                "total": objlist.count
            });


        } else if (this.get('action') === 'config') {
            this.json(config);
        } else {
            this.fail('404', "错误请求！请求参数错误，请确认！")
        }
    }
}