
//加载ueditor
$(function () {
    var $window = $(window);
    
    //失去焦点
   $('body').on('focusout', '.j_pagename,j_path', function(){
        var pagename = $.trim($(this).val());
        if(!pagename){
            $(this).siblings('.help-block').text("不能为空");
        }else{
             $(this).siblings('.help-block').text(' ');
        }
   })
    //ueditor 保存修改或新增数据
    $('body').on('click','.j_save',function(e){
        var t = $(this);
        var pagename = $.trim($('.j_pagename').val());
        var path = $.trim($('.j_path').val());
        var _id = $('input[name="_id"]').val();
        var type = $('input[name="releaseType"]').val() || 'default';
        var useLayout = $('.j_uselayout').attr('checked') ? '1' : '0';
        var uecontent = '';
        if(!pagename){
            $('.j_pagename').siblings('.help-block').text("页面名称不能为空");
            return false;
        }
        if(!path){
            $('.j_path').siblings('.help-block').text("页面路径不能为空");
            return false;
        }
        if(type =="home"){
            uecontent = editor.getValue();
        }else{
            uecontent = editor.getContent();
        }
        if(!uecontent ){
            toastr.error('内容不能为空');
            return;
        }
        //if(!/\.html?$/.test(path)){
        //    $('.j_path').siblings('.help-block').text("页面路径不正确");
        //    return;
        //}
        //修改 or 新增
        var url = _id? '/admin/template/updatedata':'/admin/template/addlist';
        $.ajax({
            url: url,
            type: 'POST',
            data:{
                "updateBy":sesisonObj.username,
                "pageName":pagename,
                "id":_id,
                "path":path,
                "releaseType":type,
                "useLayout":useLayout,
                "content":uecontent
            },
            success: function (data) {
               //返回数据正常
                if (data.errno == "0") {
                    // window.location="/admin/template";
                     history.go(-1);
                } else {
                    toastr.error('添加失败');
                }
            }
        });
    });
});
