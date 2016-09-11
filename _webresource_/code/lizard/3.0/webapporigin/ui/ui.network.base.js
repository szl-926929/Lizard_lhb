/**
 * Created by jp_wang on 2015/12/8.
 */
/*
 * Network组件的基类
 * */
define(['UIView'], function(UIView) {
  return _.inherit(UIView, {
    propertys: function($super) {

      $super();
      this.openedElementArray = [];
      this.openedElementIdArray = [];

      this.zIndex = 10;
      this.parent = "#main";
      /*
       **组件占屏幕的位置
       *可选参数有：FullScreen(全屏)
       * KeepHeader(占据除去header以外的位置)
       * KeepFooter(占据除去footer以外的位置)
       * KeepBoth(占据除去header footer以外的位置)
       */
      this.screen = "keepHeader";
      this.position = "absolute";
      this.top = 0;
      this.bottom = 0;
      this.left = 0;
      this.right = 0;
    },
    _getTpl: function(id, cb) {
      var tplId = '';
      switch (id) {
        case 'loadFailed':
          tplId = 'UILoadingFailedHtml';
          break;
        default:
          tplId = 'UILoadingFailedHtml';
      }
      require([tplId], function(tpl) {
        cb(tpl);
      });
    },
    _setCss: function(el) {
      var self = this;
      return function ( styles ){
        var _b = !!(self.position == "absolute" || self.position == "fixed");
        var initStyles = function ( direction ){
          if(_b){
            el.css(direction,styles[direction]);
          }else{
            el.css("margin-"+direction, styles[direction]);
          }
        };
        for(var m in styles) {initStyles(m);}
      };
    },
    _hidden : function ( type, element ){
      var $type = type === "close" ? 'remove' : 'hide';
      var domid = $('#' + this.domID );
      if( !element ){ //如果没有填任何元素，则删除所有已经添加的元素
        this.openedElementArray.forEach(function ( el, i ){
          el[$type]();
        });
      }
      else if( element == 'current' ){
        if(type === "close"){
          domid.remove();
        }else{
          domid.hide();
        }
      }
      else{
        //如果填有元素，则查找已添加元素的数组，赋为索引
        var index = this.openedElementIdArray.indexOf(element);
        //通过索引查找其元素，执行remove/hide方法
        if( index > -1 ){
          this.openedElementArray[index][$type]();
        }else{
          console.warn("no this element!");
        }
      }
    },
    close : function ( element ){
      this._hidden('close', element);
    },
    hide : function ( element ){
      this._hidden('hide', element);
    },
    _close : function (){
      this.$parent.remove();
    },
    _callback : function ( callback ){
      var self = this;
      return callback && callback(function (){
          self._close();
        });
    },
    _setDomId: function(el) {
      this.domID = "domID" + new Date().getTime();
      $(el).attr('id', this.domID);
    },
    _show: function(id, cb) {
      var that = this;
      this._getTpl(id, function(tpl) {
        var d = $(tpl());

        that._setDomId(d);

        d.css({"position":that.position});

        //页面已经load,获取父级
        that.parent = $(that.parent);
        //如果父级不是main,且是绝对定位，则给此元素加一个relative
        if(that.parent.prop("id") !== "main" && that.position == "absolute" ){
          that.parent.css({"position":"relative"});
        }
        var setCss = that._setCss(d);

        switch ( that.screen.toLocaleLowerCase() ) {
          case "keepheader" :
            setCss({"top":that.top,"bottom":0});
            break;
          case "keepfooter" :
            setCss({"bottom":that.bottom,"top":0});
            break;
          case "fullscreen" :
            setCss({"top":0,"bottom":0});
            break;
          case "keepboth" :
            setCss({"top":that.top,"bottom":that.bottom});
            break;
          default :
            setCss({"top":that.top,"bottom":0});
        }
        setCss({ "left" : that.left, "right" : that.right, "zIndex" : that.zIndex });

        that.parent.append( d );

        that.$id = $('.cp-Network-' + id);
        that.$parent = that.$id.parent();

        that.openedElementArray.push(that.$parent);
        that.openedElementIdArray.push(id);

        //获取可能存在的所有按钮
        that.retryBtn = that.parent.find(".btn-retry");
        that.callBtn  = that.parent.find(".btn-call");
        that.closeBtn = that.parent.find(".close");
        that.noSearchText = that.parent.find('.loadNosearch-box p');
        that.loadingText = that.parent.find('.loading-box .ellips_line2');
        that.loadingsubmitText = that.parent.find('.loading-box .loading-layer');

        //返回一个close函数，用于手动关闭页面
        that.retryBtn.off("click").on("click",function (){
          return that._callback.call(that, cb);
        });
      });
    },
    initialize: function($super, options) {
      $super(options);
    },
    loadFailed: function(callback) {
      this._show('loadFailed', callback);
    }
  });
});