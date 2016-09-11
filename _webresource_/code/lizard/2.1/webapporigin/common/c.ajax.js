/**
 * 封装常用的Ajax 访问
 * @namespace cAjax
 * @author shbzhang@ctrip.com
 * @date 2013年6月23日
 */
define(['libs', 'cUtilPerformance'], function (libs, cperformance) {
  //为兼容lizard2.0, json去掉charset=utf-8 
  var contentTypeMap = {
    'json': 'application/json',
    'jsonp': 'application/json'
  };
  //http://apiproxy.ctrip.com    AffliationGateway
  //http://bridge.soa.uat.qa.nt.ctripcorp.com   BridgeGateway
  //http://openservice.ctrip.com
  //https://sopenservice.ctrip.com  市场营销Gateway
  //http://openserviceauth.ctrip.com
  //http://gateway.xbooking.ctrip.com  XBookingGateway
  //https://gateway.secure.fws.qa.nt.ctripcorp.com/
  //http://gateway.secure.uat.qa.nt.ctripcorp.com/

  var getWayDomains = [
    "m.ctrip.com",
    "sec-m.ctrip.com",
    "gateway.secure.ctrip.com",
    "gateway.m.uat.qa.nt.ctripcorp.com", //uat测试环境
    "gateway.m.fws.qa.nt.ctripcorp.com",
    "gateway.secure.fws.qa.nt.ctripcorp.com",
    "gateway.secure.uat.qa.nt.ctripcorp.com"
  ];

  var _getContentType = function (contentType) {
    if (contentType) {
      contentType = contentTypeMap[contentType] ? contentTypeMap[contentType] : contentType;
    }
    return contentType;
  };


  /**
   *  AJAX GET方式访问接口
   * @method cAjax.get
   * @param {string} url 请求的url
   * @param {object} data json格式的数据
   * @param {function} successCallback 成功回调
   * @param {function} [errorCallback] 错误回调
   * @param {number} [timeout=30000] 超时时间
   * @returns {XMLHttpRequest} XMLHttpRequest ajax句柄
   */
  function get(url, data, callback, error, timeout) {
    var opt = _getCommonOpt(url, data, callback, error);
    opt.type = 'GET';
    opt.timeout = timeout;
    return _sendReq(opt);
  }


  /**
   * AJAX POST方式访问接口
   * @method cAjax.post
   * @param {string} url 请求的url
   * @param {object} data json格式的数据
   * @param {function} successCallback 成功回调
   * @param {function} [errorCallback] 错误回调
   * @param {number} [timeout=30000] 超时时间
   * @returns {XMLHttpRequest} XMLHttpRequest ajax句柄
   */
  function post(url, data, callback, error,timout) {
    var contentType = data.contentType;
    // data = JSON.stringify(data);
    data = JSON.stringify(data);
    var opt = _getCommonOpt(url, data, callback, error);
    opt.type = 'POST';
    opt.dataType = 'json';
    opt.timeout = timout;
    opt.contentType = _getContentType(contentType) || 'application/json';
    return _sendReq(opt);
  }


  /**
   * 以JSONP方式跨域访问外部接口
   * @method cAjax.jsonp
   * @param {string} url 请求的url
   * @param {object} data json格式的数据
   * @param {function} successCallback 成功回调
   * @param {function} [errorCallback] 错误回调
   * @param {number} [timeout=30000] 超时时间
   * @returns {XMLHttpRequest} XMLHttpRequest ajax句柄
   */
  function jsonp(url, data, callback, error,timeout) {
    var opt = _getCommonOpt(url, data, callback, error);
    opt.type = 'GET';
    opt.dataType = 'jsonp';
    opt.crossDomain = true;
    opt.timeout = timeout;
    return _sendReq(opt);
  }


  /**
   * Cros方法提交Ajax请求
   * @method cAjax.cros
   * @param {string} url 请求的url
   * @param {string} [type=POST] 请求提交方式 POST|GET
   * @param {object} data json格式的数据
   * @param {function} successCallback 成功回调
   * @param {function} [errorCallback] 错误回调
   * @param {number} [timeout=30000] 超时时间
   * @returns {XMLHttpRequest} XMLHttpRequest ajax句柄
   */
  function cros(url, type, data, callback, error,timeout) {
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
    /* if (window.XDomainRequest) {
     return _iecros(opt);
     } else {*/
    return _sendReq(opt);
    //}
  }

  /**
   * AJAX 提交表单,不能跨域
   * @method cAjax.form
   * @param {url} url
   * @param {Object} form 可以是dom对象，dom id 或者jquery 对象
   * @param {function} callback 回调
   * @param {function} error 可选
   */
  function form(url, formdata, callback, error) {
    var jdom = null, data = '';
    if (typeof formdata == 'string') {
      jdom = $('#' + formdata);
    } else {
      jdom = $(formdata);
    }
    if (jdom && jdom.length > 0) {
      data = jdom.serialize();
    }
    var opt = _getCommonOpt(url, data, callback, error);
    return _sendReq(opt);
  }

  function _sendReq(opt) {
    var uuidXhrSend = cperformance.getUuid();
    cperformance.group(uuidXhrSend, {
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
      timeout: opt.timeout || Lizard.timeout || 50000,

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
        cperformance.log({
          name: 'AjaxMessageSize',
          // contentEncoding: xhr && typeof xhr.getResponseHeader == 'function' ? xhr.getResponseHeader('content-encoding') : undefined, // 确保不要报错
          url: opt.url
        }, loadedLength);
        cperformance.performance[uuidXhrSend].status = "success";
        cperformance.groupEnd(uuidXhrSend);
        opt.callback(res);
      },
      error: function (err, status) {
        if (status !== 'abort') {
          cperformance.performance[uuidXhrSend].status = "fail";
          cperformance.groupEnd(uuidXhrSend);
        }
        if (opt.error) {
          opt.error(err);
        }
      }
    };
    //是否是跨域则加上这条， 跨协议时，也是跨域请求
    if (opt.url.indexOf(window.location.host) === -1 || opt.url.indexOf(window.location.protocol) === -1) {
      obj.crossDomain = !!opt.crossDomain;
    }
    try{
      var origin = window.location.origin;
      if(!origin){
        origin = window.location.protocol + "//"+window.location.host;
      }
      var arr = opt.url.match(/^\s*(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/)||[];
      var containsDomain = false;
      for(var i=0;i<getWayDomains.length;i++){
        if(arr[10] == getWayDomains[i]){
          containsDomain = true;
        }
      }
      //添加bu开关控制，默认是关闭的，使用时需要打开
      if(/^https?/.test(origin) && (arr[2] && arr[2].indexOf(origin) === -1) && !(Lizard.app.vendor.is('CTRIP')) && containsDomain  && opt.dataType != "jsonp"){
        obj.beforeSend=function (xhr) {
          try{
            xhr.setRequestHeader("cookieOrigin", origin);
            xhr.onprogress = function (event) {
              loadedLength = event.loaded ? event.loaded : event.position;
            };
          }catch(e){

          }
        };
        obj.xhrFields = {withCredentials: true};
      }
    }catch(e){}
    return $.ajax(obj);
  }

  /**
   * ie 调用 crors
   */
  function _iecros(opt) {
    if (window.XDomainRequest) {
      var xdr = new XDomainRequest();
      if (xdr) {
        if (opt.error && typeof opt.error == "function") {
          xdr.onerror = function () {
            opt.error();
          };
        }
        //handle timeout callback function
        if (opt.timeout && typeof opt.timeout == "function") {
          xdr.ontimeout = function () {
            opt.timeout();
          };
        }
        //handle success callback function
        if (opt.success && typeof opt.success == "function") {
          xdr.onload = function () {
            if (opt.dataType) {//handle json formart data
              if (opt.dataType.toLowerCase() == "json") {
                opt.callback(JSON.parse(xdr.responseText));
              }
            } else {
              opt.callback(xdr.responseText);
            }
          };
        }

        //wrap param to send
        var data = "";
        if (opt.type == "POST") {
          data = opt.data;
        } else {
          data = $.param(opt.data);
        }
        xdr.open(opt.type, opt.url);
        xdr.send(data);
      }
    }
  }

  function _getCommonOpt(url, data, callback, error) {
    return {
      url: url,
      data: data,
      callback: callback,
      error: error
    };
  }

  return {
    get: get,
    post: post,
    jsonp: jsonp,
    cros: cros,
    form: form
  };
});