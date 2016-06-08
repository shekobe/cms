'use strict';
/**
 * config
 * @type {Object}
 */
module.exports = {
    on: true, //是否开启 WebSocket
    type: "socket.io", //使用的 WebSocket 库类型，默认为 socket.io
    allow_origin: "", //允许的 origin
    adapter: undefined, // socket 存储的 adapter，socket.io 下使用
    path: "", //url path for websocket
    messages: {
        //open: 'admin/socket/open',
        //close: 'admin/socket/close',
        updateall: 'admin/socket/updateall',
        addlist: 'admin/socket/addlist',
        addlist2: 'admin/socket/addlist2',
        downloadlist:'admin/socket/downloadlist',
        execserver:'admin/socket/execserver'
    }
};