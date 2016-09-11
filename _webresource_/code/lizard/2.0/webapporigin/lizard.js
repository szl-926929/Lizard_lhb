define(['CommonStore', 'cMessageCenter', 'cUILoading', 'cUIWarning404', 'cUIHeader', 'cBase', 'cModel', 'memStore', 'cUtilityPath', 'cUtilityUtil', 'cUtilityStateHistory', 'cUtilityPerformance', 'cUtilityCacheView', 'cUIAnimation', 'cUtility', Lizard.app.version.gte(6.4)? 'cHybridShell' : '', 'cUtilityFlip', 'cPageParser'],
  function (CommonStore, MessageCenter, Loading, Warning404, cUIHeader, Base, cModel, mStore, path, utils, History, Performance, CacheViews, animation, util,cHybridShell) {
    //修复zepot html(undefined)的bug
    var oHtml = $.fn.html;
    $.fn.html = function (html) {
      if (html === undefined) {
        return (this.length > 0 ? this[0].innerHTML : null);
      } else {
        return oHtml.call(this, html);
      }
    };
    var oText = $.fn.text;
    $.fn.text = function (text) {
      if (text === undefined) {
        return (this.length > 0 ? this[0].textContent : null);
      } else {
        return oText.call(this, text);
      }
    };


    var location = window.location;
    var history = window.history;

    var DialogHist = [];
    var DialogMag = {};

    //添加base的处理
    if (/\/html5\//i.test(location.href.replace(/[\?#].+$/, ''))) {
      $('<base/>').attr('href', location.href.replace(/\/html5\//i, '/webapp/')).prependTo($('head').eq(0));
    }

    //矫正lizard的两个静态属性 ;
    Lizard.runAt = "client"; //运行在什么环境 html5还是webapp
    var renderAt = $('.main-viewport').attr('renderat');
    Lizard.renderAt = 'server';
    if (!renderAt) Lizard.renderAt = 'client'; //判断首屏渲染的环境v8还是brower
    Lizard.allowDebug = false;

    Lizard.log = function (msg) {
      if (window.console && console.log && Lizard.allowDebug) {
        var args = Array.prototype.splice.call(arguments, 0, arguments.length);
        args.unshift("(LOG)");
        console.log.apply(console, args);
      }
    };
    Lizard.group = function (name) {
      var callerName = Lizard.group.caller.name;
      if (window.console && console.group && console.time && Lizard.allowDebug) {
        var prefix = "Lizard.";
        console.time(prefix + callerName);
        console.group(prefix + callerName);
      }
    }
    Lizard.groupEnd = function (name) {
      var callerName = name || Lizard.groupEnd.caller.name;

      if (window.console && console.groupEnd && console.timeEnd && Lizard.allowDebug) {
        var prefix = "Lizard.";
        console.timeEnd(prefix + callerName);
        console.groupEnd(prefix + callerName);
      }
    }
    Lizard.dirs = function (opt) {
      if (window.console && console.dir && Lizard.allowDebug) {
        console.dir(opt);
      }
    }
    //google 再营销代码
    Lizard.gaMarketing = function () {
      var _img = new Image();
      _img.onload = function () {
      }
      _img.onerror = function () {
      }
      _img.src = ('https:' == document.location.protocol ? 'https:' : 'http:') + "//googleads.g.doubleclick.net/pagead/viewthroughconversion/1066331136/?value=1.000000&amp;label=cG9hCIyRngMQgNi7_AM&amp;guid=ON&amp;script=0";
    }


    //l_wang start
    var chistory = new History;
    var cperformance = new Performance;

    //缓存view实例
    window.cacheViews = new CacheViews;

    //首屏model的缓存
    window.cacheModels = new CacheViews();

    //l_wang end
    function APP(options) {
      this.initialize(options)
    }

    //定义一些初始的配置项
    APP.defaults = {
      "mainRoot"        : '#main',
      "header"          : 'header',
      "viewport"        : '.main-viewport',
      "animForwardName" : 'slideleft',
      "animBackwardName": 'slideright',
      "isAnim"          : false,
      //是否开启动画
      "maxsize"         : 10
    }
    APP.prototype = {
      //*********l_wang start*********
      //注册消息句柄
      registerMsg   : function (id, handler) {
        MessageCenter.register(MessageCenter.MAP.APP, id, handler);
      },

      //分发消息
      dispatchMsg   : function (id, data, scope) {
        MessageCenter.dispatch(MessageCenter.MAP.APP, id, data, scope);
      },

      //viewReady应该写到通用配置里，后期重构
      viewReady     : function (handler) {
        this.registerMsg('viewReady', handler);
      },
      createCommonUI: function () {
        this.loading = new Loading();
        this._waring404 = new Warning404();
        require(['text!ui/h5Loading.html'], _.bind(function(tmpl){
          var oldShow = this.loading.showAction;
          this.loading.showAction = function () {
            this.contentDom.html(tmpl);
            this.mask.show();
            oldShow.call(this);
            this.setzIndexTop();
          }
          var oldHide = this.loading.hide;
          this.loading.hide = function () {
            this.root && this.root.hide();
            this.mask && this.mask.hide();
            oldHide.call(this);
          }
          Lizard.__loadingtmpl = tmpl;
        }, this));
        require(['text!ui/loadFailed.html'], _.bind(function(tmpl){
          this._waring404.setTmpl(tmpl, '.btn-retry');
          Lizard.__loadingfailtmpl = tmpl;
        }, this));
      },
      showLoading   : function () {
        if (this.loading._showTimeout) {
          clearTimeout(this.loading._showTimeout);
          delete this.loading._showTimeout;
        }
        this.loading._showTimeout = setTimeout(_.bind(function () {
          if (_.isUndefined(cHybridShell)) {
            if (!Lizard.__loadingtmpl) return;
            this.loading.show && this.loading.show();
            this.loading.reposition && this.loading.reposition();
          } else {
            var fn = new cHybridShell.Fn('show_loading_page');
            fn.run();
          }
          delete this.loading._showTimeout;
        }, this),  this.options && this.options.showloadingtimeout || 200);
      },
      hideLoading   : function () {
        if (this.loading._showTimeout) {
          clearTimeout(this.loading._showTimeout);
          delete this.loading._showTimeout;
        }
        if (_.isUndefined(cHybridShell)) {
          this.loading.hide && this.loading.hide();
        } else {
          var fn = new cHybridShell.Fn('hide_loading_page');
          fn.run();
        }
      },

      //*********l_wang end*********
      //初始化函数
      initialize    : function initialize(options) {
        // Lizard.group();
        var opts = this.initProperty(options);
        this.options = opts;
        this.firstState = null;
        this.mainRoot = $(opts.mainRoot);
        this.header = $(opts.header);
        this.viewport = this.mainRoot.find(opts.viewport);
        this.curView = null;
        this.lastView = null;
        this.chistory = chistory;
        //实例化cathViews组件
        this.views = cacheViews;
        this.maxsize = opts.maxsize;

        //构建通用组件
        this.createCommonUI();

        if (Lizard.animationAPI) {
          require([Lizard.animationAPI], _.bind(function (animation) {
            this.animAPIs = animation;
          }, this));
        } else {
          this.animAPIs = animation;
        }
        this.animForwardName = opts.animForwardName;
        this.animBackwardName = opts.animBackwardName;
        this.isAnim = Lizard.animationAPI || opts.isAnim;
        this.animatName = this.animForwardName;

        //是否开启hashchange,false为不开启
        this.observe = false;

        var validate = this.validate();
        if (validate) {
          //throw validate;
        }

        this.start();
        MessageCenter.register(MessageCenter.MAP.APP, 'switchview', function (args) {
          var opts = args[0], $el = args[1], ret = args[2];
          if (opts.nextPageShow || !this.isAnim) {
            if (this.curView)
              this.curView.$el.hide();
            $el.show();
            _.isFunction(this.header.html) && this.header.html(ret.header).css({display: ''});
          } else {
            $el.hide();
          }
        });
        // Lizard.groupEnd();
      },
      initProperty  : function initProperty(options) {
        // Lizard.group();
        var opts = _.extend({},
          APP.defaults, options || {});
        // Lizard.log("opts:");
        // Lizard.dirs(opts);
        // Lizard.groupEnd();
        return opts;
      },
      validate      : function validate() {
        if (this.mainRoot.length < 1) {
          return "mainRoot 不存在"
        }
        if (this.header.length < 1) {
          return "header 不存在"
        }
        if (this.viewport.length < 1) {
          return "viewport 不存在"
        }
        return false
      },
      start         : function start() {

        Lizard.group()
        /*
         记录第一次访问时候的href
         */
        this.bookmarkAnchor = {};

        this.bindEvents();
        if (Lizard.isInCtripApp && window.Internal.isWinOS) {
          this.header.parent().show();
        } else if (Lizard.isHybrid) {
          this.header.parent().hide();
        } else {
          this.header.parent().show();
        }
        if (!Lizard.isHybrid || Lizard.isInCtripApp) {
          // Lizard.group();
          var fistPageURL = path.documentUrl.href.replace(/#DIALOG_.*$/, '');
          var fistPageHtml = document.documentElement.outerHTML;

          Lizard.log("Lizard.renderAt::" + Lizard.renderAt);
          Lizard.log("Lizard.runAt::" + Lizard.runAt);
          var pathBeginIndex = fistPageURL.indexOf(path.parseUrl(fistPageURL).pathname);
          this.loadView(fistPageURL.substring(pathBeginIndex), fistPageHtml, {
              viewName   : this.options.firstPageViewName || "viewName",
              loading    : (Lizard.renderAt != "server") ? (this.options.isFirstPageHideLoading ? false : null) : false,
              landingpage: 1
            },
            Lizard.renderAt == "server");
        } else {
          /**
           function getDefaultView() {
                var href = location.href, i = href.indexOf("#"), hash = i >= 0 ? href.substr(i + 1) : null;
                if (!hash) return hash;
                if (navigator.userAgent.indexOf('Gecko') != -1) {
                hash = decodeURIComponent(hash);
                }
                return hash;
                }
           **/
          var defaultView = this.chistory.getHash();
          if (!defaultView) {
            if (Lizard.localRoute.config.defaultView) {
              defaultView = Lizard.localRoute.config.defaultView;
            } else {
              defaultView = _.first(_.keys(Lizard.localRoute.config)).replace(/(\{(.+?)\})/g,
                function (a, b) {
                  return "";
                });
            }
            if (!defaultView) defaultView = '/index///';
          }
          var defaultView = defaultView.replace(/#DIALOG_.*$/, '');
          this.goTo(defaultView, {
            viewName: this.options.firstPageViewName || "viewName",
            loading : this.options.isFirstPageHideLoading ? false : null
          });
        }
        Lizard.groupEnd();
      },
      bindEvents    : function () {
        //l_wang提升响应速度
        $.bindFastClick && $.bindFastClick();
        //处理a标签
        this._handleLink();
        chistory.popstate(this);
      },
      //l_wang start
      _handleLink   : function _handleLink() {

        /*只有不是hybrid的情况下，且不支持pushstate的情况下，才走这里，因为hybird要走hashchange,也需要绑定click事件*/
        if (!Lizard.isHybrid && !utils.isSupportPushState) return;
        // Lizard.group();
        $('body').on('click', $.proxy(function (e) {
            var el = $(e.target);
            var needhandle = false;

            while (true) {
              if (!el[0]) break;
              if (el[0].nodeName == 'BODY') break;
              if (el.hasClass('sub-viewport')) break;

              if (el[0].nodeName == 'A') {
                needhandle = true;
                break;
              }
              el = el.parent();
            }

            //此处判断有问题，有可能点击的a标签中的行内元素
            if (needhandle) {
              //设置此属性便为真实链接，不予特殊处理，业务要处理与框架无关
              var href = el.attr('href');
              var opts = {};
              var lizard_data = el.attr('lizard-data');

              if (
                /*el.attr('target') || */
              (el.attr('lizard-catch') == 'off') || (href && utils.isExternalLink(href))) {
                return true;
              }

              e.preventDefault();
              if (lizard_data) {
                opts.data = JSON.parse(lizard_data);
              }
              //否则视作跳转，至于前进后退由a标签上面的属性决定
              if (el.attr('data-jumptype') == 'back') {
                this.back(el.attr('href'), opts);
              } else if (el.attr('data-jumptype') == 'forward') {
                this.goTo(el.attr('href'), opts);
              }
            }
          },
          this));
        // Lizard.groupEnd();
      },

      loadView       : function loadView(url, text, opts, isServer) {

        //每次在加载controllerjs之前，先设置page_id为wait，相当于将之前的数据发掉
        var view = this.curView || {
            hpageid        : '',
            pageid         : '',
            _getViewUrl    : function () {
              return "";
            },
            browserReferrer: ''
          };

        if (!window.__bfi) window.__bfi = [];
        var pId = $('#page_id');
        var urlUBT = location.href, refer = view.browserReferrer || "", pageId;
        if (util.isInApp() && !Lizard.isInCtripApp) {
          var urlAbsPath = Lizard.getAbsPath(urlUBT.replace(/.*#/, ""));
          urlUBT = Lizard.toUBTURL(urlAbsPath);
          if (!refer) {

          } else {
            var referAbsPath = Lizard.getAbsPath(refer.replace(/.*#/, ""));
            refer = Lizard.toUBTURL(referAbsPath);
          }
          pageId = view.hpageid;
        } else {
          pageId = view.pageid;
          if (!refer) {

          } else {
            var referAbsPath = Lizard.getAbsPath(refer, 1);
            refer = Lizard.toUBTURL(referAbsPath, 1);
          }
        }

        window.__bfi.push(['_unload', {
          page_id: pageId,
          url    : decodeURIComponent(urlUBT),
          refer  : decodeURIComponent(refer)
        }]);


        //end
        Lizard.group();
        opts = opts || {};
        // 临时加viewNameBack
        var pushState = false;
        if (!isServer) {
          pushState = opts.pushState;

          if (pushState !== false) {
            pushState = true;
          }
          //关闭hashchange
          this.closeObserve();
        }

        var uuidDomready = cperformance.getUuid();
        var uuidOnload = cperformance.getUuid();
        cperformance.group(uuidDomready, {
          name       : "Domready",
          landingpage: (opts.landingpage == 1) ? 1 : 0,
          url        : url
        });
        cperformance.group(uuidOnload, {
          name       : "Onload",
          landingpage: (opts.landingpage == 1) ? 1 : 0,
          url        : url
        });
        if (opts.loading !== false && !isServer) {
          if (this.options.isHideAllLoading) {
            if (opts.loading == true) {
              this.showLoading();
            }
          } else {
            this.showLoading();
          }
        }
        this.parsePage(url, text, _.bind(this._renderCallback, this), [null, isServer, opts, uuidDomready, uuidOnload, url, text, pushState]);
      },
      _renderCallback: function (ret, isServer, opts, uuidDomready, uuidOnload, url, text, pushState) {

        /*
         需要添加hashchange、popstate过来的逻辑，
         当popstate过来的state元素已经被删除，则需要重新恢复，但不能push记录到浏览器，同时id也不能变，
         这种场景主要发生在浏览过好多页面时，突然刷新浏览器，这是浏览器中的记录还在，但是view已经不存在了

         */
        if (ret.config.configEmpty) {
          if (opts.loading !== false && !isServer) this.hideLoading();
          return;
        }
        var $el = isServer ? this.viewport.children().eq(0) : $(ret.viewport);
        if (!isServer) {
          if (opts.stateid) {
            $el.attr("id", opts.stateid);
          } else {
            $el.attr("id", ret.id);
          }

        }

        cperformance.groupEnd(uuidDomready);
        if (!isServer) {
          //如果是第一次进来，则须把fake内容清理掉
          if (!this.firstState) {
            this.viewport.html("");
          }
          //if (opts.nextPageShow || !this.isAnim) {
          //if (this.curView) this.curView.$el.hide();
          //$el.show();
          //this.header.html(ret.header);
          //} else {
          $el.hide();
          //}
          $el.appendTo(this.viewport);
          //this.header.html(ret.header);
        }

        var state = {
          id  : isServer ? $el.attr("id") : (opts.stateid || ret.id),
          //优先考虑opts中的id
          url : isServer ? location.href : url,
          opts: opts
        };

        var cloneRet = _.omit(_.clone(ret), ['header', 'viewport', 'TDK']);
        if (isServer || opts.stateid) {
          cloneRet.id = $el.attr("id");
        }

        var params = _.extend({
            "viewName" : ret.config.viewName || opts.viewName,
            "text"     : text,
            "opts"     : opts,
            "$el"      : $el,
            "state"    : state,
            "url"      : url,
            "single"   : false,
            "pushState": pushState,
            "callback" : $.proxy(function (curView, lastView) {
                if (opts.loading !== false && !isServer)
                  this.hideLoading();
                if (curView && curView.switchByOut) {
                  curView.turning = function () {
                    lastView && lastView.hide();
                    $('.main-viewport').children().hide();
                    MessageCenter.dispatch(MessageCenter.MAP.APP, 'switchview', [opts, $el, ret], this);
                  }
                }
                else {
                  MessageCenter.dispatch(MessageCenter.MAP.APP, 'switchview', [opts, $el, ret], this);
                }
                this.switchView(curView, lastView);
                cperformance.groupEnd(uuidOnload);
              },
              this)
          },
          cloneRet);
        this.controller(params);
      },

      parsePage: function parsePage(url, html, callback, callbackarg) {

        Lizard.group();
        var self = this;
        var pageConfig = Lizard._initParser(url, html);
        var controller = Lizard.getController(pageConfig);

        if (window.navigator.userAgent.indexOf('Android 2') > -1 && $('head').length == 2) {
          $($('head')[1]).remove();
        }

        if (controller) require([controller]);
        Lizard.retyClickFunc = function () {
          delete Lizard.currentUrl;
          Lizard.goTo(url);
        }

        this.getData(pageConfig,
          function (datas) {
            var uuidTemplateRender = cperformance.getUuid();
            cperformance.group(uuidTemplateRender, {
              name: "TemplateRender",
              url : url
            });
            var renderObj = Lizard.render(pageConfig, datas);
            cperformance.groupEnd(uuidTemplateRender);
            if (!Lizard.urlSchemaMap) {
              Lizard.urlSchemaMap = {};
            }
            if (renderObj.config.url_schema) {
              if (_.isString(renderObj.config.url_schema)) {
                renderObj.config.url_schema = [renderObj.config.url_schema];
              }
              _.each(renderObj.config.url_schema,
                function (urlSchema) {
                  var parseRet = Lizard.schema2re(urlSchema, url);
                  if (parseRet.reStr && !Lizard.urlSchemaMap[parseRet.reStr]) {
                    Lizard.urlSchemaMap[parseRet.reStr] = {
                      html         : html,
                      urlMatchIndex: parseRet.index
                    };
                  }
                });
            }
            callbackarg[0] = renderObj;
            if (_.isFunction(callback)) callback.apply(this, callbackarg);
            Lizard.groupEnd('parsePage');
          });

      },

      getData: function getData(pageConfig, callback) {
        Lizard._isLoading = true;
        var models = Lizard.getModels(pageConfig);
        if (models.length == 0) {
          callback.call(this, []);
        }
        Lizard.ajaxDatas = {};
        Lizard.errorCalled = false;
        this._processModels(models, callback, [], _.isFunction(pageConfig.validate));
      },

      _transfuncToVal: function (obj) {
        for (var p in obj) {
          if (obj.hasOwnProperty(p)) {
            if (_.isString(obj[p]) && obj[p].indexOf('function') == 0) {
              obj[p] = eval('(' + obj[p] + ')()');
            } else if (_.isObject(obj[p]) || _.isArray(obj[p])) {
              this._transfuncToVal(obj[p]);
            }
          }
        }
      },

      _onSucess: function (data, datas, index, models, callback, ignoreError) {
        var model = models[index];
        model.done = true;
        model.error = false;
        datas[index] = data;
        if (model.name) {
          Lizard.ajaxDatas[model.name] = data;
        }
        if (_.every(models,
            function (model) {
              return model.done;
            })) {
          if (Lizard._stoploadpage) {
            this.hideLoading();
            Lizard._stoploadpage = false;
            return;
          }
          callback.call(this, datas);
        } else {
          this._processModels(models, callback, datas, ignoreError);
        }
      },

      _processModels: function (models, callback, datas, ignoreError) {
        var _this = this;
        if (_.some(models,
            function (model) {
              return model.error;
            }) && !Lizard.errorCalled) {
          Lizard.errorCalled = true;
          this.hideLoading();
          Lizard.currentUrl && chistory.pushState({url: Lizard.currentUrl.url, id: 'none_exist'}, Lizard.currentUrl.url, Lizard.currentUrl.url);
          Lizard._isLoading = false;
          var errorData = {
            callback: function () {
              waring404.hide();
              Lizard.retyClickFunc();
            },
            headData: {
              title : '网络不给力',
              events: {
                returnHandler: function () {
                  waring404.hide();
                  if (Lizard.isHybrid && this.bookmarkAnchor.isFirst) {
                    CtripUtil.app_back_to_home();
                  } else {
                    window.location.reload();
                  }
                }
              }
            }
          };
          if (Lizard.errorBack) errorData = _.extend(errorData, Lizard.errorBack(datas));
          var waring404 = this._waring404;
          waring404.show();
          waring404.options(errorData);
          if (errorData.tel) waring404.tel = errorData.tel;
          waring404.callback = function () {
            errorData.callback.call(this),
              waring404.hide()
          };
          var hDom = $('#headerview');
          if (errorData.headData) {
            var headerview = new cUIHeader({
              'root': hDom
            });
            if (!errorData.headData.events) {
              errorData.headData.events = {};
            }
            if (errorData.headData.events.returnHandler) {
              var returnFunc = errorData.headData.events.returnHandler;
              errorData.headData.events.returnHandler = function () {
                waring404.hide();
                returnFunc.call(this);
              }
            } else {
              errorData.headData.events.returnHandler = function () {
                waring404.hide();
                if (Lizard.isHybrid && this.bookmarkAnchor.isFirst) {
                  CtripUtil.app_back_to_home();
                } else {
                  window.location.reload();
                }
              }
            }
            headerview.set(errorData.headData)
          }
          return;
        }
        _.each(models,
          function (model, index) {
            if (model.processed) {
              return;
            }
            if (!model.depends || _.every(model.depends,
                function (depend) {
                  return (depend in Lizard.ajaxDatas);
                })) {
              var url = model.url,
                emodel = cacheModels.findById(url);
              if (!emodel) {
                emodel = new Base.Class(cModel, {
                  __propertys__: function () {
                    this.urlParseRet = path.parseUrl(url);
                    this.protocol = this.urlParseRet.protocol.substr(0, this.urlParseRet.protocol.length - 1);
                    if (location.protocol === 'https:' && this.protocol === 'http') {
                      url = 'https' + url.substr(4);
                    }
                  }                  
                }).getInstance();
                emodel.setAttr('url', url);
                _this._transfuncToVal(model.postdata);
                emodel.setAttr('param', model.postdata);
                var cacheStore = emodel.getResultStore();
                if (!cacheStore) {
                  var cachStore = new mStore({
                    key          : url,
                    useLocalStore: model.useLocalStore
                  });
                  emodel.setAttr('result', cachStore);
                }
                cacheModels.add(url, emodel);
              } else {
                _this._transfuncToVal(model.postdata);
                emodel.setAttr('param', model.postdata);
              }
              model.processed = true;
              if (model.suspend && eval('(' + model.suspend + ')()')) {
                _this._onSucess({},
                  datas, index, models, callback);
              } else {
                emodel.excute(function (data) {
                    _this._onSucess(data, datas, index, models, callback);
                  },
                  function (error) {
                    if (ignoreError || !(error instanceof XMLHttpRequest)) {
                      _this._onSucess(error, datas, index, models, callback, ignoreError);
                      if (error instanceof XMLHttpRequest) {
                        _this._stopdependModel(model, models, datas, callback);
                      }
                    } else {
                      model.error = true;
                      _this._processModels(models, callback, datas, ignoreError);
                    }
                  },
                  model.ajaxOnly, this)
              }
            }
          });
      },

      _stopdependModel: function (model, models, datas, callback) {
        var _this = this;
        _.each(models,
          function (modelItem, index) {
            if (modelItem == model) {
              return;
            }
            if (modelItem.depends && _.indexOf(modelItem.depends, model.name) > -1) {
              modelItem.done = true;
              modelItem.error = false;
              datas[index] = {};
              if (modelItem.name) {
                Lizard.ajaxDatas[modelItem.name] = {};
              }
              _this._stopdependModel(modelItem, models, datas, callback);
            }
          });
      },

      controller    : function controller(params) {

        Lizard.group();
        var controller = params.controller;
        var cloneparam = _.clone(params);
        var callback = params.callback ||
          function () {
          };
        if (cloneparam.pushState !== false) {
          cloneparam.pushState = true;
        }
        cloneparam = _.omit(cloneparam, ['controller', 'header', 'viewport', 'TDK', 'callback']);

        this.loadController(controller, $.proxy(function (View) {
            if (View) {
              this.lastView = this.curView;
              var recycleView = _.find(this.views.catchs, function (view) {
                return view.config && view.config.controller == cloneparam.config.controller;
              });
              /*           if (recycleView)
               {
               recycleView.$el = cloneparam.$el;
               recycleView.onCreate();
               recycleView.delegateEvents();
               this.curView = recycleView;
               }
               else */
              {
                this.curView = new View({
                  el: cloneparam.$el
                });
              }
              cloneparam = _.omit(cloneparam, ['$el', 'single']);

              this.curView.timestamp = (new Date()).getTime();
              if (cloneparam.viewName) {
                this.curView.$el.data("viewName", cloneparam.viewName);
              }
              cloneparam.viewportID = cloneparam.id;
              delete cloneparam.id;
              this.curView = _.extend(this.curView, cloneparam);

              this.curView['onmessage'] = this.curView['onmessage'] ||
              function (data) {
                Lizard.log('onmessage', data);
              }
              this.curView['postMessage'] = function (opts) {
                //return;
                var opts = opts || {};
                var viewName = opts.viewName;
                var data = opts.data;
                if (viewName) {
                  var view = this.views.findByViewName(viewName);
                  if (view && view['onmessage'] && data) {
                    view['onmessage'](data);
                  }
                } else {
                  this.views.values.each(function (key, view) {
                    if (view['onmessage'] && data) {
                      view['onmessage'](data);
                    }
                  })
                }
              }
              this.curView['refresh'] = function (datas) {
                var tmpl = this.config.view.viewport;
                if (tmpl) {
                  var compiled = _.template(tmpl);
                  var viewport = compiled(datas);
                  this.$el.html(viewport);
                }
              }
              this.curView.referrer = (this.lastView && this.lastView.url) || ""; //document.referrer;
              this.curView.browserReferrer = (this.lastView && this.lastView.url) || document.referrer;
              this.views.add(cloneparam.viewportID, this.curView);
            } else {
              this.lastView = this.curView;
              cloneparam.timestamp = cloneparam.timestamp || (new Date()).getTime();
              cloneparam = _.omit(cloneparam, ['single', 'opts', 'pushState', 'text', 'viewName']);
              this.curView = cloneparam;
              this.curView.referrer = (this.lastView && this.lastView.url) || ""; //document.referrer;
              this.curView.browserReferrer = (this.lastView && this.lastView.url) || document.referrer;
              this.curView.show = function () {
                this.$el.show();
              }
              this.curView.hide = function () {
                this.$el.hide();
              }
              this.curView.refresh = function (datas) {

              }
              this.curView.sendUbt = function () {

              }
              this.views.add(this.curView.id, this.curView);
            }

            if (!this.firstState || this.replaceFirstState) {
              this.firstState = cloneparam.state;
              this.bookmarkAnchor.href = window.location.href;
              this.bookmarkAnchor.isFirst = true;
              chistory.replaceState(cloneparam.state, cloneparam.url, cloneparam.url);
              this.bookmarkAnchor.hash = chistory.getHash();
            } else {
              /**
               需要添加对dialog单例和多例的判断
               **/
              if (cloneparam.pushState) {
                chistory.pushState(cloneparam.state, cloneparam.url, cloneparam.url);
                this.bookmarkAnchor.isFirst = false;
              }
            }
            Lizard.groupEnd('controller');
            callback(this.curView, this.lastView);
          },
          this));
      },
      loadController: function loadController(controller, callback) {
        Lizard.group();
        Lizard.log("controller:", controller);

        if (!controller) {
          _.isFunction(callback) && callback();
          Lizard.groupEnd();
          return;
        }
        /*
         处理hybrid中weinre调试
         */
        // if(Lizard.weinre){
        // controller = controller.replace("\.js","");
        // }
        requirejs([controller
            /*+"?t="+(new Date).getTime()*/
          ],
          function (View) {
            Lizard._isLoading = false;
            if (Lizard._stoploadpage) {
              this.hideLoading();
              Lizard._stoploadpage = false;
              return;
            }
            _.isFunction(callback) && callback(View);
            Lizard.groupEnd('loadController');
          })
      },
      switchView    : function switchView(inView, outView) {
        Lizard.group();
        Lizard.log('inView.id:', (inView && inView.id));
        Lizard.log('outView.id:', (outView && outView.id));
        Lizard.log('this.isAnim:', this.isAnim);

        //由于view移除可能不在文档中，所以先append
        if (outView && !document.getElementById(outView.id) && (inView && !inView.switchByOut)) {
          outView.$el.appendTo(this.viewport);
          outView.$el.hide();
        }
        if (inView && !document.getElementById(inView.id)) {
          inView.$el.appendTo(this.viewport);
          inView.$el.hide();
        }
        //inView.$el.show();
        //动画切换时执行的回调
        var switchFn;
        var scope = this;

        //此处有问题，如果inView不再的话，应该由firstState生成默认页面
        if (!inView) throw 'inview 未被实例化';

        //将T 、P的值重新设置回去
        Lizard.T.lizTmpl = inView.lizTmpl;
        Lizard.P.lizParam = inView.lizParam;

        //outView不存在的情况下就不释放动画接口
        if (outView) {
          outView.saveScrollPos();
          if (this.isAnim) {
            switchFn = this.animAPIs[this.animatName];
          }
          //switchFn = this.animAPIs[this.animatName];
          //未定义的话便使用默认的无动画
          //l_wang 此段代码需要做一个包裹，或者需要回调，否则不会执行应该执行的代码!!!
          inView.fromView = outView.viewName;
          if (switchFn && _.isFunction(switchFn)) {
            switchFn(inView, outView, $.proxy(function (inView, outView) {
                //清理多余的view
                Lizard.groupEnd('switchView');
                this._onSwitchEnd(inView, outView);
              },
              this));
          } else {
            inView && !inView.switchByOut && outView.hide();
            inView.show();
            Lizard.groupEnd('switchView');
            this._onSwitchEnd(inView, outView);
          }
        } else {
          //这里开始走view的逻辑，我这里不予关注
          inView.show();
          Lizard.groupEnd('switchView');
          this._onSwitchEnd(inView, outView);
        }
      },
      //l_wang 既然使用消息机制，就应该全部使用，后期重构
      _onSwitchEnd  : function (inView, outView) {

        /*Lizard.gaMarketing();*/

        if (outView != inView && !inView.switchByOut) {
          setTimeout(function () {
            outView && outView.$el && outView.$el.hide()
          }, 10);
        }
        //onshow之后发送ubt,这样bu\sbu就可以在onshow的时候设置pageid\hpageid
        inView.sendUbt(true);
        //触发渲染结束事件
        this.dispatchMsg('viewReady', inView);

        //清理多余的view
        this._destroyViews();
      },
      //根据时间戳操作views排序，然后进行view清理操作
      _destroyViews : function destroyViews(id) {
        //开启hashchange
        this.openObserve();
        Lizard.group();

        if (id) {
          var view = this.views.findById(id);

          if (view) {
            // view.$el.remove();
            //内部实现其实就是view.$el.remove();
            view.destroy();
            this.views.delById(id);
            this.views.delByIdFromBackups(id);
          }
          return;
        }
        var len = this.views.length() - this.maxsize;
        if (len < 1) {
          Lizard.groupEnd();
          return;
        }
        for (var i = 0; i < len; i++) {
          var obj = this.views.orderCaches.shift();
          var key = obj["key"];
          var view = this.views.findById(key);
          if (view) {
            view.$el.remove();
            var viewportID = view.viewportID;
            this.views.delById(viewportID);
            // this.views.delByIdFromBackups(viewportID);
          }
        }
        Lizard.groupEnd();
      },
      goTo          : function goTo(url, opts) {

        /*
         参数情况：
         1.goto(url)
         2.goto(url,opts)
         3.goto(opts)
         4.goto()

         */

        var self = this;
        self.header = $('#headerview>header');
        Lizard.group();
        if (!url) return;
        if (_.isObject(url)) {
          opts = url;
          url = opts.url;
          if (!url) return;
        }
        opts = opts || {};
        this.animatName = opts.animatName || this.animForwardName;
        this.replaceFirstState = opts.replaceFirstState || false;
        if (Lizard.currentUrl && Lizard.currentUrl.url == url) {
          return;
        }
        Lizard.currentUrl = {url: url, opts: opts};
        /*
         处理viewName存在的情况
         如果已经存在viewName的实例，则彻底销毁
         */

        if (opts.viewName) {
          var views = self.views;
          var view = views.findByName(opts.viewName);

          if (view) {
            if (opts.cache) {
              var pushState = opts.pushState;
              if (pushState !== false) {
                pushState = true;
              }
              self.lastView = self.curView;
              self.curView = view;
              var header = view.config.view.header;
              if (header) {
                self.header.html(header);
              }
              if (self.curView.timestamp > self.lastView.timestamp) {
                self.curView.navigationType = 'forward';
                self.animatName = self.animForwardName;
              } else {
                self.curView.navigationType = 'back';
                self.animatName = self.animBackwardName;
              }
              self.closeObserve();
              if (pushState) {
                chistory.pushState(view.state, view.url, view.url);
              }
              //暂时如此
              self.curView.referrer = self.lastView.url;
              self.switchView(self.curView, self.lastView);
            } else {
              self._destroyViews(view.viewportID);
              noExist();
            }
          } else {
            var view = views.findByNameFromBackups(opts.viewName);
            if (view) {
              if (opts.cache) {
                var opts = view.opts;
                opts.viewName = view.viewName;
                self.loadView(view.url, view.text, opts);
              } else {
                self._destroyViews(view.viewportID);
                noExist();
              }
            } else {
              noExist();
            }
          }
        } else {
          noExist();
        }
        function noExist() {
          Lizard.log("url:", url);
          Lizard.log("opts:", JSON.stringify(opts));
          self.showPageByHref(url, opts);
          Lizard.groupEnd();
        }
      },
      showPageByHref: function showPageByHref(url, opts) {

        Lizard.group();
        var that = this;
        var opts = opts || {};
        var type = opts.type || 'get';
        if (opts.data) type = 'post';
        if (!opts.data) opts.data = {};
        var data = opts.data;
        //所有页面都走跳页面的方式
        opts.jump = that.options.isAllPageJump;

        //如果url符合要求才进行读取
        if (!utils.goExternalLink(url, opts)) {
          //针对hybrid打包的文件
          var localRouteRet = Lizard.isHybrid && Lizard.localRoute.mapUrl(url);

          if (localRouteRet) {
            requirejs([localRouteRet],
              function (text) {
                Lizard.log("localRouteRet 存在");
                Lizard.groupEnd();
                that.loadView(url, text, opts);
              });
          } else {
            Lizard.log('url:', url);
            Lizard.log('type:', type);
            Lizard.log('data:', JSON.stringify(data));
            /*
             //"Order_nametip?type=name"与Order match匹配成功导致Order_nametip页面用了Order页面的缓存
             if (Lizard.urlSchemaMap) {
             var matchRet = [];
             for (var reStr in Lizard.urlSchemaMap) {
             var matches = url.replace(/[#\?].*$/g, '').match(new RegExp(reStr, 'i'));
             if (matches && matches.index == Lizard.urlSchemaMap[reStr].urlMatchIndex) {
             matchRet.push({ length: reStr.length, html: Lizard.urlSchemaMap[reStr].html });
             }
             }
             if (!_.isEmpty(matchRet)) {
             matchRet.sort(function (a, b) {
             if (a.length > b.length) {
             return -1;
             }
             else if (a.length < b.length) {
             return 1;
             }
             })
             that.loadView(url, matchRet[0].html, opts);
             return;
             }
             }*/

            $[type](url, data,
              function (text) {

                Lizard.log('新页面请求成功');
                Lizard.groupEnd();

                that.loadView(url, text, opts);
              });
          }
        }
      },
      closeObserve  : function closeObserve() {
        Lizard.group();
        this.observe = false;
        Lizard.groupEnd();
      },
      openObserve   : function openObserve() {
        Lizard.group();
        var that = this;
        setTimeout(function () {
            that.observe = true;
          },
          0);
        Lizard.groupEnd();
      },
      /*
       该函数主要用来处理popstate、hashchange的回调
       */
      showView      : function (data) {

        Lizard.log('Lizard.showView start');
        /*
         因为第一次进来就已经存入history了，所以浏览器记录变化过来的应该都有data对象了，
         如果没有的话就要重新打开页面了。
         */

        // data = data;|| this.firstState;
        //l_wang 暂时替换
        // var view = this.views.getItem(data.url);
        var view = this.views.findById(data.id);
        //if (view && view.state.url != data.url) {
        //  console.log('set view to null');
        //   view = null;
        //}
        //    var el = document.getElementById(data.id);
        if (view) {
          Lizard.log('data.url: ' + data.url + ' already exist');
          //事件缺失需要处理
          view.delegateEvents && view.delegateEvents();
          this.lastView = this.curView;
          this.curView = view;
          //这个时候需要将该view置前，并且改变url
          //this.views.push(data.id, this.curView, true);
          var header = view.config.view && view.config.view.header;
          if (header) {
            this.header.html(header).css({display: ''});
          }

          //l_wang 这里有个问题是，返回过程中一般不会有新的view产生，我们根据键值取出
          //而标识存于data中，没有就会回到firstState中
          //点击浏览器时候判断前进后退，根据view生成时间判断
          if (this.curView.timestamp > this.lastView.timestamp) {
            this.curView.navigationType = 'forward';
            this.animatName = this.animForwardName;
          } else {
            this.curView.navigationType = 'back';
            this.animatName = this.animBackwardName;
          }

          Lizard.log('Lizard.showView end');
          //添加back回来的referrer
          this.curView.referrer = (this.lastView && this.lastView.url) || ""; //document.referrer;

          //暂时如此
          this.switchView(this.curView, this.lastView);
        } else {
          var view = this.views.findByIdFromBackups(data.id);
          if (view) {
            var opts = view.opts;
            this._destroyViews(view.viewportID);
            opts.viewName = view.viewName;

            /*
             重新生成view但是不计入histroy、不生成新的id
             */
            opts.stateid = data.id;
            opts.pushState = false;

            this.loadView(view.url, view.text, opts, false);
          } else {
            // 如果页面元素不存在，则直接加载新页面
            Lizard.log('data.url: ' + data.url + ' not exist');
            Lizard.log('Lizard.showView end');
            /*
             重新生成view但是不计入histroy、不生成新的id
             */
            if (!data.opts) data.opts = {};
            data.opts.stateid = data.id;
            data.opts.pushState = false;
            this.goTo(data.url, data.opts);
          }
        }
      },

      goBack: function (url, opts) {
        //if (url) Lizard.currentUrl = {url: url, opts:opts};
        var self = this;
        self.header = $('#headerview>header');
        opts = opts || {};
        /*
         处理viewName存在的情况
         这种行为会导致和浏览器默认行为不一致
         适合做自定义访问行为的应用
         逻辑：
         如果viewName存在，从findByName中找出view实例，并显示
         如果findByName中不存在，但是findByNameFromBackups中存在，则从中去除
         响应信息进行恢复，如果都不存在，这直接抛出异常
         */
        if (opts.viewName) {
          var pushState = opts.pushState;
          if (pushState !== false) {
            pushState = true;
          }
          var views = self.views;
          var view = views.findByName(opts.viewName);
          if (view) {
            self.lastView = self.curView;
            self.curView = view;
            var header = view.config.view.header;
            if (header) {
              self.header.html(header);
            }
            if (self.curView.timestamp > self.lastView.timestamp) {
              self.curView.navigationType = 'forward';
              self.animatName = self.animForwardName;
            } else {
              self.curView.navigationType = 'back';
              self.animatName = self.animBackwardName;
            }
            self.closeObserve();
            if (pushState) {
              chistory.pushState(view.state, view.url, view.url);
            }
            Lizard.currentUrl = {url: view.url, opts: opts};
            //暂时如此
            self.switchView(self.curView, self.lastView);
          } else {
            var view = views.findByNameFromBackups(opts.viewName);
            if (view) {
              var opts = view.opts;
              self._destroyViews(view.viewportID);
              opts.viewName = view.viewName;
              self.loadView(view.url, view.text, opts);
            } else {
              // throw new Error "name equal "+opts.viewName+" view not exist";
              if (url) {
                this.goTo(url, opts);
              }
            }
          }
          return;
        }

        //此处做一处理，解决landingpage问题
        if (typeof url != 'string') {
          if (history.length > 1) {
            if (Lizard.isHybrid && this.bookmarkAnchor.isFirst) {
              var reqs = ['cWidgetFactory', 'cWidgetGuider'];
              require(reqs,
                function () {
                  var WidgetFactory = arguments[0];
                  var Guider = WidgetFactory.create('Guider');
                  Guider.backToLastPage({});
                });
            } else {
              history.back();
              return;
            }
          } else {
            if (typeof url == 'object') {
              opts = url;
              opts.animatName = opts.animatName || this.animBackwardName;

              //这个时候需要处理 firsState
              opts.replaceFirstState = true;
              opts.isPushState = true;
              this.goTo(opts.defaultView, opts);
            }
          }
        } else {
          opts.animatName = opts.animatName || this.animBackwardName;
          //此处有问题
          opts.isPushState = false;
          this.goTo(url, opts);
        }
      },
      go    : function (no) {
        history.go(no);
      },

      /**
       * 移植自2.1版本
       */
      jump: function(url,opt) {
        if (Lizard.isHybrid || Lizard.isInCtripApp) {
          var openUrl = url,
            isLegalAgr = opt && _.isNumber(opt.targetModel),
            isMultView = (Lizard.config.multiView == "on"),
            index = url.toLowerCase().indexOf('/webapp/');
          //如果是完整的url, 将url转换为hybrid的格式
          if (util.validate.isUrl(url)) {
            targetModel = isLegalAgr ? opt.targetModel :  (isMultView ? 2 : 5);
            if (targetModel >= 4) {
              var paths = url.match(/webapp\/([^\/]+)/i);
              if (paths.length > 1) {
                var sbuName = paths[1];
                openUrl = sbuName + "/index.html" + "#" + url.substr(url.indexOf('/webapp'));
              }
            }
          }else if (url.indexOf('ctrip://') == 0) {
            //唤醒协议
            targetModel = 1;
          } else if (url.indexOf('.html#') > 0) {
            //路径有hash,本view打开
            targetModel = isLegalAgr ? opt.targetModel : 5;
            openUrl = index >= 0 ? url.substr(index + 8) : url;
          } else {
            //如果为部分url,检查是否符合跳转格式
            openUrl = index >= 0 ? url.substr(index + 8) : url;
            var reg = /^([^\/]+)\/([^\s]*)/;
            var paths = openUrl.match(reg);
            if (paths && paths.length > 2) {
              //如果没有index.html
              if (paths[1].indexOf('index.html') < 0) {
                openUrl = paths[1] + "/index.html" + "#" + url;
              }
            }
          }
          targetModel = isLegalAgr ? opt.targetModel : (isMultView ? 4 : 5);
          CtripUtil.app_open_url(openUrl, targetModel, opt && opt.title || "", opt && opt.pageName || openUrl, opt && opt.isShowLoadingPage || false);
        } else {
          var openUrl = url;
          //如果不是url格式,直接跳转
          if (!util.validate.isUrl(url)) {
            var domain = window.location.protocol + '//' + window.location.host
            //如果没有webapp,不全格式
            if (url.toLowerCase().indexOf('/webapp') < 0 && url.toLowerCase().indexOf('/html5') == -1) {
              openUrl = domain + "/webapp/" + url;
            } else {
              openUrl = domain + url;
            }
          }

          if (opt && opt.replace) {
            window.location.replace(openUrl);
          } else {
            window.location.href = openUrl;
          }
        }
      },

      showDialog: function showDialog(config, opts) {
        this.closeObserve();

        var dialogPre = "DIALOG_"
        var that = this;
        opts = opts || {};
        if (opts.loading !== false) {
          if (that.options.isHideAllLoading) {
            if (opts.loading == true) {
              that.showLoading();
            }
          } else {
            that.showLoading();
          }
        }

        var dialogName = opts.dialogName || "dialog" + (++utils.dialogUuid);
        this.animatName = opts.animatName || this.animForwardName;
        var single = opts.single;
        var pushState = opts.pushState;
        if (pushState !== false) {
          pushState = true;
        }
        var viewName = opts.viewName;

        var pageUrl = this.curView.url.replace(/#DIALOG_.*$/, ''); //window.location.href.replace(hash,'')
        var pageID = this.curView.id.replace(/\$.*/, '');
        var lizTmpl = this.curView.lizTmpl;
        var lizParam = this.curView.lizParam;
        var text = this.curView.text;
        //添加对dialog hashchange的处理
        if (!DialogHist.length) {
          DialogHist.unshift({
            url: pageUrl,
            id : pageID
          });
        }

        var url = pageUrl + '#' + dialogPre + dialogName;
        var config = config || {};
        if (!config.model) config.model = {};
        if (!config.view) config.view = {};
        var uuidDomready = cperformance.getUuid();
        var uuidOnload = cperformance.getUuid();

        cperformance.group(uuidDomready, {
          "name"     : "Domready",
          landingpage: 0,
          url        : url
        });
        cperformance.group(uuidOnload, {
          name       : "Onload",
          landingpage: 0,
          url        : url
        });

        function getDataEnd(datas) {
          var uuidTemplateRender = cperformance.getUuid();
          cperformance.group(uuidTemplateRender, {
            name: "TemplateRender",
            url : url
          });
          var ret = Lizard.render(config, datas, {
            pageID    : pageID,
            dialogName: dialogName,
            ubtInfo   : {
              ab_testing_tracker: opts.ab_testing_tracker || "",
              bf_ubt_orderid    : opts.bf_ubt_orderid || "",
              page_id           : opts.page_id || ""
            }
          });
          cperformance.groupEnd(uuidTemplateRender);
          ret.dialogName = dialogName;
          that._renderCallback(ret, false, opts, uuidDomready, uuidOnload, url, text, pushState);
        };

        that.getData(config,
          function (datas) {
            var configData = config.model.data;
            if (configData) {
              datas = datas.concat([configData]);
            }
            getDataEnd(datas);
          });

      },
      interface : function () {
        return {
          "goTo"       : this.goTo,
          "goBack"     : this.goBack,
          "showDialog" : this.showDialog,
          "forward"    : this.goTo,
          "back"       : this.goBack,
          "go"         : this.go,
          "jump"       : this.jump,
          'registerMsg': this.registerMsg,
          'viewReady'  : this.viewReady,
          'showLoading': this.showLoading,
          'hideLoading': this.hideLoading

        }
      }
    }
    return APP
  })
