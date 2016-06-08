/**
 * @require js/lib/require.js
 * @require js/base/base.js
 */
require(['jquery'],function(){

var $ = require('jquery');

var app = {
	init:function(){
		console.log( 'this is /js/base/common.js');
		$('#contain p').css('text-align','center');
	}
};

return app;
});
