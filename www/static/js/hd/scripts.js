//十六位颜色代码转化成RGB颜色
function Sixteen2RGB(str) {;
    if (str.substr(0, 1) == "#"){
      str = str.substring(1);
    }
    if (str.length != 6){
          return false;
       } 
    str = str.toLowerCase();
    var b =[],c = [];
    for (var x = 0; x < 3; x++) {
        b[0] = str.substr(x * 2, 2);
        b[3] = "0123456789abcdef";
        b[1] = b[0].substr(0, 1);
        b[2] = b[0].substr(1, 1);
        c.push(b[3].indexOf(b[1]) * 16 + b[3].indexOf(b[2]));
    }
    return c.join(',');
}
//RGB颜色转化成十六位颜色代码
function RGB2Sixteen(arr) {
    var str = "#";
    for(var i=0;i < arr.length;i++){
    	if(arr[i] =='') arr[i] = 0;
		arr[i] = parseInt(arr[i]);
    	if(typeof arr[i] !== "number") return false;
    	if(arr[i] <0 || arr[i] > 255) return false;
    	var c = "0123456789abcdef";
        var a = arr[i] % 16;
        var b = c.substr(a, 1);
        a = (arr[i] - a) / 16;
        str += c.substr(a, 1) + b
    }
    return str;
}
/*监测本地保存*/
function supportstorage() {
	if (typeof window.localStorage=='object') 
		return true;
	else
		return false;		
}
/*保存布局*/
function handleSaveLayout() {
	var e = $(".demo").html();
	if (!stopsave && e != window.demoHtml) {
		stopsave++;
		window.demoHtml = e;
		saveLayout();
		stopsave--;
	}
}
/*同类型节点移除样式*/
function removeMenuClasses() {
	$("#menu-layoutit .btn-group button").removeClass("active");
}
var layouthistory;
//保存布局信息 
function saveLayout(){
	var data = layouthistory;
	if (!data) {
		data={};
		data.count = 0;
		data.list = [];
	}
	if (data.list.length>data.count) {
		for (i=data.count;i<data.list.length;i++)
			data.list[i]=null;
	}
	data.list[data.count] = window.demoHtml;
	data.count++;
	if (supportstorage()) {
		localStorage.setItem("layoutdata",JSON.stringify(data));
	}
	layouthistory = data;
	var _id = $.trim($('#spa_pageid').val())
	var name = $.trim($('#spa_name').val())
	var path = $.trim($('#spa_viewpath').val())
	if(!name){
		$('#spa_name').siblings('.help-block').text("页面名称不能为空");
		return false;
	}
	if(!path){
		$('#spa_viewpath').siblings('.help-block').text("访问路径不能为空");
		return false;
	}
	//confirm  is new or update
	var url = _id? '/admin/template/updatedata':'/admin/template/addlist';
	$.ajax({  
		type: "POST",  
		url: url,  
		data: {
			"updateBy":sesisonObj.username,
            "pageName":name,
            "id":_id,
            "path":path,
            "releaseType":'activety',
            "useLayout":'0',
            "content":$('.demo').html()
			},  
		success: function(data) {
			//updateButtonsVisibility();
		}
	});
}
//下载布局信息
function downloadLayout(){
	$.ajax({  
		type: "POST",  
		url: "/build/downloadLayout",  
		data: { layout: $('#download-layout').html() },  
		success: function(data) { window.location.href = '/build/download'; }
	});
}
//下载html布局
function downloadHtmlLayout(){
	$.ajax({  
		type: "POST",  
		url: "/build/downloadLayout",  
		data: { layout: $('#download-layout').html() },  
		success: function(data) { window.location.href = '/build/downloadHtml'; }
	});
}

function undoLayout() {
	var data = layouthistory;
	//console.log(data);
	if (data) {
		if (data.count<2) return false;
		window.demoHtml = data.list[data.count-2];
		data.count--;
		$('.demo').html(window.demoHtml);
		if (supportstorage()) {
			localStorage.setItem("layoutdata",JSON.stringify(data));
		}
		return true;
	}
	return false;
	/*$.ajax({  
		type: "POST",  
		url: "/build/getPreviousLayout",  
		data: { },  
		success: function(data) {
			undoOperation(data);
		}
	});*/
}
//重做
function redoLayout() {
	var data = layouthistory;
	if (data) {
		if (data.list[data.count]) {
			window.demoHtml = data.list[data.count];
			data.count++;
			$('.demo').html(window.demoHtml);
			if (supportstorage()) {
				localStorage.setItem("layoutdata",JSON.stringify(data));
			}
			return true;
		}
	}
	return false;
	/*
	$.ajax({  
		type: "POST",  
		url: "/build/getPreviousLayout",  
		data: { },  
		success: function(data) {
			redoOperation(data);
		}
	});*/
}

