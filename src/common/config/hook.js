'use strict';

/**
 * hook config
 * https://thinkjs.org/doc/middleware.html#toc-df6
 */
export default {
    // route_parse: ["prepend", "get_lang"],//获取语言版本
	logic_before: ["prepend", "csrf"], //开发阶段关闭  //, "html_cache"前置检查是否已经缓存
	view_filter : ["append", "debug_toolbar"],
  	//view_after: ["append", "html_cache"]//后置缓存
}