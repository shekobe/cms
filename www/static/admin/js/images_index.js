//加载ueditor
$(function () {
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
//
    var range = '';
        //按日期查询图片
    $('.j_search').on('click', function () {
        var t = $(this);
        range = t.attr('data-value');
        t.addClass('btn-primary').removeClass('default').siblings().addClass('default').removeClass('btn-primary');
        getTempleList(null, null, range);
    });

    //删除行数据
    $('#sample_editable_1').on('click', '.delete', function (e) {
        e.preventDefault();
        if (confirm("确定要删除吗 ?") == false) {
            return false;
        }
        var t = $(this);
        var id = t.attr('data-id');
        $.getJSON('/admin/images/deldata', {"id": id}, function (json, textStatus) {
            if (json.errno == 0) {//返回数据正常
                getTempleList();//更新表格
            } else {
                toastr.error('删除失败');
            }
        });

    });

    template.helper('sizeFormat', function (size, pointLength, units) {
        var unit;

        units = units || ['B', 'K', 'M', 'G', 'TB'];

        while ((unit = units.shift()) && size > 1024) {
            size = size / 1024;
        }

        return (unit === 'B' ? size : size.toFixed(pointLength || 2)) +
            unit;
    });

    // 设置每个评论晒图张数用大图片地址
    function setImgCount() {
        $('.j_zimg').each(function () {
            var t = $(this);

            var $img = t.find('.commentImg');
            $img.each(function () {

                var tt = $(this);
                var src = tt.attr('src');
                var img = new Image();
                img.onload = function () {
                    // window.console && console.log('width = ' + this.width + ' , height =' + this.height);
                    var $size = tt.siblings('.img_item').find('.j_size');
                    var str = $size.text();
                    $size.text('(' + this.width + '*' + this.height + ')' + str);
                    tt.siblings('.img_item').find('.mix-preview').attr('data-title', '(' + this.width + '*' + this.height + ')' + str);
                    AutoResizeImage(150, 150, tt.get(0), this.src);
                };
                img.src = src;
            });

            // 缩放图片，imgSrc用户延迟加载图片url
            function AutoResizeImage(maxWidth, maxHeight, objImg, imgSrc) {
                var img = new Image();
                img.src = imgSrc || objImg.src;
                var hRatio;
                var wRatio;
                var Ratio = 1;
                var w = img.width;
                var h = img.height;
                wRatio = maxWidth / w;
                hRatio = maxHeight / h;
                if (maxWidth == 0 && maxHeight == 0) {
                    Ratio = 1;
                } else if (maxWidth == 0) {
                    if (hRatio < 1) Ratio = hRatio;
                } else if (maxHeight == 0) {
                    if (wRatio < 1) Ratio = wRatio;
                } else if (wRatio < 1 || hRatio < 1) {
                    Ratio = (wRatio <= hRatio ? wRatio : hRatio);
                }
                if (Ratio < 1) {
                    w = w * Ratio;
                    h = h * Ratio;
                }
                objImg.style.height = Math.round(h) + "px";
                objImg.style.width = Math.round(w) + "px";

                if (h < maxHeight) { // 纵向有空余空间
                    objImg.style.marginTop = Math.round((maxHeight - h) / 2) + "px";
                }
                if (w < maxWidth) { // 横向有空余空间
                    objImg.style.marginLeft = Math.round((maxWidth - w) / 2) + "px";
                }
                $(objImg).show();
                if (!!!objImg.src)
                    objImg.src = imgSrc;
            }

        });

    }

    /**
     * 页面通用函数
     */
//
    //获取页面列表
    function getTempleList(page, nums) {//getuserbyname
        $.ajax({
            url: '/admin/images/gettepmlist',
            type: 'GET',
            cache: false,
            data: {"page": page || 1, "nums": nums || 30, range: range || '',operator:sesisonObj.username || ""},
            success: function (data) {
                if (data.data) {
                    //返回数据正常
                    var str = template('userlist2', data.data);
                    $('.j_container').html(str);
                    //$('.mix-grid').mixitup();
                    // TableEditable.init($('#sample_editable_1'));
                    //基础信息
                    setImgCount();

                    $('#sample_editable_1_info').text("第" + data.data.currentPage + "/" + data.data.totalPages + "页，共" + data.data.count + "条")
                    //分页信息
                    $('#sample_editable_1_paginate').bootpag({
                        total: data.data.totalPages,
                        page: data.data.currentPage,
                        maxVisible: 15
                    })
                    setCopy($('.j_container').find('.j_preview'));
                }
            }
        });
    }

    function setCopy(obj) {
        obj.each(function (index) {
            var t = $(this);
            t.zclip({
                path: '/static/admin/js/pulgins/zclip/ZeroClipboard.swf',
                copy: function () {
                    return $(this).attr('data-value');
                },
                afterCopy: function () {/* 复制成功后的操作 */
                    toastr.success('图片链接地址复制成功');
                    //$.bootstrapGrowl('图片链接地址复制成功', {
                    //    ele: 'body', // which element to append to
                    //    type: 'success',// (null, 'info', 'danger', 'success', 'warning')
                    //    //offset: {
                    //    //    from: $('#growl_offset').val(),
                    //    //    amount: parseInt($('#growl_offset_val').val())
                    //    //}, // 'top', or 'bottom'
                    //    align: 'center' // ('left', 'right', or 'center')
                    //    //width: parseInt($('#growl_width')), // (integer, or 'auto')
                    //    //delay: $('#growl_delay').val(), // Time while the message will be displayed. It's not equivalent to the *demo* timeOut!
                    //    //allow_dismiss: $('#glowl_dismiss').is(":checked"), // If true then will display a cross to close the popup.
                    //    //stackup_spacing: 10 // spacing between consecutively stacked growls.
                    //});
                }
            });
        });

    }

    //分页点击
    $('#sample_editable_1_paginate').on('page', function (event, page) {
        getTempleList(page);
    });

});
