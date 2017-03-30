var SlideShow = (function(){
	function SlideShow(element, options){
		this.element = element;
		this.settings = $.extend(true, this.defaults, options||{});
		this.init();
	}
	
	//对象原型改写
	SlideShow.prototype = {
		//初始化插件
		init : function(){
			var me = this;
			me.selector = me.settings.selector;
			me.sections = me.element.find(me.selector.sections);
			me.section = me.element.find(me.selector.section);
			me.pagesCount = me.pagesCount();
			me.index = (me.settings.index > 0 && me.settings.index < me.pagesCount) ? me.settings.index : 0;
			me._initPaging();
			me._initEvent();
		},
		//获取轮播图数量
		pagesCount : function(){
			return this.section.length;
		},
		//上一页
		prev : function(){
			var me = this;
			if(me.index > 0){
				me.index --;
			}else if(me.settings.loop){
				me.index = me.pagesCount - 1;
			}
			me._slideAnimate();
		},
		//下一页
		next : function(){
			var me = this;
			if(me.index < me.pagesCount-1 ){
				me.index++;
			}else if(me.settings.loop){
				me.index = 0;
			}
			
			me._slideAnimate();
		},
		//初始化索引和布局
		_initPaging : function(){
			var me = this,
				pageClass = me.selector.pages.substring(1);
				me.activeClass = me.selector.active.substring(1);
			var winWidth = $(window).width(),
				sectionsW = me.settings.width;
				sectionW = (100 / me.pagesCount).toFixed(2),
				secImg = me.section.find("img");
			var widthUnits = me.settings.width.substr(me.settings.width.length-1,1);

			me.sections.parent().css({
				"position" : "relative",
				"overflow" : "hidden",
				"width" : me.settings.width
			});
			if(widthUnits == "%"){
				me.sections.css({"width" : parseInt(me.settings.width) * me.pagesCount +"%",  "position" : "absolute"});
			}else{
				me.sections.css({"width" : parseInt(me.settings.width) * me.pagesCount +"px",  "position" : "absolute"});
			}
			
			var proportion = me.settings.proportion;
			 
			if(proportion){
				me.section.css({"width" : sectionW + '%', "float" : "left"});
				if(widthUnits == "%"){
					var sectionsH = winWidth * parseInt(me.settings.width)/100 * me.settings.proportion;
					me.sections.parent().css({"height" : sectionsH + "px"});
					me.section.css({"height" : sectionsH + "px"});
				}
				else{
					var sectionsH =  parseInt(me.settings.width) * me.settings.proportion;
					me.sections.parent().css({"height" : sectionsH + "px"});
					me.section.css({"height" : sectionsH + "px"});
				}
			}else if(me.settings.height){
				me.section.css({"width" : sectionW + '%', "height" : me.settings.height + "px", "float" : "left"});
				me.sections.parent().css({"height" : me.settings.height + "px"})
			}
			
			secImg.css({"width" : "100%"});
			if(me.settings.nav){
				var pageHTML = '<ul class = ' + pageClass + '>';
				for(var i = 0; i < me.pagesCount; i++){
					pageHTML += '<li></li>';
				}

				me.element.append(pageHTML);
				var pages = me.element.find(me.selector.pages);
				me.pageItem = pages.find("li");
				me.pageItem.eq(me.index).addClass(me.activeClass);
				pages.css({
					"position" : "absolute",
					"width" : "20%",
					"bottom" : "20px",
					"right" : "10px",
					"z-index" : "999",
					"overflow" : "hidden",
					"text-align" : "right",

				});
				me.pageItem.css({
					"float" : "left",
					"display" : "inline-block",
					"width" : "20px",
					"height" : "20px",
					"border-radius" : "50%",
					"margin-left" : "8px"
				});
			}

		},
		//初始化插件事件
		_initEvent : function(){
			var me = this;
			touchPosX = 0;
			
			var intervalAnimate = setInterval(function(){
				me.next();
			},me.settings.interval);
			me.element.on("touchstart", function(e){
				clearInterval(intervalAnimate);
				e.preventDefault();
				touchPosX = e.originalEvent.targetTouches[0].pageX;
			});
			me.element.on("touchend", function(e){
				e.preventDefault();
				clearInterval(intervalAnimate);
				var changeX = e.originalEvent.changedTouches[0].clientX - touchPosX;
				if(changeX < 0){
					me.next();
				}
				if(changeX > 0){
					me.prev();
				}
				
				setTimeout(function(){
					clearInterval(intervalAnimate);
					intervalAnimate = setInterval(function(){
						me.next();
				},me.settings.interval)
				},me.settings.interval);
			});
			
			
		},
		//滚动动画
		_slideAnimate : function(){
			var me = this;
			var dest = me.section.eq(me.index).position();
			if(!dest) return;
			var translate = 'translateX(-' + dest.left + 'px)';
			
			me.sections.css("transition", "all " + me.settings.duration + "ms " + me.settings.easing);
			me.sections.css({"transform" : translate});
			me.pageItem.eq(me.index).addClass(me.activeClass).siblings("li").removeClass(me.activeClass);
		}
	};
		return SlideShow;
})();

SlideShow.prototype.defaults = {
	selector : {
		sections : '.sections',
		section : '.section',
		pages : '.pages',
		active : '.active'
	}, //元素类名
	index : 0, //初始索引
	loop : true, //循环播放
	duration : 500, //动画过渡时间
	easing : 'ease-in-out', //动画过渡easing
	width : "100%", //宽度，可设置百分比或像素
	height : "200px", //高度
	interval : 4000, //轮播时间间隔
	proportion : 0.6, //宽长比例，设置后height失效
	nav : true //是否显示索引，需要自行编写li颜色和active颜色
}

//示范
// var options = {
// 	interval : 5000,
// 	width : "100%",
// 	proportion : 0.42
// };
// var slideShowAnimate = new SlideShow($(".slideplay"),options);