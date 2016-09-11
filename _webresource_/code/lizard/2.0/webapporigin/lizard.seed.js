/**
* @author 魏晓军 / l_wang王磊 <l_wang@Ctrip.com>
* @class lizard
* @description 框架入口，将会引导至各个view

整体逻辑分为：
① 加载库文件
② 解析模板生成静态html
③ 实例化view，绑定事件
④ 

*/
/**
注意：标准l_wang的地方是我拿不准的，需要各位看看

需要晓军确定的点：
① 文件加载为何不使用requireJS
② 现在引用系统级的东西没有使用cfg配置，打包如何处理
③ 
④ parser中使用Lizard命名空间不太合理，请斟酌是否应该采用AMD模式引入
⑤ 

*/

//add by  byl  在此处删除url中的GetUserInfos参数
(function () {
    window.localStorage.removeItem("LIZARD_GETUSERINFOS");
    var url = window.location.href,name = "GetUserInfos";
    var re = new RegExp("(\\\?|&)" + name + "=([^&]+)(&|$)", "i"), m = url.match(re);
    var tokenVal =  m?m[2]:"";
    if(tokenVal){
        window.localStorage.setItem("LIZARD_GETUSERINFOS",tokenVal);
        //var tokenStr = "GetUserInfos="+tokenVal;
        //url = url.replace("?"+tokenStr,"").replace("&"+tokenStr,""); //判断多个参数
        url = url.replace(tokenVal,"").replace(/[\S\s]GetUserInfos=/,"");
        if(window.history.replaceState){
            window.history.replaceState(null,document.title,url);
        }else{
            window.location.replace(url);
        }
    }
 })();

