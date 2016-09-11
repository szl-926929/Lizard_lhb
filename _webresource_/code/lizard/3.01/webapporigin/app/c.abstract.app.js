/** 
 * Lizard APP对象
 * @author wxj@ctrip.com/luwei@ctripcom
 * @version V2.1
 */
define(['cPageModelProcessor', 'cUtilPerformance', 'cUtilCommon', ((Lizard.app.vendor.is('CTRIP') || Lizard.isHybrid) && !Lizard.app.code.is('WE')) ? 'cHybridHeader' : 'UIHeader', 'UILoading', 'cMessageCenter', 'UIAnimation', Lizard.app.version.gte(6.4)? 'cHybridShell' : '', 'react', 'cPageParser'],
  function (callModels, cperformance, utils, Header, UILoading, MessageCenter, animation, cHybridShell, React) {

    if (/\/html5\//i.test(location.href.replace(/[\?#].+$/, '')) && !Lizard.config.basehtml5) {
      var baseNode = document.createElement('base');
      baseNode.setAttribute('href', location.href.replace(/\/html5\//i, '/webapp/'));
      if (document.head.firstChild) {
        baseNode.insertBefore(document.head.firstChild);
      } else {
        document.head.appendChild(baseNode);
      }
    }    

    function APP(options) {
      this.initialize(options);
    }

    APP.subclasses = [];

    APP.defaults = {
      "mainRoot"        : '#main',
      "header"          : 'header',
      "viewport"        : '.main-viewport',
      "animForwardName" : 'slideleft',
      "animBackwardName": 'slideright',
      "isAnim"          : false,
      //是否开启动画
      "maxsize"         : 10
    };

    APP.prototype = {
      ctnrViewNames: ['lizardHisCtnrView'],

      viewReady: function (handler) {
        //TODO subscribe viewReady message
        MessageCenter.subscribe('viewReady', handler);
      },

      initialize: function initialize(options) {
        // Lizard.group();
        var opts = this.initProperty(options);
        this.options = opts;
        this.firstState = null;
        this.mainRoot = document.querySelector(opts.mainRoot);
        this.header = document.querySelector(opts.header);
        this.targetViewport = this.viewport = this.mainRoot.querySelector(opts.viewport);
        this.curView = null;
        this.lastView = null;
        //实例化cathViews组件
        this.maxsize = opts.maxsize;
        this.animForwardName = opts.animForwardName;
        this.animBackwardName = opts.animBackwardName;
        this.isAnim = Lizard.config.animationAPI || Lizard.config.isAnim || opts.isAnim;
        if (Lizard.config.animationAPI) {
          require([Lizard.config.animationAPI], _.bind(function(animation){
            this.animAPIs = animation;
          }, this));
        } else {
          this.animAPIs = animation;
        }
        this.animatName = this.animForwardName;

        //是否开启hashchange,false为不开启
        this.observe = false;
        this.headerView = new Header();
        if (Lizard.isHybrid) {
          //this.headerView.root.addClass('cm-header-hybird-wrap');
        }
        this.bindEvents();
        this.views = {};  
        this.loading = new UILoading();
        this.start();        
        MessageCenter.subscribe('switchview', function (inView, outView) {
          inView.$el.style.display = 'block';
        }, this);
      },

      initProperty: function initProperty(options) {
        var opts = _.extend({}, APP.defaults, options || {});
        return opts;
      },

      bindEvents: function () {
        this._handleLink();
      },
      _handleLink: function _handleLink() {
        if (!Lizard.isHybrid && !utils.isSupportPushState) {
          return;
        }
        document.body.addEventListener('click', _.bind(function (e) {
          var el = e.target;
          var needhandle = false;

          while (true) {
            if (!el) {
              break;
            }
            if (el.nodeName == 'BODY') {
              break;
            }
            if (el.className.split(/\s+/).indexOf('sub-viewport')) {
              break;
            }

            if (el.nodeName == 'A') {
              needhandle = true;
              break;
            }
            el = el.parentNode;
          }

          if (needhandle) {
            var href = el.getAttribute('href');
            var opts = {};
            var lizard_data = el.getAttribute('lizard-data');

            if (Lizard.config.lizardCatch == 'off'|| (el.getAttribute('lizard-catch') == 'off') || (href && utils.isExternalLink(href))) {
              return true;
            }
            e.preventDefault();
            if (lizard_data) {
              opts.data = JSON.parse(lizard_data);
            }
            if (el.getAttribute('data-jumptype') == 'back') {
              this.back(el.getAttribute('href'), opts);
            } else if (el.getAttribute('data-jumptype') == 'forward') {
              this.goTo(el.getAttribute('href'), opts);
            }
          }

        }, this));
      },

      start: function () {

      },

      loadView: function (url, html, options) {
        MessageCenter.unsubscribe('buonload');        
        var uuidDomready = cperformance.getUuid();
        var uuidOnload = cperformance.getUuid();
        cperformance.group(uuidDomready, {
          name       : "Domready",
          landingpage: (options.landingpage == 1) ? 1 : 0,
          url        : url
        });
        cperformance.group(uuidOnload, {
          name       : "Onload",
          landingpage: (options.landingpage == 1) ? 1 : 0,
          url        : url
        });        
        Lizard.loadingView = true;

        if (url) {
          //先向ubt发送unload
          if (Lizard.unloadUbt) {
            Lizard.unloadUbt(this.curView);
          }
        }
        var pageConfig = Lizard._initParser(url, html);        
        if ((Lizard.config && Lizard.config.isHideAllLoading) || options.hideloading) {
          if (_.isUndefined(pageConfig.isHideByOut)?!Lizard.config.isHideByOut:!pageConfig.isHideByOut) {
            this.hideLoading();  
          }
        }
        else {
          if (Lizard.app.vendor.is('CTRIP') && this.curView && this.curView.$el) {
            this.curView.$el.style.display = 'none'; 
          }
          this.showLoading();  
        }
        try{          
          pageConfig.serverData = window.Fp.getData('datas');
        }catch(e){}
        //获取页面配置后，执行Ajax获取数据并渲染callModels类似Model的excute并提供了成功和失败回调
        callModels(pageConfig, _.bind(function (datas, pageConfig) {
          delete pageConfig.serverData;
          //成功回调，先判断目前执行的回调是否属于当前用户最近浏览的URL
          if (_.isFunction(this.judgeForward) && !this.judgeForward(url)) {
            return;
          }
          //var uuidTemplateRender = cperformance.getUuid();
          //cperformance.group(uuidTemplateRender, {
          //  name: "TemplateRender",
          //  url : url
          //});
          //执行渲染
          var renderObj = Lizard.__firstPageRenderObj;
          delete Lizard.__firstPageRenderObj;
          if (_.isUndefined(renderObj)) {
            if (pageConfig.model.apis && pageConfig.model.apis.length === 0 && pageConfig.init_data) {
              datas = pageConfig.init_data;
            }
            renderObj = Lizard.render(pageConfig, datas, options.renderAt);
          } else {
            renderObj.config = pageConfig;
          }
          if (renderObj.header && this.targetViewport == this.viewport) {
            this.header.innerHtml = renderObj.header;
            this.header.style.display = 'block';
          }
          //cperformance.groupEnd(uuidTemplateRender);
          //html模板提供两种缓存机制，一种根据viewName缓存，还有一种根据schema缓存
          if (!Lizard.viewHtmlMap) {
            Lizard.viewHtmlMap = {};
          }
          if (!Lizard.viewSchemaMap) {
            Lizard.viewSchemaMap = {};
          }
          //全局遮罩层特殊，比如404这样的View对应的viewName可能是一个业务View的，所以不缓存
          if (_.indexOf(this.ctnrViewNames, renderObj.config.viewName) == -1){
            Lizard.viewHtmlMap[renderObj.config.viewName] = html;
            if (!Lizard.config.disableSchemaCache) {
              if (_.isString(renderObj.config.url_schema)) {
                var url_schema = renderObj.config.url_schema;
                if (url_schema.indexOf('/') === 0) {
                  (Lizard.viewSchemaMap[Lizard.schema2re(url_schema) + '$'] = html);
                } else {
                  (Lizard.viewSchemaMap[Lizard.schema2re('/' + url_schema) + '$'] = html);
                }
              } else {
                _.each(renderObj.config.url_schema, function(url_schema){
                  if (url_schema.indexOf('/') === 0) {
                    (Lizard.viewSchemaMap[Lizard.schema2re(url_schema) + '$'] = html);
                  } else {
                    (Lizard.viewSchemaMap[Lizard.schema2re('/' + url_schema) + '$'] = html);
                  }
                });  
              }
            }
          }
            
          //其实渲染完毕后，理论上就可以提前显示，而不必等 View实例化完成，所以这里先搞出节点放到文档碎片中根据需要可以提前append到文档上
          var renderNode = document.createElement('div');
          renderNode.style.display = 'none';                    
          //实例化View
          require(['cPageView', pageConfig.controller], _.bind(function (View, Component) {
            if (_.isFunction(this.judgeForward) && !this.judgeForward(url)) {
              return;
            }
            this.animatName = options.animatName || (this.navigationType == 'back' ? this.animBackwardName : this.animForwardName);
            if (this.curView) {
              this.lastView = this.curView;
            }
            if (options.forceCreateInstance && renderObj.config.viewName && this.views[renderObj.config.viewName]) {
              if (this.views[renderObj.config.viewName].$el) {
                this.views[renderObj.config.viewName].$el.remove();
              }
              this.views[renderObj.config.viewName] = null;
            }
            //同一个ViewName的View共享View实例
            if (renderObj.config.viewName && this.views[renderObj.config.viewName]) {
              this.curView = this.views[renderObj.config.viewName];
              this.curView.lastURL = this.curView.$el.getAttribute('page-url');                          
              this.curView.lizParam = renderObj.lizParam;
              this.curView.navigationType = this.navigationType;
            }
            else {
              if (!this.viewport.firstChild) {
                this.viewport.appendChild(renderNode);
                renderNode = this.viewport.firstChild;
              }              
              this.curView = new View({
                el: renderNode
              });  
              this.curView.$el.setAttribute('page-url', url);
              this.curView.$el.setAttribute('data-view-name', renderObj.config.viewName);
              this.curView.$el.setAttribute("id", renderObj.id);              
              this.curView.text = html;              
              _.extend(this.curView, _.pick(renderObj, ['datas', 'config', 'lizTmpl', 'lizParam']));
            }
            if (this.curView.pageinstance && _.isFunction(this.curView.pageinstance.getCurrentState)) {
              this.curView.pageinstance.setState(this.curView.pageinstance.getCurrentState());
            } else {
              this.curView.pageinstance = React.render(
                React.createElement(Component, {datas: renderObj.datas}),
                this.curView.$el                                  
              );
            }    
            this.curView.pageid = renderObj.config.pageid || this.curView.pageinstance.pageid;
            this.curView.hpageid = renderObj.config.hpageid || this.curView.pageinstance.hpageid;
            if (this.curView.$el.parentNode != this.targetViewport) {
              this.targetViewport.appendChild(this.curView.$el);
            }
            if (options.renderAt == 'server') {
              renderNode.parentNode.removeChild(renderNode);
            }
            Lizard.__fakeViewNode = null;
            cperformance.groupEnd(uuidDomready);
            this.hideLoading();
            MessageCenter.publish('switchview', [this.curView, this.lastView]);
            this.curView.lastViewId = this.curView.referrer = (this.lastView && this.lastView.config.viewName);
            this.switchView(this.curView, this.lastView);
            cperformance.groupEnd(uuidOnload); 
            if (renderObj.config.viewName) {
              this.views[renderObj.config.viewName] = this.curView;
            }
          }, this));
        }, this), _.bind(function (datas, errorBack) {
          //失败回调
          this.hideLoading();
          var errorData =
          {
            callback: function () {              
              Lizard.goTo(url, {pushState: false});
            },
            headData: {
              title : '网络不给力',
              back  : true,
              events: {
                returnHandler: function () {
                  Lizard.back();
                }
              }
            }
          };
          if (errorBack) {
            errorData = _.extend(errorData, errorBack(datas));
          }
          var errorBody = {
            datamodel: errorData,
            callTelAction: errorData.callTelAction || function() {},
            retryAction: errorData.callback
          };
          this.showWarning404(errorBody, pageConfig, errorData);
        }, this));
      },

      switchView: function(inView, outView) {
        if (outView && !document.getElementById(outView.id) && (inView && !inView.switchByOut)) {
          this.targetViewport.appendChild(outView.$el);
          outView.$el.style.display = 'none';
          outView.id = outView.$el.getAttribute('id');
        }
        if (inView && !document.getElementById(inView.id)) {
          this.targetViewport.appendChild(inView.$el);
          inView.$el.style.display = 'none';
          inView.id = inView.$el.getAttribute('id');
        }
        //inView.$el.show();
        //动画切换时执行的回调
        var switchFn;

        //此处有问题，如果inView不再的话，应该由firstState生成默认页面
        if (!inView) {
          throw 'inview 未被实例化';
        }
        //将T 、P的值重新设置回去
        Lizard.T.lizTmpl = inView.lizTmpl;
        Lizard.P.lizParam = inView.lizParam;

        //outView不存在的情况下就不释放动画接口
        if (outView) {
          if (outView.$el.style.display != 'none') {
            outView.saveScrollPos();
          }
          if (this.isAnim) {
            switchFn = this.animAPIs[this.animatName];
          }
          //switchFn = this.animAPIs[this.animatName];
          //未定义的话便使用默认的无动画
          //l_wang 此段代码需要做一个包裹，或者需要回调，否则不会执行应该执行的代码!!!
          inView.fromView = outView.config.viewName;
          if (_.indexOf(this.ctnrViewNames, inView.config.viewName) > -1) {
            MessageCenter.publish('showHisCtnrView');
            outView.hideWarning404 = _.bind(function () {
              if (this._warning404.status === 'show') {
                if (inView.config.viewName == 'warning404') {
                  this._warning404.hide();
                } else {
                  Lizard.goBack();
                }
              }
            }, this);
          }
          if (switchFn && _.isFunction(switchFn) && !inView.switchByOut) {
            switchFn(inView, outView, _.bind(function (inView, outView) {
              this._onSwitchEnd(inView, outView);
            }, this));
          } else {
            if (_.indexOf(this.ctnrViewNames, inView.config.viewName) == -1) {
              if (inView && !inView.switchByOut) {
                outView.hide();
              }
              inView.show();
            }
            this._onSwitchEnd(inView, outView);
          }
        } else {
          //这里开始走view的逻辑，我这里不予关注
          if (_.indexOf(this.ctnrViewNames, inView.config.viewName) > -1) {
            MessageCenter.publish('showHisCtnrView');
          }
          inView.show();
          this._onSwitchEnd(inView, outView);
        }
      },
      //l_wang 既然使用消息机制，就应该全部使用，后期重构
      _onSwitchEnd: function (inView, outView) {
        _.each(this.targetViewport.childNodes, function (view) {
          if (inView.switchByOut && outView && view == outView.$el) {
            return;
          }
          if (view != inView.$el) {
            view.style.display = "none";
          }
        });
        if (outView != inView && !inView.switchByOut) {
          setTimeout(function () {
            if (outView && outView.$el) {
              outView.$el.style.display = 'none';
            }
          }, 10);
        }

        MessageCenter.publish('viewReady', [inView]);
      },

      showView: function (data) {
        this.loadView(data.url, data.text, data.options);
      },

      /**
       * 页面跳转方法,灵活使用此方法,也可实现跨页面跳转
       * @method Lizard.goTo
       * @param {String} url URL信息
       * @param {Object} [opt] 跨页跳转的配置参数,如不传此参数, 则为单页的view切换, 详细参数信息,见@see http://jimzhao2012.github.io/api/classes/CtripUtil.html#method_app_open_url,
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
       * @example
       * //新开WebView的方式打开 osd/osdindex webView的名称指定为webViewOsd
       * Lizard.goTo(Lizard.appBaseUrl + 'osd/osdindex', {targetModel: '4', pageName: 'webViewOsd'})
       * //在同一个webView中直接跳转到osd/osdindex
       * Lizard.goTo(Lizard.appBaseUrl + 'osd/osdindex')
       */
      goTo: function (url, opt) {

      },

      /**
       * 页面回退方法,如果在第一个页面回退,则自动会回退至native界面
       * @method Lizard.goBack
       * @param {String} url URL信息
       * @param {Object} opt 设置信息
       * @param {String} [opt.pageName] 可选,如指定了此参数,多webview的情况,可回退至指定页面
       * @example
       * //回退至上一个页面,框架会判断如果是webview最先打开的页面会直接回退到上一个native页
       * Lizard.goBack()
       * //多WebView的情况下,回退至已打开webViewOsd页面, {pageName: 'webViewOsd'})
       * Lizard.goBack(Lizard.appBaseUrl + 'osd/osdindex', {pageName: 'webViewOsd'})
       */
      goBack: function () {

      },

      /**
       * 处理跨频道跳转, 屏蔽web与hybrid跨频道的不同
       * @method Lizard.jump
       * @param {String} url 要跳转的页面,支持http/https/ctripwireless和部分路径
       * @param {Object} [opt]  配置参数, 详细见@see http://jimzhao2012.github.io/api/classes/CtripUtil.html#method_app_open_url,
       * @param {number} [opt.targetModel=4] 新页面打开方式,4为单页面打开,5为新webview打开
       * @param {boolean} [opt.replace=false] 是否在浏览器history中增加记录
       * @example
       *  //在web环境下, href会跳转至http://m.ctrip.com/webapp/ticket/index, hybrid环境中会打开ticket/index.html#/webapp/ticket/index
       *  Lizard.jump('http://m.ctrip.com/webapp/ticket/index')
       *  //单webview打开线上地址
       *  Lizard.jump('http://m.ctrip.com/webapp/ticket/index',{targetModel:0})
       *  //多webview打开线上,或者设置Lizard.config.multiView 为 on
       *  Lizard.jump('http://m.ctrip.com/webapp/ticket/index',{targetModel:2})
       *  //web环境下会跳转至/webapp/myctrip/orders/allorders,hybrid环境中会打开myctrip/index.html#/webapp/myctrip/orders/allorders
       *  Lizard.jump('/webapp/myctrip/orders/allorders')
       *  //多webview打开hybrid页面
       *  Lizard.jump('/webapp/myctrip/orders/allorders',{targetModel:4})
       *  //跳转至native页面
       *  Lizard.jump('ctrip://wireless/hotel?id=2342342')
       */
      jump:function(url,opt){

      },
      /**
       * @deprecated 2.1 废弃
       * 内部调用goTo,具体参考goTo方法
       * @param url
       * @param opt
       * @method Lizard.go
       * @see Lizard.goTo
       */
      go    : function () {
      },

      /**
       * 显示一个全局遮盖层
       * @param {Function} onShow 显示遮盖层时的回调
       * @param {Function} onHide 隐藏遮盖层时的回调
       * @param {Object}  options 传入参数
       * @method Lizard.showHisCtnrView
       */
      showHisCtnrView: function (onShow, onHide, options) {
        this.__isLanding = false;
        if (!this.curView && !options.pageConfig) {
          return;
        }
        if (!this.curView && options.pageConfig) {
          options.addToHistory = false;
        }
        var oldAnimFlag = this.isAnim, oldAnimName = this.animatName;
        if (this.curView) {
          this.curView.triggerShow = this.curView.triggerHide = options ? (!options.triggerFlag) : true;
          this.curView.triggerHide = options && ('triggerHide' in options) ? (options.triggerHide) : true;
        }
        this.isAnim = (options && options.isAnim) ? true : this.isAnim;
        if (this.isAnim) {
          this.animatName = this.animForwardName;
        }
        var config = _.clone(options.pageConfig ? options.pageConfig : this.curView.config);
        var url = options.pageConfig ? options.pageConfig.pageUrl : this.curView.config.pageUrl;
        config.model.apis = [];
        config.view = { viewport: '' };
        config.controller = 'cPageView';
        config.viewName = options && options.viewName ? options.viewName : url;
        config.preventUBT = true;
        if (_.indexOf(this.ctnrViewNames, config.viewName) == -1) {
          this.ctnrViewNames.push(config.viewName);
        }        
        if (!options || options.addToHistory !== false) {
          if (Lizard.isHybrid) {
            this.endObserver();
            if (encodeURIComponent(url) == window.location.hash.substr(1)) {
              window.location.hash = encodeURIComponent(encodeURIComponent(url));
              url = encodeURIComponent(url);
            } else {
              window.location.hash = encodeURIComponent(url);
            }            
          } else {
            history.pushState({url: url, text: ' <SCRIPT type="text/lizard-config">' + JSON.stringify(config) + '<' + '/SCRIPT>', options: {pushState: true}}, document.title, url);
          }
        }
        this.loadView(url, ' <SCRIPT type="text/lizard-config">' + JSON.stringify(config) + '<' + '/SCRIPT>', { pushState: true, hideloading: true });
        if (Lizard.isHybrid) {
          var timeout = 1;
          if ($.os.ios && parseInt($.os.version) >= 9) {
            timeout = 100;
          }
          setTimeout(_.bind(this.startObserver, this), timeout);
        }
        var headData = {};
        MessageCenter.unsubscribe('showHisCtnrView');
        MessageCenter.subscribe('showHisCtnrView', function () {
          var self = this;
          this.lizardHisCtnrView = this.curView;
          if (!this.curView.onShow) {
            this.curView.onShow = function () {
              if (onShow) {
                onShow.apply(this, arguments);
              }
              setTimeout(function () {
                self.animatName = self.animBackwardName;
              }, 10);
            };
            this.curView.onHide = function () {
              if (onHide) {
                onHide.apply(this, arguments);
              }
              setTimeout(function () {
                self.isAnim = oldAnimFlag;
                self.animatName = oldAnimName;
              }, 10);
            }; 
          }  
          this.curView.show();
          if (self.isAnim) {
            this.curView.onShowed = true;
          }
        }, this);
      },

      /**
       * 隐藏遮盖层
       * @method Lizard.hideHisCtnrView
       */
      hideHisCtnrView: function () {
        history.back();
      },
      
      stateObserve: function(callback, scope, args) {
        if (!this.curView) {
          return;
        }
        if (!this._stateCallbacks) {
          this._stateCallbacks = [];
        }
        this._stateCallbacks.push({callback: callback, scope: scope, args: args, view: this.curView});        
      },
      
      _callObserveBack: function () {
        var callbackFunc = this._stateCallbacks.pop();
        if (callbackFunc.view == this.curView) {
          callbackFunc.callback.apply(callbackFunc.scope, callbackFunc.args);            
        }  
      },
      
      setHeader: function(data) {
        this.headerView.set(data);  
      },
      
      showLoading: function(data, template) {
        if (!data) {
          data = {};
        }
        if (this.loading._showTimeout) {
          clearTimeout(this.loading._showTimeout);
          delete this.loading._showTimeout;
        }
        this.loading._showTimeout = setTimeout(_.bind(function () {
          delete this.loading._showTimeout;
          this.loading.show(data, template);
        }, this), Lizard.config.showloadingtimeout || 200);          
      },
      
      hideLoading: function() {
        if (this.loading._showTimeout) {
          clearTimeout(this.loading._showTimeout);
          delete this.loading._showTimeout;
          return;
        }  
        this.loading.hide();
      },
      
      interface: function () {
        return {
          'viewReady'      : this.viewReady,          
          'stateObserve'   : this.stateObserve,
          "goTo"           : this.goTo,
          "goBack"         : this.goBack,
          /**
           * 页面跳转函数
           * @method Lizard.forward
           * @deprecated
           * @see Lizard.goTo
           */
          "forward"        : this.goTo,
          /**
           * 页面回退函数
           * @method Lizard.back
           * @deprecated
           * @see Lizard.goBack
           */
          "back"           : this.goBack,
          "go"             : this.go,
          "jump"           : this.jump,
          "setHeader"      : this.setHeader,
          "showLoading"    : this.showLoading,
          "hideLoading"    : this.hideLoading
        };
      }
    };

    return APP;
  });
