$(function () {
    var $window = $(window);
    //初始化加载页面
    getTempleList();
    template.helper('dateFormatCon', function (str, from) {
        var arr = str.split(',');
        var str2 = '';
        for (var i = 0; i < arr.length; i++) {
            str2 += '<div class="path">' + arr[i] + '</div>';
        }
        return str2;
    });



/**
 * [页面基础事件]
 */
    $('body').on('click','.search_submit',function(e){
        getTempleList(1,20);
    })
    //删除行数据
    $('#sample_editable_1').on('click', '.delete', function (e) {
            e.preventDefault();
            if (confirm("确定要删除吗 ?") == false) {
                return false;
            }
            var t = $(this);
            var id = t.attr('data-id');
            $.getJSON('/admin/template/deldata', {"id":id}, function(json, textStatus) {
                if(json.errno == 0){//返回数据正常
                    // var nRow = t.parents('tr')[0];
                    // oTable.fnDeleteRow(nRow);
                    getTempleList();//更新表格
                }else{
                    toastr.error('删除失败');
                }
            });

    });
    $('body').on('click', '.j_test', function (e) {
        $('div.retest').find('.modal-title').html('执行' + $(this).attr('data-name') + '命令');
        var serverpath = $(this).attr('data-server').split(',');
        var scriptPath = $(this).attr('data-script');
        var userArr = $(this).attr('data-user').split(',');
        var passArr = $(this).attr('data-pass').split(',');
        var groupArr = $(this).attr('data-group').split(',');

        e.stopPropagation();
        $messages.empty();
    });


/**
 * 页面通用函数
 */
//
    //获取页面列表
    function getTempleList(page,nums) {//getuserbyname
        var type = $('input[name="template_type"]').val() || '';
        var search = $.trim($('.searchinput').val()) ||'';
        $.ajax({
            url: '/admin/template/gettepmlist',
            type: 'GET',
            cache: false,
            data:{"page":page||1,"nums":nums||15,"type":type,"search":search.replace(/'|"|=|>|<|%|$/g,'')},
            success:function(data){
                if(data.data){
                    //返回数据正常
                    var str = template('userlist', data);
                    $('#sample_editable_1').html(str);
                    // TableEditable.init($('#sample_editable_1'));
                    //基础信息
                    $('#sample_editable_1_info').text("第"+data.data.currentPage+"/"+data.data.totalPages+"页，共"+data.data.count+"条")
                    //分页信息
                    $('#sample_editable_1_paginate').bootpag({
                       total: data.data.totalPages,
                       page: data.data.currentPage,
                       maxVisible: 10
                    })
                }
            }
        });
    }
    //分页点击
    $('#sample_editable_1_paginate').on('page', function(event, page){
        getTempleList(page);
    });

   

});