(function () {
    //解决三星 小米手机stringfy失效问题
    ; (function () {
        if (navigator.userAgent.indexOf('Android') > 0) {
            JSON.stringify = {}
        } (function () {
            'use strict';
            function f(n) {
                return n < 10 ? '0' + n : n
            }
            if (typeof Date.prototype.toJSON !== 'function') {
                Date.prototype.toJSON = function () {
                    return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z' : null
                };
                String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () {
                    return this.valueOf()
                }
            }
            var cx, escapable, gap, indent, meta, rep;
            function quote(string) {
                escapable.lastIndex = 0;
                return escapable.test(string) ? '"' + string.replace(escapable,
    function (a) {
        var c = meta[a];
        return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4)
    }) + '"' : '"' + string + '"'
            }
            function str(key, holder) {
                var i, k, v, length, mind = gap,
    partial, value = holder[key];
                if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
                    value = value.toJSON(key)
                }
                if (typeof rep === 'function') {
                    value = rep.call(holder, key, value)
                }
                switch (typeof value) {
                    case 'string':
                        return quote(value);
                    case 'number':
                        return isFinite(value) ? String(value) : 'null';
                    case 'boolean':
                    case 'null':
                        return String(value);
                    case 'object':
                        if (!value) {
                            return 'null'
                        }
                        gap += indent;
                        partial = [];
                        if (Object.prototype.toString.apply(value) === '[object Array]') {
                            length = value.length;
                            for (i = 0; i < length; i += 1) {
                                partial[i] = str(i, value) || 'null'
                            }
                            v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                            gap = mind;
                            return v
                        }
                        if (rep && typeof rep === 'object') {
                            length = rep.length;
                            for (i = 0; i < length; i += 1) {
                                if (typeof rep[i] === 'string') {
                                    k = rep[i];
                                    v = str(k, value);
                                    if (v) {
                                        partial.push(quote(k) + (gap ? ': ' : ':') + v)
                                    }
                                }
                            }
                        } else {
                            for (k in value) {
                                if (Object.prototype.hasOwnProperty.call(value, k)) {
                                    v = str(k, value);
                                    if (v) {
                                        partial.push(quote(k) + (gap ? ': ' : ':') + v)
                                    }
                                }
                            }
                        }
                        v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                        gap = mind;
                        return v
                }
            }
            if (typeof JSON.stringify !== 'function') {
                escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
                meta = {
                    '\b': '\\b',
                    '\t': '\\t',
                    '\n': '\\n',
                    '\f': '\\f',
                    '\r': '\\r',
                    '"': '\\"',
                    '\\': '\\\\'
                };
                JSON.stringify = function (value, replacer, space) {
                    var i;
                    gap = '';
                    indent = '';
                    if (typeof space === 'number') {
                        for (i = 0; i < space; i += 1) {
                            indent += ' '
                        }
                    } else if (typeof space === 'string') {
                        indent = space
                    }
                    rep = replacer;
                    if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
                        throw new Error('JSON.stringify');
                    }
                    return str('', {
                        '': value
                    })
                }
            }
        } ());

    })();
    //获取lizard的引用路径
    var pdConfig = "";
    var lizardConfig = "";

    //实现Lizard的ready方法
    var lizardReady = false;
    var readyQueue = [];
    if (typeof Lizard == 'undefined') {
        Lizard = {};
    }

    /*by wxj start*/
    Lizard.version = "2.0";
    /*by wxj end*/
    function is_in_ctrip_app() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/ctripWireless/i) == "ctripwireless") {
            return true;
        } else {
            return false;
        }
    }

    /*…jiangjing@ctrip.com…2015-01-08…*/
    /*…jiangjing@ctrip.com…2015-01-26…*/
    /**
     * @var {Object} app 当前宿主应用程序的相关信息
     * @memberof Lizard
     *
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
     *
     * // 判断当前 APP 的版本号是否小于、小于等于、等于、大于等于、大于某个特定版本号
     * Lizard.app.version.lt(6.1)
     * Lizard.app.version.lte(6.1)
     * Lizard.app.version.eq(6.1)
     * Lizard.app.version.gte(6.1)
     * Lizard.app.version.gt(6.1)
     */
    Lizard.app = (function() {
        var
            // 各版本特征码
            ATTRS = {
                // 主版
                MASTER : ['Ctrip_CtripWireless', 'Unicom_CtripWireless', 'Pro_CtripWireless'] ,

                // 青春版
                YOUTH  : ['Youth_CtripWireless'] ,

                // 攻略社区
                GS     : ['gs_wireless']
            },

            // 厂商代号一律为大写英文字母
            _VENDOR, 

            // 应用代码一律为大写英文字母
            _CODE, 

            _version, _normVersion, 

            // 将版本号各部分前缀补零，以方便不同版本号之间的比较，e.g.
            // 5.10 -> 005.010
            // 6.0  -> 006.000
            normVersion = function(/*String|Number*/ version) {
                // 强制转制成字符串
                version += '';

                // 假设一种情况，实参为数字 6.0，则小数部分将被忽略。故：
                // 如果版本号不含次版本号，则强制添加次版本号为 0
                if (version.indexOf('.') < 0) version += '.0';

                version = (version + '').split('.');
                for (var iterator = 0; iterator < version.length; iterator++) {
                    version[iterator] = '000'.substr(version[iterator].length) + version[iterator];
                }
                return version.join('.');
            }, 

            RE = RegExp,

            UA = window.navigator.userAgent;

        // 逐一对比特征码与 userAgent 信息
        for (var iterator in ATTRS)
          for (var i = 0; i < ATTRS[iterator].length; i++) {
            if (new RE(ATTRS[iterator][i] + '_([\\d.]+)$').test(UA)) {
              _VENDOR = 'CTRIP';
              _CODE = iterator;
              _version = RE.$1;
              break;
            }
          }
        if (!_VENDOR)
            // 第三方厂商：微信
            if (/MicroMessenger\/([\d.]+)/.test(UA)) {
                _VENDOR  = 'TECENT';
                _CODE    = 'WEIXIN';
                _version = RE.$1;
            }

        // 版本号规范化处理
        if (_version)
            _normVersion = normVersion(_version);

        return {
            // 厂商
            vendor: {
                toString: function() { return _VENDOR; },

                is: function(vendor) {
                    return vendor.toUpperCase() == _VENDOR;
                }
            },

            // 代号
            code: {
                toString: function() { return _CODE; },

                is: function(code) {
                    return code.toUpperCase() == _CODE;
                }
            },

            // 版本
            version: {
                toString: function() { return _version; },

                lt  : function(version) { return _normVersion <  normVersion(version); },
                lte : function(version) { return _normVersion <= normVersion(version); },
                eq  : function(version) { return _normVersion == normVersion(version); },
                gte : function(version) { return _normVersion >= normVersion(version); },
                gt  : function(version) { return _normVersion >  normVersion(version); }
            }
        };
    })();

    Lizard.isInCtripApp = (is_in_ctrip_app() && (window.location.protocol != "file:"));
    // Lizard.isInCtripApp = (Lizard.app.vendor.is('CTRIP') && (window.location.protocol != "file:"));
    /*处理wp*/ //add by byl 在此处增加winPhone下，第一次进入时，将winPhone的native状态写入缓存
    var search = window.location.search;
    if (!Lizard.isInCtripApp &&
	    search &&
	    ((search.indexOf('from_native_type=3') != -1) || (search.indexOf('from_native_type%3D3') != -1))) {
        Lizard.isInCtripApp = true;
        if(window.localStorage){
           window.localStorage.setItem("isInWinOS","1");
        }
    }else{
        //此处去取isInWinOS的缓存，判断当前环境是否是winOS
        if(window.localStorage){
            var isInWinOS = window.localStorage.getItem("isInWinOS");
            if(isInWinOS){
                Lizard.isInCtripApp = true;
            }
        }
    }
    Lizard.isHybrid = !!(window.Internal && window.Internal.isInApp || window.LizardLocalroute || Lizard.isInCtripApp);
    Lizard.getAbsPath = function getAbsPath(url, isWeb) {
        url = decodeURIComponent(url);
        if (isWeb) {
            if (url.charAt(0) == "\/") {
                //var href = 'http://m.ctrip.com';
                var href = window.location.protocol+"//"+ window.location.hostname;

                url = href + url;
            }
        } else {
            if (url.charAt(0) == "\/") {
                var href = window.location.href.replace(/\/index\.html.*/, '');
                url = href + url;
            }
        }

        
        if(/^(https|http|ftp|rtsp|mms)?:\/\//.test(url)){
               
        }else{
            var node = document.createElement("script");
            node.src = url;
            var url = node.src;
            node = null
        }
        return url;
    }


    Lizard.hrefresh = function () {
        CtripUtil.app_open_url(window.location.href.replace(/#.*/g, ""), 0);
    }
    Lizard.toUBTURL = function (url, isWeb) {
        var ret;
        if (isWeb) {
            ret = url;
        } else {
            ret = url.replace(/.*\/[^\/]*?webapp[^\/]*\//, 'http://hybridm.ctrip.com/webapp/');
        }
        return ret;
    }

    if (Lizard.isHybrid) {
        //CtripUtil.app_check_network_status();
        Lizard.localRoute = {
            config: {},
            addConfig: function (obj) {
                for (var urlschema in obj) {
                    if (obj.hasOwnProperty(urlschema)) {
                        Lizard.localRoute.config[urlschema] = obj[urlschema];
                    }
                }
            },
            mapUrl: function (url) {
                var ret = '', lc = 0;
                for (var urlSchema in Lizard.localRoute.config) {
                    if (Lizard.localRoute.config.hasOwnProperty(urlSchema)) {
                        var parseRet = Lizard.schema2re(urlSchema, url);
                        if (parseRet.reStr && parseRet.param) {
                            if (parseRet.reStr.length > lc) {
                                lc = parseRet.reStr.length;
                                ret = Lizard.localRoute.config[urlSchema];
                            }
                        }
                    }
                }
                return ret;
            }
        };
        if (window.LizardLocalroute) {
            Lizard.localRoute.addConfig(window.LizardLocalroute);
            var el = document.getElementById("LizardLocalroute");
            if (el) {
                Lizard.weinre = el.getAttribute("LizardWeinre");
                Lizard.ip = el.getAttribute("LizardIP");
                Lizard.chanal = el.getAttribute("LizardChanal");
            }
        }
    }

    Lizard.ready = function (fn) {
        if (lizardReady) {
            fn && fn.call(window)
        } else {
            readyQueue.push(fn)
        }
    }

    function ready() {
        for (var n = 0; n < readyQueue.length; n++) {
            var fn = readyQueue[n];
            fn && fn.call(window);
        }
    }
    var config = {};

    function setConfig(key, value) {
        config[key] = value;
    }
    Lizard.config = function (arg1, arg2) {

        var t = typeof arg1;

        switch (t) {
            case 'string':
                return setConfig(arg1, arg2);
                break;
            case 'object':

                for (var key in arg1) {

                    if (arg1.hasOwnProperty(key)) {
                        setConfig(key, arg1[key]);
                    }
                }
                break;
            default:
                return config;
        }
    };



    function getLizardDir() {

        var scripts = document.getElementsByTagName('script') || [];
        var lizard_dir = "";
        var reg = /lizard\.seed\.(src\.)*js.*$/ig;
        for (var i = 0; i < scripts.length; i++) {
            var src = scripts[i].getAttribute("src");
            if (src && reg.test(src)) {
                lizard_dir = src.replace(reg, '')
                var pdConfigPath = scripts[i].getAttribute("pdConfig");
                if (pdConfigPath) pdConfig = pdConfigPath;

                /*
                添加对lizardConfig属性的支持
                isViewFinishedLoadInitApp hybrid不需要等待用户信息的返回，直接实例化App
                isHideAllLoading //所有页面都不使用loading
                isFirstPageHideLoading //首页隐藏loading
                firstPageViewName //第一个页面的viewName
                isAllPageJump //是否开启所有页面都走jump的方式
                eg:
                <script type="text/javascript" 
                src="//webresource.c-ctrip.com/code/lizard/2.0/web/lizard.seed.js" 

                pdConfig="/webapp/ticket/webresource/ticket/ticketconfig.js"

                lizardConfig = "isViewFinishedLoadInitApp:true,isHideAllLoading:true"
                >
                </script>


                */

                try {
                    if (scripts[i].getAttribute("lizardConfig")) lizardConfig = new Function('return {' + scripts[i].getAttribute("lizardConfig") + '}')();
                } catch (e) {
                    console.log(e.message);
                }

                return lizard_dir;
            }
        }
        return lizard_dir;
    }


    var lizard_dir = getLizardDir();
    if (!lizard_dir) {
        throw '没有引入lizard.seed.js文件';
    }
    Lizard.dir = '//webresource.c-ctrip.com/code/lizard/2.0/web/';
    /*
    从lizarConfig属性上扩展config
    */
    if (lizardConfig) {

        Lizard.config(lizardConfig);
    }


    //加载必要的组件
    function loadScript(url, callback) {
        var script = document.createElement("script")
        script.type = "text/javascript";
        script.async = true;
        script.onload = callback;
        script.src = url;
        document.body.appendChild(script);
    }
    var parserPath = Lizard.dir + "parser.js";
    var requirePath = Lizard.dir + "3rdlibs/require.min.js";
    var systemModels = [];

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
                callback();
            }
        }
    }
    /*
    添加对require.min.js和parser.js的判断
    */
    var requireLoaded = typeof require != 'undefined';
    if (requireLoaded) {
        systemModels = [];
    } else {
        systemModels = [requirePath]
    }

    mutileLoad(systemModels, function () {
        var lizardExpansions = ["appBaseUrl", "webresourceBaseUrl", "restfullApi", "restfullApiHttps", "WebresourcePDBaseUrl"];
        ; (function () {
            // Lizard.appBaseUrl = Lizard.webresourceBaseUrl = '/';
            var metas = document.getElementsByTagName('meta');
            for (var i = 0; i < metas.length; i++) {
                var name = metas[i].getAttribute('name');
                var content = metas[i].getAttribute('content');
                if (metas[i].getAttribute('lizardExpansion')) {
                    Lizard[name] = content;
                }
                for (var j = 0; j < lizardExpansions.length; j++) {
                    var lizardExpansion = lizardExpansions[j];
                    if (name == lizardExpansion) {
                        if (!Lizard[name]) Lizard[name] = content;
                    }
                }
            }
        })();

        //添加对winphone的支持
        var libs = (function () {
            var libs = Lizard.dir + '3rdlibs/zepto';
            var iswinphone = window.navigator.userAgent.indexOf('IEMobile') > -1 ? true : false;
            var isie = window.navigator.userAgent.indexOf('MSIE') > -1 ? true : false;
            var version = 0;
            var SUPPORT_VERSION = 10;

            if (iswinphone) {
                version = window.navigator.userAgent.match(/IEMobile\/\d+/);
                if (version.length > 0) {
                    version = version[0].split('/');
                    version = version[1];
                };
            };
            /*by wxj start*/
            if (!('__proto__' in {}) || (iswinphone && version < 10))
            /*by wxj end*/
            {
                //if ( (isie && !iswinphone) || (iswinphone && version < 10)){
                libs = Lizard.dir + '3rdlibs/jquery';
            }
            return libs;
        })();
        /*
        处理hybrid中weinre调试
        */
        if (Lizard.weinre) {
            require.config({
                urlArgs: "v=" + (new Date()).getTime(),
                baseUrl: "https://" + Lizard.ip + ":5389/" + Lizard.chanal
            })
        }
        require.config({
            waitSeconds: 40,
            shim: {
                $: {
                    exports: 'zepto'
                },
                _: {
                    exports: '_'
                },
                B: {
                    deps: [
                        '_',
                        '$'
                    ],
                    exports: 'Backbone'
                },
                F: {
                    deps: ['$'],
                    exports: 'Fastclick'
                },
                lizard: {
                    deps: [
                        '$',
                        '_',
                        'B',
                        'F'
                    ]
                  },
                  cHybridShell: {
                    deps: [
                        '$',
                        '_'
                    ]
                },
                libs: {
                    deps: ['_', '$', 'B'],
                    exports: 'libs'
                },
                common: {
                    deps: ['libs']
                },
                cBase: {
                    exports: 'cBase'
                },
                cAjax: {
                    exports: 'cAjax'
                },
                cPageView: {
                    deps: ['B'],
                    exports: 'cPageView'
                }
            },
            "paths": {
                "json2": Lizard.dir + "3rdlibs/json2",
                "bridge": Lizard.dir + "3rdlibs/bridge",
                "R": Lizard.dir + "3rdlibs/require",
                '$': libs,
                "_": Lizard.dir + "3rdlibs/underscore",
                "B": Lizard.dir + "3rdlibs/backbone",
                "F": Lizard.dir + "3rdlibs/fastclick",
                // "P": Lizard.dir + "parser",
                'lizard': Lizard.dir + 'lizard',
                "libs": Lizard.dir + "3rdlibs/libs",
                "text": Lizard.dir + "3rdlibs/require.text",
                "cCoreInherit": Lizard.dir + "core/c.core.inherit",

                /***"cView": Lizard.dir + "business/c.business.view",****/
                "rsa": Lizard.dir + "business/c.business.rsa",
                "cBusinessCommon": Lizard.dir + "business/c.business.common",

                "c": Lizard.dir + "common/c",
                "cBase": Lizard.dir + "common/c.base",
                /**"cLog": Lizard.dir + "common/c.log",***/
                "cSales": Lizard.dir + "common/c.sales",
                "cLazyload": Lizard.dir + "common/c.lazyload",
                "cListAdapter": Lizard.dir + "common/c.common.listadapter",
                "cGeoService": Lizard.dir + "common/c.geo.service",
                "cGeoHelper": Lizard.dir + "common/c.geo.helper",
                "cMessageCenter": Lizard.dir + "common/c.message.center",
                "cAjax": Lizard.dir + "common/c.ajax",
                //add img.lazyload 140625
                "cImgLazyload": Lizard.dir + "common/c.img.lazyload",
                "cGeo": Lizard.dir + "common/c.geo",

                "cUtilityHybrid": Lizard.dir + "util/c.utility.hybrid",
                "cUtilityHash": Lizard.dir + "util/c.utility.hash",
                "cUtilityDate": Lizard.dir + "util/c.utility.date",
                "cUtilityServertime": Lizard.dir + "util/c.utility.servertime",
                "cUtilityCrypt": Lizard.dir + "util/c.utility.crypt",
                "cUtility": Lizard.dir + "util/c.utility",
                "cUtilityFlip": Lizard.dir + "util/c.utility.flip",
                "Validate": Lizard.dir + "util/c.validate",
                "cUtilityPath": Lizard.dir + "util/c.utility.path",
                "cUtilityUtil": Lizard.dir + "util/c.utility.utils",
                "cUtilityStateHistory": Lizard.dir + "util/c.utility.state.history",
                "cUtilityPerformance": Lizard.dir + "util/c.utility.performance",
                "cUtilityCacheView": Lizard.dir + "util/c.utility.cacheview",
                "cPageParser": Lizard.dir + "page/c.page.parser",

                "cAbstractStore": Lizard.dir + "store/c.abstract.store",
                "cAbstractStorage": Lizard.dir + "store/c.abstract.storage",
                "cStore": Lizard.dir + "store/c.local.store",
                "cStorage": Lizard.dir + "store/c.local.storage",
                "cSessionStore": Lizard.dir + "store/c.session.store",
                "cSessionStorage": Lizard.dir + "store/c.session.storage",
                "memStore": Lizard.dir + "store/c.memorystore",
                "CommonStore": Lizard.dir + "store/c.common.store",
                "PageStore": Lizard.dir + "store/c.store.package",

                "cAbstractModel": Lizard.dir + "model/c.abstract.model",
                "cModel": Lizard.dir + "model/c.model",
                "cUserModel": Lizard.dir + "model/c.user.model",
                "cMultipleDate": Lizard.dir + "model/c.multiple.data",

                "cUI": Lizard.dir + "ui/c.ui",
                "cUICore": Lizard.dir + "ui/c.ui.core",
                "cHistory": Lizard.dir + "ui/c.ui.history",
                "cUIView": Lizard.dir + "ui/c.ui.view",
                "cDataSource": Lizard.dir + "ui/c.ui.datasource",
                "cUIBase": Lizard.dir + "ui/c.ui.base",
                "cUIAbstractView": Lizard.dir + "ui/c.ui.abstract.view",
                "cUIAlert": Lizard.dir + "ui/c.ui.alert",
                "cUIHeader": Lizard.dir + "ui/c.ui.header",

                "cUIAnimation": Lizard.dir + "ui/c.ui.animation",
                "cUICitylist": Lizard.dir + "ui/c.ui.citylist",
                "cUIHeadWarning": Lizard.dir + "ui/c.ui.head.warning",
                "cUIInputClear": Lizard.dir + "ui/c.ui.input.clear",
                "cUILayer": Lizard.dir + "ui/c.ui.layer",
                "cUILoading": Lizard.dir + "ui/c.ui.loading",
                "cUILoadingLayer": Lizard.dir + "ui/c.ui.loading.layer",
                "cUIMask": Lizard.dir + "ui/c.ui.mask",
                "cUIPageview": Lizard.dir + "ui/c.ui.page.view",

                "cUIScrollRadio": Lizard.dir + "ui/c.ui.scroll.radio",
                "cUIScrollRadioList": Lizard.dir + "ui/c.ui.scroll.radio.list",
                "cUIScrollList": Lizard.dir + "ui/c.ui.scrolllist",
                "cUIToast": Lizard.dir + "ui/c.ui.toast",
                "cUIWarning": Lizard.dir + "ui/c.ui.warning",
                "cUIWarning404": Lizard.dir + "ui/c.ui.warning404",
                "cUIHashObserve": Lizard.dir + "ui/c.ui.hash.observe",
                "cUIEventListener": Lizard.dir + "ui/c.ui.event.listener",
                "cUISwitch": Lizard.dir + "ui/c.ui.switch",
                "cUIScroll": Lizard.dir + "ui/c.ui.scroll",
                "cUINum": Lizard.dir + "ui/c.ui.num",
                "cUIGroupList": Lizard.dir + "ui/c.ui.group.list",
                "cUIBusinessGroupList": Lizard.dir + "ui/c.ui.business.group.list",
                "cUITab": Lizard.dir + "ui/c.ui.tab",
                "cUIImageSlider": Lizard.dir + "ui/c.ui.imageSlider",
                "cUIBubbleLayer": Lizard.dir + "ui/c.ui.bubble.layer",

                'cUILayerList': Lizard.dir + 'ui/c.ui.layer.list',
                'cUIIdentitycard': Lizard.dir + 'ui/c.ui.identitycard',

                'cUISidebar': Lizard.dir + 'ui/c.ui.sidebar',



                "cWidgetFactory": Lizard.dir + "widget/c.widget.factory",
                "cWidgetHeaderView": Lizard.dir + "widget/c.widget.headerview",
                "cWidgetListView": Lizard.dir + "widget/c.widget.listview",
                "cWidgetTipslayer": Lizard.dir + "widget/c.widget.tipslayer",
                "cWidgetInputValidator": Lizard.dir + "widget/c.widget.inputValidator",
                "cWidgetPublisher": Lizard.dir + "widget/c.widget.publisher",
                "cWidgetGeolocation": Lizard.dir + "widget/c.widget.geolocation",
                "cWidgetAbstractCalendar": Lizard.dir + "widget/c.widget.abstract.calendar",
                "cWidgetCalendar": Lizard.dir + "widget/c.widget.calendar",
                "cWidgetCalendarPrice": Lizard.dir + "widget/c.widget.calendar.price",
                "cWidgetSlide": Lizard.dir + "widget/c.widget.slide",
                "cWidgetMember": Lizard.dir + "widget/c.widget.member",
                "cWidgetGuider": Lizard.dir + "widget/c.widget.guider",
                "cWidgetCaptcha": Lizard.dir + "widget/c.widget.captcha",

                "cCalendar": Lizard.dir + "widget/c.calendar",
                "cHolidayCalendar": Lizard.dir + "widget/c.holiday.calendar",
                "cHolidayPriceCalendar": Lizard.dir + "widget/c.holiday.price.calendar",

                "cBasePageView": Lizard.dir + "page/c.page.base",
                "cCommonPageFactory": Lizard.dir + "page/c.page.factory",
                "cCommonListPage": Lizard.dir + "page/c.page.common.list",
                "cPageView": Lizard.dir + "page/c.page.view",

                "cBI": Lizard.dir + "business/c.bi",

                "cHybridFacade": Lizard.dir + "hybrid/c.hybrid.facade",
                "cHybridShell": Lizard.dir + "hybrid/c.hybrid.shell",

                /*…jiangjing@ctrip.com…2015-01-23…*/
                // cShell_<VENDOR>_<APPCODE> 命名的模块仅供 cShell 内部引用
                "cShell": Lizard.dir + "shell/c.shell",
                "cShell_CTRIP_MASTER": Lizard.dir + "shell/c.shell.ctrip.master",
                "cShell_TECENT_WEIXIN": Lizard.dir + "shell/c.shell.tecent.weixin"
            },
            "map"      : {
              "*": {
                "cCommonStore": "CommonStore"
              }
            }
        });


        function defineLoadedModules() {
            if (window.requirejs) define("R", function () { });
            if (window.JSON) define("json2", function () { });
            if (window.__bridge_callback) define("bridge", function () { });
            if (window.Zepto) define("$", function () { });
            if (window._) define("_", function () { });
            if (window.Backbone) define("B", function () { });
            if (window.$ && window.$.bindFastClick) define("F", function () { });
            //if (window.Lizard && window.Lizard.runAt) define("P", function () { });
        }
        defineLoadedModules();
        function initAPP() {
            var reqs = ['lizard', 'cWidgetFactory', 'cWidgetGuider', 'cWidgetMember'];
            if (!window.LizardLocalroute) { 
              reqs.push('//webresource.c-ctrip.com/ResCRMOnline/R5/basewidget/ui.loadFailed.js', '//webresource.c-ctrip.com/ResCRMOnline/R5/basewidget/ui.loading.js');                
            }
            require(reqs, function () {
                var lizard = arguments[0];
                var WidgetFactory = arguments[1];

                if (!Lizard.isHybrid && !Lizard.isInCtripApp && !Lizard.app.code.is("GS")) {
                    var Member = WidgetFactory.create('Member');
                    Member.autoLogin({
                        callback: loginOver
                    });
                } else {
                    loginOver();
                }
                /*
                用户信息获取完毕后的执行函数
                */
                function loginOver() {

                    //---处理lizardready后的方法
                    lizardReady = true;
                    ready();
                    // bu定制版本号
                    if (config.version) {
                      require.config({
                        urlArgs: config.version
                      });
                    }

                    if (pdConfig) {
                        /*
                        实现pfconfig支持多个 EG;
                        pdconfig = "a.js,b.js"
                        */
                        require(pdConfig.split(','), pdConfigEnd);
                        //loadScript(pdConfig, pdConfigEnd)
                    } else {
                        pdConfigEnd();
                    }

                    function pdConfigEnd() {
                        //实例化
                        var opts = _.extend({}, config);
                        var int = new lizard(opts);
                        Lizard.instance = int;
                        var interface = int.interface();
                        for (var n in interface) {
                            Lizard[n] = $.proxy(interface[n], int);
                        }

                        if (Lizard.isHybrid || Lizard.app.code.is('GS')) {
                            var Guider = WidgetFactory.create('Guider');
                            Guider.create();
                        }
                        /*
                        只有webapp下才用ga代码
                        */
                        if (!Lizard.isHybrid || Lizard.isInCtripApp) {
                            /* 添加采集代码*/
                           /* ; (function (i, s, o, g, r, a, m) {
                                i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
                                    (i[r].q = i[r].q || []).push(arguments)
                                }, i[r].l = 1 * new Date(); a = s.createElement(o),
                                m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
                            })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

                            ga('create', 'UA-3748357-1', 'auto');
                            ga('require', 'displayfeatures');
                            ga('send', 'pageview');
                            */
                            /*; (function () {
                                if (typeof _gaq == "undefined") _gaq = [];
                                _gaq.push(['_setAccount', 'UA-3748357-1']);
                                _gaq.push(['_setDomainName', '.ctrip.com']);
                                _gaq.push(['_setAllowHash', false]);
                                _gaq.push(['_addOrganic', 'soso', 'w']);
                                _gaq.push(['_addOrganic', 'sogou', 'query']);
                                _gaq.push(['_addOrganic', 'youdao', 'q']);
                                _gaq.push(['_addOrganic', 'so.360.cn', 'q']);
                                _gaq.push(['_addOrganic', 'so.com', 'q']);
                                _gaq.push(['_addOrganic', 'm.baidu.com', 'word']);
                                _gaq.push(['_addOrganic', 'wap.baidu.com', 'word']);
                                _gaq.push(['_addOrganic', 'wap.soso.com', 'key']);
                                _gaq.push(['_trackPageview']);
                                (function () {
                                    var ga = document.createElement('script');
                                    ga.type = 'text/javascript';
                                    ga.async = true;
                                    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                                    var s = document.getElementsByTagName('script')[0];
                                    s.parentNode.insertBefore(ga, s);
                                })();
                            })();*/
                        }
                        /*
                        如果是webapp则http调用ubt，如果是hybrid则直接打入hybrid包中
                        */
                        if (!Lizard.isHybrid || Lizard.isInCtripApp) {
                            ; (function () {
                                var slist = document.getElementsByTagName('script') || [];
                                var reg = /_bfa\.min\.js/i;
                                for (var i = 0; i < slist.length; i++) {
                                    if (reg.test(slist[i].src)) {
                                        return;
                                    }
                                }
                                if ((window.$_bf && window.$_bf.loaded) || window.$LAB || window.CtripJsLoader) {
                                    return;
                                }
                                var d = new Date();
                                var v = '?v=' + d.getFullYear() + d.getMonth() + '_' + d.getDate() + '.js';
                                var bf = document.createElement('script');
                                bf.type = 'text/javascript';
                                bf.charset = 'utf-8';
                                bf.async = true;
                                try {
                                    var p = 'https:' == document.location.protocol;
                                } catch (e) {
                                    var p = 'https:' == document.URL.match(/[^:]+/) + ":";
                                }
                                bf.src = (p ? "https://webresource.c-ctrip.com/code/ubt/_mubt.min.js" + v : 'http://webresource.c-ctrip.com/code/ubt/_mubt.min.js' + v);
                                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(bf, s);

                            })();
                        } else {
                            ; (function () {
                            		var src = "ubt/_mubt.min.js";
                            		var lizardDir = Lizard.dir;
                            		if(lizardDir){
                            			var path = lizardDir.substr(0,lizardDir.indexOf('lizard/webresource'))
                            			src = path+src;
                            		}
                                var node = document.createElement("script");  
                                node.src = src;
                                var url = node.src;
                                node = null
                                require([url], function () {

                                });
                            })();
                        }
                        /*
                        添加google的在营销代码
                        */
                        /*; (function () {
                        var _img = new Image();
                        _img.onload = function () {
                        }
                        _img.onerror = function () {
                        }
                        _img.src = ('https:' == document.location.protocol ? 'https:' : 'http:') +
                        "//googleads.g.doubleclick.net/pagead/viewthroughconversion/1066331136/?value=1.000000&amp;label=cG9hCIyRngMQgNi7_AM&amp;guid=ON&amp;script=0";
                        })();
                        */


                    }

                }


            });
        };
        if (Lizard.isHybrid || Lizard.isInCtripApp || Lizard.app.code.is('GS')) {

            window.appInstance = false;
            window.localStorage.setItem('ISINAPP', '1');
            window.app = {};
            /*如果不需要等待web_view_finished_load信息，则直接初始化*/
            if (config.isBeforeViewFinishedLoadInitApp) {
                initAPP();
            };
            window.app.callback = function (options) {
                var methods = {
                    'web_view_finished_load': function () {
                        if (Lizard.web_view_finished_load) {
                            return;
                        } else {
                            Lizard.web_view_finished_load = 1;
                        }
                        // {
                        // extSouceID: ""
                        // osVersion: "Android_18"
                        // platform: "2"
                        // version: "5.5"
                        // }
                        if (window.localStorage) {
                            var appInfo = options.param;
                            if (appInfo) window.localStorage.setItem('APPINFO', JSON.stringify(appInfo));
                            console.log("appInfo")
                            console.log(appInfo)

                        }
                        /*如果不需要等待用户信息，则直接初始化*/
                        if (!config.isBeforeViewFinishedLoadInitApp && config.isViewFinishedLoadInitApp) {
                            initAPP();
                        }                        
                        CtripUtil.app_init_member_H5_info();

                    },

                    'init_member_H5_info': function (params) {
                        // {
                        // appId: "ctrip.android.view"
                        // clientID: "32043596200000129090"
                        // device: "samsung_GT-N7102"
                        // extSouceID: ""
                        // isPreProduction: "0"
                        // osVersion: "Android_18"
                        // platform: "2"
                        // serverVersion: "5.7"
                        // sourceId: "8892"
                        // timestamp: "1402930469100",
                        // userInfo:{
                        // data:{
                        // Auth: ""
                        // BMobile: ""
                        // BindMobile: ""
                        // IsNonUser: true
                        // UserID: ""
                        // },
                        // timeby: 1
                        // timeout: "2015/06/16"
                        // },
                        // version: "5.5"
                        // }
                        require(['libs', 'CommonStore'], function (libs, CommonStore) {
                            window.appInstance = true;
                            var wStore = window.localStorage;
                            if (wStore && params) {
                                console.log("params")
                                console.log(params)
                                var headStore = CommonStore.HeadStore.getInstance();
                                var userStore = CommonStore.UserStore.getInstance();
                                var unionStore = CommonStore.UnionStore.getInstance();
                                var headInfo = headStore.get();

                                //用户信息
                                if (params.userInfo) {
                                    try {
                                        var userInfo = userStore.getUser();
                                        params.userInfo.data.BMobile = params.userInfo.data.BindMobile;
                                        userStore.setUser(params.userInfo.data);
                                        headInfo.auth = params.userInfo.data.Auth;
                                    } catch (e) {
                                        alert('set data error');
                                    }
                                } else {
                                    userStore.removeUser();
                                }

                                if (params.device) {
                                    var deviceInfo = {
                                        device: params.device
                                    }
                                    wStore.setItem('DEVICEINFO', JSON.stringify(deviceInfo));
                                }

                                if (params.appId) {
                                    var appInfo = {
                                        version: params.version,
                                        appId: params.appId,
                                        serverVersion: params.serverVersion,
                                        platform: params.platform
                                    }
                                    wStore.setItem('APPINFO', JSON.stringify(appInfo));
                                }

                                if (params.timestamp) {
                                    var date = new Date();
                                    var serverdate = {
                                        server: params.timestamp,
                                        local: date.getTime()
                                    }
                                    wStore.setItem('SERVERDATE', JSON.stringify(serverdate));
                                }

                                if (params.sourceId) {
                                    headInfo.sid = params.sourceId;
                                    wStore.setItem('SOURCEID', params.sourceId);
                                }

                                wStore.removeItem('isPreProduction');
                                if (params.isPreProduction) {
                                    wStore.setItem('isPreProduction', params.isPreProduction);
                                }

                                //接受clientId,供UBT使用
                                if (params.clientID) {
                                    headInfo.cid = params.clientID;
                                    wStore.setItem('GUID', params.clientID);
                                }
                                //外部渠道号
                                if (params.extSouceID) {
                                    headInfo.xsid = params.extSouceID;
                                }
                                //soa2.0 syscode 可以接受非09的值, restful 待定
                                if (params.platform) {
                                    headInfo.syscode = params.platform == '1' ? 12 : 32;
                                }
                                if (params.version) {
                                    headInfo.cver = params.internalVersion || params.version;
                                }

                                //分销联盟参数
                                //ctrip://wireless/allianceID=123&ouID=456&sID=789&extendSourceID=11111
                                if (params.allianceId && params.sId) {
                                    var union = {
                                        "AllianceID": params.allianceId,
                                        "SID": params.sId,
                                        "OUID": params.ouId ? params.ouId : ""
                                    }
                                    unionStore.set(union);
                                }

                                headStore.set(headInfo)

                            }

                            if (!config.isBeforeViewFinishedLoadInitApp && !config.isViewFinishedLoadInitApp) {
                                initAPP();
                            }

                            wStore.setItem('CINFO', JSON.stringify(params));
                        });
                        Lizard.networkType = params.networkStatus;
                    },

                    'app_h5_need_refresh': function () {
                        initAPP();
                    }
                }
                if (options && typeof methods[options.tagname] === 'function') {
                    methods[options.tagname](options.param);
                }

                if (config.isBeforeViewFinishedLoadInitApp) {
                    Lizard.facadeMethods = {
                        'web_view_finished_load': methods['web_view_finished_load'],

                        'init_member_H5_info': methods['init_member_H5_info']
                    }
                } else if (config.isViewFinishedLoadInitApp) {
                    Lizard.facadeMethods = {
                        'init_member_H5_info': methods['init_member_H5_info']
                    }
                } else {

                }

            };

            //如果是pc端打开的话，直接主动触发init_member_H5_info
            if (Internal.isIOS || Internal.isAndroid || Internal.isWinOS) { } else {
                var isPc = (function isPc() {
                    return window.navigator.platform == "Win32";
                })();
                //添加对winphone的判断
                var iswinphone = window.navigator.userAgent.indexOf('IEMobile') > -1 ? true : false;
                if (iswinphone) {
                    isPc = false;
                }
                if (!isPc) return;
                var appInfo = { "tagname": "web_view_finished_load", "param": { "platform": "2", "osVersion": "Android_18", "extSouceID": "", "version": "5.5"} }
                Internal.isAndroid = (appInfo.param.platform == "2");
                Internal.isInApp = true;
                Internal.appVersion = appInfo.param.version;
                Internal.osVersion = appInfo.param.osVersion;
                if (window.localStorage) {
                    window.localStorage.clear();
                    if (appInfo) window.localStorage.setItem('APPINFO', JSON.stringify(appInfo));
                    window.localStorage.setItem('ISINAPP', '1');
                }
                window.Util_a = {};
                window.Util_a.h5Log = function (paramString) {
                    console.log('h5Log::', paramString);
                }
                window.Util_a.openUrl = function (paramString) {
                    console.log('h5Log::', paramString);
                }
                window.Locate_a = {};
                window.Locate_a.locate = function (paramString) { };
                window.NavBar_a = {};
                window.NavBar_a.setNavBarHidden = function (paramString) { };
                window.User_a = {};
                window.User_a.initMemberH5Info = function (paramString) { };
                window.Util_a.checkNetworkStatus = function () { };
                window.Business_a = {};
                window.Business_a.logGoogleRemarking = function () { };
                window.Business_a.sendUBTLog = function () { };
                window.app.callback({
                    'tagname': 'web_view_finished_load'
                })
                window.app.callback({
                    'tagname': 'init_member_H5_info',
                    'param': {
                        appId: "ctrip.android.view",
                        clientID: "32043596200000129090",
                        device: "samsung_GT-N7102",
                        extSouceID: "",
                        isPreProduction: "0",
                        osVersion: "Android_18",
                        platform: "2",
                        serverVersion: "5.7",
                        sourceId: "8892",
                        timestamp: "1402930469100",
                        userInfo: {
                            data: {
                                Auth: "",
                                BMobile: "",
                                BindMobile: "",
                                IsNonUser: true,
                                UserID: ""
                            },
                            timeby: 1,
                            timeout: "2015/06/16"
                        },
                        version: "5.5"
                    }
                });
            }
        } else {
            initAPP();
        }
    });

    var shown = false;
    window.onpageshow = function (e) {
        if (shown) {
            window.location.reload();
        }
        shown = true;
    }
    if (window.LizardLocalroute) {
      var path = Lizard.dir.substr(0,Lizard.dir.indexOf('lizard/webresource'))
      document.write("<SCRIPT src = '" + path + "basewidget/res/js/ui.loadFailed.js'><" + "/SCRIPT>");
      document.write("<SCRIPT src = '" + path + "basewidget/res/js/ui.loading.js'><" + "/SCRIPT>");
    } 
    window.getAppUITemplatePath = function (path) {
      if (!Lizard.notpackaged) return 'text!' + 'ui/' + path + '.html';
      if (document.location.href.indexOf('172.16.140.104:5389') > 0 || document.location.href.indexOf('localhost') > 0)
        return 'text!' + Lizard.dir + 'ui/' + path + '.html';

      return 'text!' + 'ui/' + path + '.html';
    }
}).call(this);
