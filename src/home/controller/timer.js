'use strict';


import Base from './base.js';

export default class extends Base {

    /**
     * index actions
     * @return {Promise} []
     */
    async indexAction(self) {

       self.http.isJsonp() ? self.jsonp({t:Date.now(),u:''}) : self.json({t:Date.now(),u:''});
    }

}
