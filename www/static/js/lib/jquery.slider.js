/**
 *   slider by @teen 
 *   emain: hewendong@360shouji.com
 *
 */

(function($) {
	//  Create a jQuery plugin
	$.fn.slider = function(options) {
		var defaults = {
			next: ".J_next", //下一个按钮
			prev: ".J_prev", //上一个按钮
			auto: 5000, //是否自动滚动,动画间隔延迟时间 如果时间为0 关闭自动滚动
			speed: 200, //动画时间
			itemwarp:'.itemWarp',//列表
			listnumObj:'.J_number li', //是否有计数机,计数器的选择器
			active:'on',//计数器hover,默认为on
		};
		var opt = $.extend({}, defaults, options);

		//  Enable multiple-slider support
		return this.each(function(i) {
			var _this = $(this);
			var len = $(opt.itemwarp).children().length;//总个数

			var _animate = function(index){
				if($(opt.itemwarp).children().is(":animated")) return false;
				// console.log('animate:'+index);
				//滚动中
				$(opt.itemwarp).children().eq(index).fadeIn(opt.speed).addClass(opt.active).siblings().fadeOut(opt.speed).removeClass(opt.active);
				$(opt.listnumObj).eq(index).addClass(opt.active).siblings().removeClass(opt.active);
			}
			//下一个
			_this.delegate(opt.next, 'click', function(event) {
				var index = $(opt.itemwarp).children('.'+opt.active).index();
				// console.log('next --> current :'+index+',all = '+len)
				if(index == len-1){
					index = 0;
				}else{
					index++;
				}
				_animate(index);
			})//上一个
			.delegate(opt.prev, 'click', function(event) {
				var index = $(opt.itemwarp).children('.'+opt.active).index();
				// console.log('prev --> current :'+index+',all = '+len)
				if(index == 0){
					index = len-1;
				}else{
					index--;
				}
				_animate(index);
			})//计数器
			.delegate(opt.listnumObj, 'click', function(event) {
				var numbers = $(opt.listnumObj).length;
				if(numbers > len) return false;
				var index = $(this).index();
				_animate(index);
			});
			var timer;
			$(this).hover(function(){// hover
				if(opt.auto !== 0){
					clearInterval(timer);
				}
			},function(){//out
				if(opt.auto !== 0){
					timer = setInterval(function(){
						var index = $(opt.itemwarp).children('.'+opt.active).index();
						if(index == len-1){
							index = 0;
						}else{
							index++;
						}
						_animate(index);
					},opt.auto);
				}
			}).trigger('mouseleave');

		});
	};

})(jQuery);