function handleJsIds() {
	handleModalIds();
	handleAccordionIds();
	handleCarouselIds();
	handleTabsIds()
}
function handleAccordionIds() {
	var e = $(".demo #myAccordion");
	var t = randomNumber();
	var n = "accordion-" + t;
	var r;
	e.attr("id", n);
	e.find(".accordion-group").each(function(e, t) {
		r = "accordion-element-" + randomNumber();
		$(t).find(".accordion-toggle").each(function(e, t) {
			$(t).attr("data-parent", "#" + n);
			$(t).attr("href", "#" + r)
		});
		$(t).find(".accordion-body").each(function(e, t) {
			$(t).attr("id", r)
		})
	})
}
function handleCarouselIds() {
	var e = $(".demo #myCarousel");
	var t = randomNumber();
	var n = "carousel-" + t;
	e.attr("id", n);
	e.find(".carousel-indicators li").each(function(e, t) {
		$(t).attr("data-target", "#" + n)
	});
	e.find(".left").attr("href", "#" + n);
	e.find(".right").attr("href", "#" + n)
}
function handleModalIds() {
	var e = $(".demo #myModalLink");
	var t = randomNumber();
	var n = "modal-container-" + t;
	var r = "modal-" + t;
	e.attr("id", r);
	e.attr("href", "#" + n);
	e.next().attr("id", n)
}
function handleTabsIds() {
	var e = $(".demo #myTabs");
	var t = randomNumber();
	var n = "tabs-" + t;
	e.attr("id", n);
	e.find(".tab-pane").each(function(e, t) {
		var n = $(t).attr("id");
		var r = "panel-" + randomNumber();
		$(t).attr("id", r);
		$(t).parent().parent().find("a[href=#" + n + "]").attr("href", "#" + r)
	})
}
function randomNumber() {
	return randomFromInterval(1, 1e6)
}
function randomFromInterval(e, t) {
	return Math.floor(Math.random() * (t - e + 1) + e)
}
function gridSystemGenerator() {
	$(".lyrow .preview input").bind("keyup", function() {
		var e = 0;
		var t = "";
		if($(this).attr('data-type') == 'b-center'){//居中布局
			var n = $(this).val();
			var w = parseInt(n);
			var p = /\d+(%)$/g.test(n)?'%':'px';
			if((typeof w === 'number')&& w < 2561 && w >1){
				t = w+p;
			}else{
				t = '1240px';
			}
			$(this).parent().siblings('.view').children().width(w+p);
			$(this).parent().prev().show()
		}else{
			var n = $(this).val().split(" ", 12);
			$.each(n, function(n, r) {
				e = e + parseInt(r);
				t += '<div class="col-md-' + r + ' column"></div>'
			});
			if (e == 12) {
				$(this).parent().next().children().html(t);
				$(this).parent().prev().show()
			} else {
				$(this).parent().prev().hide()
			}
		}
	})
}
//配置信息
function configurationElm(e, t) {
	// $(".demo").delegate(".configuration > a", "click", function(e) {
	// 	e.preventDefault();
	// 	var t = $(this).parent().next().next().children();
	// 	$(this).toggleClass("active");
	// 	t.toggleClass($(this).attr("rel"))
	// });
	$(".demo").delegate(".configuration .dropdown-menu a", "click", function(e) {
		e.preventDefault();
		var t = $(this).parent().parent();
		var n = t.parent().parent().next().next().children();
		t.find("li").removeClass("active");
		$(this).parent().addClass("active");
		var r = "";
		t.find("a").each(function() {
			r += $(this).attr("rel") + " "
		});
		t.parent().removeClass("open");
		n.removeClass(r);
		n.addClass($(this).attr("rel"))
	})
}
function removeElm() {
	$(".demo").delegate(".remove", "click", function(e) {
		e.preventDefault();
		$(this).parent().remove();
		if (!$(".demo .lyrow").length > 0) {
			clearDemo()
		}
	})
}
//清空
function clearDemo() {
	$(".demo").empty();
	layouthistory = null;
	if (supportstorage())
		localStorage.removeItem("layoutdata");
}

