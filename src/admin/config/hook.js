'use strict';

/**
 * hook config
 * https://thinkjs.org/doc/middleware.html#toc-df6
 */
export default {
    logic_before: ["prepend", "csrf"], //开发阶段关闭
    view_filter : ['append', 'debug_toolbar'],
    //logic_before: ['prepend', 'html_cache'],//前置检查是否已经缓存
    //view_after: ['append', 'html_cache']//后置缓存
}