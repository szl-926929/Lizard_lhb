/**
 * Created by jp_wang on 2016/3/22.
 */

define('text!template/collect.html', function() {
  return function() {
    var __p = '<div class="cp-h5-main"><div class="cui-view cui-layer cui-alert cp-h5-collect" id="cui-1415327286173" style="margin-left:-150px;margin-top:-137px;z-index:10000;width:auto"><div class="cui-pop-box group-select-modal"><div class="cui-hd group-select-hd"><i class="i-select-success"></i>收藏成功<i class="i-close"></i></div><div class="cui-bd"><p class="groupText">分组到：</p><ul class="pop-group-list"></ul><div class="cp-newGroupBtn"><i class="i-plus"></i>新分组</div></div></div></div><div class="cui-view cui-layer cui-alert cp-h5-newGroup" id="cui-1415327286173" style="margin-left:-141px;margin-top:-79px;z-index:10000;width:auto;display:none"><div class="cui-pop-box"><div class="cui-bd"><div class="cui-error-tips"><p style="padding-bottom:10px;font-weight:bold">新建分组</p><input type="text" placeholder="分组名称" class="group-new-input"><i class="group-clear-val" style="display:none;position:absolute;background-color:#ccc;font-size:18px;height:18px;width:18px;right:32px;top:63px;border-radius:11px;line-height:18px;text-align:center;color:#fff">×</i></div><div class="cui-roller-btns"><div class="cui-flexbd cui-btns-cancel">取消</div><div class="cui-flexbd cui-btns-sure">确认</div></div></div></div></div><div class="cui-view cui-mask cui-opacitymask cp-h5-mask" id="cui-1415327286174" style="position:fixed;left:0;top:0;width:100%;height:100%;z-index:9999"></div><div class="cp-h5-collect-toast" style="left:50%;margin-left:-130px;visibility:visible;z-index:113003;top:50%;position:fixed;display:none"><div style="width:220px;line-height:24px;border-radius:5px;background:rgba(0,0,0,.7);padding:10px 15px;color:#fff;font-weight:700;text-align:center;word-break:break-all"><div class="cui-layer-content"></div></div></div></div>';
    return __p;
  };
});
define('class', function (){

  var $Class = function ( parent ){

    var _class = function (){
      this.init.apply( this, arguments );
    };

    if( parent ){
      var subClass = function (){};
      subClass.prototype = parent.prototype;
      _class.prototype = new subClass(); // jshint ignore:line
    }

    //_class.prototype.constructor = _class;

    _class.prototype.init = function (){};

    _class.fn = _class.prototype;

    _class.fn.parent = _class;

    _class._super = _class.__proto__;// jshint ignore:line

    _class.extend = function ( obj ){

      var extended = obj['extended'];

      for( var i in obj ){
        _class[ i ] = obj[ i ];
      }

      if( extended ){ extended( _class );}
    };

    _class.include = function ( obj ){

      var included = obj['included'];

      for( var i in obj ){
        _class.fn[ i ] = obj[ i ];
      }

      if( included ) {included( _class );}
    };

    return _class;
  };

  return $Class;
});
define('base', ['class'],function ( $class ){

  var Base = new $class; // jshint ignore:line

  var classToType = {},
    toString = classToType.toString;

  "Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function ( el ){
    classToType[ "[object " + el + "]" ] = el.toLowerCase();
  });

  var isType = function ( obj ){
    return obj === null ? String(obj) :
      classToType[toString.call(obj)] || "object";
  };

  Base.extend({
    init : function (){},
    isPreProduction : function (){
      return localStorage.getItem( "isPreProduction" );
    }, //hybrid环境
    isObject : function ( el ){
      return isType( el ) == "object";
    },
    isBool : function ( el ){
      return isType( el ) == "boolean";
    },
    isNumeric : function ( num ){
      return typeof num == "number" && !isNaN( num ) && isFinite( num );
    },
    isArray : Array.isArray || function ( object ){
      return object instanceof Array;
    },
    has : function ( el ){
      return Array.isArray( el ) ? el.length > 0 : $(el) && $(el).length > 0;
    },
    //aka : Object.keys
    keys : function( obj ) {
      var a = [];
      for(a[a.length] in obj); // jshint ignore:line
      return a; //虽然功能没问题，但是不建议这样写
    },
    //aka : _.values
    values : function ( obj ){
      var keys = this.keys(obj);
      var length = keys.length;
      var values = new Array(length);
      for (var i = 0; i < length; i++) {
        values[i] = obj[keys[i]];
      }
      return values;
    },
    //数组去重
    unique : function ( array ){
      var n = {},r=[];
      for(var i = 0; i < array.length; i++) {
        if (!n[array[i]]) {
          n[array[i]] = true;
          r.push(array[i]);
        }
      }
      return r;
    },
    isPC : function() {
      var useragent = navigator.userAgent;
      var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod", "BB10", "PlayBook", "Macintosh", "KFAPWI", "KFTHWI"];
      var isPC = true;
      for (var v = 0; v < Agents.length; v++) {
        if (useragent.indexOf(Agents[v]) > 0) {
          isPC = false;
          break;
        }
      }
      return isPC;
    },
    isIOS : function (){
      var _ua = navigator.userAgent;
      return /iPhone|iPad|Mac OS X/g.test( _ua ) && _ua.indexOf("Safari") > -1;
    },
    isInApp : function (){
      var useragent = navigator.userAgent, bInApp = false;
      var data = window.localStorage.getItem('isInApp') || window.localStorage.getItem('ISINAPP');
      if (useragent.indexOf('CtripWireless') > -1) {
        bInApp = true;
      }
      if (data) {
        bInApp = data == '1';
      }
      return bInApp;
    },

    getURLParameter : function ( param ) {
      var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)", "i");
      var r = location.search.substr(1).match(reg);
      if (r !== null) {
        return unescape(decodeURI(r[2]));
      }
      return null;
    },

    deviceEnv : function () {
      var ua = navigator.userAgent;
      var padRegex = /ipad|android/i;
      var isOnline = !this.isInApp() && !padRegex.test(ua) && $(window).width() > 767;
      var isPadApp = ua.match(/Ctrip_Pad_App/i);
      var rv;

      if (isOnline) {
        rv = 0;
      }
      else if (isPadApp) {
        rv = 10;
      }
      else if (padRegex.test(ua) && $(window).width() > 767) {
        rv = 11;
      }
      else if (this.isInApp() && $(window).width() < 768) {
        rv = 20;
      }
      else{
        rv = 21;
      }

      return rv;
    },
    parent : function ( el ){
      return $((el && typeof el === "string" && /(\.|#)(\w|-)+/.test( el )) ? el : "#main" );
    },
    getHeadStore : function (){
      var headStore = localStorage.getItem( "HEADSTORE" );
      return headStore && JSON.parse( headStore );
    },
    isLogin : function() {
      var _userInfo = localStorage.getItem('USER');
      var userInfo = (_userInfo && JSON.parse( _userInfo )) || null,
        now = +new Date(),
        timeOut;
      if (!userInfo || !userInfo.value || !userInfo.value.Auth || !userInfo.timeout) {
        return false;
      }
      /*验证是否过期*/
      if (userInfo && userInfo.timeout) {
        timeOut = +new Date(userInfo.timeout.replace(/-/g, "/"));
        return timeOut - now >= 0;
      }
    },
    loginAction : function() {
      var host = window.location.host;
      var domain = "accounts.ctrip.com";
      var LINKS = 'https://' + domain + '/H5Login/#login';

      if (host.match(/^m\.ctrip\.com/i)) {
        domain = "accounts.ctrip.com";
      } else if (host.match(/\.uat\.qa/i)) {
        domain = "accounts.uat.qa.nt.ctripcorp.com";
      } else if (host.match(/\.fat/i) || host.match(/\.fws/i) || host.match(/^(localhost|172\.16|127\.0)/i)) {
        domain = "accounts.fat49.qa.nt.ctripcorp.com";
      }
      window.location.href = LINKS;
    },
    getEnv : function () {
      if (this.isInApp()) {
        if (this.isPreProduction() == '1') { // 定义堡垒环境
          return "baolei";
        }
        else if (this.isPreProduction() == '0') { // 定义测试环境
          return "test";
        }
        else if (this.isPreProduction() == '2') { // 定义UAT环境
          return "uat";
        }
        else {
          return "pro";
        }
      }
      else {
        var host = location && location.hostname;
        if (host.match(/^(localhost|172\.16|127\.0)/i)) {
          return "local";
        }
        else if (host.match(/m\.fat\d*\.qa\.nt\.ctripcorp\.com|^210\.13\.100\.191/i)) {
          return "test";
        }
        else if (host.match(/m\.uat\.qa\.nt\.ctripcorp\.com/i)) {
          return "uat";
        }
        else if (host.match(/^10\.8\.2\.111/i) || host.match(/^10\.8\.5\.10/i)) {
          return "baolei";
        }
        else {
          return "pro";
        }
      }
    },
    loadStyle : function (){
      if( this.getEnv() === "local" && location.href.indexOf("?test=cPublic") > -1 ){
        return !this.has("#cpH5MainCss") ? '<link href="n_main.css" type="text/css" rel="stylesheet" id="cpH5MainCss"/>' : "";
      }else{
        if( this.isInApp() && location.protocol == "file:" ){
          return !this.has("#cpH5MainCss") ? '<link href="../lizard/webresource/styles/h5/common/n_main.css" type="text/css" rel="stylesheet" id="cpH5MainCss"/>' : "";
        }else{
          var str = location.protocol + "//webresource.c-ctrip.com/styles/h5/common/n_main.css";
          return !this.has("#cpH5MainCss") ? "<link href='"+ str +"' type='text/css' rel='stylesheet' id='cpH5MainCss' />" : "";
        }
      }
    },
    getProtocol : function (){
      var _protocol = location.protocol && location.protocol.slice( 0, -1 ),
        protocol = _protocol !== "file" ? _protocol : "http";
      return protocol;
    },
    getMethod : function (){
      return this.getProtocol() === "http" ? "gateway" : "common";
    },
    prompt : function ( val ){
      var toast = $(".cp-h5-collect-toast"),
        $has = !toast.html();
      if( $has ){
        toast = $('<div class=cp-h5-collect-toast style="left:50%; margin-left:-130px; visibility: visible; z-index: 113003; top: 50%; position: fixed; display: none;"><div style="width: 220px; line-height: 24px; border-radius: 5px; background: rgba(0,0,0,.7); padding: 10px 15px; color: #fff; font-weight: 700; text-align: center; word-break: break-all;"><div class=cui-layer-content></div></div></div>');
        $("body").append(toast);
      }
      toast.show().find(".cui-layer-content").html( val );
      setTimeout(function (){
        toast[$has?'remove':'hide']();
      },2000);
    },
    //事件代理
    delegate : function ( maps ){
      //获取事件map 的 keys ( "click .xxx", "keyup .yyy" ... 这种 )
      var keys = this.keys( maps ),
      //获取事件map 的 函数 ( function xxx (){} )
        values = this.values( maps);

      var e = [],  //click , keyup 等事件名称
        m = [];  //.xxx, #xxx 等元素

      keys.forEach(function ( el, i ){
        var r = el.split(" ");
        e.push( r[0] );
        m.push( r[1] );
      });
      //注册监听器
      this.unique(e).forEach(function ( el ){
        $(".cp-h5-main").off(el).on(el, typeAction);
      });

      function typeAction (event){
        keys.every(function ( el, i){
          if( event.type == e[i] ){
            if( m[i][0] == "#" && event.target.id == m[i].slice(1)){
              values[i].call( this, event );
              return false;
            }else if( m[i][0] == "." && event.target.classList.contains(m[i].slice(1))){
              values[i].call( this, event );
              return false;
            }else{
              return true;
            }
          }else{
            return true;
          }
        });
      }
    },
    base64 : function ( str ){
      var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      var out, i, len;
      var c1, c2, c3;
      len = str.length;
      i = 0;
      out = "";
      while(i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if(i == len)
        {
          out += base64EncodeChars.charAt(c1 >> 2);
          out += base64EncodeChars.charAt((c1 & 0x3) << 4);
          out += "==";
          break;
        }
        c2 = str.charCodeAt(i++);
        if(i == len)
        {
          out += base64EncodeChars.charAt(c1 >> 2);
          out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
          out += base64EncodeChars.charAt((c2 & 0xF) << 2);
          out += "=";
          break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
      }
      return out;
    }
  });

  //自动加载css
  $("head").append(Base.loadStyle());


  return Base;
});
define('model', ["base", "ajax", "class" ],function ( base, Ajax, $class ){

  var collect = new Ajax();

  collect.setting({
    interface : "restapi/soa2/10108/json/"
  });

  var CollectModel = {
    //添加收藏
    addProduct : function ( productList, channel, version, callback ){
      collect.send("myfavoritesadd",{ "FavoriteList" : productList, "Channel" : channel, "Version" : version }, function ( error, data ){
        if( error ) {return callback( error );}
        return callback( null,data );
      });
    },
    //取消收藏
    deleteProduct : function ( productList, callback ){
      collect.send("myfavoritesdelete", { "FavoriteIdList" : productList }, function ( error, data ){
        if( error ) {return callback( error );}
        return callback( null, data );
      });
    },
    //是否已经收藏
    isMyFavorites : function ( QueryList, callback ){
      collect.send("ismyfavorites", { "QueryList" : QueryList }, callback);
    }
  };
  return CollectModel;
});
define('ajax', ['base','class'],function ( base, Class ){

  var host = location.host,
    protocol = base.getProtocol(),
    method = base.getMethod();

  var Query = new Class();

  Query.include({
    baseurl : function ( path ) {

      var domain = 'm.ctrip.com';

      var domainarr = {
        "local": {
          "https": {
            "common": { "domain": "secure.fat19.qa.nt.ctripcorp.com", "path": "restapi" }
          },
          "http": {
            "common": { "domain": "gateway.m.fws.qa.nt.ctripcorp.com", "path": "restapi" },
            "gateway": { "domain": "gateway.m.fws.qa.nt.ctripcorp.com", "path": "restapi" },
            "cruise_gateway": { "domain": "orderws.cruise.fat6.qa.nt.ctripcorp.com", "path": "Cruise-Order-OpenAPI" }
          }
        },
        "test": {
          "https": {
            "common": { "domain": "secure.fat19.qa.nt.ctripcorp.com", "path": "restapi" }
          },
          "http": {
            "common": { "domain": "gateway.m.fws.qa.nt.ctripcorp.com", "path": "restapi" },
            "gateway": { "domain": "gateway.m.fws.qa.nt.ctripcorp.com", "path": "restapi" },
            "cruise_gateway": { "domain": "orderws.cruise.fat6.qa.nt.ctripcorp.com", "path": "Cruise-Order-OpenAPI" }
          }
        },
        "uat": {
          "https": {
            "common": { "domain": "gateway.m.uat.qa.nt.ctripcorp.com", "path": "restapi" }
          },
          "http": {
            "common": { "domain": "gateway.m.uat.qa.nt.ctripcorp.com", "path": "restapi" },
            "gateway": { "domain": "gateway.m.uat.qa.nt.ctripcorp.com", "path": "restapi" },
            "cruise_gateway": { "domain": "orderws.cruise.fat6.qa.nt.ctripcorp.com", "path": "Cruise-Order-OpenAPI" }
          }
        },
        "baolei": {
          "https": {
            "common": { "domain": "10.8.5.99", "path": "restapi" }
          },
          "http": {
            "common": { "domain": "10.8.14.28:8080", "path": "restapi" },
            "gateway": { "domain": "10.8.14.28:8080", "path": "restapi" },
            "cruise_gateway": { "domain": "orderws.cruise.fat6.qa.nt.ctripcorp.com", "path": "Cruise-Order-OpenAPI" }
          }
        },
        "pro": {
          "https": {
            "common": { "domain": "sec-m.ctrip.com", "path": "restapi" }
          },
          "http": {
            "common": { "domain": "m.ctrip.com", "path": "restapi" },
            "gateway": { "domain": "m.ctrip.com", "path": "restapi" },
            "cruise_gateway": { "domain": "m.ctrip.com", "path": "restapi" }
          }
        }
      };

      domain = domainarr[ base.getEnv() ][ this.protocol ][ this.method ][ "domain" ];

      return domain;
    },
    buildurl: function ( path ) {
      var domain = this.baseurl();
      //var path = path || 'restapi/soa2/10108/json/';
      var tempUrl =  protocol + '://' + domain + '/';
      return tempUrl;
    },
    setting : function (  options /* method,protocol,interface */ ){
      if( !options || typeof options !== "object" || !options.interface ){
        console.error( "options parameters error" );
        return;
      }
      this.method = options.method || method;
      this.protocol = options.protocol || protocol;
      this.requestUrl = this.buildurl() + options.interface;
    },
    send : function ( url,data,callback,type,islogin ){

      var self = this;

      type = type || "POST";

      islogin = islogin || false;

      var head = base.getHeadStore();

      //如果取不到则判断没有登录
      if(!islogin){
        if( !head || typeof head.value !== "object" || !base.isLogin() ){
          return callback({ "errorMsg":"notLoggedIn" });
        }
      }

      var $data = {};
      $data.head = head.value;

      //data与$data合并
      if( typeof data === "object" ){
        for( var i in data ){
          $data[i] = data[i];
        }
      }
      $.ajax({
        url : this.requestUrl + url,
        type : type,
        dataType : "json",
        data : JSON.stringify( $data ),
        contentType : "application/json",
        success : function ( data ){
          return callback( null,data );
        },
        error : function ( xhr,error ){
          return callback({ "errorMsg":error });
        }
      });
    }
  });

  return Query;
});
define('collect', [ 'class', "base", "model", 'text!template/collect.html' ],function ( $class, base, Model, html ){

  var Collect = new $class();// jshint ignore:line

  Collect.include({
    init : function (){
      var options = arguments[0];
      if( !options || typeof options !== "object" ) {options = {};}
      this.query = Model;
    },
    save : function ( options, callback ){
      var self = this;
      if ( !options ||  typeof options !== "object" || typeof callback !== "function" || !base.isArray(options.FavoriteList) ){// jshint ignore:line
        return callback({ errorMsg : "FavoriteList参数错误" });
      }
      var FavoriteList = options.FavoriteList,
        channel = options.Channel || null,
        version = options.Version || null;

      this.query.addProduct( FavoriteList, channel, version, function ( error,data ){
        if( error ){
          base.prompt("网络错误，收藏失败！");
          return callback ( error );
        }else{
          //添加ubt代码
          if (typeof window['__bfi'] == 'undefined') {window['__bfi'] = [];}
          window['__bfi'].push([
            '_tracklog',
            'COLLECT_FROM',
              'from='+base.isInApp()?'Hybrid':'H5'
          ]);

          base.prompt("收藏成功！");

          //收藏成功
          return callback( null,{
            "FavoriteIDs" : data.FavoriteIdList
          });
        }
      });
    },
    //是否已经收藏
    isMyFavorites : function ( options, callback ){
      if ( !options ||  typeof options !== "object" || typeof callback !== "function" || !base.isArray(options.QueryList) ){
        return callback({ errorMsg : "QueryList参数错误" });
      }
      var QueryList = options.QueryList;
      var QueryProductList = [];
      var FavoriteIDList = [];

      //将需要查询的product放入数组中
      QueryList.forEach(function ( el ){
        QueryProductList.push( el.ProductID );
        FavoriteIDList.push(null);
      });

      this.query.isMyFavorites( QueryList, function ( error, data ){
        if( error ){
          return callback( error );
        }
        var resultList = (data && data.ResultList) || [];
        var ok;
        //遍历结果数组，然后在请求数组中查询，如果查到了，就把查到的项变为true
        resultList.forEach(function ( el ){
          //服务返回的 el.ProductID是个string
          var n = QueryProductList.indexOf(parseInt(el.ProductID,10));
          if( n > -1 ){
            QueryProductList[n] = true;
            FavoriteIDList[n] = el.FavoriteID;
            ok = true;
          }
        });
        //将没有查到的项变为false
        QueryProductList.forEach(function (el,i){
          if(!base.isBool(el)){
            QueryProductList[i] = false;
            ok = false;
          }
        });
        return callback( null, {
          result : QueryProductList,
          FavoriteIDs : FavoriteIDList,
          success : ok
        });
      });
    },
    cancel : function ( FavoriteIDs, callback ){
      var params = Array.isArray( FavoriteIDs ) ? FavoriteIDs : [ FavoriteIDs ];
      this.query.deleteProduct( params, function ( error, data ){
        if( error ){
          base.prompt("取消收藏失败");
          return callback ( error );
        }
        base.prompt("取消收藏成功");
        return callback( null, data );
      });
    }
  });

  return Collect;
});
define('prompt', ['class','base'],function ( $class, base ){

  var Prompt = new $class();// jshint ignore:line

  var pp = ["cp-promptMask","cm-modal--alert"],

    screenOp = "keepheader,keepfooter,fullscreen,keepboth",

    template = {
      prompt : '<div class="cp-promptMask cui-view cui-mask cui-opacitymask" style="position:fixed; left: 0px; top: 0px; background: rgba(0,0,0,.5); width:100%; height:100%"></div>'+
        '<section class="cm-modal cm-modal--alert">'+
        '<div class="cm-modal-bd">'+

        '</div>'+
        '<div class="cm-actions">'+

        '</div>'+
        '</section>'
    },
    check = false;

  Prompt.include({
    init : function (){

      var options = arguments[0];

      if(!options || typeof options !== "object"){ options = {};}

      this.parent = base.parent(options.parent);

      this.screen = (typeof options.screen === "string" && screenOp.indexOf(options.screen.toLowerCase()) > -1) ? options.screen.toLowerCase() : "keepheader";

      this.zIndex = options.zIndex && typeof options.zIndex === "number" && !isNaN(options.zIndex) ? options.zIndex : 10;

      this.message = options.message && {}.toString.call(options.message) == '[object Object]' ? options.message : { title: '标题配置不正确'};

      this.buttons = options.buttons && base.isArray(options.buttons) ? options.buttons : [];

      this.autoHide = options.autoHide && typeof options.autoHide === "boolean" ? options.autoHide : false;

      this.timeout = options.timeout && typeof options.timeout === "number" && !isNaN(options.timeout) &&  (options.timeout > 0) ? options.timeout : 1000;

      this.hidecallback = options.hidecallback;

      var t = base.isNumeric( options.header ) ? options.header : $("header").height();
      var b = base.isNumeric( options.footer ) ? options.footer : $("footer").height();

      this.t = t === null ? 0 : t;
      this.b = b === null ? 0 : b;
    },
    __open : function ( selector,temp ){
      var self = this;

      var d = $(temp);
      var dM = d.eq(0);
      var bd;

      if(this.screen === "keepheader"){
        dM.css({"top":this.t,"bottom":0});
      }else if(this.screen === "keepfooter"){
        dM.css({"bottom":this.b,"top":0});
      }else if (this.screen === "fullscreen"){
        dM.css({"top":0,"bottom":0});
      }else if(this.screen === "keepboth"){
        dM.css({"top":this.t,"bottom":this.b});
      }else{
        dM.css({"top":this.t,"bottom":0});
      }
      dM.css("zIndex",this.zIndex);
      d.eq(1).css("zIndex",this.zIndex + 1);

      this.parent.append( d );

      bd = d.find('.cm-modal-bd');

      if(!!this.message.content){  // jshint ignore:line
        bd.html('<h3 class="cm-alert-title">' + this.message.title + '</h3><div class="cm-mutil-lines">' + this.message.content + '</div>'); // jshint ignore:line
      }else{
        !!this.message.title ? bd.html('<p>' + this.message.title + '</p>') : bd.html('<p>没有标题</p>'); // jshint ignore:line
      }

      self.__btns();

      $('.cp-promptMask').css('height',$(document).height());

      $('.cm-modal').css('display','block');//

      this.currentElement = d;
    },
    __btns : function (){
      var self = this;
      var btns = $('.cm-actions');
      var btnsArray = [];

      if(this.buttons.length <= 0){
        return;
      }else if(this.buttons.length > 2 ){
        btns.addClass('cm-actions--full');
      }

      for(var i=0; i<= this.buttons.length-1; i++){
        btns.append('<span class="cm-actions-btn">'+ this.buttons[i].text +'</span>');

        (function( i ){// jshint ignore:line
          btns.find('.cm-actions-btn').eq(i).off().on('click',function(){ // jshint ignore:line
            self.buttons[i].callback( $.proxy( self.__close, self ) );// jshint ignore:line
          });// jshint ignore:line
        })( i );// jshint ignore:line
      }
    },
    __close : function (){
      if(check) {this.currentElement.hide();} else {this.currentElement.remove();}
    },
    prompt : function ( M ){
      var self = this;

      if ( M ){
        if(M.message) {this.message.title = M.message.title;}
        if(M.message) {this.message.content = M.message.content;}
        this.buttons = M.buttons || [];
        this.autoHide = M.autoHide;
        this.timeout = M.timeout;
        this.hidecallback = M.hidecallback;
      }

      var timeout = this.timeout;
      var autohide = this.autoHide;

      //显示/创建
      self.__open(pp[0],template.prompt);


      if (autohide) {setTimeout(function(){ _callback(); },timeout);}

      var _callback = function(){
        self.__close();
        if(!!self.hidecallback && typeof(self.hidecallback) === 'function') {self.hidecallback();} // jshint ignore:line
      };
    },
    showNoNetUI : function (){
      var self = this;

      var $checkNetStatus = new Prompt({
        zIndex: 3000,
        parent: "#main",
        screen: "FullScreen",
        message: {
          title : '网络连接失败',
          content: '当前网络不可用，请您尝试启用移动网络或者Wi-Fi来继续访问页面。'
        },
        autoHide: false,

        buttons: [
          {
            text: '知道了！',
            callback: function (close) {
              close();
            }
          }
        ]
      });
      setTimeout(function(){ $('.cp-promptMask').remove();$('.cm-modal').remove(); $checkNetStatus.prompt(); },300); // jshint ignore:line
    }
  });
  return Prompt;
});
require(['collect', 'prompt', 'UINetwork'], function(collect, prompt, network) {
  var cPublic = {
    Collect : collect,
    collect : collect,

    Prompt :  prompt,
    prompt : prompt,

    Network : network,
    network : network
  };
  if(window.cPublic) {
    // 如果已经存在cPublic对象了，则是公共的main.js先加载了
    // 在cPublic对象上新增方法
    _.extend(window.cPublic, cPublic);
  }else {
    window.cPublic = cPublic;
  }

  return cPublic;
});