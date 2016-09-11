define(["cUIBase","libs"],function(a){var b=function(b){this.element,this.clazz=[a.config.prefix+"history"],this.maskName="maskName",this.style={},this.size=!1,this.listSize=6,this.itemClickFun=null,this.focusFun=null,this.blursFun=null,this.inputFun=null,this._id=a.getCreateId(),this._boxDom,this._borderDom,this._contDom,this._clearButton,this.clearButtonTitle="清除搜索历史",this.notHistoryButtonTitle="无搜索历史",this.historyStore=null,this.dataSource=[],this._autoLocResoure,this._bodyDom,this.rootBox,this._oneShow=!1;var c=this;this.event_focus=function(){c.Open(),"function"==typeof c.focusFun&&c.focusFun()},this.event_blur=function(){"function"==typeof c.blurFun&&c.blurFun()},this.event_input=function(){""==c.element.val()&&(c._init(),c.Open()),c.inputFun(c.element.val())},this._setOption(b),this._init()};return b.prototype={_setOption:function(a){for(var b in a)switch(b){case"element":case"maskName":case"clearButtonTitle":case"style":case"dataSource":case"historyStore":case"itmeClickFun":case"focusFun":case"blurFun":case"inputFun":case"size":case"listSize":case"rootBox":this[b]=a[b];break;case"clazz":isArray(a[b])&&(this.clazz=this.clazz.concat(a[b])),isString(a[b])&&this.clazz.push(a[b])}},_init:function(){this._contDom&&(this._contDom.find("li.item").unbind("click"),this._contDom.remove()),this._boxDom&&this._boxDom.remove(),this._CreateDom(),this._BuildEvent()},_CreateDom:function(){var b=a.createElement;this._bodyDom=this.rootBox||$("body"),this.element=$(this.element),this._boxDom=$(b("div",{id:this._id,"class":this.clazz.join(" ")})),this._boxDom.css({position:"absolute",display:"none"}),this._borderDom=$(b("div",{"class":a.config.prefix+"history-border"}));var c=[];c=""==this.element.val()?this._getHistory():this._getSubList(this.dataSource,this.listSize),this._contDom=$(b("ul",{"class":a.config.prefix+"history-list"}));for(var d in c)this._contDom.append('<li class="item" data_id="'+c[d].id+'">'+c[d].name+"</li>");""==this.element.val()&&(this._clearButton=$(b("li",{"class":[a.config.prefix+"clear-history clearbutton"]})),this._clearButton.html(c.length>0?this.clearButtonTitle:this.notHistoryButtonTitle),this._contDom.append(this._clearButton)),this._borderDom.append(this._contDom),this._boxDom.append(this._borderDom),this._bodyDom.append(this._boxDom)},_Location:function(){this._boxDom.css({height:"auto",width:"auto"});var b=a.getPageSize(),c=a.getElementPos(this.element[0]),d=this.style.left?this.style.left:(this.size&&this.size.left?this.size.left+c.left:c.left)+"px",e=this.style.top?this.style.top:(this.size&&this.size.top?this.size.top+(c.top+this.element.height()):c.top+this.element.height())+"px",f=this.style.width?this.style.width:this.element.width()+"px",g=this.size&&this.size.height?b.height+this.size.height+"px":"auto";this._boxDom.css({left:d,top:e,width:f,height:g})},_AutoLocation:function(){this._Location();var a=this;this._autoLocResoure=function(){a._Location()},$(window).unbind("resize",this._autoLocResoure),$(window).bind("resize",this._autoLocResoure)},_UnAutoLocation:function(){$(window).unbind("resize",this._autoLocResoure)},_BuildEvent:function(){var a=this;this._contDom.find("li.item").unbind("click").bind("click",function(){var b=$(this);if(a.element.val(b.text()),a.Close(),"function"==typeof a.itmeClickFun){var c={id:b.attr("data_id"),name:b.text()};a.itmeClickFun(c)}}),this.element.unbind("focus",this.event_focus),this.element.unbind("blur",this.event_blur),this.element.unbind("input",this.event_input),this.element.bind({focus:this.event_focus,blur:this.event_blur,input:this.event_input}),""==this.element.val()&&this._getHistory().length>0&&this._clearButton.bind("click",function(){a.historyStore.remove(),a.Close(),a._init()})},setOpen:function(){this._oneShow=!0},Open:function(){this._boxDom.css("z-index",a.getBiggerzIndex()),this._boxDom.show(),this._AutoLocation()},Close:function(){this._boxDom.hide(),this._UnAutoLocation()},setDataSource:function(a){this.dataSource=a,this.Close(),this._init(),this.Open()},addHistory:function(a){var b=this.historyStore.get()||[];a.id||(a.id=0);for(var c=-1,d=0,e=b.length;e>d;d++)if(b[d].name==a.name){c=d;break}c>-1&&b.splice(c,1),b.unshift(a),this.historyStore.set(b),this._init()},reset:function(){this._init()},_getHistory:function(){var a=this.historyStore.get()||[];return this._getSubList(a,this.listSize)},_getSubList:function(a,b){var c=a.length;return b>=c?a:a.slice(0,b)}},b});