function changeStructure(e, t) {
	$("#download-layout ." + e).removeClass(e).addClass(t)
}
//清除
function cleanHtml(e) {
	$(e).parent().append($(e).children().html())
}
//下载
function downloadLayoutSrc() {
	var e = "";
	$("#download-layout").children().html($(".demo").html());
	var t = $("#download-layout").children();
	t.find(".preview, .configuration, .drag, .remove").remove();
	t.find(".lyrow").addClass("removeClean");
	t.find(".box-element").addClass("removeClean");
	t.find(".lyrow .lyrow .lyrow .lyrow .lyrow .removeClean").each(function() {
		cleanHtml(this)
	});
	t.find(".lyrow .lyrow .lyrow .lyrow .removeClean").each(function() {
		cleanHtml(this)
	});
	t.find(".lyrow .lyrow .lyrow .removeClean").each(function() {
		cleanHtml(this)
	});
	t.find(".lyrow .lyrow .removeClean").each(function() {
		cleanHtml(this)
	});
	t.find(".lyrow .removeClean").each(function() {
		cleanHtml(this)
	});
	t.find(".removeClean").each(function() {
		cleanHtml(this)
	});
	t.find(".removeClean").remove();
	$("#download-layout .column").removeClass("ui-sortable");
	$("#download-layout .row-fluid").removeClass("clearfix").children().removeClass("column");
	if ($("#download-layout .container").length > 0) {
		changeStructure("row-fluid", "row")
	}
	formatSrc = $.htmlClean($("#download-layout").html(), {
		format: true,
		allowedAttributes: [
			["id"],
			["class"],
			["data-toggle"],
			["data-target"],
			["data-parent"],
			["role"],
			["data-dismiss"],
			["aria-labelledby"],
			["aria-hidden"],
			["data-slide-to"],
			["data-slide"]
		]
	});
	$("#download-layout").html(formatSrc);
	$("#downloadModal textarea").empty();
	$("#downloadModal textarea").val(formatSrc)
}
//当前编辑属性的dom
var currentproperty = null;
var currentDocument = null;
var timerSave = 1000;
var stopsave = 0;
var startdrag = 0;
var demoHtml = $(".demo").html();
var currenteditor = null;
$(window).resize(function() {
	$("body").css("min-height", $(window).height() - 90);
	$(".demo").css("min-height", $(window).height() - 160)
});
$(window).on('resize scroll',function(){
	var mt = $(window).scrollTop();
	setTimeout(function(){
		if($('.editcontainer .page-sidebar-menu').parent().hasClass('slimScrollDiv')){
			$('.editcontainer .slimScrollDiv').stop().animate({"margin-top":mt},200);
		}else{
			$('.editcontainer .page-sidebar-menu').stop().animate({"margin-top":mt},200);			
		}
	},200);
})
function restoreData(){
	if (supportstorage()) {
		layouthistory = JSON.parse(localStorage.getItem("layoutdata"));
		if (!layouthistory) return false;
		window.demoHtml = layouthistory.list[layouthistory.count-1];
		if (window.demoHtml) $(".demo").html(window.demoHtml);
	}
}

