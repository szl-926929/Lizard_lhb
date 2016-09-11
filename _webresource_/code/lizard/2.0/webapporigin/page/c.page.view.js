/**
 * @author zsb张淑滨shbzhang@gmail.com>
 * @class PageView
 * @description 多数UI View的基类，提供基础方法，以及自建事件机
 */
//by wl to avoid back problems
window.onunload = function () {
};
define(['libs', 'cUIHeader', 'cUIAlert', 'cUIWarning', 'cUIHeadWarning', 'cUIWarning404', 'cUIToast', 'cUILoading', 'cUIBubbleLayer', 'cBusinessCommon', 'cUtility', Lizard.app.version.gte(6.4)? 'cHybridShell' : ''],
  function (libs, cUIHeader, Alert, Warning, HeadWarning, Warning404, Toast, Loading, cUIBubbleLayer, BusinessCommon, util,cHybridShell) {
    "use strict";

    //处理业务代码
    BusinessCommon();

    var _alert = new Alert({
      title:   '提示信息',
      message: '',
      buttons: [
        {
          text:  '知道了',
          click: function () {
            this.hide();
          }
        }
      ]
    });

    var _confirm = new Alert({
      title:   '提示信息',
      message: '您的订单还未完成，是否确定要离开当前页面？',
      buttons: [
        {
          text:  '取消', click: function () {
          this.hide();
        }, type: Alert.STYLE_CANCEL
        },
        {
          text:  '确定',
          click: function () {
            this.hide();
          },
          type:  Alert.STYLE_CONFIRM
        }
      ]
    });


    var _warning = new Warning({
      title: ''
    });

    var _headwarning = new HeadWarning({
      title: ''
    });

    var _warning404 = new Warning404();

    var _loading = new Loading();

    var _toast = new Toast();

    //气泡弹层
    var _bubbleLayer = new cUIBubbleLayer();

    var PageView = Backbone.View.extend({
      scrollPos: {x: 0, y:0},
      //标题
      header:     null,
      //兼容老的header bar
      headerview: null,

      //上一个View的ID
      lastViewId: "",
      //UBT pageId
      pageid: 0,
      hpageid: 0,
      
      scrollZero: true,

      /**
       * View构造函数
       */
      initialize: function () {
        this.id = this.$el.attr("id");
        //初始化alert
        this.alert = _alert;

        //初始化warning
        this.warning = _warning;

        //初始化headwarning
        this.headwarning = _headwarning;

        //初始化headwarning
        //this.NoHeadWarning = new cUI.NoHeadWarning({
        //  content: ''
        //});

        //初始化404提示
        this.warning404 = _warning404;

        //初始化loading框，将app.js里面的loading移过来
        this.loading = _loading;
        
                    
          var oldShow = this.loading.showAction;
          this.loading.showAction = function () {
            this.contentDom.html(Lizard.__loadingtmpl);
            this.mask.show()
            oldShow.call(this);
              this.setzIndexTop();
            }
            var oldHide = this.loading.hide;
            this.loading.hide = function () {
              this.root && this.root.hide();
              this.mask && this.mask.hide();
            oldHide.call(this);
          }
          this.warning404.setTmpl(Lizard.__loadingfailtmpl, '.btn-retry');  
        


        //初始化toast
        this.toast = _toast;

        //初始化气泡浮层
        this.bubbleLayer = _bubbleLayer;

        this.confirm = _confirm;

        this.create();
      },

      /**
       * 生成头部
       */
      _createHeader: function () {
        var hDom = $('#headerview');
        this.header = this.headerview = new cUIHeader({ 'root': hDom });
      },

      /**
       * create 方法
       */
      create: function () {
        //调用子类onCreate
        this.onCreate && this.onCreate();
      },

      /**
       * view 销毁方法
       */
      destroy: function () {
        this.$el.remove();
      },

      /**
       * View 显示
       */
      show: function () {
        // fix ios 页面切换键盘不消失的bug shbzhang 2014-10-22 10:44:29
        document.activeElement && document.activeElement.blur();
        //生成头部
        this._createHeader();
        //调用子类onShow方法
        !this.switchByOut && this.$el.show();
        //调用onload
        this.validateRet && this.onLoad && this.onLoad(this.lastViewId);
        //if (!this.loaded)
        {
          this.validateRet && this.onShow && this.onShow();
          //this.loaded = true;
          if (this.onBottomPull) {
            this._onWidnowScroll = $.proxy(this.onWidnowScroll, this);
            this.addScrollListener();
          }
        }
        if (this.scrollZero) {
          window.scrollTo(0, 0);
        }
      },

      /**
       * View 隐藏
       */
      hide:      function () {
        // console.log('hide')
        //调用子类onHide方法
        this.onHide && this.onHide();
        this.removeScrollListener && this.removeScrollListener();
        this.$el.hide();
      },

      /*add by wxj 20140527 22:33 start*/
      jump:      function (url, opt) {
        //Lizard.forward(url, opt);
        if (opt && window.location.pathname.indexOf('/webapp/wallet/') == 0) {
          window.location.replace(url);
        } else {
        window.location.href = url;
        }        
      },
      /*add by wxj 20140527 22:33 end*/
      /**
       * 前进
       * @param url
       */
      forward:   function (url, opt) {
        Lizard.forward(url, opt);
      },
      /**
       * 回退至前一页面
       * @param url
       */
      back:      function (url, opt) {
        Lizard.back(url, opt);
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
       * @param key
       * @returns {.paths.P|*|typeDic.P|__displayMap__.P}
       */
      getQuery:      function (key) {
        return Lizard.P(key);
      },
      /**
       * 保存滚动条位�?
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
       */
      turning:     function () {

      },
      /**
       * 显示单个按钮的alert框
       * @param message 内容
       * @param title 标题
       */
      showMessage: function (message, title) {
        this.alert.setViewData({
          message: message,
          title:   title
        });
        this.alert.show();
      },

      /**
       * 隐藏Alert框
       */
      hideMessage: function () {
        this.alert.hide();
      },

      /**
       * 显示两个按钮的confirm 对话框
       * @param message 内容
       * @param title 标题
       * @param okFn  按钮1回调
       * @param cancelFn 按钮2回调
       * @param okTxt   按钮1文本
       * @param cancelTxt 按钮2文本
       */
      showConfirm: function (message, title, okFn, cancelFn, okTxt, cancelTxt) {
        //如果传入的是对象的话，直接用作初始化
        if (typeof message == 'object' && message.message) {
          this.confirm.setViewData(message);
        } else {
          this.confirm.setViewData({
            message: message,
            title:   title,
            buttons: [
              {
                text:  (cancelTxt || '取消'), click: function () {
                if (typeof cancelFn == 'function') {
                  cancelFn();
                }
                this.hide();
              }, type: Alert.STYLE_CANCEL
              },
              {
                text:  (okTxt || '确定'),
                click: function () {
                  if (typeof okFn == 'function') {
                    okFn();
                  }
                  this.hide();
                },
                type:  Alert.STYLE_CONFIRM
              }
            ]
          });
        }
        this.confirm.show();
      },

      /**
       * 隐藏confirm对话框
       */
      hideConfirm: function () {
        this.confirm.hide();
      },

      /**
       * 显示气泡提示
       * @param opts
       */
      showBubbleLayer: function (opts) {
        this.bubbleLayer.showMenu(opts);
      },

      /**
       * 隐藏气泡提示
       */
      hideBubbleLayer: function () {
        this.bubbleLayer.hide();
      },

      /**
       * 显示warning 建议使用showWarning404()代替
       * @deprecated  1.1
       * @param title
       * @param callback
       */
      showWarning: function (title, callback) {
        if (title) this.warning.setTitle(title, callback);
        this.warning.show();
      },

      /**
       * 隐藏warning
       * @deprcated 1.1
       */
      hideWarning: function () {
        this.warning.hide();
      },


      /**
       * 显示showWarnig404,此组件有一个拨打电话和一个重试按钮
       * @param callback 点调重试按钮的回调
       */
      showWarning404: function (callback) {
        if (callback) this.warning404.retryClick(callback);
        this.warning404.show();
        this.warning404.firer = this;
      },

      /**
       * 隐藏waring404组件
       */
      hideWarning404: function () {
        if (!this.warning404.firer || this.warning404.firer === this)
          this.warning404.hide();
      },

      /**
       * 显示Toast
       * @param title 标题
       * @param timeout 显示时长
       * @param callback 隐藏时回调
       * @param clickToHide 是否允许点击界面任一处,隐藏Toast
       */
      showToast: function (title, timeout, callback, clickToHide) {
        if (this.toast.isShow()) {
          return;
        }
        clickToHide = (typeof clickToHide != 'undefined') ? clickToHide : true;
        this.toast.show(title, timeout, callback, clickToHide);
      },

      /**
       * 隐藏toast
       */
      hideToast: function () {
        this.toast.hide();
      },

      /**
       * 显示Loading
       */
      showLoading: function () {
        if (_.isUndefined(cHybridShell)) {
          this.loading.show();
          this.loading.firer = this;
          this.loading.reposition();
        } else {
          var fn = new cHybridShell.Fn('show_loading_page');
          fn.run();
        }
      },

      /**
       * 隐藏Loading
       */
      hideLoading: function () {
        if (_.isUndefined(cHybridShell)) {
          if (!this.loading.firer || this.loading.firer == this)
            this.loading.hide();
        } else {
          var fn = new cHybridShell.Fn('hide_loading_page');
          fn.run();
        }
      },

      /**
       * 获取服务器时间
       * @returns {cUtility.getServerDate|*}
       */
      getServerDate: function () {
        return util.getServerDate();
      },

      /**
       * 设置html的title
       * @param title
       */
      setTitle: function (title) {
        document.title = title;
      },

      /**
       * 获得guid
       */
      getGuid: function () {
        return util.getGuid();
      },

      /**
       * 发送UBT统计代码
       */
      sendUbt:function (retry) {
          var view = this;
          if (!window.__bfi) window.__bfi = [];
          var pId = $('#page_id'), oId = $('#bf_ubt_orderid');
          //var url = this._getViewUrl(), pageId, orderid = "";
          var url = location.href, refer = view.browserReferrer || "", pageId, orderid = "";
          /* && !Lizard.isInCtripApp*/
          if (util.isInApp()) {
              if (view.hpageid == 0) {
                  return;
              }
              var urlAbsPath = Lizard.getAbsPath(url.replace(/.*#/, ""));
              url = Lizard.toUBTURL(urlAbsPath);
              if (!refer) {

              } else {
                  var referAbsPath = Lizard.getAbsPath(refer.replace(/.*#/, ""));
                  refer = Lizard.toUBTURL(referAbsPath);
              }
              pageId = view.hpageid;
          } else {
              if (view.pageid == 0) {
                  return;
              }
              pageId = view.pageid;
              if (!refer) {

              } else {
                  var referAbsPath = Lizard.getAbsPath(refer,1);
                  refer = Lizard.toUBTURL(referAbsPath, 1);
              }
          }
          //在此处修改orderid的获取逻辑，优先取orderid,其次oid,避免为undefined
          orderid = Lizard.P("orderid") || Lizard.P("oid") || '';

          if (oId.length == 1) {
              oId.val(orderid)
          }
          window.__bfi.push(['_asynRefresh', {
              page_id: pageId,
              orderid: orderid,
              url: decodeURIComponent(url),
              refer: decodeURIComponent(refer)
          }]);
       

      },
      /**
       * 兼容老的方式
       */
      _sendUbt:function(pageId){
        this.sendUbt(pageId);
      },

      /**
       * 获得页面Url,hyrbid会增加一个虚拟域名
       */
      _getViewUrl: function () {
        var url = location.href;
        if (util.isInApp()) {
          var idx = url.indexOf('webapp');
          url = 'http://hybridm.ctrip.com/' + url.substr(idx);
        }
        return url;
      }
    })
    return PageView;

  });