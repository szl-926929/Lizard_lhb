define(["libs","cBase","cUILayer"],function(a,b,c){var d={},e={prefix:"cui-",sleep:2},f=null,g=null,h=null,i=function(a){this.hide(),a&&"function"==typeof a&&a.call(this),$(".cui-opacitymask").unbind("click"),$(".cui-toast").unbind("click")},j=function(a,b){var c=this,d=function(){$(".cui-opacitymask").unbind("click").bind("click",function(){i.call(c,b)}),$(".cui-toast").unbind("click").bind("click",function(){i.call(c,b)})};a&&setTimeout(d,400)},k=function(a,b,c,d){var h=this;this.setContent(a),"function"==typeof g&&g.call(this);var k=function(){i.call(h,c)},l=1e3*(b||e.sleep);f=setTimeout(k,l),j.call(this,d,c),this.focusPosition=setInterval($.proxy(function(){var a=document.activeElement;if($.needFocus(a)){this.focusPosition||(this.focusPosition=!0);var b=parseInt($(a).offset().top)+30;this.root.css({top:b+"px",position:"absolute"})}},this),20)},l=function(){clearTimeout(f),this.focusPosition&&(clearInterval(this.focusPosition),this.root.css({top:"50%",position:"fixed"})),"function"==typeof h&&h.call(this)};d.__propertys__=function(){g=this.show,h=this.hide,this.show=k,this.hide=l},d.initialize=function($super,a){this.addClass([e.prefix+"toast"]),$super(a)},d.setContent=function(a){this.create(),this.contentDom.html(a)};var m=new b.Class(c,d);return m});