function initContainer(){
	$(".demo, .demo .column").sortable({
		connectWith: ".column",
		opacity: 1,
		handle: ".drag",
		start: function(e,t) {
			if (!startdrag) stopsave++;
			startdrag = 1;
		},
		stop: function(e,t) {
			if(stopsave>0) stopsave--;
			startdrag = 0;
		}
	});
	configurationElm();
}
$(function() {
	restoreData();

	//ueditor
	var ueconfig={toolbars: [["source","undo","redo","insertunorderedlist","insertorderedlist","link","unlink","help","simpleupload","insertimage","emotion","pagebreak","date","bold","italic","fontborder","strikethrough","underline","forecolor","justifyleft","justifycenter","justifyright","justifyjustify","paragraph","rowspacingbottom","rowspacingtop","lineheight"]]};
	window.ue = UE.getEditor('contenteditor',ueconfig) || null;
		
	$("body").css("min-height", $(window).height() - 90);
	$(".demo").css("min-height", $(window).height() - 160);
	
	$(".sidebar-nav .lyrow").draggable({
		connectToSortable: ".demo",
		helper: "clone",
		handle: ".drag",
		start: function(e,t) {
			if (!startdrag) stopsave++;
			startdrag = 1;
		},
		drag: function(e, t) {
			t.helper.width("100%").height('auto');			
		},
		stop: function(e, t) {
			$(".demo .column").sortable({
				opacity: 1,
				connectWith: ".column",
				start: function(e,t) {
					if (!startdrag) stopsave++;
					startdrag = 1;
				},
				stop: function(e,t) {
					if(stopsave>0) stopsave--;
					startdrag = 0;
				}
			});
			if(stopsave>0) stopsave--;
			startdrag = 0;
			//固定布局
			if(t.helper.find('.pagecenter').length >0){
				t.helper.addClass('pagecenter').width(t.helper.find('.pagecenter').width());
			}
			
		}
	});
	$(".sidebar-nav .box").draggable({
		connectToSortable: ".column",
		helper: "clone",
		handle: ".drag",
		start: function(e,t) {
			if (!startdrag) stopsave++;
			startdrag = 1;
		},
		drag: function(e, t) {
			t.helper.width("100%").css({"min-height":"1px","height":"auto"});
		},
		stop: function() {
			handleJsIds();
			if(stopsave>0) stopsave--;
			startdrag = 0;
			// t.helper.width("100%")
		}
	});
	initContainer();
	//编辑属性
	$('.editcontainer').delegate("[data-target=#propertyModal]","click",function(e) {
		var _this = $(this).parent().siblings('.view').children();
		currentproperty = _this;
		var _style = _this.children('.column').attr("style") || '';
		var arr = _style.split(";")
		var _width=_height=_bgcolor=_bgimg=_bgrepeat=_bgpostion='',newstyle=[];
		for(var i=0;i<arr.length;i++){
			arr[i] = $.trim(arr[i]);
			if(/^width:/i.test(arr[i])){ 
				_width = $.trim(arr[i].split(':')[1]);
			}else if(/^height:/i.test(arr[i])){ 
				_height = $.trim(arr[i].split(':')[1]);
			}else if(/^background-color:/i.test(arr[i])){ 
				_bgcolor = $.trim(arr[i].split(':')[1]);
			}else if(/^background:/i.test(arr[i])){//background
				var newarr=[],list = arr[i].replace(/"|'/g,'').replace(/,\s(?=\d+)/g,',').split(" ");
				for(var m=0;m<list.length;m++){
					if(/^#([0-9a-f]{3}|[0-9a-f]{6})/i.test(list[m])){//16进制
						_bgcolor = list[m];
					}else if(/^rgb/i.test(list[m])){//rgb 颜色转义
						var c = list[m].slice(4);
						_bgcolor= RGB2Sixteen(c.substring(0,c.length -1).split(","))
					}else if(/^url/i.test(list[m])){//图片地址分离
						_bgimg = list[m].split('(')[1].replace(/(\))$/,'')
					}else if(/(repeat)/ig.test(list[m])){ //repeat
						_bgrepeat = list[m];
					}else{//position
						if(!/background/i.test(list[m]))
							newarr.push(list[m]);
					}
				}
				if(newarr.length >1)
					_bgpnpmostion = newarr.join(' ');
			}else{
				newstyle.push(arr[i]); 
			} 
		}
		if(newstyle.length>0)
			newstyle = newstyle.join(';');

		var m = $('#propertyModal');
		m.find('input[name="modal-width"]').val(_width); 
		m.find('input[name="modal-height"]').val(_height);
		if(_bgcolor == "#000000") _bgcolor ='';
		m.find('input[name="modal-bgcolor"]').val(_bgcolor);
		m.find('span[name="modal-bgcolor-show"]').css("background-color",_bgcolor).text(_bgcolor);
		m.find('input[name="modal-bgimage"]').val(_bgimg);
		m.find('input[name="modal-repeat"]:checked').val(_bgrepeat);
		m.find('input[name="modal-position"]:checked').val(_bgpostion);
		if(newstyle && typeof newstyle === 'string'){
			m.find('input[name="modal-style"]').val(newstyle);
		}

	});
	//修改属性的背景颜色
	$('#propertyModal input[name="modal-bgcolor"]').on('change',function(){
		var str = $(this).val();
		if(str && /^#([0-9a-f]{3}|[0-9a-f]{6})/i.test(str))
			$(this).siblings('span[name="modal-bgcolor-show"]').css("background-color",str).text(str);
	})
	//保存属性
	$('#propertyModal .btn-primary').on('click',function(){
		var _this = $('#propertyModal');
		var _width = _this.find('input[name="modal-width"]').val() || '';
		var _height = _this.find('input[name="modal-height"]').val() || '';
		var _bgcolor = _this.find('input[name="modal-bgcolor"]').val() || '';
		var _bgimg = _this.find('input[name="modal-bgimage"]').val() || '';
		var _bgrepeat = _this.find('input[name="modal-repeat"]:checked').val() || '';
		var _bgpostion = _this.find('input[name="modal-position"]:checked').val() || '';
		var _style = _this.find('input[name="modal-style"]').val() || '';
		if(_style) currentproperty.attr('style',_style);
		if(_width){
			currentproperty.children('.column').css('width',_width);
			if(currentproperty.hasClass('.pagecenter'))
				currentproperty.css('width',_width);
		}
		if(_height) currentproperty.children('.column').css('height',_height);
		if(_bgcolor && /^#([0-9a-f]{3}|[0-9a-f]{6})/i.test(_bgcolor)) currentproperty.children('.column').css('background-color',_bgcolor);
		if(_bgimg) currentproperty.children('.column').css('background',(_bgcolor?_bgcolor:'')+' url('+_bgimg+') '+_bgrepeat+' '+_bgpostion+'');
		_this.removeClass('in').hide();
		$('.modal-backdrop').removeClass('in').hide();
	});
	//富文本编辑器
	$('.editcontainer').delegate("[data-target=#editorModal]","click",function(e) {
		e.preventDefault();
		currenteditor = $(this).parent().parent().find('.view');
		var eText = currenteditor.html();
		ue.setContent(eText);
	});
	//保存
	$("#savecontent").click(function(e) {
		e.preventDefault();
		var content = ue.getContent();//contenthandle.getData()
		currenteditor.html(content);
	});
	$("[data-target=#downloadModal]").click(function(e) {
		e.preventDefault();
		downloadLayoutSrc();
	});
	$("[data-target=#shareModal]").click(function(e) {
		
		// 
	});
	//保存
	$('#saveModal').delegate('.btn-primary','click',function(e){
		e.preventDefault();
		handleSaveLayout();
	})
	//取消

	$("#download").click(function() {
		downloadLayout();
		return false
	});
	$("#downloadhtml").click(function() {
		downloadHtmlLayout();
		return false
	});
	/**
	 * 头部菜单功能
	 */
	//编辑
	$("#edit").click(function() {
		$("body").removeClass("layoutedit topreview").addClass("edit");
		removeMenuClasses();
		$(this).addClass("active");
		return false
	});
	//清除
	$("#clear").click(function(e) {
		e.preventDefault();
		clearDemo()
	});
	//布局编辑
	$("#layoutedit").click(function() {
		$("body").removeClass("edit topreview").addClass("layoutedit");
		removeMenuClasses();
		$(this).addClass("active");
		return false
	});
	//预览
	$("#topreview").click(function() {
		$("body").removeClass("edit layoutedit").addClass("topreview");
		removeMenuClasses();
		$(this).addClass("active");
		return false
	});
	$("#fluidPage").click(function(e) {
		e.preventDefault();
		changeStructure("container", "container-fluid");
		$("#fixedPage").removeClass("active");
		$(this).addClass("active");
		downloadLayoutSrc()
	});
	$("#fixedPage").click(function(e) {
		e.preventDefault();
		changeStructure("container-fluid", "container");
		$("#fluidPage").removeClass("active");
		$(this).addClass("active");
		downloadLayoutSrc()
	});
	$(".nav-header").click(function() {
		$(".sidebar-nav .boxes, .sidebar-nav .rows").hide();
		$(this).next().slideDown()
	});
	//撤销
	$('#undo').click(function(){
		stopsave++;
		if (undoLayout()) initContainer();
		stopsave--;
	});
	//重做
	$('#redo').click(function(){
		stopsave++;
		if (redoLayout()) initContainer();
		stopsave--;
	});
	


	removeElm();
	gridSystemGenerator();
	setInterval(function() {
		handleSaveLayout()
	}, timerSave)



	//左侧菜单切换
	$(".sidebar-nav .page-sidebar-menu li > a").on('click',function(){
		var _this = $(this).parent('li');
		if($('.j_leftsidebar').hasClass('page-sidebar-menu-closed')){
			if(_this.hasClass('open')){
				_this.removeClass('open').children('ul.sub-menu').slideUp('400');
		        _this.find('> a > .arrow.open').removeClass('open');
			}else{
				_this.addClass('open').siblings('.open').removeClass('open').children('ul.sub-menu').slideUp('400');
				_this.children('ul.sub-menu').slideDown('400');
		        _this.find('> a > .arrow').addClass('open');
			}
		}
		 
	});
})


/**
 *  页面js重写
 */


	
