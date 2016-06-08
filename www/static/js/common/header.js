/* header js 调用 */
;(function($){
    $(function(){
    	//menu
        $('.nav-menu').on('click touch', function(){
            var el =$(this).parents('.nav');
            el.hasClass('openMenu')?el.removeClass('openMenu'):el.addClass('openMenu');
        });
        //footer
        $('.ser-cont h3 a').on('click touch', function(){
            var el =$(this).parents('.ser-cont');
            el.hasClass('open-cont')?el.removeClass('open-cont'):el.addClass('open-cont');
        });
        //select region
        $('.select-region').on('click touch', function(){
            $('#mask').show();
            $('.region-selection').addClass('fadein');
        });
        //close
        $('.close-selection,#mask').on('click touch', function(){
            $('.region-selection').removeClass('fadein');
            $('#mask').hide();
        });

    });
})(window.jQuery || window.Zepto);