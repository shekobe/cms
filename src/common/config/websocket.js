'use strict';
/**
 * config
 * @type {Object}
 */
module.exports = {
    on: true, //�Ƿ��� WebSocket
    type: "socket.io", //ʹ�õ� WebSocket �����ͣ�Ĭ��Ϊ socket.io
    allow_origin: "", //����� origin
    adapter: undefined, // socket �洢�� adapter��socket.io ��ʹ��
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