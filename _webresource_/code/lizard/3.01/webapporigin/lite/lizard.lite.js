/**
 * Created by bianyl on 2015/8/7.
 */
(function(window, document){
  var utils = (function(){
    var isArray = Array.isArray ||
      function(object){ return object instanceof Array };
    var emptyArray = [], slice = emptyArray.slice;
    var  class2type = {},toString = class2type.toString;
    var _zid = 1;
    var objs = "Boolean Number String Function Array Date RegExp Object Error".split(" ");
    for(var i= 0,name;i<objs.length;i++){
      name = objs[i];
      class2type[ "[object " + name + "]" ] = name.toLowerCase()
    }
    function type(obj) {
      return obj == null ? String(obj) :
      class2type[toString.call(obj)] || "object"
    }
    function isString(){ return typeof obj == 'string' }
    function isFunction(value) { return type(value) == "function" }
    function isWindow(obj)     { return obj != null && obj == obj.window }
    function isObject(obj)     { return type(obj) == "object" }
    function isPlainObject(obj) {
      return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
    }
    function likeArray(obj) { return typeof obj.length == 'number' }
    function zid(element) {
      return element._zid || (element._zid = _zid++)
    }
    function extend(target, source, deep) {
      for (var key in source)
        if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
          if (isPlainObject(source[key]) && !isPlainObject(target[key]))
            target[key] = {}
          if (isArray(source[key]) && !isArray(target[key]))
            target[key] = []
          extend(target[key], source[key], deep)
        }
        else if (source[key] !== undefined) target[key] = source[key]
    }
    var me = {};
    //星期数据
    me._DAY1 = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    me._DAY2= ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    me._MAPS = {
      //有前导零的日期值
      'd': function (str, date, key) {
        var d = date.getDate().toString();
        if (d.length < 2){
          d = '0' + d;
        }
        return str.replace(new RegExp(key, 'mg'), d);
      },
      //无前导零的日期值
      'j': function (str, date, key) {
        return str.replace(new RegExp(key, 'mg'), date.getDate());
      },
      //星期中的第几天 1-7
      'N': function (str, date, key) {
        var d = date.getDay();
        if (d === 0){
          d = 7;
        }
        return str.replace(new RegExp(key, 'mg'), d);
      },
      'w': function (str, date, key) {
        var d = date.getDay();
        var title = me._DAY1[d];
        return str.replace(new RegExp(key, 'mg'), title);
      },
      'W': function (str, date, key) {
        var d = date.getDay();
        var title = me._DAY2[d];
        return str.replace(new RegExp(key, 'mg'), title);
      },
      //有前导零的月份
      'm': function (str, date, key) {
        var d = (date.getMonth() + 1).toString();
        if (d.length < 2){
          d = '0' + d;
        }
        return str.replace(new RegExp(key, 'mg'), d);
      },
      //无前导零的月份
      'n': function (str, date, key) {
        return str.replace(key, date.getMonth() + 1);
      },
      //四位年份
      'Y': function (str, date, key) {
        return str.replace(new RegExp(key, 'mg'), date.getFullYear());
      },
      //两位年份
      'y': function (str, date, key) {
        return str.replace(new RegExp(key, 'mg'), date.getYear());
      },
      //无前导零的小时,12小时制
      'g': function (str, date, key) {
        var d = date.getHours();
        if (d >= 12){
          d = d - 12;
        }
        return str.replace(new RegExp(key, 'mg'), d);
      },
      //无前导零的小时，24小时制
      'G': function (str, date, key) {
        return str.replace(new RegExp(key, 'mg'), date.getHours());
      },
      //有前导零的小时，12小时制
      'h': function (str, date, key) {
        var d = date.getHours();
        if (d >= 12){
          d = d - 12;
        }
        d += '';
        if (d.length < 2){
          d = '0' + d;
        }
        return str.replace(new RegExp(key, 'mg'), d);
      },
      //有前导零的小时，24小时制
      'H': function (str, date, key) {
        var d = date.getHours().toString();
        if (d.length < 2){
          d = '0' + d;
        }
        return str.replace(new RegExp(key, 'mg'), d);
      },
      //有前导零的分钟
      'i': function (str, date, key) {
        var d = date.getMinutes().toString();
        if (d.length < 2) {
          d = '0' + d;
        }
        return str.replace(new RegExp(key, 'mg'), d);
      },
      //有前导零的秒
      's': function (str, date, key) {
        var d = date.getSeconds().toString();
        if (d.length < 2){
          d = '0' + d;
        }
        return str.replace(new RegExp(key, 'mg'), d);
      },
      //无前导零的分钟
      'I': function (str, date, key) {
        var d = date.getMinutes().toString();
        return str.replace(new RegExp(key, 'mg'), d);
      },
      //无前导零的秒
      'S': function (str, date, key) {
        var d = date.getSeconds().toString();
        return str.replace(new RegExp(key, 'mg'), d);
      },
      //转换为今天/明天/后天
      'D': function (str, date, key) {
        var now =new Date();
        now.setHours(0, 0, 0, 0);
        date = new Date(date.valueOf());
        date.setHours(0, 0, 0, 0);
        var day = 60 * 60 * 24 * 1000,
          tit = '',
          diff = date - now;
        if (diff >= 0) {
          if (diff < day) {
            tit = '今天';
          } else if (diff < 2 * day) {
            tit = '明天';
          } else if (diff < 3 * day) {
            tit = '后天';
          }
        }
        return str.replace(new RegExp(key, 'mg'), tit);
      }
    };
    me.format= function (format,date) {
      if (typeof format !== 'string'){
        format = '';
      }
      date = date || new Date();
      for (var key in me._MAPS) {
        format = me._MAPS[key].call(this, format, date, key);
      }
      return format;
    };
    me.isObject = function (obj) {
      return obj === Object(obj);
    };
    /**
     * 获取cookie中的值
     */
    me.getCookie = function(key){
      var cookies = document.cookie;
      var value = "";
      if(cookies){
        var cookieArr = cookies.split("; ");
        for(var i= 0,cookie,index;i<cookieArr.length;i++){
          cookie = cookieArr[i];
          index = cookie.indexOf("=");
          if(cookie.substr(0,index) == key){
            value = cookie.substr(index+1);
          }
        }
      }
      return value;
    };
    /**
     * 获取cookie中的值
     */
    me.setCookie = function (key, value, timeout, path, domain, secure) {
      value = me.isObject(value)?JSON.stringify(value):value;
      document.cookie = key + "=" + escape(value) +
      ((timeout) ? "; expires=" + timeout : "") +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      ((secure) ? "; secure" : "");
    };
    // Copy all but undefined properties from one or more
    // objects to the `target` object.
    me.extend = function(target){
      var deep, args = slice.call(arguments, 1);
      if (typeof target == 'boolean') {
        deep = target
        target = args.shift()
      }
      args.forEach(function(arg){ extend(target, arg, deep) });
      return target;
    };
    me.ObjSet = function (obj, path, value) {
      if (!path){
        return null;
      }
      var array = path.split('.');
      obj = obj || {};
      for (var i = 0, len = array.length, last = Math.max(len - 1, 0); i < len; i++) {
        if (i < last) {
          obj = (obj[array[i]] = obj[array[i]] || {});
        } else {
          obj[array[i]] = value;
        }
      }

      return obj;
    };
    me.getObj = function (obj, path) {
      if (!obj || !path){
        return null;
      }

      var array = path.split('.');

      obj = obj || {};

      for (var i = 0, len = array.length, last = Math.max(len - 1, 0); i < len; i++) {
        obj = obj[array[i]];

        if (obj === null || typeof obj === 'undefined') {
          return null;
        }
      }

      return obj;
    };
    me.isUrl = function (url) {
      return /^http(s)?:\/\/[A-Za-z0-9\-]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\:+!]*([^<>])*$/.test(url);
    };
    me.getUrlParam = function (url, name) {
      var re = new RegExp("(\\?|&)" + name + "=([^&]+)(&|$)", "i"), m = url.match(re);
      return m ? m[2] : "";
    };
    me.getUrlParams = function (url) {
      var _url = url.split('://');
      var searchReg = /([^&=?]+)=([^&]+)/g;
      var urlParams = {};
      var match, value, length, name;

      while (match = searchReg.exec(_url[0])) {
        name = match[1];
        value = match[2];
        urlParams[name] = value;
      }

      if (_url[1]) {
        var idx = 0;
        length = me._.size(urlParams);
        me._.each(urlParams, function (value, key) {
          if (++idx == length) {
            urlParams[key] += '://' + _url[1];
          }
        });
      }

      return urlParams;
    };
    me.proxy = function(fn, context) {
      var args = (2 in arguments) && slice.call(arguments, 2);
      if (isFunction(fn)) {
        var proxyFn = function(){ return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) };
        proxyFn._zid = zid(fn);
        return proxyFn
      } else if (isString(context)) {
        if (args) {
          args.unshift(fn[context], fn);
          return me.proxy.apply(null, args)
        } else {
          return me.proxy(fn[context], fn)
        }
      } else {
        throw new TypeError("expected function")
      }
    };
    me.getGuid = function () {
      var guid = utils.getCookie("GUID");
      var ws = window.localStorage;
      if(!guid){
        guid = ws.getItem('GUID') || '';
      }else{
        try{
          ws.setItem('GUID',guid);
        } catch (e){
        }
      }
      return guid;
    };
    me.getDomain = function(type){
      var host = window.location.host,
        isAccounts = type=="accounts",
        domain = isAccounts ?"accounts.ctrip.com":"m.ctrip.com";
      if (host.match(/^m\.ctrip\.com/i)){
        if(type == "https"){
          domain = "sec-m.ctrip.com";
        }
        //domain = "accounts.ctrip.com";
      }else if (host.match(/\.uat\.qa/i)){
        domain = isAccounts ?"accounts.uat.qa.nt.ctripcorp.com":"gateway.m.uat.qa.nt.ctripcorp.com";
      }else if (host.match(/\.fat/i) || (host.match(/\.lpt/i))|| host.match(/\.fws/i) || host.match(/^(localhost|172\.16|127\.0)/i)) {
        domain = isAccounts ?"accounts.fat49.qa.nt.ctripcorp.com":"gateway.m.fws.qa.nt.ctripcorp.com";
      }
      return domain;
    };
    me.isString = isString;
    me.$ = (function(){
      var $ ={};
      $.each = function(elements, callback){
        var i, key
        if (likeArray(elements)) {
          for (i = 0; i < elements.length; i++)
            if (callback.call(elements[i], i, elements[i]) === false) return elements
        } else {
          for (key in elements)
            if (callback.call(elements[key], key, elements[key]) === false) return elements
        }
        return elements
      };
      var returnTrue = function(){return true},
        returnFalse = function(){return false},
        ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
        eventMethods = {
          preventDefault: 'isDefaultPrevented',
          stopImmediatePropagation: 'isImmediatePropagationStopped',
          stopPropagation: 'isPropagationStopped'
        };
      function compatible(event, source) {
        if (source || !event.isDefaultPrevented) {
          source || (source = event)

          for(var name in eventMethods){
            var predicate = eventMethods[name];
            var sourceMethod = source[name]
            event[name] = function(){
              this[predicate] = returnTrue
              return sourceMethod && sourceMethod.apply(source, arguments)
            };
            event[predicate] = returnFalse
          }
          if (source.defaultPrevented !== undefined ? source.defaultPrevented :
              'returnValue' in source ? source.returnValue === false :
              source.getPreventDefault && source.getPreventDefault())
            event.isDefaultPrevented = returnTrue
        }
        return event
      }
      $.Event = function(type, props) {
        if (!isString(type)) props = type, type = props.type
        var event = document.createEvent('Events'), bubbles = true;
        if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
        event.initEvent(type, bubbles, true)
        return compatible(event)
      }

      function serialize(params, obj, traditional, scope){
        var type, array = isArray(obj), hash = isPlainObject(obj);
        $.each(obj, function(key, value) {
          type = $.type(value)
          if (scope) key = traditional ? scope :
          scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
          // handle data in serializeArray() format
          if (!scope && array) params.add(value.name, value.value)
          // recurse into nested objects
          else if (type == "array" || (!traditional && type == "object"))
            serialize(params, value, traditional, key)
          else params.add(key, value)
        })
      }
      $.param = function(obj, traditional){
        var params = []
        params.add = function(k, v){ this.push(escape(k) + '=' + escape(v)) }
        serialize(params, obj, traditional)
        return params.join('&').replace(/%20/g, '+')
      }
      var jsonpID = 0,
        document = window.document,
        key,
        name,
        rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        scriptTypeRE = /^(?:text|application)\/javascript/i,
        xmlTypeRE = /^(?:text|application)\/xml/i,
        jsonType = 'application/json',
        htmlType = 'text/html',
        blankRE = /^\s*$/;

      function mimeToDataType(mime) {
        if (mime) mime = mime.split(';', 2)[0]
        return mime && ( mime == htmlType ? 'html' :
            mime == jsonType ? 'json' :
              scriptTypeRE.test(mime) ? 'script' :
              xmlTypeRE.test(mime) && 'xml' ) || 'text'
      }
      // trigger a custom event and return false if it was cancelled
      function triggerAndReturn(context, eventName, data) {

        var event = $.Event(eventName);
        event._args = data;
        //$(context).trigger(event, data);
        context.dispatchEvent(event);
        return !event.isDefaultPrevented()
      }

      // trigger an Ajax "global" event
      function triggerGlobal(settings, context, eventName, data) {
        if (settings.global) return triggerAndReturn(context || document, eventName, data)
      }

      function ajaxStart(settings) {
        if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
      }
      function ajaxStop(settings) {
        if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
      }
      function ajaxBeforeSend(xhr, settings) {
        var context = settings.context
        if (settings.beforeSend.call(context, xhr, settings) === false ||
          triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
          return false

        triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
      }
      function ajaxSuccess(data, xhr, settings, deferred) {
        var context = settings.context, status = 'success';
        settings.success.call(context, data, status, xhr);
        if (deferred) deferred.resolveWith(context, [data, status, xhr])
        triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
        ajaxComplete(status, xhr, settings)
      }
      function ajaxError(error, type, xhr, settings, deferred) {
        var context = settings.context
        settings.error.call(context, xhr, type, error)
        if (deferred) deferred.rejectWith(context, [xhr, type, error])
        triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
        ajaxComplete(type, xhr, settings)
      }
      // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
      function ajaxComplete(status, xhr, settings) {
        var context = settings.context
        settings.complete.call(context, xhr, status)
        triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
        ajaxStop(settings)
      }
      function empty() {}
      $.ajaxJSONP = function(options, deferred){
        if (!('type' in options)) return $.ajax(options);

        var _callbackName = options.jsonpCallback,
          callbackName = (isFunction(_callbackName) ?
              _callbackName() : _callbackName) || ('jsonp' + (++jsonpID)),
          script = document.createElement('script'),
          originalCallback = window[callbackName],
          responseData,
          abort = function(errorType) {
            //$(script).triggerHandler('error', errorType || 'abort')
          },
          xhr = { abort: abort }, abortTimeout;
        if (deferred) deferred.promise(xhr);
        function finishLoad(e,errorType){
          clearTimeout(abortTimeout);
          document.getElementsByTagName("head")[0].removeChild(script);
          if (e.type == 'error' || !responseData) {
            ajaxError(null, errorType || 'error', xhr, options, deferred)
          } else {
            ajaxSuccess(responseData[0], xhr, options, deferred)
          }

          window[callbackName] = originalCallback
          if (responseData && isFunction(originalCallback))
            originalCallback(responseData[0])

          originalCallback = responseData = undefined
        };
        script.onload = finishLoad;
        script.onerror = finishLoad;

        if (ajaxBeforeSend(xhr, options) === false) {
          abort('abort')
          return xhr
        }

        window[callbackName] = function(){
          responseData = arguments
        }

        script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName);
        document.head.appendChild(script)

        if (options.timeout > 0) abortTimeout = setTimeout(function(){
          abort('timeout')
        }, options.timeout);

        return xhr
      };
      $.active = 0;
      $.type = type;
      $.ajaxSettings = {
        // Default type of request
        type: 'GET',
        // Callback that is executed before request
        beforeSend: empty,
        // Callback that is executed if the request succeeds
        success: empty,
        // Callback that is executed the the server drops error
        error: empty,
        // Callback that is executed on request complete (both: error and success)
        complete: empty,
        // The context for the callbacks
        context: null,
        // Whether to trigger "global" Ajax events
        global: true,
        // Transport
        xhr: function () {
          return new window.XMLHttpRequest()
        },
        // MIME types mapping
        // IIS returns Javascript as "application/x-javascript"
        accepts: {
          script: 'text/javascript, application/javascript, application/x-javascript',
          json:   jsonType,
          xml:    'application/xml, text/xml',
          html:   htmlType,
          text:   'text/plain'
        },
        // Whether the request is to another domain
        crossDomain: false,
        // Default timeout
        timeout: 0,
        // Whether data should be serialized to string
        processData: true,
        // Whether the browser should be allowed to cache GET responses
        cache: true
      };

      function appendQuery(url, query) {
        if (query == '') return url
        return (url + '&' + query).replace(/[&?]{1,2}/, '?')
      }
      function serializeData(options) {
        if (options.processData && options.data && $.type(options.data) != "string")
          options.data = $.param(options.data, options.traditional);
        if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
          options.url = appendQuery(options.url, options.data), options.data = undefined
      }
      $.ajax = function(options){
        var settings = me.extend({}, options || {}),
          deferred = $.Deferred && $.Deferred();
        for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

        ajaxStart(settings);

        if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
        RegExp.$2 != window.location.host;

        if (!settings.url) settings.url = window.location.toString();
        serializeData(settings);

        var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url)
        if (hasPlaceholder) dataType = 'jsonp'

        if (settings.cache === false || (
          (!options || options.cache !== true) &&
          ('script' == dataType || 'jsonp' == dataType)
          ))
          settings.url = appendQuery(settings.url, '_=' + Date.now())

        if ('jsonp' == dataType) {
          if (!hasPlaceholder)
            settings.url = appendQuery(settings.url,
              settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?');
          return $.ajaxJSONP(settings, deferred)
        }

        var mime = settings.accepts[dataType],
          headers = { },
          setHeader = function(name, value) { headers[name.toLowerCase()] = [name, value] },
          protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
          xhr = settings.xhr(),
          nativeSetHeader = xhr.setRequestHeader,
          abortTimeout

        if (deferred) deferred.promise(xhr)

        if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest')
        setHeader('Accept', mime || '*/*')
        if (mime = settings.mimeType || mime) {
          if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
          xhr.overrideMimeType && xhr.overrideMimeType(mime)
        }
        if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
          setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')

        if (settings.headers) for (name in settings.headers) setHeader(name, settings.headers[name])
        xhr.setRequestHeader = setHeader

        xhr.onreadystatechange = function(){
          if (xhr.readyState == 4) {
            xhr.onreadystatechange = empty
            clearTimeout(abortTimeout)
            var result, error = false
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
              dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))
              result = xhr.responseText

              try {
                // http://perfectionkills.com/global-eval-what-are-the-options/
                if (dataType == 'script')    (1,eval)(result)
                else if (dataType == 'xml')  result = xhr.responseXML
                else if (dataType == 'json') result = blankRE.test(result) ? null : JSON.parse(result)
              } catch (e) { error = e }

              if (error) ajaxError(error, 'parsererror', xhr, settings, deferred)
              else ajaxSuccess(result, xhr, settings, deferred)
            } else {
              ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred)
            }
          }
        }

        if (ajaxBeforeSend(xhr, settings) === false) {
          xhr.abort()
          ajaxError(null, 'abort', xhr, settings, deferred);
          return xhr
        }

        if (settings.xhrFields) for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]

        var async = 'async' in settings ? settings.async : true
        xhr.open(settings.type, settings.url, async, settings.username, settings.password)

        for (name in headers) nativeSetHeader.apply(xhr, headers[name])

        if (settings.timeout > 0) abortTimeout = setTimeout(function(){
          xhr.onreadystatechange = empty
          xhr.abort()
          ajaxError(null, 'timeout', xhr, settings, deferred)
        }, settings.timeout)

        // avoid sending empty string (#319)
        xhr.send(settings.data ? settings.data : null);
        return xhr
      }
      return $;
    })();
    me._ = (function(){
      var _ = {};
      var nativeKeys = nativeKeys = Object.keys;
      var breaker = {};
      var ArrayProto = Array.prototype,ObjProto = Object.prototype,hasOwnProperty = ObjProto.hasOwnProperty,nativeForEach = ArrayProto.forEach;
      _.keys = nativeKeys || function (obj) {
        if (obj !== Object(obj)) throw new TypeError('Invalid object');
        var keys = [];
        for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
        return keys;
      };
      _.has = function (obj, key) {
        return hasOwnProperty.call(obj, key);
      };
      _.size = function (obj) {
        if (obj == null) return 0;
        return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
      };
      _.each = function (obj, iterator, context) {
        if (obj == null) return;
        if (nativeForEach && obj.forEach === nativeForEach) {
          obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
          for (var i = 0, l = obj.length; i < l; i++) {
            if (iterator.call(context, obj[i], i, obj) === breaker) return;
          }
        } else {
          for (var key in obj) {
            if (_.has(obj, key)) {
              if (iterator.call(context, obj[key], key, obj) === breaker) return;
            }
          }
        }
      };
      return _;
    })()
    return me;
  })();
  var performance = (function(){
    function Performance() {
      this.performance = {};
      this.isapp = "0";
      this.defaults = {
        "AjaxReady":      {
          "name": "JS.Lizard.AjaxReady",
          "tags": {
            "url": "",
            "status": ""
          }
        },
        /* JIANG Jing … 2014-08-19 */
        /* 记录 AJAX 响应的消息体长度信息 */
        "AjaxMessageSize":{
          "name": "JS.Lizard.AjaxMessageSize",
          "tags": {
            "url": ""
          }
        }
      };
      this.uuid = 0;
    }

    if (!window.__bfi) {
      window.__bfi = [];
    }

    Performance.prototype = {
      send:     function (name, tag, value, ts) {
        var sendKey = ['_trackMatrix', name, tag, value, ts];
        //+1……2014-09-10……JIANGJing……临时禁用GeoRequest中除指定之外的其他性能监控点
        if (name == 'JS.Lizard.GeoRequest' && (typeof tag.url != 'string' || !tag.url.match(/^(Native|Web) function (number|detail|error)$/))) { return; }
        window.__bfi.push(sendKey);
      },
      //+…2014-08-19
      /* 获取规范格式的当前时间 */
      getTime: function() {
        return (new Date()).getTime();
      },

      //+…2014-08-19
      /* 初始化选项值 */
      initOptions: function(opt) {
        //opt.startTime = this.getTime();
        opt.version = "2.1"; /*lizard版本号*/
        opt.isapp =  this.isapp;  /*web/hybrid*/
        opt.network   = 'unknown';  /*网络状况2g/3g/wifi*/
      },

      //+…2014-08-19
      /* 用于记录非时间长度值 */
      /**
       * 用于记录非时间长度值
       * @param opt
       * @param value
       */
      log: function(opt, value) {
        if (opt.url && utils.isString(opt.url))
        {
          if (opt.url.indexOf('_fxpcqlniredt') > -1){
            opt.url = opt.url.substring(0, opt.url.indexOf('_fxpcqlniredt') - 1);
          }
          console.log(opt.url);
          opt.url = opt.url.replace(new RegExp((+new Date()+'').slice(0,8)+'\\d{5}'),'__TIME__');
        }
        var def  = this.defaults[opt.name], tags = {};
        this.initOptions(tags);
        // 标签数据
        for (var key in def.tags) {
          tags[key] = (opt[key] || def.tags[key]) + '';
        }
        /*if (tags.distribution) {
         tags.distribution = this.distribution(value);
         }*/
        if(opt.name != "AjaxMessageSize"){/*ajaxmessagesize暂时不记录distribution*/
          tags.distribution = this.distribution(value);
        }
        this.send(def.name, tags, value, this.getTime());
      },
      group:    function (id, opt) {
        //-1…2014-08-19
        // opt.startTime = (new Date).getTime();
        //+1…2014-08-19
        opt.startTime = this.getTime();
        //-1…2014-08-19
        // opt.network = Lizard.networkType || 'unknown';
        this.performance[id] = opt;
      },

      //+……2014-09-12……JIANGJing……读写 tag 值
      groupTag: function(id, tagname, /*OPTIONAL*/ value) {
        var opt = this.performance[id];
        if (!opt) {
          this.performance[id] = opt = {};
        }

        if (arguments.length == 3) {
          opt[tagname] = value;
        }

        return opt[tagname];
      },

      groupEnd: function (id) {
        var opt = this.performance[id] || {};
        this.log(opt, this.getTime() - opt.startTime);
      },
      getUuid:  function () {
        return "Performance_" + (++this.uuid);
      },

      distribution: function (time) {
        var ret = "";
        if (0 <= time & time <= 500) {
          ret = '[0,500]';
        } else if (501 <= time & time <= 1000) {
          ret = '[501,1000]';
        } else if (1001 <= time & time <= 2000) {
          ret = '[1001,2000]';
        } else if (2001 <= time & time <= 3000) {
          ret = '[2001,3000]';
        } else if (3001 <= time & time <= 4000) {
          ret = '[3001,4000]';
        } else if (4001 <= time) {
          ret = '[4001,--]';
        }
        return ret + "(ms)";
      }
    };

    return new Performance();
  })();
  var cAjax = (function(){
    var contentTypeMap = {
      'json': 'application/json',
      'jsonp': 'application/json'
    };
    var _getContentType = function (contentType) {
      if (contentType) {
        contentType = contentTypeMap[contentType] ? contentTypeMap[contentType] : contentType;
      }
      return contentType;
    };
    function _sendReq(opt) {
      var uuidXhrSend = performance.getUuid();
      performance.group(uuidXhrSend, {
        name: "AjaxReady",
        url: opt.url,
        data: opt.data
      });
      //+…2014-08-19
      var loadedLength = 0;
      var obj = {
        url: opt.url,
        type: opt.type,
        dataType: opt.dataType,
        data: opt.data,
        contentType: opt.contentType,
        timeout: opt.timeout || 50000,
        //+…2014-08-19
        // 获取响应的字节长度（responseText.length 系字符数）
        beforeSend: function (xhr) {
          xhr.onprogress = function (event) {
            loadedLength = event.loaded ? event.loaded : event.position;
          };
        },
        //-1…2014-08-19
        // success: function (res) {
        //+1…2014-08-19
        success: function (res, status, xhr) {
          //+5…2014-08-19
          performance.log({
            name: 'AjaxMessageSize',
            // contentEncoding: xhr && typeof xhr.getResponseHeader == 'function' ? xhr.getResponseHeader('content-encoding') : undefined, // 确保不要报错
            url: opt.url
          }, loadedLength);
          performance.performance[uuidXhrSend].status = "success";
          performance.groupEnd(uuidXhrSend);
          opt.callback(res);
        },
        error: function (err) {
          performance.performance[uuidXhrSend].status = "fail";
          performance.groupEnd(uuidXhrSend);
          if (opt.error) {
            opt.error(err);
          }
        }
      };
      //是否是跨域则加上这条
      if (opt.url.indexOf(window.location.host) === -1) {
        obj.crossDomain = !!opt.crossDomain;
      }
      if(opt.dataType == "jsonp"){
        obj.jsonpCallback = opt.jsonpCallback;
      }

      return utils.$.ajax(obj);
    };
    function _getCommonOpt(url, data, callback, error) {
      return {
        url: url,
        data: data,
        callback: callback,
        error: error
      };
    };
    var ajax = {};
    ajax.cros =function(url, type, data, callback, error,timeout){
      var contentType = data.contentType;
      if (type.toLowerCase() !== 'get') {
        // data = JSON.stringify(data);
        data = JSON.stringify(data);
      }
      var opt = _getCommonOpt(url, data, callback, error);
      opt.type = type;
      opt.dataType = 'json';
      opt.crossDomain = true;
      opt.data = data;
      opt.contentType = _getContentType(contentType) || 'application/json';
      opt.timeout = timeout;
      return _sendReq(opt);
    };
    ajax.jsonp = function(url, data, callback, error,timeout) {
      var opt = _getCommonOpt(url, data, callback, error);
      opt.type = 'GET';
      opt.dataType = 'jsonp';
      opt.crossDomain = true;
      opt.timeout = timeout;
      if(data.jsonpCallback){
        opt.jsonpCallback = data.jsonpCallback;
      }
      return _sendReq(opt);
    };
    return ajax;
  })();
  var AbsModel = function(){
    var model = {
      url:null,
      validates:[],
      protocol:(window.location.protocol.indexOf("https") > -1) ? "https" : "http",
      contentType:"json",
      method:"POST",
      timeout:30000,
      ajax : null,
      checkAuth:true,
      needSOA:true,
      param :{}
    };

    model.execute=function(onComplete, onError,scope){
      //组织请求头部
      var guid = utils.getGuid(),cid =  Lite.HeadStore.getAttr("cid");
      if(guid &&  guid != cid){
        Lite.HeadStore.setAttr("cid", guid || "");
      }
      //每次请求前设置用户Auth
      Lite.HeadStore.setAuth(Lite.UserStore.getAuth());
      var url = this.appendSuffix(this.buildurl());
      var params = this.getParam();
      params.head = Lite.HeadStore.get() || {};
      params.contentType = this.contentType;
      var _getResponseHead =function (data,scop) {
        var fromSOA = !!data.ResponseStatus;
        var head = fromSOA ? data.ResponseStatus : data.head,
          success = false, overdue = false;
        if (fromSOA && head) {
          var ack = head.Ack;
          //酒店模块报错ack返回值是1
          if (ack === 'Failure' || ack == 1) {
            var errors = head.Errors;
            if ((errors instanceof Array) && errors.length > 0) {
              //考虑到可能存在多个error的情况
              for (var i = 0, error; i < errors.length; i++) {
                error = errors[i];
                if (error && error.ErrorCode && error.ErrorCode == 'MobileRequestFilterException') {
                  //auth 过期，用户重新登录 2.01 09 16 modefy by byl  此处添加BU 控制，判断是否调用登陆界面
                  if (scop.checkAuth) {
                    overdue = true;
                    //在此将所有的auth信息都置空
                    Lite.HeadStore.setAuth("");
                    Lite.UserStore.removeUser();
                  }
                  break;
                }
              }
            }
          }
          //SOA2.0的成功判断增加枚举类型
          success = head.Ack === 'Success' || head.Ack == '0';
        } else {
          success = (head && head.errcode === 0);
        }
        if(overdue){
          return {
            'success': success,
            'overdue': overdue
          };
        }else{
          return !!success;
        }
      };
      var __onComplete = utils.proxy(function (data) {
        if(this.needSOA){
          //默认执行，验证SOA2.0的服务
          //保存服务请求日志
          var validates = _getResponseHead(data,this);
          if ((typeof validates === 'boolean')) {
            if (!validates) {
              if (typeof onError === 'function') {
                return onError.call(scope || this, data);
              } else {
                return false;
              }
            }
          } else {
            if (validates && validates.overdue) {
              Lite.Member.memberLogin({'param': 'from=' + encodeURIComponent(window.location.href)});
              return;
            }
          }
        }
        var datamodel = typeof this.dataformat === 'function' ? this.dataformat(data) : data;
        if (typeof onComplete === 'function') {
          onComplete.call(scope || this, datamodel, data);
        }
      }, this);

      var __onError = utils.proxy(function (e) {
        if (typeof onError === 'function') {
          onError.call(scope || this, e);
        }
      }, this);
      if (this.contentType === "json") {
        // @description 跨域请求
        return this.ajax = cAjax.cros(url, this.method, params, __onComplete, __onError,this.timeout);
      } else if (this.contentType === "jsonp") {
        // @description jsonp的跨域请求
        return this.ajax = cAjax.jsonp(url, params, __onComplete, __onError,this.timeout);
      }
    };
    model.buildurl=function () {
      var url = this.url;
      if (!utils.isUrl(this.url)) {
        var domain = 'm.ctrip.com';
        url = this.protocol + '://' + domain + '/restapi' +  this.url;
      }
      return url;
    };
    model.appendSuffix=function(url){
      var cid = utils.getGuid();
      if(cid){
        var segChar = url.indexOf('?')>-1 ? "&":'?' ;
        url = url + segChar + '_fxpcqlniredt=' + cid;
      }
      return url;
    };
    model.getParam =function () {
      var params;
      if(utils.isObject(this.param)){  //model post请求参数只能为对象
        params = utils.extend(true,{},this.param);
      }
      return params || {};
    };
    model.setParam = function (key, val) {
      if (typeof key === 'object' && !val) {
        this.param = key;
      } else {
        this.param[key] = val;
      }
    };
    return model;
  };
  //Store基类对象
  var AbsStore = function(){
    var store = {};
    store.lifeTime = "30D";
    store.sProxy = window.localStorage;
    store.setAttr=function (attrName, attrVal) {
      if (utils.isObject(attrName)) {
        for (var i in attrName) {
          if (attrName.hasOwnProperty(i)) {this.setAttr(i, attrName[i], attrVal);}
        }
        return;
      }
      var obj = this.get() || {};
      if (obj) {
        utils.ObjSet(obj, attrName, attrVal);
        return this.set(obj);
      }
      return false;
    };
    store.getAttr=function (attrName, tag) {
      var obj = this.get(tag);
      var attrVal = null;
      if (obj) {
        attrVal = utils.getObj(obj, attrName);
      }
      return attrVal;
    };
    store.set = function(value,tag){
      var now = new Date();
      var saveDate = utils.format('Y/m/d H:i:s',now);
      var timeout = utils.format('Y/m/d H:i:s',new Date(now.getTime()+ this._getLifeTime()));
      var entity = this._buildStorageObj(value,timeout,tag,saveDate);
      try{
        this.sProxy.setItem(this.key,JSON.stringify(entity));
      }catch(e){
        if(console){
          console.log(e);
        }
      }
    };
    store.oldSet = function(value,key){
      var now = new Date();
      var saveDate = utils.format('Y/m/d H:i:s',now);
      var timeout = utils.format('Y/m/d H:i:s',new Date(now.getTime()+ this._getLifeTime()));
      var obj = {
        data:    value,
        timeout:  timeout,
        tag:      null,
        savedate: saveDate
      };
      key = key || this.key
      try{
        this.sProxy.setItem(key,JSON.stringify(obj));
      }catch(e){
        if(console){
          console.log(e);
        }
      }
    };
    store.get = function(tag){
      var result = null, isEmpty = true;
      if (Object.prototype.toString.call(this.defaultData) === '[object Array]') {
        result = this.defaultData.slice(0);
      } else if (this.defaultData) {
        result = utils.extend({},this.defaultData);
      }
      var obj;
      try{
        var pResult = this.sProxy.getItem(this.key);
        if(pResult){
          pResult = JSON.parse(pResult);
          if(new Date(pResult.timeout) >= new Date()){
            if(tag){
              if (tag === pResult.tag) {
                obj = pResult.oldvalue;
              }
            }else{
              obj = pResult.value;
            }
          }
        }
      }catch(e){
        if(console){
          console.log(e);
        }
      }
      var type = typeof obj;
      if (({ 'string': true, 'number': true, 'boolean': true })[type]) {return obj;}
      if (obj) {
        if (Object.prototype.toString.call(obj) == '[object Array]') {
          result = [];
          for (var i = 0, ln = obj.length; i < ln; i++) {
            result[i] = obj[i];
          }
        } else {
          if (obj && !result) {result = {};}
          utils.extend(result, obj);
        }
      }
      for (var a in result) {
        isEmpty = false;
        break;
      }
      return !isEmpty ? result : null;

    };
    store.oldGet = function(key){
      var v = this.sProxy.getItem(key);
      var d = v ? JSON.parse(v) : null;
      if (d && d.timeout) {
        /*验证是否过期*/
        var n = new Date();
        var t = new Date(d.timeout);
        if (t >= n) {
          return d;
        }
        localStorage.removeItem(key);
        return null;
      }
      return d;
    };
    store._getLifeTime = function () {
      var timeout = 0;
      var str = this.lifeTime + "";
      var unit = str.charAt(str.length - 1);
      var num = +str.substring(0, str.length - 1);
      if (typeof unit == 'number') {
        unit = 'M';
      } else {
        unit = unit.toUpperCase();
      }

      if (unit == 'D') {
        timeout = num * 24 * 60 * 60;
      } else if (unit == 'H') {
        timeout = num * 60 * 60;
      } else if (unit == 'M') {
        timeout = num * 60;
      } else if (unit == 'S') {
        timeout = num;
      } else {
        //默认为秒
        timeout = num * 60;
      }
      return timeout * 1000;
    };
    store._buildStorageObj=function (value, timeout, tag, savedate,oldVal) {
      var obj = {
        value:    value,
        timeout:  timeout,
        tag:      tag,
        savedate: savedate
      };
      if(oldVal){
        obj.oldvalue =oldVal;
      }
      return obj;
    };
    return utils.extend(true,{},store);
  };
  var Member = function(){
    var host = window.location.host;
    var domain = "accounts.ctrip.com";
    if (host.match(/^m\.ctrip\.com/i)) {
      domain = "accounts.ctrip.com";
    } else if (host.match(/.uat\.qa/i)) {
      domain = "accounts.uat.qa.nt.ctripcorp.com";
    } else if (host.match(/.fat/i) || host.match(/.fws/i)) {
      domain = "accounts.fat49.qa.nt.ctripcorp.com";
    } else if (host.match(/^(localhost|172\.16|127\.0)/i)) {
      domain = "accounts.fat49.qa.nt.ctripcorp.com";
    }
    this.LINKS = {
      MEMBER_LOGIN: 'https://' + domain + '/H5Login/#login',
      REGISTER: 'https://' + domain + '/H5Register/'
    };
  };
  Member.prototype = {
    memberLogin: function (options) {
      this._getLink(this.LINKS.MEMBER_LOGIN, options);
    },
    nonMemberLogin: function (options) {
      options = utils.extend({
        callback: function () {
        }
      }, options || {});
      Lite.NotUserLoginModel(options.callback, options.callback);
    },
    _getLink : function (link, options) {
      var url = link, lt = location;
      var param = (options && options.param && typeof options.param === 'string') ? options.param : "";
      if (param) {
        param = utils.getUrlParams(options.param);
        var backUrl = (param && param.backurl) ? decodeURIComponent(param.backurl) : "";
        var from = (param && param.from) ? decodeURIComponent(param.from) : "";
        var pHost = lt.protocol + "//" + lt.host;
        //判断参数是否为完整url，不是的话，补全host
        if (utils.isUrl(backUrl)) {
          param.backurl = backUrl;
        } else {
          if (backUrl !== "") {
            param.backurl = pHost + backUrl;
          }
        }
        if (utils.isUrl(from)) {
          param.from = from;
        } else {
          if (from !== "") {
            param.from = pHost + from;
          }
        }
        var paramStr = utils.$.param(param);

        if (paramStr) {
          url = url + "?" + paramStr;
        }
      }
      window.location.href = url;
    }
  };

  var Lite = {};
  Lite.version = "0.0.1";
  Lite.Model = function(options){
    if(!options || (options && !options.url)){
      return;
    }
    return utils.extend(true,new AbsModel(),options);
  };
  Lite.UserModel = function(token){
    var url = ['https://',utils.getDomain("accounts"), '/',"CrossDomainGetTicket/ajax/ajaxgetticket.ashx"].join("");
    var userModel = Lite.Model(
      {
        url:url,
        contentType:"jsonp",
        checkAuth:false,
        param:{'jsonpCallback': "callbackfn",token:token,'IsH5': 1}
      });
    userModel.execute = function(onComplete, onError, ajaxOnly, scope, onAbort) {
      this.isAbort = false;
      var url = this.buildurl();
      var successCallback = function(info) {
        if (info.RetCode == '0' && info.UserData) {
          if (typeof onComplete === 'function') {
            onComplete.call(scope, info.UserData);
          }
        } else {
          if (typeof onError === 'function') {
            onError.call(scope);
          }
        }
      };
      var errorCallback = function() {
        if (this.isAbort) {
          if (typeof onAbort === 'function') {
            onAbort.call(scope);
          }
          this.isAbort = false;
          return;
        }
        if (typeof onError === 'function') {
          onError.apply(scope, arguments);
        }
      };
      var params = this.getParam();
      params.head = Lite.HeadStore.get() || {};
      params.contentType = this.contentType;
      return this.ajax = cAjax.jsonp(url, params, successCallback, errorCallback,this.timeout);
    };
    return userModel;
  };
  Lite.NotUserLoginModel = function(suc,err,scope){
    var url = 'https://' + utils.getDomain() + "/html5/Account/NonUserLogin";
    var opts = {
      method:"get",
      timeout:25000
    }
    var successCallback = function(data) {
      if (data.ServerCode == 1 && data.Data) {
        Lite.UserStore.setUser(data.Data);

        if (typeof suc === 'function') {
          suc.call(scope || this, data);
        }
      } else {
        if (typeof err === 'function') {
          err.call(scope || this);
        }
      }
    };

    var errorCallback = function() {
      if (typeof err === 'function') {
        err.apply(scope || this, arguments);
      }
    };
    return this.ajax = cAjax.cros(url, opts.method, {}, successCallback, errorCallback,opts.timeout);
  };
  function _getUrl(url){
    var path = '/restapi/soa2/',
      domain = utils.getDomain(),
      protocal = (window.location.protocol.indexOf("https") > -1) ? "https" : "http",
      url = [protocal,'://',domain,path,url].join("");
    return url;
  }
  Lite.ClientIdModel = function(){
    var url = _getUrl('10290/createclientid');
    var clientModel = Lite.Model(
      {
        url:url,
        checkAuth:false,
        method:"get",
        param:{'systemcode': "09",createtype:3}
      });
    return clientModel;
  };
  Lite.ThirdPartModel = function(){
    var url = _getUrl('10448/GetThirdPartMembers.json');
    var thirdPartModel = Lite.Model(
      {
        url:url,
        checkAuth:false
      });
    return thirdPartModel;
  };
  Lite.Store = function(options){
    if(!options || (options && !options.key)){
      return;
    }
    var storeObj = utils.extend(true,new AbsStore(),options);
    if(options && options.defaultData ){
      var dataNow = storeObj.sProxy.getItem(storeObj.key);
      if(!dataNow){
        storeObj.set(options.defaultData);
      }
    }
    return storeObj;
  };
  Lite.HeadStore = (function(){
    var headStore = {
      key:"HEADSTORE",
      lifeTime:"15D",
      defaultData : {
        "cid": utils.getGuid(),
        "ctok": "",
        "cver": "1.0",
        "lang": "01",
        "sid": "8888",
        "syscode": '09',
        "auth": ""
      },
      setAuth:function (auth) {
        this.setAttr('auth', auth);
      }
    };
    return Lite.Store(headStore);
  })();
  Lite.UserStore = (function(){
    var userStore = {
      key:"USER",
      lifeTime:"90D",
      getUser: function () {
        return this.get();
      },
      setUser:function(info){
        this.set(info);
        this.oldSet(info,"USERINFO");
      },
      isLogin: function () {
        var user = this.getUser();
        return user && !!user.Auth && !user.IsNonUser;
      },
      getUserName: function () {
        var user = this.getUser();
        return user && user.UserName; //add by byl 此处支持localstorage中的user信息被删除
      },
      getUserId: function () {
        var user = this.getUser() || {};
        return user.UserID || utils.getGuid();
      },
      getAuth: function () {
        var userinfo = this.getUser();
        return userinfo && userinfo.Auth;
      },
      isNonUser: function () {
        var user = this.getUser();
        return user && !!user.IsNonUser;
      },
      removeUser: function () {
        this.sProxy.removeItem('USER');
      },
      setThirdParts:function(membersInfo){
        var isLogin = this.isLogin(),
          userinfo = this.getUser() || {};
        //此过程中如果退出登录的话，不写入第三方用户信息
        if(!isLogin || !membersInfo){
          return;
        }
        userinfo.thirdParts = membersInfo;
        this.setUser(userinfo);
      },
      setThirdPartsNon:function(){
        var isLogin = this.isLogin(),
          userinfo = this.getUser() || {};
        //此过程中如果退出登录的话，不写入第三方用户信息
        if(!isLogin){
          return;
        }
        userinfo.thirdParts = "";
        this.setUser(userinfo);
      }
    }
    return Lite.Store(userStore);
  })();
  Lite.Member = new Member();
  Lite.Utils = utils;

  (function(){
    var url =  window.location.href;
    var shortToken = utils.getUrlParam(url, 'GetUserInfos'),
      thirdPartMember =  utils.getUrlParam(url, '__ThirdPartMember__');

    var sucCb = function (data) {
      if(data.UserID){
        data.LoginName = data.LoginName || "";
        if(data.ResponseStatus){
          delete data.ResponseStatus;
          delete data.Result;
        }
        data.Auth = data.Auth ? data.Auth : cookieAuth;
        Lite.UserStore.setUser(data);
        Lite.HeadStore.setAuth(data.Auth);
      }
      getThirdParts();
    };
    //获取用户信息成功回调
    var errCb = function () {
      //self.memberLogin();
    };
    if(shortToken){
      Lite.UserStore.removeUser();
      var userModel = Lite.UserModel(shortToken);
      userModel.execute(sucCb,errCb);
    }
    if(!shortToken && thirdPartMember){
      //获取第三方信息
      getThirdParts();
    }
    //检查clientId
    getClientId();
    //获得新的clientId
    function getClientId(){
      var cookieCid = utils.getCookie("GUID"),
        ls = window.localStorage,
        cid = ls.getItem("GUID");
      //如果cid不存在或者是老的cid格式,发起查询服务
      var clientModel = Lite.ClientIdModel();
      if(!cookieCid && (!cid || cid.indexOf('-')>-1)){
        //如果CID存在,此时应为一个老格式,做一个备份
        if(cid){
          ls.setItem('BGUID',cid);
          clientModel.setParam("PreviousID",cid);
        }
        clientModel.execute(function (data) {
          if(data && data.ClientID){
            ls.setItem('GUID',data.ClientID);
            Lite.HeadStore.setAttr('cid',data.ClientID);
            utils.setCookie("GUID",data.ClientID,new Date(new Date().getTime()+3*360*24*60*60*1000),"/",".ctrip.com");
          }
        });
      }else {
        if(!cookieCid){
          //cookie中没有，但是localStorage中有，须写入cookie中,，默认存储三年时间
          utils.setCookie("GUID",cid,new Date(new Date().getTime()+3*360*24*60*60*1000),"/",".ctrip.com");
        }
      }
    }
    function getThirdParts(){
      var thirdPartModel = Lite.ThirdPartModel();
      var sucFun = function(data){
        if(data.Members && data.Members.length > 0 ){
          //将信息写到缓存中
          Lite.UserStore.setThirdParts(data.Members);
        }else{
          //如果查询到的数据没有第三方绑定帐号,置空
          Lite.UserStore.setThirdPartsNon();
        }
      };
      var errFun = function(data){
        //暂不做处理
        console.log(data);
      };
      thirdPartModel.execute(sucFun,errFun);
    }
  })();

  if ( typeof module != 'undefined' && module.exports ) {
    module.exports = Lite;
  } else {
    window.LizardLite = Lite;
  }
})(window,document);