/* File Created: 六月 23, 2013 */

define(['libs', 'cUIAlert', 'cUIWarning', 'cUIHeadWarning', 'cUIWarning404', 'cUIToast', 'cSales', 'cStorage', 'cBase', 'CommonStore', 'cUtility', 'cUILoading', 'cUIBubbleLayer'], function (libs, Alert, Warning, HeadWarning, Warning404, Toast, cSales, cStorage, cBase, CommonStore, cUtility, Loading, cUIBubbleLayer) {
  function debughander(e, on, line) {
    if (e && e.originalEvent) alert(e.originalEvent.message + ' ' + on + ' ' + line);
  };
  var localStorage = cStorage.localStorage;
  //用于切换页面时，让当前input失去焦点
  document.body && (document.body.tabIndex = 10000);


  var _alert = new Alert({
    title: '提示信息',
    message: '',
    buttons: [
          {
            text: '知道了',
            click: function () {
              this.hide();
            }
          }
        ]
  });

  var _confirm = new Alert({
    title: '提示信息',
    message: '您的订单还未完成，是否确定要离开当前页面？',
    buttons: [
      { text: '取消', click: function () { this.hide(); }, type: Alert.STYLE_CANCEL },
      {
        text: '确定',
        click: function () {
          this.hide();
        },
        type: Alert.STYLE_CONFIRM
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

  //l_wang新增验证方法解决fixed导致问题
  var elSelector = ['.fix_bottom', '.fix_b', 'header', '.order_btnbox'];

  //需要处理的wrapper
  var elWrapper = '.cont_blue , .cont_blue1';

  //保存fixed定时器
  var FIXED_RESOURCE = null;

  //修正fixed引起的问题
  function reviseFixed() {
    return false;
    var el = $(elSelector.join(','));
    if (document.activeElement.nodeName == 'INPUT' && (document.activeElement.type == 'tel' || document.activeElement.type == 'text')) {
      el.css('position', 'static');

      //需要处理的wrapper，左盟主48px问题
      $(elWrapper).css('margin-top', '0px');

    } else {
      el.css('position', 'fixed');
      $(elWrapper).css('margin-top', '48px');

      if (FIXED_RESOURCE) { clearInterval(FIXED_RESOURCE); FIXED_RESOURCE = null; }
    }
  }

  return Backbone.View.extend({

    ENUM_STATE_NOCREATE: 0,
    ENUM_STATE_CREATE: 1,
    ENUM_STATE_LOAD: 2,
    ENUM_STATE_SHOW: 3,
    ENUM_STATE_HIDE: 4,
    //子类可以设置此pageid，用于autotest
    pageid: 0,
    //视图的scroll位置
    scrollPos: { 
      x: 0,
      y: 0
    },
    header: null,
    footer: null,
    cSales: cSales,
    // ui controller
    warning: null,
    alert: null,
    // ------------

    onCreate: function () {
    },
    viewInitialize: function () {
    },
    initialize: function (request, appliction, viewname) {
	  if (arguments.length == 1)
	  {
	    this.$el = arguments[0].el;	
	    request = {query: {}};
		appliction = {
		  forward: function(){console.warn('The function of forward in view will be deprecated in Lizard 2.1');},
		  backward: function(){console.warn('The function of backward in view will be deprecated in Lizard 2.1');},
		  loadView: function(){console.warn('The function of backward in view will be deprecated in Lizard 2.1');},
		}	      
	    viewname = '';        	
	  }
      this.$el.addClass('sub-viewport');
      this.id = _.uniqueId('viewport');
	  if (arguments.length == 3)
	  {
        this.$el.attr('id', 'id_' + this.id);
	  }
	  if (viewname)
	  {
        this.viewname = viewname
	  }
      //添加自定义pageid
      if (this.pageid) this.$el.attr('page-id', this.pageid);

      this.viewdata = {};
      this.appliction = appliction;
      this.request = request;
      this.$el.attr('page-url', this.request.viewpath);
      this.state = this.ENUM_STATE_CREATE;

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

      //初始化toast
      this.toast = _toast;

      //初始化气泡浮层
      this.bubbleLayer = _bubbleLayer;

      this.confirm = _confirm;

      this.viewport = $('.main-viewport');

      //加入页面自定义的css
      if (_.isArray(this.css)) {
        this.appendCss(this.css);
      }

      this.debug();
      try {
        this.onCreate();
      } catch (e) {
        //alert(this.request.viewpath+'/onCreate/Error:'+JSON.stringify(e));
      }
    },
    _initializeHeader: function () {
      var self = this;
      if (this.header.backUrl) {
        this.$el.on('click', '#js_return', function () {
          self.back(self.header.backUrl);
        });
      }
      if (this.header.home) {
        this.$el.delegate('#js_home', 'click', function () {
          self.home();
        });
      }
      if (this.header.phone) {
        this.$el.find('#js_phone').attr('href', 'tel:' + this.header.phone);
      }
      if (this.header.title) {
        this.$el.find('header h1').text(this.header.title);
      }
      if (this.header.subtitle) {
        this.$el.find('header p').text(this.header.subtitle);
      }
      if (this.header.rightAction) {
        this.$el.delegate('header div', 'click', this.header.rightAction);
      }
    },
    _initializeFooter: function () {
      if (this.footer) {
        this.footer.hide();
        //设置footer的view
        this.footer.setCurrentView(this);
      }

      if (cUtility.isInApp()) {
        return;
      }

      //临时解决广告不消失问题
      if (this.hasAd && !this.footer.isExpire()) {
        var ctn = this.adContainer ? this.$el.find('#' + this.adContainer) : $('#footer');
        var oldRootBox = this.footer.rootBox;
        if (oldRootBox && oldRootBox.attr('id') != ctn.attr('id')) {
          this.footer.remove();
          this.footer.isCreate = false;
        }
        this.footer.update({
          rootBox: ctn
        });
        this.footer.show();
      }
    },

    //触发load事件
    __onLoad: function (lastViewName) {
      //切换页面时，确保当前input失去焦点
      document.activeElement && document.activeElement.blur();
      this.getServerDate();
      //处理渠道信息
      this.disposeChannel();
      this.header = this._getDefaultHeader();
      this.state = this.ENUM_STATE_LOAD;
      // try {
      this.onLoad && this.onLoad(lastViewName);
      //  } catch (e) {
      //alert(this.request.viewpath+'/onLoad/Error:'+JSON.stringify(e));
      //  }
    },
    //触发Show事件
    __onShow: function () {

      //切换页面时，确保当前input失去焦点
      document.activeElement && document.activeElement.blur();
      document.activeElement.blur;

      this.state = this.ENUM_STATE_SHOW;
      //fix scroll bug shbzhang 2013.10.10
      window.scrollTo(0, 0);
      //try {
        this.onShow && this.onShow();
      //} catch (e) {
        //alert(this.request.viewpath + '/onShow/Error:' + JSON.stringify(e));
      //}
      //ubt统计
      //if (!location.host.match(/localhost|172\.16|127\.0|210\.13/ig)) {
      this._sendUbt();
      //}
      this._initializeHeader();
      this._initializeFooter();
      this.__updateSales(this.$el);
      if (this.onBottomPull) {
        this._onWidnowScroll = $.proxy(this.onWidnowScroll, this);
        this.addScrollListener();
      }
      //ga统计
      this._sendGa();

      //Kenshoo统计
      this._sendKenshoo();
      this.resetViewMinHeight();

      //l_wang 新增代码用以解决
      //事件只能绑定一次
      //&& ('ontouchstart' in window)
      if (!this.FixedInput) {
        this.$('input').on('focus', function (e) {
          if (e.target.type == 'tel' || e.target.type == 'text') {
            if (!FIXED_RESOURCE) {
              reviseFixed();
              FIXED_RESOURCE = setInterval(function () {
                reviseFixed();
              }, 500);
            }
          }
        });
        this.FixedInput = true;
      }


    },
    //兼容min-height，重置view高度
    resetViewMinHeight: function () {
      //暂时兼容性处理
      //            var main = $('#main');
      //            var main_frame = main.find('.main-frame');
      //            var main_viewport = main_frame.find('.main-viewport');
      //            var sub_viewport = main_viewport.find('.sub-viewport');
      //            var h = $(window).height();
      //            $('body').css('min-height', h);
      //            main.css('min-height', h);
      //            main_frame.css('min-height', h);
      //            main_viewport.css('min-height', h);
      //            sub_viewport.css('min-height', h);

    },
    //触发hide事件
    __onHide: function (id) {
      this.state = this.ENUM_STATE_HIDE;
      this.onHide && this.onHide(id);
      this.hideHeadWarning();
      //this.hideNoHeadWarning(;)
      this.hideWarning();
      this.hideLoading();
      this.hideWarning404();
      this.hideToast();
      this.hideConfirm();
      this.hideMessage();

      if (this.onBottomPull) {
        this.removeScrollListener();
      }
      //      this.scrollPos = {
      //        x: window.scrollX,
      //        y: window.scrollY
      //      }
    },

    showLoading: function () {
      this.loading.show();
      this.loading.firer = this;
    },
    hideLoading: function () {
      if (!this.loading.firer || this.loading.firer == this)
        this.loading.hide();
    },

    forward: function (url, replace) {
      this.appliction.forward.apply(null, arguments);
    },
    back: function (url) {
      // 在ios环境中使用application.back()会出现问题！
      // 作为一个调查点保留
      // if (cUtility.isInApp()) {
      // this.appliction.forward(url);
      // } else {
      this.appliction.back.apply(null, arguments);
      // }
    },
    jump: function (url, replace) {
      // app环境不支持jump
      if (cUtility.isInApp()) {
        url = url.replace(window.BASEURL, '');
        this.forward(url);
      } else {
        if (replace) {
          window.location.replace(url);
        } else {
          window.location.href = url;
        }
      }
    },
    home: function () {
      this.appliction.forward('');
    },
    setTitle: function (title) {
      this.appliction.setTitle("携程旅行网-" + title);
    },
    //还原到原来的滚动条位置
    restoreScrollPos: function () {
      window.scrollTo(this.scrollPos.x, this.scrollPos.y);

//      setTimeout($.proxy(function () {
//        window.scrollTo(this.scrollPos.x, this.scrollPos.y);
//      }, this), 20)
    },
    /**
    * 获得url中查询字符串，类似于get的请求参数
    * @param name {String} 要查询参数的key
    * @return {String}
    * @demo
    * #ticketlist/?name=value
    * var v = this.getQuery('name');
    * console.log(v);//value;
    *
    */
    getQuery: function (name) {
      return this.request.query[name] || null;
    },
    /**
    * 获得url中路径中的某一部分
    * @param index {Number} 在路径中某个段的值
    * @param {String} 要查询的路径的value
    * @demo
    * #ticketlist/!value/hoe
    * var v = this.getPath(0);
    * console.log(v);//value;
    */
    getPath: function (index) {
      return this.request.path[index] || null;
    },
    getRoot: function () {
      return this.request.root || null;
    },
    showMessage: function (message, title) {
      this.alert.setViewData({
        message: message,
        title: title
      });
      this.alert.show();
    },

    hideMessage: function () {
      this.alert.hide();
    },

    showConfirm: function (message, title, okFn, cancelFn, okTxt, cancelTxt) {
      //如果传入的是对象的话，直接用作初始化
      if (typeof message == 'object' && message.message) {
        this.confirm.setViewData(message);
      } else {
        this.confirm.setViewData({
          message: message,
          title: title,
          buttons: [
          { text: (cancelTxt || '取消'), click: function () {
            if (typeof cancelFn == 'function') { cancelFn(); }
            this.hide();
          }, type: Alert.STYLE_CANCEL
          },
          {
            text: (okTxt || '确定'),
            click: function () {
              if (typeof okFn == 'function') { okFn(); }
              this.hide();
            },
            type: Alert.STYLE_CONFIRM
          }
        ]
        });
      }
      this.confirm.show();
    },

    hideConfirm: function () {
      this.confirm.hide();
    },

    showWarning: function (title, callback) {
      if (title) this.warning.setTitle(title, callback);
      this.warning.show();
    },
    hideWarning: function () {
      this.warning.hide();
    },
    showHeadWarning: function (title, content, callback) {
      if (title) this.headwarning.setTitle(title, content, callback);
      this.headwarning.show();
    },

    hideHeadWarning: function () {
      this.headwarning.hide();
    },

    showBubbleLayer: function (opts) {
      this.bubbleLayer.showMenu(opts);
    },

    hideBubbleLayer: function () {
      this.bubbleLayer.hide();
    },

    showWarning404: function (callback, options) {
      if (callback) this.warning404.retryClick(callback);
      this.warning404.show();
      if (options) this.warning404.options(options);
        this.warning404.firer = this;
    },

    hideWarning404: function () {
      if (!this.warning404.firer || this.warning404.firer === this)
        this.warning404.hide();
    },

    showNoHeadWarning: function (content, top) {
      if (content) this.NoHeadWarning.setContent(content, top);
      this.NoHeadWarning.show();
    },
    //hideNoHeadWarning: function () {
    //  this.NoHeadWarning.hide();
    //},
    showToast: function (title, timeout, callback, clickToHide) {
      if (this.toast.isShow()) {
        return;
      }
      clickToHide = (typeof clickToHide != 'undefined') ? clickToHide : true;
      this.toast.show(title, timeout, callback, clickToHide);
      this.toast.firer = this;
    },
    hideToast: function () {
      if (!this.toast.firer || this.toast.firer == this)
        this.toast.hide();
    },
    updateHeader: function (options) {
      for (var key in options) {
        this.header[key] = options[key];
      }
      this._initializeHeader();
    },
    _getDefaultHeader: function () {
      return {
        backUrl: null,
        home: false,
        phone: null,
        title: null,
        subtitle: null,
        rightAction: null
      };
    },
    __updateSales: function ($el) {
      var local = location.host, refUrl = document.referrer, seosales = '';
      if (local && refUrl.indexOf(local) === -1) {
        refUrl = refUrl.replace('http://', '').replace('https://', '').split('/')[0].toLowerCase();
        if (refUrl.indexOf('baidu') > -1) {
          seosales = 'SEO_BAIDU';
        }
        if (refUrl.indexOf('google') > -1) {
          seosales = 'SEO_GOOGLE';
        }
        if (refUrl.indexOf('soso.com') > -1) {
          seosales = 'SEO_SOSO';
        }
        if (refUrl.indexOf('sogou') > -1) {
          seosales = 'SEO_SOGOU';
        }
        if (refUrl.indexOf('m.so.com') > -1) {
          seosales = 'SEO_SO';
        }
        if (refUrl.indexOf('so.360') > -1) {
          seosales = 'SEO_360SO';
        }
        if (refUrl.indexOf('bing.com') > -1) {
          seosales = 'SEO_BING';
        }
        if (refUrl.indexOf('yahoo') > -1) {
          seosales = 'SEO_YAHOO';
        }
        if (refUrl.indexOf('youdao') > -1) {
          seosales = 'SEO_YOUDAO';
        }
        if (refUrl.indexOf('jike.com') > -1 || refUrl.indexOf('babylon.com') > -1 || refUrl.indexOf('ask.com') > -1 || refUrl.indexOf('avg.com') > -1 || refUrl.indexOf('easou.com') > -1 || refUrl.indexOf('panguso.com') > -1 || refUrl.indexOf('yandex.com') > -1) {
          seosales = 'SEO_360SO';
        }
      }
      var appSourceid = window.localStorage.getItem('SOURCEID');
      var newSourceid = this.getQuery('sourceid'), newSales = this.getQuery('sales');
      var _sales = CommonStore.SalesStore.getInstance().get();
      var sales = this.getQuery('sales') || seosales || (_sales && _sales.sales), sourceid = this.getQuery('sourceid') || appSourceid || (_sales && _sales.sourceid);
      if ((newSourceid && +newSourceid > 0) || (newSales && newSales.length > 0)) {
        //移除APP_DOWNLOAD
        cStorage.localStorage.oldRemove("APP_DOWNLOAD");
      }
      if (sales || sourceid) {
        if (sales) {
          cSales.setSales(sales);
        }
        if (sourceid) {
          cSales.setSourceId(sourceid);
        }

        cSales.getSalesObject(sales || sourceid, $.proxy(function (data) {
          //如果没有配置下载渠道包，则隐藏下载广告浮层2014-1-4 caof
          if (!data.appurl || data.appurl.length <= 0) {
            if (this.footer && this.footer.rootBox) {
              var ad = this.footer.rootBox.find('#dl_app');
              if (ad.length > 0) { ad.hide() };
            }
          }
          // end caof
          this.warning404.tel = data.tel ? data.tel : '4000086666';
          cSales.replaceContent($el);
        }, this));
      } else {
        if (local && refUrl.indexOf(local) === -1) {
          refUrl = refUrl.replace('http://', '').replace('https://', '').split('/')[0].toLowerCase();
          if (refUrl.indexOf('baidu') > -1) {
            sales = 'SEO_BAIDU';
          }
          if (refUrl.indexOf('google') > -1) {
            sales = 'SEO_GOOGLE';
          }
          if (refUrl.indexOf('soso.com') > -1) {
            sales = 'SEO_SOSO';
          }
          if (refUrl.indexOf('sogou') > -1) {
            sales = 'SEO_SOGOU';
          }
          if (refUrl.indexOf('m.so.com') > -1) {
            sales = 'SEO_SO';
          }
          if (refUrl.indexOf('so.360') > -1) {
            sales = 'SEO_360SO';
          }
          if (refUrl.indexOf('bing.com') > -1) {
            sales = 'SEO_BING';
          }
          if (refUrl.indexOf('yahoo') > -1) {
            sales = 'SEO_YAHOO';
          }
          if (refUrl.indexOf('youdao') > -1) {
            sales = 'SEO_YOUDAO';
          }
          if (refUrl.indexOf('jike.com') > -1 || refUrl.indexOf('babylon.com') > -1 || refUrl.indexOf('ask.com') > -1 || refUrl.indexOf('avg.com') > -1 || refUrl.indexOf('easou.com') > -1 || refUrl.indexOf('panguso.com') > -1 || refUrl.indexOf('yandex.com') > -1) {
            seosales = 'SEO_360SO';
          }
          if (sales) cSales.setSales(sales);
          setTimeout(function () {
            cSales.replaceContent($el);
          }, 1);
        }
      }
    },
    getServerDate: function (callback) {
      return cUtility.getServerDate(callback);
    },
    now: function () {
      return cUtility.getServerDate();
    },
    debug: function () {
      var debug = this.request.query['debug'] || localStorage.get('DEBUG');
      if (debug == 'yes') {
        $(window).unbind('error', debughander);
        $(window).bind('error', debughander);
        localStorage.set('DEBUG', debug, new cBase.Date(cBase.getServerDate()).addDay(1).valueOf());
      } else if (debug == 'no') {
        $(window).unbind('error', debughander);
        localStorage.remove('DEBUG');
      }
    },

    _sendUbt: function () {
      if (window.$_bf && window.$_bf.loaded == true) {
        //alert(this.pageid);
        if (this.pageid == 0) {
          return;
        }
        var url = this._getAurl(),
          query = this.request.query,
          pId = $('#page_id'),
          oId = $('#bf_ubt_orderid'),
          bigurl = location.protocol + "//" + location.host + url;

        var pageId = +(this.pageid);

        if (cUtility.isInApp()) {
          pageId += 1000;
          bigurl = "http://hybridm.ctrip.com/" + url.substr(url.indexOf('webapp'));
        }
        if (pId.length == 1) {
          pId.val(pageId);
        }
        //set order id
        if (oId.length == 1) {
          if (query && query.orderid) {
            oId.val(query.orderid);
          } else {
            oId.val('');
          }
        }
        window.$_bf['asynRefresh']({
          page_id: pageId,
          url: location.protocol + "//" + location.host + url
        });
      } else {
        if (!cUtility.isInApp()) {
          setTimeout($.proxy(this._sendUbt, this), 300);
        }
      }
    },

    _sendGa: function () {
      //ga统计
      if (typeof _gaq !== 'undefined') {
        var url = this._getAurl();
        _gaq.push(['_trackPageview', url]);
      } else {
        setTimeout($.proxy(this._sendGa, this), 300);
      }
    },

    _sendKenshoo: function () {
      var query = this.request.query;
      if (query && query.orderid) {
        var kurl = "https://2113.xg4ken.com/media/redir.php?track=1&token=8515ce29-9946-4d41-9edc-2907d0a92490&promoCode=&valueCurrency=CNY&GCID=&kw=&product="
        kurl += "&val=" + query.val + "&orderId=" + query.orderid + "&type=" + query.type;
        var imgHtml = "<img width='1' height='1' src='" + kurl + "'/>"
        $('body').append(imgHtml);
      }
    },

    _getAurl: function () {
      var url = this.request.root, param;
      if (this.request.viewpath) {
        url += "#" + this.request.viewpath;
      }
      if (this.request.path.length > 0) {
        param = $.param(this.request.query);
        url += "!" + this.request.path.join("/") + (param.length ? '?' + param : '');
      }
      return url;
    },

    //处理渠道
    disposeChannel: function () {
      var AllianceID = this.getQuery('allianceid'), SID = this.getQuery('sid'), OUID = this.getQuery('ouid');
      var UNION;
      if (AllianceID && SID) {
        UNION = {
          AllianceID: AllianceID,
          SID: SID,
          OUID: OUID
        };
        CommonStore.UnionStore.getInstance().set(UNION);
        //来自分销流量，隐藏浮层 2014-1-4 caof
        if (this.footer && this.footer.rootBox) {
          var ad = this.footer.rootBox.find('#dl_app');
          if (ad.length > 0) { ad.hide() };
        }
      } else {
        var local = location.host, refUrl = document.referrer;
        if (local && refUrl.indexOf(local) === -1) {
          refUrl = refUrl.replace('http://', '').replace('https://', '').split('/')[0].toLowerCase();
          if (refUrl.indexOf('baidu') > -1) {
            AllianceID = AllianceID || '4897';
            SID = SID || '353693';
            OUID = OUID || '';
          }
          if (refUrl.indexOf('google') > -1) {
            AllianceID = AllianceID || '4899';
            SID = SID || '353694';
            OUID = OUID || '';
          }
          if (refUrl.indexOf('soso.com') > -1) {
            AllianceID = AllianceID || '4900';
            SID = SID || '353696';
            OUID = OUID || '';
          }
          if (refUrl.indexOf('sogou') > -1) {
            AllianceID = AllianceID || '4901';
            SID = SID || '353698';
            OUID = OUID || '';
          }
          if (refUrl.indexOf('m.so.com') > -1) {
            AllianceID = AllianceID || '5376';
            SID = SID || '353699';
            OUID = OUID || '';
          }
          if (refUrl.indexOf('so.360') > -1) {
            AllianceID = AllianceID || '5376';
            SID = SID || '353700';
            OUID = OUID || '';
          }
          if (refUrl.indexOf('bing.com') > -1) {
            AllianceID = AllianceID || '4902';
            SID = SID || '353701';
            OUID = OUID || '';
          }
          if (refUrl.indexOf('yahoo') > -1) {
            AllianceID = AllianceID || '4903';
            SID = SID || '353703';
            OUID = OUID || '';
          }
          if (refUrl.indexOf('youdao') > -1) {
            AllianceID = AllianceID || '4904';
            SID = SID || '353704';
            OUID = OUID || '';
          }
          if (refUrl.indexOf('jike.com') > -1 || refUrl.indexOf('babylon.com') > -1 || refUrl.indexOf('ask.com') > -1 || refUrl.indexOf('avg.com') > -1 || refUrl.indexOf('easou.com') > -1 || refUrl.indexOf('panguso.com') > -1 || refUrl.indexOf('yandex.com') > -1) {
            AllianceID = AllianceID || '5376';
            SID = SID || '353700';
            OUID = OUID || '';
          }
          if (AllianceID && SID) {
            UNION = {
              AllianceID: AllianceID,
              SID: SID,
              OUID: OUID
            };
            CommonStore.UnionStore.getInstance().set(UNION);
            //来自分销流量，隐藏浮层 2014-1-4 caof
            if (this.footer && this.footer.rootBox) {
              var ad = this.footer.rootBox.find('#dl_app');
              if (ad.length > 0) { ad.hide() };
            }
          }
        }
      }
    },
    //获得guid
    getGuid: function () {
      return cUtility.getGuid();
    },
    setTitle: function (title) {
      document.title = title;
    },
    appendCss: function (styles) {
      if (!styles) return;
      for (var i = 0, len = styles.length; i < len; i++) {
        if (!this.css[styles[i]]) {
          this.head.append($('<link rel="stylesheet" type="text/css" href="' + styles[i] + '" />'));
          this.css[styles[i]] = true;
        }
      }
    },

    addClass: function (name) {
      this.$el.addClass(name);
    },

    removeClass: function (name) {
      this.$el.removeClass(name);

    },

    //新增view load 方法，此方法会触发其onload事件
    __load: function (lastViewName) {
      this.__onLoad(lastViewName);
    },

    //新增view 的show方法 
    show: function () {
      //在快速前进或是返回时，viewport会莫名其妙丢失view
      //这里强制判断，不存在则强行插入。
      if (this.$el.parent() == this.viewport) {
        this.viewport.append(this.$el);
      }
      
      this.$el.show();
      this.__onShow();
    },

    //新增view 的hide方法 
    hide: function (viewname) {
      this.$el.hide();
      this.__onHide(viewname);
    }
  });
});
