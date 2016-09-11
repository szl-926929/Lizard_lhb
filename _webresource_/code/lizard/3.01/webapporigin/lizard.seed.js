/**
 * @namespace Lizard
 */
(function () {
  //初始化Lizard命名空间

  /*…jiangjing@ctrip.com…2015-01-08…*/
  /**
   * 当前宿主应用程序的相关信息
   * @name Lizard.app
   * @example
   *
   * // 判断当前 APP 是否由携程自主开发
   * Lizard.app.vendor.is('CTRIP')
   *
   * // 判断当前 APP 是否主版
   * Lizard.app.code.is('MASTER')
   *
   * // 判断当前 APP 是否青春版
   * Lizard.app.code.is('YOUTH')
   *
   * // 判断当前 APP 是否攻略社区版
   * Lizard.app.code.is('GS')
   * // 判断当前 APP 是否攻略周末版
   * Lizard.app.code.is('WE')
   * // 判断当前 APP 是否安卓TV
   * Lizard.app.code.is('TV')
   *
   * // 判断是否是微信
   * Lizard.app.code.is('WEIXIN')
   *
   * // 判断当前 APP 的版本号是否小于、小于等于、等于、大于等于、大于某个特定版本号
   * Lizard.app.version.toString() //获取版本号
   * Lizard.app.version.lt(6.1)
   * Lizard.app.version.lte(6.1)
   * Lizard.app.version.eq(6.1)
   * Lizard.app.version.gte(6.1)
   * Lizard.app.version.gt(6.1)
   */
  function appInfo() {
    var
    // 各版本特征码
      ATTRS = {
        // 主版
        MASTER : ['Ctrip_CtripWireless', 'Unicom_CtripWireless', 'Pro_CtripWireless'],

        // 青春版
        YOUTH : ['Youth_CtripWireless'],

        // 攻略社区
        GS : ['gs_wireless'],
        // 攻略社区
        WE : ['we_wireless'],
        // Android TV
        TV : ['AndroidTV_CtripWireless'],
        // 铁友
        TY : ['Tieyou_TieyouWireless'],
        // 携程特价
        DIS : ['Discount_CtripWireless']
      },

    // 厂商代号一律为大写英文字母
      _VENDOR,

    // 应用代码一律为大写英文字母
      _CODE,

      _version,
      _normVersion,

    // 将版本号各部分前缀补零，以方便不同版本号之间的比较，e.g.
    // 5.10 -> 005.010
    // 6.0  -> 006.000
      normVersion = function (/*String|Number*/
                              version) {
        // 强制转制成字符串
        version += '';

        // 假设一种情况，实参为数字 6.0，则小数部分将被忽略。故：
        // 如果版本号不含次版本号，则强制添加次版本号为 0
        if (version.indexOf('.') < 0) {
          version += '.0';
        }

        version = (version + '').split('.');
        for (var iterator = 0; iterator < version.length; iterator++) {
          version[iterator] = '000'.substr(version[iterator].length) + version[iterator];
        }
        return version.join('.');
      },

      RE = RegExp,

      UA = window.navigator.userAgent;

    // 逐一对比特征码与 userAgent 信息
    for (var iterator in ATTRS) {
      for (var i = 0; i < ATTRS[iterator].length; i++) {
        if (new RE(ATTRS[iterator][i] + '_([\\d.]+)$').test(UA)) {
          _VENDOR = 'CTRIP';
          _CODE = iterator;
          _version = RE.$1;
          break;
        }
      }
    }

    if (!_VENDOR) {
      // 第三方厂商：微信
      if (/MicroMessenger\/([\d.]+)/.test(UA)) {
        _VENDOR = 'TECENT';
        _CODE = 'WEIXIN';
        _version = RE.$1;
      }
    }

    // 版本号规范化处理
    if (_version) {
      _normVersion = normVersion(_version);
    }

    return {
      // 厂商
      vendor : {
        toString : function () {
          return _VENDOR;
        },

        is : function (vendor) {
          if ((Lizard.app.code.is('TV')|| Lizard.app.code.is('TY')) && vendor == 'CTRIP') {
            return false;
          }
          return vendor.toUpperCase() == _VENDOR;
        }
      },

      // 代号
      code : {
        toString : function () {
          return _CODE;
        },

        is : function (code) {
          return code.toUpperCase() == _CODE;
        }
      },

      // 版本
      version : {
        toString : function () {
          return _version;
        },

        lt : function (version) {
          return _normVersion < normVersion(version);
        },
        lte : function (version) {
          return _normVersion <= normVersion(version);
        },
        eq : function (version) {
          return _normVersion == normVersion(version);
        },
        gte : function (version) {
          return _normVersion >= normVersion(version);
        },
        gt : function (version) {
          return _normVersion > normVersion(version);
        }
      }
    };
  }
  /** @lends Lizard */
  Lizard = typeof Lizard != 'undefined' ? Lizard : { // jshint ignore:line
    /**
     * Lizard版本号
     * @example
     * Lizard.version  // 2.1
     */
    version : "3.01",
    app : appInfo(),
    /**
     * 判断现在运行的包是否是Hybrid包, h5直连的话，这个是false
     * @example
     * Lizard.isHybrid  // true,  hybrid包
     * Lizard.isHybrid  // false, h5 webapp, native直连
     */
    isHybrid : !!(window.LizardLocalroute),
    /**
     * 判断是否在携程的APP中打开H5页面
     * @example
     * Lizard.isInCtripApp  // true, native直连
     * Lizard.isInCtripApp  // false, h5 webapp
     */
    isInCtripApp : !!(navigator.userAgent.match(/ctripwireless/i) && (window.location.protocol != "file:")),

    /**
     * 每次页面切换完成时调用。
     * @param {function} fn(view) 切换完成后,当前的view对象
     * @example
     * Lizard.viewReady(function(view) {
     *
     * });
     */
    viewReady : function (fn) {
      if (Lizard.readyQueue) {
        Lizard.readyQueue.push(fn);
      } else {
        Lizard.readyQueue = [fn];
      }
    },
    /**
     * 判断是否用的开发版还是正式版
     * @private
     */
    notpackaged : typeof _ == 'undefined'
  };

  /**
   * 运行在什么环境 html5还是webapp
   * @name Lizard.runAt
   * @example
   * Lizard.runAt  // client, webapp, html5环境
   */
  /**
   * 运行在什么环境 html5还是webapp
   * @name Lizard.renderAt
   * @example
   * Lizard.renderAt  // client, webapp环境
   * Lizard.renderAt  // server, html5环境
   */
  Lizard.runAt = "client";

  //初始化lizard属性
  initLizardConfig();
  //加载资源文件
  function getRenderAttr() {
    var renderAt = document.getElementsByClassName('main-viewport')[0]?document.getElementsByClassName('main-viewport')[0].getAttribute('renderat'):'client';
    Lizard.renderAt = 'server';
    if (!renderAt) {
      Lizard.renderAt = 'client';
    }//判断首屏渲染的环境v8还是brower
    loadRes();
  }

  if (document.getElementsByClassName('main-viewport')[0]) {
    getRenderAttr();
  } else {
    $(document).ready(getRenderAttr);
  }

  window.Lizard = Lizard;

  /*
   * 组织UI组件路径
   * @param path
   * @returns {string}
   */
  window.getAppUITemplatePath = function (path) {
    if (!Lizard.notpackaged) {
      return 'text!' + 'ui/' + path + '.html';
    }
    // 源码不能跑的原因
    if (['loadFailed', 'h5Loading'].indexOf(path) != -1) {
      return 'text!' + 'ui/' + path + '.html';
    }

    return 'text!' + Lizard.dir + 'ui/' + path + '.html';
  };

  window.getAppUICssPath = function (path) {
    if (!Lizard.notpackaged) {
      return 'text!' + 'ui/' + path + '.css';
    }

    return 'text!' + Lizard.dir + 'ui/' + path + '.css';
  };

  /*
   * 加载单个js文件
   * @param url
   * @param callback
   */
  function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.onload = callback;
    script.src = url;
    if (url.indexOf('//webresource.c-ctrip.com/') > -1) {
      script.setAttribute('crossorigin', 1);
    }
    document.head.appendChild(script);
  }

  /*
   * 加载多个js文件
   * @param scripts
   * @param callback
   */
  function mutileLoad(scripts, callback) {
    var len = scripts.length;
    var no = 0;
    if (!len) {
      end();
      return;
    }
    for (var i = 0; i < len; i++) {
      var url = scripts[i];
      loadScript(url, end);
    }

    function end() {
      no++;
      if (no >= len) {
        var configModel = Lizard.notpackaged ? [Lizard.dir + 'config.js'] : ['config'];
        if (!Lizard.isHybrid) {
          configModel.push('cOnlineRender');
        }
        require(configModel, function(){
          if (!Lizard.isHybrid) {
            initAppByPackaged(arguments[arguments.length - 1]);
          }
          callback();
        });
      }
    }
  }

  /*
   * 解析lizard.seed.js标签的属性，初始化izard.dir,Lizard.pdConfig
   * Lizard.config 三个属性
   * 配置BU版本号
   * @example
   * script type="text/javascript" src="http://localhost/code/lizard/2.1/6.2/dev/webapporigin/lizard.seed.js" lizardConfig ="version:Date.now()"
   */
  /**
   * 配置全局bu的全局js
   * @name Lizard.pdConfig
   * @example
   * &lt;script src="//webresource.c-ctrip.com/code/lizard/2.1/web/lizard.seed.js" pdConfig="/webapp/demo/webresource/demoConfig.js"&gt;   // 引入一个js
   * &lt;script src="//webresource.c-ctrip.com/code/lizard/2.1/web/lizard.seed.js" pdConfig="/webapp/demo/webresource/demoConfig.js, demoConfig2.js"&gt;  // 引入多个js
   */

  /**
   * @description lizard bu项目配置,比如开启多webview, version等等
   * @name Lizard.config
   * @example
   * &lt;script src="lizard.seed.js" lizardConfig="multiView:'on'"&gt; // 全局hybrid多webview模式
   * &lt;script src="lizard.seed.js" lizardConfig="version:Date.now()"&gt; // 配置模块加载的版本号
   * &lt;script src="lizard.seed.js" lizardConfig="lizardCatch:'off'"&gt; // 全局的a可以点击
   */

  function initLizardConfig() {
    var scripts = document.getElementsByTagName('script') || [];
    var reg = /lizard\.seed\.(beta\.|beta.src\.|src\.|\b)*js.*$/ig;
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].getAttribute("src");
      if (src && reg.test(src)) {
        //Lizard.isCdnCombo = (src.indexOf('res/concat?f=/') > -1);
        Lizard.dir = src.replace(reg, '');
        if(typeof isLizardUserBeta != "undefined" && isLizardUserBeta){
          Lizard.dir = Lizard.dir.replace("/web/","/beta/");
        }
        if (!Lizard.notpackaged) {
          initLizardExpansions();
        }
        if (src.indexOf('beta') > -1) {
        Lizard.uibeta_sandbox = true;
        }
        var configStr = scripts[i].getAttribute("pdConfig") || '';
        Lizard.pdConfig = JSON.parse('["' + configStr.split(',').join('","') + '"]');
        if (!Lizard.isHybrid) {
          var routeConfig = scripts[i].getAttribute("routeConfig") || '';
          if (routeConfig) {
            require([routeConfig]);
          }
        }
        if (scripts[i].getAttribute("lizardConfig")) {
          try {
            eval('Lizard.config = {' + scripts[i].getAttribute("lizardConfig") + '}'); // jshint ignore:line
          } catch (e) {
            Lizard.config = {};
            console.log(e.stack);
          }
        } else {
          Lizard.config = {};
        }
        break;
      }
    }
  }

  /*
   * 加载AMD模块文件
   * @param e
   */
  function amdLoaderLoaded(e) {
    if (Lizard.isHybrid) {
      //Hybrid不支持多页
      Lizard.config.isMultipage = false;
      initAppByPackaged({});  
    } else {
      if (Lizard.app.vendor.is('CTRIP') && !Lizard.app.code.is('WE')) {
        $('#headerview').css({display : 'none'});
      }      
    }
  }

  function initAppByPackaged(pageConfig) {
    var isUseBeta = (typeof isLizardUserBeta != "undefined") ? isLizardUserBeta : false;
    var asynComboModules = [];
    if (Lizard.config.isMultipage) {
      //asynComboModules = Lizard.pdConfig;
      asynComboModules.push(isUseBeta ? "/code/lizard/3.01/beta/lizard.multi.js":"/code/lizard/3.01/web/lizard.multi.js");
      if (Lizard.app.vendor.is('CTRIP')) {
        asynComboModules.push(isUseBeta ? "/code/lizard/3.01/beta/lizard.hybrid.multi.js":"/code/lizard/3.01/web/lizard.hybrid.multi.js");
      } else {
        asynComboModules.push(isUseBeta ? "/code/lizard/3.01/beta/lizard.web.multi.js" :"/code/lizard/3.01/web/lizard.web.multi.js");
      }
      loadScript(Lizard.dir.substr(0, Lizard.dir.lastIndexOf('/code/lizard')) + "/res/concat?f=" + asynComboModules.join(","), function(){
        require(['config'], function(config){
          require([pageConfig.controller || 'cPageView', 'cUnderscorePlugin'], function(View){
            if ($('#main').find('.main-viewport').children().length) {
              var view = new View({el: $('#main').find('.main-viewport').children().first()});
              view.show();
            }
          });
        });
      });
    } else {
      if (Lizard.notpackaged || Lizard.isHybrid) {
        initApp();
      } else {
        asynComboModules.push(isUseBeta ? "/code/lizard/3.01/beta/lizard.core.js" :"/code/lizard/3.01/web/lizard.core.js");
        if (!Lizard.app.vendor.is('CTRIP') || Lizard.app.code.is('GS') || Lizard.app.code.is('DIS')) {
          asynComboModules.push(isUseBeta ? "/code/lizard/3.01/beta/lizard.web.js" :"/code/lizard/3.01/web/lizard.web.js");
        }
        if (Lizard.config.plainloading) {
          //asynComboModules.push("/code/lizard/3.01/web/ui/ui.loading.layer.js");        
        }
        var isDebug = !!(window.location.href.indexOf("debug=1")>0); // jshint ignore:line
        if(isDebug){
          if(isUseBeta){
            loadScript(Lizard.dir.substr(0, Lizard.dir.lastIndexOf('/code/lizard')) + "/code/lizard/3.01/beta/lizard.core.src.js", function(){
              loadScript(Lizard.dir.substr(0, Lizard.dir.lastIndexOf('/code/lizard')) + "/code/lizard/3.01/beta/lizard.web.src.js", initApp);
            });
          }else{
            loadScript(Lizard.dir.substr(0, Lizard.dir.lastIndexOf('/code/lizard')) + "/code/lizard/3.01/web/lizard.core.src.js", function(){
              loadScript(Lizard.dir.substr(0, Lizard.dir.lastIndexOf('/code/lizard')) + "/code/lizard/3.01/web/lizard.web.src.js", initApp);
            });
          }
        }else{
          var lastModified;
          var scriptUrl = Lizard.dir.substr(0, Lizard.dir.lastIndexOf('/code/lizard')) + "/res/concat?f=" + asynComboModules.join(",");
          try{
            lastModified = window.localStorage.getItem("SEED2LASTMODIFIED");
            if(lastModified){
              scriptUrl += "&_"+lastModified.split("&")[0];
            }
          }catch(e){
          }
          loadScript(scriptUrl, initApp);
        }
      }
    }
  }

  function initApp() {
    //var configModel = Lizard.notpackaged ? [Lizard.dir + 'config.js'] : ['config'];
    //require(configModel, function () {
    var reqs = [];
    if (!Lizard.isHybrid) {
      // if (Lizard.isInCtripApp) {
      if (Lizard.app.vendor.is('CTRIP')/**by vlw S43481 || Lizard.app.code.is('GS') **/
      )
      {
        reqs.push('cHybridAppInit');
        reqs.push('cStatic');
      } else {
        reqs.push('cWebAppInit');
      }
    } else {
      reqs.push('cHybridAppInit');
    }
    if (!Lizard.notpackaged) {
      if (Lizard.app.vendor.is('CTRIP') || Lizard.isHybrid) {
        reqs.push('cBaseInit');
      }
      // /**
      //  * underscore三方库
      //  * @namespace _
      //  * @see http://underscorejs.org/
      //  */
      define("_", function () {});      
    }    
      /**
       * webresources站点的根目录地址,获取meta中webresourceBaseUrl的值,可以在html的meta属性指定
       * @name Lizard.webresourceBaseUrl
       * @example
       * meta name="webresourceBaseUrl" content="http://webresource.c-ctrip.com/"
       */

      /**
       * PD的webresources站点的根目录地址,获取meta中WebresourcePDBaseUrl的值,可以在html的meta属性指定
       * @name Lizard.WebresourcePDBaseUrl
       * @example
       * meta name="WebresourcePDBaseUrl" content="/webapp/car/webresource/"
       */

      /**
       * BU app的根目录地址,获取meta中appBaseUrl的值,可以在html的meta属性指定
       * @name Lizard.appBaseUrl
       * @example
       *  meta name="appBaseUrl" content="/webapp/car/"
       */

      /**
       * restfullApi 是获取http数据的地址,获取meta中restfullApi的值,可以在html的meta属性指定
       * @name Lizard.restfullApi
       * @example
       * meta name="restfullApi" content="http://m.ctrip.com/restapi/soa2/10134"
       */

      /**
       * restfullApiHttps 是获取https数据的地址,获取meta中restfullApiHttps的值,可以在html的meta属性指定
       * @name Lizard.restfullApiHttps
       */

      /**
       * timeout 全局的ajax取数据的超时时间,默认为30s, 可以在html的meta属性指定
       * @name Lizard.timeout
       * @example
       * meta name="timeout" content="5000" lizardExpansion="true"
       */
      if (Lizard.notpackaged) {
        initLizardExpansions();
      }
      require(reqs, function () {
        if (Lizard.instance) {
          return;
        }
        if (_.isFunction(arguments[arguments.length - 1])) {
          arguments[arguments.length - 1]();
        }
      });
  }

  function initLizardExpansions() {
    var lizardExpansions = ["appBaseUrl", "webresourceBaseUrl", "restfullApi", "restfullApiHttps", "WebresourcePDBaseUrl"];
    _.each(document.getElementsByTagName('meta'), function (metatag) {      
      if (metatag.getAttribute('lizardExpansion') || _.contains(lizardExpansions, metatag.getAttribute('name'))) {
        Lizard[metatag.getAttribute('name')] = metatag.getAttribute('content');
      }
    });
  }

  /*
   * 加载资源文件
   */
  function loadRes() {
    var basescripts = [];
    if (Lizard.notpackaged) {
      basescripts = [Lizard.dir + "3rdlibs/require.min.js"];
    } else {
      if (Lizard.isHybrid && !Lizard.notpackaged) {
        //hybrid 环境下,根据引用目录,载入UBT文件 shbzhang
        var srcs = ["ubt/_mubt.min.js", "advertisement/aframe/1.0/aSlider.min.js"];
        var lizardDir = Lizard.dir;
        if (lizardDir) {
          var path = lizardDir.substr(0, lizardDir.indexOf('lizard/webresource'));
          srcs = _.map(srcs, function (src) {
            return path + src;
          });
        }
        require(srcs, function () {});
      }
    }


    if (Lizard.app.vendor.is('CTRIP') || Lizard.isHybrid) {
      Lizard.mutileLoad = function () {
        mutileLoad(basescripts, amdLoaderLoaded);
      };
    } else {
      if (Lizard.config.initbyout) {
        Lizard.start = amdLoaderLoaded;
      } else {
        mutileLoad(basescripts, amdLoaderLoaded);
      }
    }
  }
  
  //添加判断，6.5版本及以上，不加载lizard.hybrid.js
  //if (!Lizard.isHybrid) {
  //  var synComboModules = [];
  //  if (Lizard.app.vendor.is('CTRIP') && !(_.find($('SCRIPT'), function(script){return $(script).attr('src').indexOf('lizard.hybrid.js') > -1;}))) {
  //    synComboModules.push("/code/lizard/3.0/web/lizard.hybrid.js");
  //  } 
  //  if (Lizard.app.code.is('TV')) {
  //    synComboModules.push("/code/lizard/3.0/web/app/c.tv.start.js");
  //  } else if (Lizard.app.code.is('TY')) {
  //    synComboModules.push("/code/lizard/3.0/web/app/c.ty.start.js");
  //  }
  //  if (synComboModules.length) {
  //    document.write('<script src="' + Lizard.dir.substr(0, Lizard.dir.lastIndexOf('/code/lizard')) + "/res/concat?f=" + synComboModules.join(",") + '"><\/script>');// jshint ignore:line
  //  }
  //}

})();
