/**
 * @Description:多数UI View的基类，提供基础方法，以及自建事件机制
 * @author shbzhang@ctrip.com
 * @date 2014-09-30 15:23:20
 * @version V1.0
 */
/**
 * View 基类,继承自Backbone.View
 * @see http://backbonejs.org/#View
 * @namespace cPageView
 * @example
 * defined('cPageView',function(cPageView){
 *  var View = cPageView.extend({
 *    //view初始化调用,在生命周期中只调用一次
 *    onCreate:function(){
 *    },
 *    //view显示时调用
 *    onShow:function(){
 *    ),
 *    //view隐藏调用
 *    onHide:function(){
 *    },
 *    //view获得视口时调用,此方法仅在hybrid有效
 *    onAppear:function(){
 *    }
 *  });
 *  return View;
 * })
 */
define(['libs', ((Lizard.app.vendor.is('CTRIP') || Lizard.isHybrid) && !Lizard.app.code.is('WE'))? 'cHybridHeader' : 'UIHeader', 'cGuiderService'],
  function (libs, Header, Guider) {
    "use strict";
    /**
     * 根元素,jQuery对象
     * @name cPageView.prototype.$el
     */

    /**
     * 根元素，原生dom对象
     * @name cPageView.prototype.el
     */

    /**
     * 定义事件
     * @name cPageView.prototype.events
     * @example
     *  events: {
     *    "click .js-icon": "open",
     *    "click .js-edit": function() {}
     *  },
     *  open: function() {}
     */
    /**
     * 查找子元素
     * @method cPageView.prototype.$
     * @param {string} selector 选择器
     * @example
     * this.$('.js-list')
     */
    var PageView = Backbone.View.extend(/** @lends cPageView.prototype */{
      /**
       * 滚动条位置
       * @private
       */
      scrollPos: { x: 0, y: 0 },
      /**
       * view的头部,兼容h5和hybrid的头部设置, h5是html实现，hybrid是native控制
       * @example
       * this.header.set({
       *   back: {
       *     tagname: 'back', 
       *     callback: function () {
       *     }
       *   },
       *   center: {
       *     tagname: 'title', 
       *     value: ['精品特价', '11月24日 周一出发']
       *   },
       *   right:  [{ 
       *     tagname: 'test', 
       *     value: '定义class',
       *     // h5自定义图片使用cls
       *     classname: 'custom_class',
       *     // hybrid自定义图片，只支持本地图片
       *     imagePath: 'monitor/webresource/img/demo.png',
       *     pressedImagePath: 'monitor/webresource/img/demo.png'
       *     callback: function() {
       *     }  
       *   }],
       *   moreMenus:[{
       *     tagname: 'more_my_favorite', iconname: 'share', value: '分享', 
       *     callback: function (data, index, el) {
       *     }
       *   },
       *   {
       *     tagname: 'more_phone', iconname: 'tel', value: '联系携程', 
       *     callback: function () {
       *     }
       *   },
       *   {
       *     tagname: 'more_my_order', iconname: 'file', value: '我的订单', 
       *     callback: function () {
       *     }
       *   },
       *   {
       *     tagname: 'more_my_favorite', iconname: 'love', value: '我的收藏', 
       *     callback: function () {
       *     }
       *   },
       *   {
       *     tagname: 'more_message_center', iconname: 'email', value: '消息中心', 
       *     callback: function () {
       *     }
       *   },
       *   {
       *     tagname: 'more_home', iconname: 'home', value: '携程首页', 
       *     callback: function () {
       *     }
       *   }]
       * });
       * // 局部更新头部
       * this.header.updateHeader({})
       * // 隐藏头部
       * this.header.hide();
       * // 显示头部,默认是显示的，在隐藏后可以调用次方法
       * this.header.show();
       */
      header   : null,


      /**
       * UBT统计用,web 环境下使用pageid
       */
      pageid: 0,

      /**
       * UBT统计用,hybrid 环境下使用pageid
       */
      hpageid: 0,

      /**
       * 页面切换时，是否要滚动至顶部,
       * 默认``true``
       */
      scrollZero: true,

      /**
       * 页面切换时，是否执行onShow
       * 默认``true``
       */
      triggerShow: true,

      /**
       * 页面切换时，是否执行onHide
       * 默认``true``
       */
      triggerHide: true,

      /**
       * 直落代码,设置此属性和pageid属性后,将会开启电话号码直落功能
       * @var View.cPageView.businessCode
       * @type {string}
       */

      /**
       * 前一个页面的viewName
       * @var View.cPageView.lastViewId
       * @type {string}
       * @deprecated
       */

      /**
       * 前一个页面的viewName
       * @var View.cPageView.referrer
       * @type {string}
       */


      /**
       * View构造函数
       * @private
       */
      initialize: function () {
        this.id = this.$el.attr("id");
        this.create();
      },

      /**
       * 生成头部
       * @private
       */
      _createHeader: function () {
        var hDom = $('#headerview');
        this.header = this.headerview = new Header({ 'root': hDom, 'wrapper': hDom });
      },

      /**
       * create 方法,View首次初始化是调用
       * @method cPageView.prototype.onCreate
       */
      create: function () {
        //调用子类onCreate
        if(this.onCreate){
          this.onCreate();
        }
        if (_.isArray(this.defferModules)) {
          var stopEvent = true, self = this, calledMethod;
          _.each(this.events, function(method, event){
            if (!_.isFunction(method)) {method = self[method];}
            self.events[event] = function(e){
              if (stopEvent) {
                self.showLoading();
                calledMethod = {method: method, event: e};
                return;
              }
              self.hideLoading();
              method.apply(self, arguments); 
            };
          });
          setTimeout(_.bind(function(){require(this.defferModules, _.bind(function(){
            stopEvent = false;
            if(_.isFunction(this.defferModuleCallback)){
              this.defferModuleCallback.apply(this, arguments);
            }
            if (_.isObject(calledMethod)) {
              calledMethod['method'].apply(this, [calledMethod.event]); self.hideLoading();
            }
          }, this));}, this), 1);
        }
      },

      /**
       * view 销毁方法
       */
      destroy: function () {
        this.$el.remove();
      },

      /**
       * View 显示时调用的方法
       * @method cPageView.prototype.onShow
       */
      show: function () {
        // fix ios 页面切换键盘不消失的bug shbzhang 2014-10-22 10:44:29
        if(document.activeElement){
          document.activeElement.blur();
        }
        //生成头部
        this._createHeader();
        //调用子类onShow方法
        if(!this.switchByOut){
          this.$el.show();
        }
        if(this.triggerShow && this.onShow ){
          this.onShow();
        }
        if(this.onAfterShow){
          this.onAfterShow();
        }
        //注册Web_view_did_appear 事件
        Guider.registerAppearEvent(_.bind(this.onAppearHandler, this));
        
        if (Lizard.app.vendor.is('CTRIP')){
          if (history.length == 1) {this.__appeartimeout = setTimeout(_.bind(this.onAppearHandler, this), Lizard.config.appearTimeout || 1000);}
        } 

        if (this.onBottomPull) {
          this._onWidnowScroll = $.proxy(this.onWidnowScroll, this);
          this.addScrollListener();
        }

        if (this.scrollZero) {
          window.scrollTo(0, 0);
        }

        this.triggerShow = true;
        this.triggerHide = true;

        //如果定义了addScrollListener,说明要监听滚动条事,此方法在cListView中实现
        if(this.addScrollListener){
          this.addScrollListener();
        }
      },

      /**
       * View 隐藏
       * @method cPageView.prototype.onHide
       */
      hide: function () {
        //取消web_view_did_appear 事件的注册
        Guider.unregisterAppearEvent();
        //调用子类onHide方法
        if(this.triggerHide && this.onHide){
          this.onHide();
        }
        if(this.removeScrollListener){
          this.removeScrollListener();
        }
        this.$el.hide();
      },

      /**
       * View 从Native 回来，重新获取焦点时调用，此方法只在hybrid可用
       * @param {String} data 再次唤醒事由Native传来的参数
       */
      onAppear: function (data) {
        console.log('onAppear --------------');
      },
      
      onAppearHandler: function (param) {
        clearTimeout(this.__appeartimeout);
        if (param && param.callbackString) { this.sendUbt();}
        this.onAppear(param);        
      },

      /**
       * 跨频道跳转,建议使用cross代替代替
       * @deprecated
       * @method View.cPageView.jump
       * @param {String|JSON} opt
       */
      jump: function (opt) {
        if (_.isString(opt)) {
          window.location.href = opt;
        } else {
          Guider.jump(opt);
        }
      },
      /**
       * @see Lizard.jump
       * @deprecated
       */
      cross   : function (url, opt) {
        Lizard.jump(url, opt);
      },
      /**
       * @see Lizard.goTo
       * @deprecated
       */
      forward: function (url, opt) {
        Lizard.forward.apply(null, arguments);
      },
      /**
       * @see Lizard.goBack
       * @deprecated
       */
      back   : function (url, opt) {
        Lizard.back.apply(null, arguments);
      },

      /**
       * 刷新页面,空函数
       */
      refresh  : function () {

      },
      /**
       * 唤醒App,要求返回一个app接受的字符串
       * @return {String} url
       */
      getAppUrl: function () {
        return "";
      },

      /**
       * 返回URL中参数的值
       * @see Lizard.P
       * @deprecated
       */
      getQuery     : function (key) {
        return Lizard.P(key);
      },
      /**
       * 保存滚动条位置
       */
      saveScrollPos: function () {
        this.scrollPos = {
          x: window.scrollX,
          y: window.scrollY
        };
      },

      /**
       * 恢复原滚动条位置
       */
      restoreScrollPos: function () {
        window.scrollTo(this.scrollPos.x, this.scrollPos.y);
      },

      /**
       * 空方法,兼容1.1
       * @deprecated
       */
      turning    : function () {

      },
      /**
       * @see Lizard.showMessage
       * @deprecated
       */
      showMessage: function (params) {
        Lizard.showMessage(params);
      },

      /**
       * @see Lizard.hideMessage
       * @deprecated
       */
      hideMessage: function () {
        Lizard.hideMessage();
      },

      /**
       * @see Lizard.showConfirm
       * @deprecated
       */
      showConfirm: function (params) {
        Lizard.showConfirm(params);
      },

      /**
       * @see Lizard.hideConfirm
       * @deprecated
       */
      hideConfirm: function () {
        Lizard.hideConfirm();
      },

      /**
       * @see Lizard.showWarning404
       * @deprecated
       */
      showWarning404: function (params) {
        Lizard.showWarning404(params);

      },

      /**
       * @see Lizard.hideWarning404
       * @deprecated
       */
      hideWarning404: function () {
        Lizard.hideWarning404();
      },

      /**
       * @see Lizard.showToast
       * @deprecated
       */
      showToast: function (params) {
        Lizard.showToast(params);
      },
      /**
       * @see Lizard.hideToast
       * @deprecated
       */
      hideToast: function () {
        Lizard.hideToast();
      },

      /**
       * @see Lizard.showLoading
       * @deprecated
       */
      showLoading: function (params) {
        Lizard.showLoading(params);
        //        this.loading.firer = this;
      },

      /**
       * @see Lizard.showLoading
       * @hideLoading
       */
      hideLoading: function (opener) {
        //        if (!this.loading.firer || this.loading.firer == this)
        Lizard.hideLoading(opener); 
      },

      /**
       * 设置html的title
       * @param {string} title
       */
      setTitle: function (title) {
        document.title = title;
      },

      /**
       * @see Lizard.sendUbt
       */
      sendUbt: function () {
        Lizard.sendUbt(this);
      }
    });
    return PageView;

  });