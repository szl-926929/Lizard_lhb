/**
 * @File c.util.common.js
 * @Description: 常用工具方法
 * @author shbzhang@ctrip.com
 * @date 2014-09-24 11:06:12
 * @version V1.0
 */

/**
 * 推荐用cUtilCommon代替，此命名空间已不推荐使用
 * @namespace Util.cUtility
 * @deprecated
 */

/**
 * 常用的Util方法类，兼用了2.0之前版本的cUtility命名空间，但已不推荐引用老的命名空间
 * @namespace Util.cUtilCommon
 * @alias cUtility
 */
define(['cUtilDate','cUtilPath'],function (cDate,cPath) {
  var Util = {};

  /**
   * cUtilDate 类型
   * @var Util.cUtilCommon.Date
   */
  Util.Date = cDate;
  /**
    * 获取服务端时间，cUtilDate.getServerDate快捷方式
    * @method Util.cUtilCommon.getServerDate
    * @param {function} [callback]
    * @returns {date} date 服务器时间
    */
  Util.getServerDate = cDate.getServerDate;
  /**
   * 是否在app中打开，app
   * @static
   * @var Util.cUtilCommon.isInApp
   * @type {boolean}
   */
  Util.isInApp = Lizard.isHybrid;

  /**
   * 浏览器是否支持pushState方法
   * @var Util.cUtilCommon.isSupportPushState
   * @type {boolean}
   */
  Util.isSupportPushState = (function () {
    //如果是hybrid则走hashchange,不走pushstate
    if (Lizard.isHybrid){
    		return false;
    	}
    // return false;
    return !!(window.history && window.history.pushState && window.history.replaceState);
  })();

  /**
   * 是否为隐私模式
   * @var Util.cUtilCommon.isPrivateModel
   * @type {boolean}
   */
  Util.isPrivateModel = (function(){
    var testKey = "TEST_PRIVATE_MODEL",
      storage = window.localStorage;

    try{
      storage.setItem(testKey,1);
      storage.removeItem(testKey);
    }catch(e){
      return true;
    }
    return false;
  })();

  /**
   * 是否外链
   * @method Util.cUtilCommon.isSupportPushState
   * @param {string} url url链接
   * @returns {boolean}
   */
  Util.isExternalLink = function (url) {
    var RegH5NewType = new RegExp(/^mailto:|^tel:|^javascript:/);
    return RegH5NewType.test(url);
  };


  /**
   * 通过一个url唤醒app
   * @method Util.cUtilCommon.weakUpApp
   * @param {string} url 唤醒url，如ctripwireless://hoteml;
   */
  Util.weakUpApp =function (url) {
    var iframe = document.createElement('iframe');
    iframe.height = 1;
    iframe.width = 1;
    iframe.frameBorder = 0;
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.top = '-9999px';
    document.body.appendChild(iframe);

    Util.weakUpApp = function (url) {
      iframe.src = url;
    };

    Util.weakUpApp(url);
  };

  /**
   * 每次调用生成一个GUID随意数 格式为f5b6bfaa-09ec-6bdd-2c81-c1f435dca270
   * @method Util.cUtilCommon.createGuid
   * @return {String} GUID 唯一标示
   */
  Util.createGuid = function () {
    function S1() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(4);
    }
    function newGuid() {
      var guid = "";
      for(var i=1;i<=20;i++){
        guid += S1();
        if(i===8 || i ===12 || i ===16 || i ===20 ){
          guid += "-";
        }
      }
      var num = parseInt(8*Math.random());
      var date = new Date().getTime()+'';
      guid += date.slice(0,num);
      for(var j=0;j<4;j++){
        guid += S1();
      }
      guid += date.slice(num+5,13);
      return guid;
    }
    return newGuid();
  };

  /**
   * 优先从cookie中取
   * 返回GUID，与createGuid不同的是，会首先检查LocalStorage中的值
   * @method Util.cUtilCommon.getGuid
   * @returns {string} GUID 唯一标示
   */
  Util.getGuid = function () {
    var guid = Util.getCookie("GUID");
    var ws = window.localStorage;
    if(!guid){
      guid = ws.getItem('GUID') || '';
    }else{
      try{
        ws.setItem('GUID',guid);
      } catch (e){

      }
    }

   /* if (!guid) {
      guid = Util.createGuid();
      try {
        ws.setItem('GUID', guid);
      } catch (e) {
      }
    }*/
    return guid;
  };
  /**
   * 获取cookie中的值
   */
  Util.getCookie = function(key){
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
   * 返回是否为android平台
   * @var Util.cUtilCommon.isAndroid
   * @type {boolean}
   */
  Util.isAndroid = (function () {
    return $.os['android'];
  })();

  /**
   * 返回是否为iPhone平台
   * @var Util.cUtilCommon.isIPhone
   * @type {boolean}
   */
  Util.isIphone = (function () {
    return $.os['iphone'];
  })();

  /**
   * 返回是否为iPad平台
   * @var Util.cUtilCommon.isIpad
   * @type {boolean}
   */
  Util.isIpad = (function () {
    return $.os['ipad'];
  })();

  /**
   * 返回是否为Window Phone平台
   * @var Util.cUtilCommon.isWPhone
   * @type {boolean}
   */
  Util.isWPhone = (function () {
    return window.navigator.userAgent.indexOf('Windows Phone') > 1;
  })();

  Util.isUrl = function (url) {
    return /^http(s)?:\/\/[A-Za-z0-9\-]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\:+!]*([^<>])*$/.test(url);
  };

  /**
   * 高德地图转百度地图
   * @param lng
   * @param lat
   * @returns {{lng: number, lat: number}}
   */
  Util.aMapToBMap = function(lng,lat){
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    var x = lng,y=lat;
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
    var  theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
    return {
      lng:z * Math.cos(theta) + 0.0065,
      lat:z * Math.sin(theta) + 0.006
    };
  };

  /**
   * 百度地图转高德地图
   * @param lng
   * @param lat
   * @returns {{lng: number, lat: number}}
   */
  Util.bMapToAMap = function(lng,lat){
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    var x = lng - 0.0065,
      y = lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    var  theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    return {
      lng : z * Math.cos(theta),
      lat : z * Math.sin(theta)
    };
  };

  /**
   * 判断是否跨域
   * @param url
   */
  Util.isCrossDomain = function(url){
    var origin  = window.location.origin;
    if(!origin){
      origin = window.location.protocol + "//"+window.location.host;
    }
    if(!/^https?/.test(origin)){  //非http或者https协议，按照非跨域处理
      return false;
    }
    var reg = /https?:\/\/(.+?)\.com/i;
    var regRes = url.match(reg);
    if(regRes){
      if(origin == regRes[0]){
        return false;
      }else{
        return origin;
      }
    }else{
      return false;
    }
  };
  /**
   * 过滤替换文本中的协议
   * @param content
   * @param hosts
   * @returns {*}
   */
  Util.protocolFilter=function(content,hosts){
    if(!content){
      return;
    }
    if(typeof  content == "object"){
      try{
        content = JSON.stringify(content);
      }catch(e){
        return content;
      }
    }
    var protocol ;
    if(window.location && window.location.protocol){
      if(window.location.protocol == "https:"){
        protocol =  "https";
      }else{
        protocol =  "http";
      }
    }
    if(typeof  hosts == "string"){
      hosts = [hosts];
    }
    hosts = hosts || [];
    var regs = [];
    if(hosts && hosts.length){
      for (var i = 0; i < hosts.length; i++) {
        regs.push(new RegExp('([\'\"])\\s*(http:)*\/\/' + hosts[i],"gi"));
      }
    }else{
      regs.push(new RegExp('([\'\"])\\s*(http:)*\/\/',"gi"));
    }
    function replaceMatch(match,$1,$2){
      if($2){
        match = match.replace($2,protocol + ":");
      }else{
        match = match.replace("//",protocol+"://");
      }
      return match;
    }
    for(var j=0;j<regs.length;j++){
      content = content.replace(regs[j],replaceMatch);
    }
    return content;
  };

  /**
   * 判断hybrid下是否使用tcp发送请求
   * @returns {*}
   */
  Util.isUseSOTPSendHTTPRequest = function(){
    var ws = window.localStorage;
    try{
      return ws.getItem("isUseSOTPSendHTTPRequest");
    }catch(e){

    }
    return false;
  };

  /**
   * 判断一个url是否是soa2.0的请求
   * @param url
   */
  Util.isSOA2Request = function(url){
    if(!url){
      return false;
    }
    var urlObj = cPath.parseUrl(url);
    var hrefNoSearch = urlObj.hrefNoSearch;
    if(hrefNoSearch && hrefNoSearch.indexOf("restapi/soa2") != -1){
      return true;
    }
    return false;
  };

  /**
   * 判断是否支持webp
   * @param callback
   */
  Util.supportWebP = function(callback){
    if(window.supportWebP){
      callback && callback(!!window.supportWebP);// jshint ignore:line
      return;
    }
    var WebP = new Image();
    WebP.onload = WebP.onerror = function(){
      window.supportWebP = !!(WebP.height == 1); // jshint ignore:line
      callback && callback(!!window.supportWebP);// jshint ignore:line
    };
    WebP.src = "data:image/webp;base64,UklGRiYAAABXRUJQVlA4IBoAAAAwAQCdASoBAAEAAAAMJaQAA3AA/v89WAAAAA==";
  };
  /**
   * img url转webp
   * @param url
   * @returns {*}
   */
  Util.formatImgUrl = function(url){
    var urlObj = cPath.parseUrl(url);
    var domain = urlObj.domain;
    var hrefNoSearch = urlObj.hrefNoSearch;
    var search = urlObj.search;
    var regImg = /\.(png|jpg|jpeg)/ig;//后缀匹配，PNG,JPG,JPEG
    if(domain && isContainsDomain(domain) && regImg.test(hrefNoSearch)){// jshint ignore:line
      //不管什么环境，只要支持webP，直接返回webP图片
      if(window.supportWebP){
        var webPUrl = hrefNoSearch + "_.webp" + (search ? search : "");
        return webPUrl;
      }
      if(!Lizard.app.vendor.is('CTRIP') && !Lizard.isHybrid ){ //h5情况下
        return url;
      }else{
        //hybrid下处理
        return url;
      }
    }else{
      return url;
    }
    //域名匹配
    function isContainsDomain(dmn){
      if(!dmn){
        return false;
      }
      if(dmn.indexOf("images4.c-ctrip.com") != -1){
        return true;
      }
      var reg = /dimg([0-1][0-9]|20)\.c\-ctrip\.com/gi;
      return reg.test(dmn);
    }
  };
  return Util;
});
