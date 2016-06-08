/**
 * this file will be loaded before server started
 * you can register middleware
 * https://thinkjs.org/doc/middleware.html
 */
'use strict';

/**
 * 
 * think.middleware('xxx', http => {
 *   
 * })
 * 
 */
//think js debug
import debugToolbar from 'think-debug-toolbar';
// html 缓存
import htmlCache from 'think-html-cache';

let conf = {
    panels: ['request', 'session', 'view', 'template', 'response', 'config', 'info'],
    depth: 4,
    extra_attrs: '',
    disabled: false,
    sort: false
};

think.middleware('debug_toolbar', debugToolbar(conf));

think.middleware('html_cache', htmlCache);

// think.middleware("get_lang", http => {
//   let supportLangs = think.config("locale.support");
//   let lang = http.pathname.split("/")[0]; //从 URL 中获取语言

//   if(supportLangs.indexOf(lang) > -1){
//     http.pathname = http.pathname.substr(lang.length + 1);
//   }else{
//     lang = http.lang(); //从 cookie 或者 header 中获取语言
//     if(supportLangs.indexOf(lang) === -1){
//       lang = http.config("locale.default"); //默认支持的语言
//     }
//   }
//   http.lang(lang, true); //设置语言，并设置模版路径中添加语言目录
// });