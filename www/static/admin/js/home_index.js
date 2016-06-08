(function($){
    var menuclass=[["banner","首页焦点图"],["smallbanner","首页小焦点图"],["1floor","首页1楼--爆款商品"],["2floor","首页2楼-特价优惠"],["3floor","首页3楼--配件"],["4floor","首页4楼--智能硬件"],["5floor","首页5楼--视频"],["6floor","首页6楼--线上平台"]];
    var list_top_menu = [];
    var list_top_category = [];
 //获取头部菜单或category列表
  function getmenu(type,id,el,page,callback){
    var type = type || 'category',id = id || '',el = el || '',page = page || 1;
    $.getJSON('/admin/home/menu', {"id":id,"type":type,"page":page}, function(data){
        result(id,el,type,data)
    });
  }
  //渲染结果
  function result(id,el,type,data){
    if(id){
            if(data.errno =='0')
                callback(data.data[0]);//回调
            else
                toastr.error('数据加载错误')
    }else{
        if(el) Metronic.unblockUI(el);//刷新用
        if(data.errno =='0'){
            var valdata = data.data;
            //menu 数据渲染
            if(type == 'menu'){
                list_top_menu =[]; //重置列表
                if(valdata.data.length > 0){
                    for(var i=0;i<valdata.data.length;i++){
                        if(valdata.data[i].parent == '0')
                        list_top_menu.push([valdata.data[i]._id,valdata.data[i].name])
                    }
                }
                //页面渲染
                var html = template("menu_edit_html",data);
                $('#menu_editTable').html(html);
                //渲染菜单关系
                $('#menu_editTable tbody tr').each(function(){
                    var parentid = $(this).attr("data-parent");
                    if(parentid && parentid != "0"){//获取非一级菜单
                        for(var i=0;i<list_top_menu.length;i++){
                            if(parentid == list_top_menu[i][0] ){
                                $(this).children().eq(4).text(list_top_menu[i][1]);
                                break;
                            }
                        }
                    }
                });
                //分页信息
                $('#menu_editTable_info').text("第"+(valdata.currentPage||1)+"/"+(valdata.totalPages||1)+"页，共"+(valdata.count||0)+"条")
                //分页按钮
                $('#menu_editTable_paginate').bootpag({
                     total: valdata.totalPages,
                     page: valdata.currentPage,
                     maxVisible: 10
                })
            
            }else if(type =='category'){//category 数据渲染
                list_top_category =[]; //重置列表
                if(valdata.data.length > 0){
                    for(var i=0;i<valdata.data.length;i++){
                        if(valdata.data[i].parent == '0')
                        list_top_category.push([valdata.data[i]._id,valdata.data[i].name])
                    }
                }
                //页面渲染
                var html = template("menu_edit_html",data);
                $('#category_editTable').html(html);
                //渲染菜单关系
                $('#category_editTable tbody tr').each(function(){
                    var parentid = $(this).attr("data-parent");
                    if(parentid && parentid != "0"){//获取非一级菜单
                        for(var i=0;i<list_top_category.length;i++){
                            if(parentid == list_top_category[i][0] ){
                                $(this).children().eq(4).text(list_top_category[i][1]);
                                break;
                            }
                        }
                    }
                });
                //分页信息
                $('#category_editTable_info').text("第"+(valdata.currentPage||1)+"/"+(valdata.totalPages||1)+"页，共"+(valdata.count||0)+"条")
                //分页按钮
                $('#category_editTable_paginate').bootpag({
                     total: valdata.totalPages,
                     page: valdata.currentPage,
                     maxVisible: 10
                })
                
            }else if(type == 'index'){
                // list_top_category =[]; //重置列表
                // if(valdata.data.length > 0){
                //     for(var i=0;i<valdata.data.length;i++){
                //         if(valdata.data[i].parent == '0')
                //         list_top_category.push([valdata.data[i]._id,valdata.data[i].name])
                //     }
                // }
                
                //页面渲染
                var html = template("menu_edit_html",data);
                $('#index_editTable').html(html);
                //渲染菜单关系
                $('#index_editTable tbody tr').each(function(){
                    var parentid = $(this).attr("data-parent");
                    if(parentid && parentid != "0"){//获取非一级菜单
                        for(var i=0;i<menuclass.length;i++){
                            if(parentid == menuclass[i][0] ){
                                $(this).children().eq(4).text(menuclass[i][1]);
                                break;
                            }
                        }
                    }
                });
                //分页信息
                $('#index_editTable_info').text("第"+(valdata.currentPage||1)+"/"+(valdata.totalPages||1)+"页，共"+(valdata.count||0)+"条")
                //分页按钮
                $('#index_editTable_paginate').bootpag({
                     total: valdata.totalPages,
                     page: valdata.currentPage,
                     maxVisible: 10
                })
            }
        }
    }
  }
  //获取、编辑和删除
  function getBysearch(type,page,search){
    //获取
    $.getJSON('/admin/home/product',{"search":search,"type":type,"page":page},function(data){
        result('','',type,data);
    });
  }
  //document ready
$(function(){
  //菜单切换
  $('#topmenu_tool > li').on('click',function(){
    var index = $(this).index();
    var targid = $(this).children('a').attr('href')
    if(index == 1){
        if($(targid).find('.dataTables_info').children().length <= 0){
            getmenu('menu');
        }
    }else if(index == 2){
        if($(targid).find('.dataTables_info').children().length <= 0){
            getmenu('category');
        }
    }else if(index == 3){
        if($(targid).find('.dataTables_info').children().length <= 0){
            getmenu("index");
            var html = '<option value="">请选择</option>';
            for(var i=0;i<menuclass.length;i++){
                html += '<option value="'+menuclass[i][0]+'">'+menuclass[i][1]+'</option>'
            }
             $('select[name="search_type"]').html(html);
        }
    }
  })
  //网站菜单管理
  $('.getwebsitemenu').on('click', function(){
    $.get('/admin/home/webmenu', function(data) {
        if(data.errno == 0){
            data.errmsg='<p>网站菜单已生成</p>';
        }
        $(this).parents('.row').append(data.errmsg).delay(5*10^3).remove();
    });
  });
  $('.freshwebsitemenu').on('click', function(){
    $.get('/admin/home/refreshcache', {'type':'category'}, function(data){
        if(data.errno == 0){
            data.errmsg='<p>缓存刷新成功</p>';
        }
        $(this).parents('.row').append(data.errmsg).delay(5*10^3).remove();
    })
  })
  //生成首页数据
   $('.getwebsiteindex').on('click', function(){
    $.get('/admin/home/webindex', function(data) {
        if(data.errno == 0){
            data.errmsg='<p>首页数据已生成</p>';
        }
        $(this).parents('.row').append(data.errmsg).delay(5*10^3).remove();
    });
  });
  $('.freshwebsiteindex').on('click', function(){
    $.get('/admin/home/refreshcache', {'type':'index'}, function(data){
        if(data.errno == 0){
            data.errmsg='<p>缓存刷新成功</p>';
        }
        $(this).parents('.row').append(data.errmsg).delay(5*10^3).remove();
    })
  })
  
  // topmenu刷新加载
  $('.topmenureload').on('click', function(){
    var _this = $(this), el = _this.parents('.tab-pane');
     Metronic.blockUI({target: el,animate: true,overlayColor: 'none'});
     getmenu('menu','',el);
  });
  //topmenu add
  $('.topmenuadd').on('click', function(){
    var _modal = $('#menu_edit');
        //初始化父级分类
        var html = '<option value="0">一级分类，无父级</option>';
        for(var i=0;i<list_top_menu.length;i++){
            html += '<option value="'+list_top_menu[i][0]+'">'+list_top_menu[i][1]+'</option>'
        }
        $('.menu_parent').html(html);
        $('input[name="menu_id"],input[name="menu_name"],input[name="menu_href"],input[name="menu_sort"],input[name="menu_info"],input[name="menu_pic"],input[name="menu_price"],input[name="menu_icon"],input[name="menu_other"]').val('');
        _modal.find('.menu_type').val('menu').attr("disabled",true);
        _modal.modal();
  })
  //topmenu/category update
  $('#menu_editTable,#category_editTable').delegate('.menuedit', 'click', function(event){
        var id = $(this).parents('tr').attr('data-id');
        var type = $(this).parents('tr').attr('data-type');
        getmenu(type,id,'','',function(a_menu){
            if(a_menu instanceof Array) a_menu = a_menu[0];
            //父级分类
            var html = '<option value="0">一级分类，无父级</option>';
            if(type =="menu"){
                for(var i=0;i<list_top_menu.length;i++){
                    html += '<option value="'+list_top_menu[i][0]+'" '+(a_menu.parent==list_top_menu[i][0]?"selected":"" )+' >'+list_top_menu[i][1]+'</option>'
                }
            }else if(type =="category"){
                for(var i=0;i<list_top_category.length;i++){
                    html += '<option value="'+list_top_category[i][0]+'">'+list_top_category[i][1]+'</option>'
                }
            }
            $('.menu_parent').html(html);
            //赋值
            $('input[name="menu_name"]').val(a_menu.name);
            $('input[name="menu_href"]').val(a_menu.href);
            $(".menu_target").val(a_menu.target);
            $('input[name="menu_sort"]').val(a_menu.sort);
            $('input[name="menu_info"]').val(a_menu.info);
            $('input[name="menu_pic"]').val(a_menu.pic);
            $('input[name="menu_price"]').val(a_menu.price);
            $('input[name="menu_icon"]').val(a_menu.icon);
            $('input[name="menu_other"]').val(a_menu.other);
            $('.menu_type').val(type).attr("disabled",true);
            $('input[name="menu_id"]').val(a_menu._id);
            var _modal = $('#menu_edit');
            //显示from框
            // _modal.find('.menu_type').val(type);
            _modal.modal();
        });
  //topmenu del
  }).delegate('.menudel', 'click', function(event) {
      var r=confirm("你确定要删除该数据，删除后不可恢复！");
    if(r==true){
        var _this = $(this).parents('tr');
        var id = _this.attr('data-id');
        $.getJSON('/admin/home/menu',{id:id},function(data){
            if(data.errno==0){
                _this.remove();
            }
        })
    }
  });
  //topmenu 翻页
    $('#menu_editTable_paginate').on('page', function(event, page){
        getmenu("menu",'','',page);
    });
  //menu新增保存修改
  $('#menu_edit').delegate('button.green','click',function(){
        var id = $('input[name="menu_id"]').val(),
            parent = $('.menu_parent').val(),
            name = $('input[name="menu_name"]').val(),
            href = $('input[name="menu_href"]').val(),
            target = $(".menu_target").val(),
            sort = $('input[name="menu_sort"]').val(),
            info = $('input[name="menu_info"]').val(),
            pic = $('input[name="menu_pic"]').val(),
            price = $('input[name="menu_price"]').val(),
            icon = $('input[name="menu_icon"]').val(),
            other = $('input[name="menu_other"]').val(),
            type = $('.menu_type').val();
        if(name =='' || href =='' || target =='' || sort =='' || type ==''){
            toastr.error("输入框不能为空，请检查！")
            return false;
        }
        //保存信息
        $.ajax({
            url:"/admin/home/menu",
            type:"POST",
            dataType:"json",
            data:{"id":id,"parent":parent,"name":name,"href":href,"target":target,"sort":sort,"info":info,"pic":pic,"price":price,"icon":icon,"other":other,"type":type}
        })
        .done(function(data) {
            if(data.errno == 0){//刷新
                $('#menu_edit').modal('hide');//关闭输入框
                getmenu(type)//显示
            }else{
                toastr.error(data.msg);
            }
        })
        .fail(function() {
                toastr.error('网络错误');
        });
  });

    //category edit
    // category刷新加载
  $('.categoryreload').on('click', function(){
    var _this = $(this), el = _this.parents('.tab-pane');
     Metronic.blockUI({target: el,animate: true,overlayColor: 'none'});
     getmenu('category','',el);
  });
  //category add
  $('.categoryadd').on('click', function(){
    var _modal = $('#menu_edit');
        //初始化父级分类
        var html = '<option value="0">一级分类，无父级</option>';
        for(var i=0;i<list_top_category.length;i++){
            html += '<option value="'+list_top_category[i][0]+'">'+list_top_category[i][1]+'</option>'
        }
        $('.menu_parent').html(html);
        $('input[name="menu_id"],input[name="menu_name"],input[name="menu_href"],input[name="menu_sort"],input[name="menu_info"],input[name="menu_pic"],input[name="menu_price"],input[name="menu_icon"],input[name="menu_other"]').val('');
        _modal.find('.menu_type').val('category').attr("disabled",true);
        _modal.modal();
  })
  //category 翻页
    $('#category_editTable_paginate').on('page', function(event, page){
        getmenu("category",'','',page);
    });
   //menu_parent
    $('.indexpageadd').on('click', function(){
        var _this = $(this);
        var _modal = $('#menu_edit');
        //初始化父级分类
        var html = '';
        for(var i=0;i<menuclass.length;i++){
            html += '<option value="'+menuclass[i][0]+'">'+menuclass[i][1]+'</option>'
        }
        $('.menu_parent').html(html);
        $('input[name="menu_id"],input[name="menu_name"],input[name="menu_href"],input[name="menu_sort"],input[name="menu_info"],input[name="menu_pic"],input[name="menu_price"],input[name="menu_icon"],input[name="menu_other"]').val('');
        _modal.find('.menu_type').val('index').attr('disabled',true);
        _modal.modal();
    });
    $('.indexpageload').on('click', function(){
        var _this = $(this);
        el = _this.parents('.tab-pane');
         Metronic.blockUI({target: el,animate: true,overlayColor: 'none'});
         getmenu('index','',el);
    });
    //category 翻页
    $('#index_editTable_paginate').on('page', function(event, page){
        getmenu("index",'','',page);
    });
    // 首页分栏目查询
    $('.search_submit').on('click', function(){
        var val = $('select[name="search_type"]').val();
        if(!val){
            toastr.error('查询条件不能为空');
            return false;
        }
        getBysearch('index',0,val);
    });

    

});

})(window.jQuery||window.Zepto);
