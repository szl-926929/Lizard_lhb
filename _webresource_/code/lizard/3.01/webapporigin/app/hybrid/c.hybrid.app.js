define(['cUtilCommon', 'cCoreInherit', 'cAbstractApp', 'cHybridShell'], function (UtilCommon, cCoreInherit, APP, cHybridShell) {
  //继承cAbstractApp
  return cCoreInherit.Class(APP, {

    bindEvents: function ($super) {
      $super();
      $(window).bind('hashchange', _.bind(function (e) {
        if (!this.stopListening) {
          this.loadFromRoute(this._getCurrentView(), 0);
          this.navigationType = 'back';
        }
        if (Lizard.__fakeViewNode) {
          Lizard.__fakeViewNode.remove();
        }
      }, this));
    },

    start: function () {
      this.startUrl = this._getCurrentView();
      this.openWithApp = (history.length == 1) ? true : false;
      this.loadFromRoute(this.startUrl, 1);
      if (Lizard.config.multiView == 'on') {
        var fn = new cHybridShell.Fn('enable_drag_animation');
        fn.run(true);
      }
    },

    loadFromRoute: function (landingpath, landingpage, forceCreateInstance) {
      var localRouteRet = Lizard.localRoute.mapUrl(landingpath);
      if (!localRouteRet && landingpage === 1 && Lizard.localRoute.config.defaultView) {
        localRouteRet = Lizard.localRoute.mapUrl(Lizard.localRoute.config.defaultView);
      }
      if (localRouteRet) {
        requirejs([localRouteRet], _.bind(function (text) {
          if (landingpath == this._getCurrentView()) {
            this.loadView(landingpath, text, {
              pushState  : false,
              renderAt   : Lizard.renderAt,
              landingpage: landingpage,
              forceCreateInstance: forceCreateInstance
            });
          } else {
            console.log('fast click back!!!');
          }
        }, this));
      }
    },

    _getCurrentView: function () {
      var landingpath = decodeURIComponent(window.location.hash);
      if (landingpath.indexOf('#') === 0) {
        landingpath = landingpath.substr(1);
      } else {
        landingpath = Lizard.localRoute.config.defaultView || _.first(_.keys(Lizard.localRoute.config));
      }
      return landingpath;
    },

    /*
     * 页面跳转方法,灵活使用此方法,也可实现跨页面跳转
     * @param {String} url URL信息
     * @param {Object} [opt] 跨页跳转的配置参数,如不传此参数, 则为单页的view切换, 详细参数信息,见{@link http://jimzhao2012.github.io/api/classes/CtripUtil.html#method_app_open_url},
     * @param {String} [opt.targetModel] 打开模式  如果全局的Lizard.config.multiView=on开启,则取值为4
     *
     * 0.当前页面刷新url, 该参数类似于js的location.href="", 注：只支持打online地址
     *
     * 1.处理ctrip://协议; 注：只处理ctrip协议的URL Schema
     *
     * 2.开启新的H5页面,title生效; 注：只支持online地址
     *
     * 3.使用系统浏览器打开; 注：只支持online地址和其它App的URL Schema，例如微信的weixin://home
     *
     * 4.开启新的H5页面，title生效，打开webapp目录下的相对路径；注：和2对应，2打开online地址，4打开相对路径
     *
     * 5.当前页面打开webapp目录下相对路径；注：和0对应，0是打开online地址，5是打开本地相对路径。 5.8之前版本，内部自动调用app_cross_package_href
     * @param {String} [opt.pageName] view的唯一标示
     * @param {String} [opt.title]  当targetMode＝2时候，新打开的H5页面的title
     * @param {Boolean} [opt.isShowLoadingPage] 开启新的webview的时候，是否加载app的loading
     * @method Global.Lizard.goTo
     * @example
     * //新开WebView的方式打开 osd/osdindex webView的名称指定为webViewOsd
     * Lizard.goTo(Lizard.appBaseUrl + 'osd/osdindex', {targetModel: '4', pageName: 'webViewOsd'})
     * //在同一个webView中直接跳转到osd/osdindex
     * Lizard.goTo(Lizard.appBaseUrl + 'osd/osdindex')
     */
    goTo           : function (url, opt) {
      var now = new Date();
      if ((opt && !opt.forcegoto) && this.lastGoto && now - this.lastGoto < 500) {
        console.log('return');
        return;
      }
      this.navigationType = 'forward';
      if (_.isObject(url)) {
        if (history.length > 1) {
          this.goBack();
          return;
        } else {
          var opts = url;
          opts.animatName = opts.animatName || this.animBackwardName;
          //这个时候需要处理 firsState
          opts.replaceFirstState = true;
          opts.isPushState = true;
          this.goTo(opts.defaultView, opts);
          return;
        }
      }
      var pageName = (opt && opt.pageName) ? opt.pageName : url;

      if ((opt && ('targetModel' in opt)) || Lizard.config.multiView == 'on') {
        var fn = new cHybridShell.Fn('open_url'),
          targetModel = (opt && opt.targetModel > 0) ? opt.targetModel : 4;

        if (targetModel >= 4) {
          url = Lizard.appBaseUrl.substr(8) + 'index.html#' + url;
          if (!Lizard.app.version.gte(6.4)) {
            this.hideLoading();
          }
        }
        fn.run(url, targetModel, opt && opt.title || "", opt && opt.pageName || url, opt && opt.isShowLoadingPage, opt && opt.meta);
      } else {
        this.endObserver();
        //if (Lizard.app.version.gte(6.9) && $.os.ios) {
          //window.location.hash = url;
        //} else {
          window.location.hash = encodeURIComponent(url);        
        //}             
        if ($.os.ios && parseInt($.os.version, 10) >= 9) {
          setTimeout(_.bind(function() {
            this.__loadview(url, opt);
          }, this), 10);
        } else {
          this.__loadview(url, opt);
        }        
        var timeout = 1;
        if ($.os.ios && parseInt($.os.version, 10) >= 9) {
          timeout = 100;
        }
        setTimeout(_.bind(this.startObserver, this), timeout);
      }
    },
    
    __loadview: function(url, opt) {
      var pageName = (opt && opt.pageName) ? opt.pageName : url;
      if (opt && pageName && Lizard.viewHtmlMap[pageName]) {
        this.loadView(url, Lizard.viewHtmlMap[pageName], {
          pushState: false,
          forceCreateInstance: opt.forceCreateInstance
        });
        return;
      } else {
        this.loadFromRoute(url, 0, opt && opt.forceCreateInstance);
      }
    },

    /*
     * 页面回退方法,如果在第一个页面回退,则自动会回退至native界面
     * @param {String} url URL信息
     * @param {Object} opt 设置信息
     * @param {String} [opt.pageName] 可选,如指定了此参数,多webview的情况,可回退至指定页面
     * @method Global.Lizard.goBack
     * @example
     * //回退至上一个页面,框架会判断如果是webview最先打开的页面会直接回退到上一个native页
     * Lizard.goBack()
     * //多WebView的情况下,回退至已打开webViewOsd页面, {pageName: 'webViewOsd'})
     * Lizard.goBack(Lizard.appBaseUrl + 'osd/osdindex', {pageName: 'webViewOsd'})
     */
    goBack         : function (url, opt) {
      var fn;
      if (arguments.length === 0) {
        var hash = window.location.hash;
        if (this.openWithApp && (hash.substr(1) == this.startUrl || decodeURIComponent(hash).substr(1) == this.startUrl)) {
          fn = new cHybridShell.Fn('back_to_last_page');
          fn.run("BACK", false);
        } else {
          history.back();          
        }
      } else if (opt && opt.pageName && !Lizard.viewHtmlMap[opt.pageName]) {
        //如果多view的情况,指定了pageName, 会跳转值指定页
        fn = new cHybridShell.Fn('back_to_page');
        fn.run(opt.pageName, "BACK");
      } else {
        this.goTo.apply(this, arguments);
        this.navigationType = 'back';
      }
    },

    /*
     * 跨频道跳转
     *  //
     * /webapp/myctrip/orders/allorders -->myctrip/index.html#/webapp/myctirp/orders/allorders
     * myctrip/orders/allorders -->myctrip/index.html#/myctirp/orders/allorders
     */
    jump           : function (url, opt) {
      var openUrl = url,
        isLegalAgr = opt && _.isNumber(opt.targetModel),
        isMultView = (Lizard.config.multiView == "on"),
        index = url.toLowerCase().indexOf('/webapp/'), paths, targetModel;
      if (UtilCommon.isUrl(url)) {
        targetModel = isLegalAgr ? opt.targetModel : (isMultView ? 2 : 5);
        if (targetModel >= 4) {
          paths = url.match(/webapp\/([^\/]+)/i);
          if (paths.length > 1) {
            var sbuName = paths[1];
            openUrl = sbuName + "/index.html" + "#" + url.substr(url.indexOf('/webapp'));
          }
        }
      } else if (url.indexOf('ctrip://') === 0) {
        //唤醒协议
        if (!opt) {
          opt = {};
        }
        opt.targetModel = 1;
        isLegalAgr = 1;
      } else if (url.indexOf('.html#') > 0) {
        //路径有hash,本view打开
        targetModel = isLegalAgr ? opt.targetModel : 5;
        openUrl = index >= 0 ? url.substr(index + 8) : url;
      } else {
        //如果为部分url,检查是否符合跳转格式
        openUrl = index >= 0 ? url.substr(index + 8) : url;
        var reg = /^([^\/]+)\/([^\s]*)/;
        paths = openUrl.match(reg);
        if (paths && paths.length > 2) {
          //如果没有index.html
          if (paths[1].indexOf('index.html') < 0) {
            openUrl = paths[1] + "/index.html" + "#" + url;
          }
        }
      }
      targetModel = isLegalAgr ? opt.targetModel : (isMultView ? 4 : 5);
      var fn = new cHybridShell.Fn('open_url');
      fn.run(openUrl, targetModel, opt && opt.title || "", opt && opt.pageName || openUrl, opt && opt.isShowLoadingPage || false, opt && opt.meta);
    },

    startObserver: function () {
      this.stopListening = false;
    },

    endObserver: function () {
      this.stopListening = true;
    },

    judgeForward: function (url) {
      if (window.location.hash) {
        return decodeURIComponent(url) == decodeURIComponent(decodeURIComponent(window.location.hash)).substr(1);
      } else {
        return url == (Lizard.localRoute.config.defaultView || _.first(_.keys(Lizard.localRoute.config)));
      }
    }
  });
});
