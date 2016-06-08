(function($){
$(function(){
	//移除事件绑定
	$(".nav-product").off();
	 /*滚动图*/
    $('#prod_good_sale').carousel({
            auto:5000,
            clickWarp:'.prod-good-sale-1',
            itemWarp:'#prod-good-sale-list',
            itemwidth:310,
            itemheight:383
    });
    //==banner滚动效果
    // PicSrollFun({
    //     area: $("#picScoll_box_1"), 				
    //     box: $("#picScoll_img_1"), 				
    //     btn: $("#Btn_1"), 		
    //     leftBtn:$("#leftBtn"), 	
    //     rightBtn:$("#rightBtn"),				
    //     autoPlay: true							
    // });
    $('#banner-slide').slider({
        next:".btn_next",
        prev:".btn_prev",
        listnumObj:'.banner-num li',
        itemwarp:'.banner-box ul'
    });
    QK.cookies('isMobile','n',7,getPath('domain').slice(1));

});
})(window.jQuery||window.Zepto);