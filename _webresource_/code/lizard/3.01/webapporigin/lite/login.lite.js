/**
 * Created by bianyl on 2015/12/1.
 */
(function(window){
  var isArray = Array.isArray ||
    function(object){ return object instanceof Array };
  var emptyArray = [], slice = emptyArray.slice;
  var  class2type = {},toString = class2type.toString;
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
  var util = {};
  util.$ = (function(){
    var $ ={};
    $.extend = function(target){
      var deep, args = slice.call(arguments, 1);
      if (typeof target == 'boolean') {
        deep = target
        target = args.shift()
      }
      args.forEach(function(arg){ extend(target, arg, deep) });
      return target;
    };
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
      var context = settings.context;
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
      };

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
      var settings = $.extend({}, options || {}),
        deferred = $.Deferred && $.Deferred();
      for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

      ajaxStart(settings);

      if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
      RegExp.$2 != window.location.host;

      if (!settings.url) settings.url = window.location.toString();
      serializeData(settings);

      var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url)
      if (hasPlaceholder) dataType = 'jsonp';

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
      };

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
    };
    return $;
  })();

  //isUrl
  util.isUrl = function (target) {
    return /^http(s)?:\/\/[A-Za-z0-9\-]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\:+!]*([^<>])*$/.test(target);
  };
  util.getUrlParam = function (url, name) {
    var re = new RegExp("(\\?|&)" + name + "=([^&]+)(&|$)", "i"), m = url.match(re);
    return m ? m[2] : "";
  };
  util.parseUrl = function (url) {
    var urlParseRE = /^\s*(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/;
    var matches = urlParseRE.exec(url || "") || [];
    return {
      href        : matches[0] || "",
      hrefNoHash  : matches[1] || "",
      hrefNoSearch: matches[2] || "",
      domain      : matches[3] || "",
      protocol    : matches[4] || "",
      doubleSlash : matches[5] || "",
      authority   : matches[6] || "",
      username    : matches[8] || "",
      password    : matches[9] || "",
      host        : matches[10] || "",
      hostname    : matches[11] || "",
      port        : matches[12] || "",
      pathname    : matches[13] || "",
      directory   : matches[14] || "",
      filename    : matches[15] || "",
      search      : matches[16] || "",
      hash        : matches[17] || ""
    };
  };
  util.jump = function(url){
    window.location = url;
  };

  var Crypt = {};
  if(typeof btoa == 'function'){
    Crypt.Base64 = {};
    Crypt.Base64.encode = function(str){
      var ret=encodeURIComponent(str);
      ret=ret.replace(/%([0-9A-F]{2})/g,function(a,b){
        return String.fromCharCode('0x'+b);
      });
      ret=btoa(ret);
      return ret;
    };
    Crypt.Base64.decode = function(str){
      var ret=atob(str);
      ret=ret.replace(/[\u0080-\u00FF]/g,function(a){
        return '%'+a.charCodeAt(0).toString(16).toUpperCase();
      });
      ret=decodeURIComponent(ret);
      return ret;
    }
  }else{
    //dowcument.write一个单独的js文件
    document.write("//webresource.c-ctrip.com/code/lizard/2.2/web/cryptBase64.min.js");
  }

  util.Crypt = Crypt;

  window.liteUtil = util;
})(window);