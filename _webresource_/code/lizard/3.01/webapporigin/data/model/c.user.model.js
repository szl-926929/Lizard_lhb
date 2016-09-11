/*
 * @Description: 封装H5的用户登录操作
 * @author ouxingzhi@vip.qq.com l_wang@ctrip.com
 * @date  2013/6/23 16:26:12
 * @version V1.0
 */
/**
 * @author cmli@ctrip.com / oxz欧新志 <ouxz@Ctrip.com>
 */
define(['cCoreInherit', 'cModel', 'cCommonStore', 'cUtilCommon', 'cUtilXhr'],
  function(cCoreInherit, cModel, CommonStore, cUtilCommon, ajaxHelper) {

    "use strict";

    var UserStore = CommonStore.UserStore.getInstance();
    var HeadStore = CommonStore.HeadStore.getInstance();

    var UserModel = {};
    /**
	   * 非会员登录
     * @class
     * @extends cModel
	   * @name cUserModel.NotUserLoginModel
     * @example
     * var NotUser = cUserModel.NotUserLoginModel;
     * NotUser.getInstance().excute();
	   */
    UserModel.NotUserLoginModel = new cCoreInherit.Class(cModel, /** @lends cUserModel.NotUserLoginModel.prototype */{
      __propertys__: function() {
        this.url = "/html5/Account/NonUserLogin";
        this.param = {};
        //this.baseurl = cModel.baseurl.call(this);
        this._abortres = {};
        this.isAbort = false;
      },

      initialize: function($super, options) {
        $super(options);
      },

      /**
       * @param {function} onComplete 取完的回调函
       * @param {function} onError 发生错误时的回调
       * @param {boolean} ajaxOnly 可选，默认为false当为true时只使用ajax调取数据
       * @param {boolean} scope 可选，设定回调函数this指向的对象
       * @param {function} onAbort 可选，但取消时会调用的函数
       * @description 向服务端做非会员登陆
       */
      excute: function(onComplete, onError, ajaxOnly, scope, onAbort) {
        //add by byl 此处添加，如果已经是非会员登录，则不重新调用非会员登录，并且执行成功的回调函数
        var userData = UserStore.getUser();
        if(userData && !!userData.Auth){
          if(typeof onComplete === 'function'){
            onComplete.call(scope, UserStore.getUser());
          }
          return;
        }
        this.isAbort = false;
        // var url = 'http://' + this.baseurl.domain + this.url;
        var host = window.location.host;
        if(host.match(/localhost/ig) || host.match(/\.fat/i)){
          host = 'm.fat19.qa.nt.ctripcorp.com';
        }
        var url = ((window.location.protocol.indexOf("https") > -1) ? "https://" : "http://") + host + this.url;
		
        var successCallback = function(data) {
          if (data.ServerCode == 1 && data.Data) {
            UserStore.setUser(data.Data);

            if (typeof onComplete === 'function') {
              onComplete.call(scope, data);
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

        this._abortres = ajaxHelper({
          'type': 'get',
          'url': url,
          'dataType': 'json',
          'crossDomain': true,
          'success': _.bind(successCallback, this),
          'error': _.bind(errorCallback, this),
          'timeout': 25000
        });
      },

      /**
       * 终止请求
       */
      abort: function() {
        this.isAbort = true;
        if (this._abortres && typeof this._abortres.abort === 'function') {
          this._abortres.abort();
        }
      }
    });

    /**
     * 用户登录model
     * @class
     * @extends cModel
     * @name cUserModel.UserLoginModel
     * @example
     * var UserLogin = cUserModel.UserLoginModel;
     * UserLogin.getInstance().excute();
     */
    UserModel.UserLoginModel = new cCoreInherit.Class(cModel, /** @lends cUserModel.UserLoginModel.prototype*/ {
      __propertys__: function() {
        this.param = {};
        this.contentType = "jsonp";
        this.url = 'CrossDomainGetTicket/ajax/ajaxgetticket.ashx';
        this._abortres = {};
        this.isAbort = false;
      },
      initialize: function($super, options) {
        $super(options);
      },
      buildurl:function(){
        var host = window.location.host,
          domain = "accounts.ctrip.com";
        if (host.match(/^m\.ctrip\.com/i)){
          domain = "accounts.ctrip.com";
        }else if (host.match(/\.uat\.qa/i)){
          domain = "accounts.uat.qa.nt.ctripcorp.com";
        }else if (host.match(/\.fat/i) || (host.match(/\.lpt/i))|| host.match(/\.fws/i) || host.match(/^(localhost|172\.16|127\.0)/i)) {
          domain = "accounts.fat49.qa.nt.ctripcorp.com";
        } else if(host.match(/\.uat\.ctipqa\.com/i)){
          domain = "accounts.uat.ctripqa.com";
        }
        return ['https://',domain, '/',this.url].join("");
      },
      //重写此处的jsonP请求
      excute: function(onComplete, onError, ajaxOnly, scope, onAbort) {
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

        this._abortres = ajaxHelper({
          'type': 'get',
          'url': url,
          'dataType': 'jsonp',
          'data':this.param,
          'crossDomain': true,
          'jsonpCallback': "callbackfn",
          'success': _.bind(successCallback, this),
          'error': _.bind(errorCallback, this),
          'timeout': 50000
        });
      },
      abort: function() {
        this.isAbort = true;
        if (this._abortres && typeof this._abortres.abort === 'function') {
          this._abortres.abort();
        }
      }
    });

    /**
     * 用户第三方登录
     * @class
     * @extends cModel
     * @name cUserModel.ThirdPartInfoModel
     * @example
     * var ThirdPart = cUserModel.ThirdPartInfoModel;
     * ThirdPart.getInstance().excute();
     */
    UserModel.ThirdPartInfoModel = new cCoreInherit.Class(cModel,  /** @lends cUserModel.ThirdPartInfoModel.prototype*/ {
      /**
       * @private
       * @method cUserModel.ThirdPardMemberLogin.__propertys__
       * @returns void
       */
      __propertys__: function() {
        this.param = {};
        this.url = '10448/GetThirdPartMembers.json';
      },
      /**
       * @private
       * @method cUserModel.UserLoginModel.initialize
       * @param {function} $super
       * @param {object} options
       * @description 对象初始化工作
       * @returns void
       */
      initialize: function($super, options) {
        $super(options);
        this.baseurl = this.seturl();
      },
      /*
       * @method cUserModel.UserLoginModel.seturl
       * @description 获取用户登录页面的服务器地址，供内部使用
       */
      seturl:function(){
        var host = window.location.host,
          path = '/restapi/soa2/',
          domain = "m.ctrip.com";
        if (host.match(/^m\.ctrip\.com/i)){
          domain = "m.ctrip.com";
        }else if (host.match(/\.uat\.qa/i)){
          domain = "gateway.m.uat.qa.nt.ctripcorp.com";
        }else if (host.match(/(\.fws|\.fat|\.lpt|localhost|172\.16|127\.0)/i)){
          domain = "gateway.m.fws.qa.nt.ctripcorp.com";
        }
        return {
          'domain': domain,
          'path': path
        };
      },

      buildurl: function () {
        if (cUtilCommon.isUrl(this.url)) {
          return this.url;
        }
        //目前没有https的接口，需要考虑https下使用的可能性
        return [this.protocol,'://',this.baseurl.domain,this.baseurl.path,this.url].join("");
      }
    });

    /**
     * 获取clientId
     * @class
     * @extends cModel
     * @name cUserModel.ClientIdModel
     * @example
     * var ClientId = cUserModel.ClientIdModel;
     * ClientId.getInstance().excute();
     */
    UserModel.ClientIdModel = new cCoreInherit.Class(cModel, /** @lends cUserModel.ClientIdModel.prototype*/{
      /**
       * @private
       * @method cUserModel.ThirdPardMemberLogin.__propertys__
       * @returns void
       */
      __propertys__: function() {
        this.param = {
          systemcode : '09',
          createtype: 3
        };
        this.method = 'get';
        this.url = '10290/createclientid';
      },
      /**
       * @private
       * @method cUserModel.UserLoginModel.initialize
       * @param {function} $super
       * @param {object} options
       * @description 对象初始化工作
       * @returns void
       */
      initialize: function($super, options) {
        $super(options);
        this.baseurl = this.seturl();
      },
      /*
       * @method cUserModel.UserLoginModel.seturl
       * @description 获取用户登录页面的服务器地址，供内部使用
       */
      seturl:function(){
        var host = window.location.host,
          path = '/restapi/soa2/',
          domain = "m.ctrip.com",
          isHttp = (this.protocol == "http")?true:false;
        if (host.match(/^(m|accounts|secure)\.ctrip\.com/i)){ //增加两个https下域名的处理
          if(isHttp){
            domain = "m.ctrip.com";
          }else{
            domain = "sec-m.ctrip.com";
          }
        }else if (host.match(/\.uat\.qa/i)){
          domain = "gateway.m.uat.qa.nt.ctripcorp.com"; //https和http下的地址是一样的
        }else if (host.match(/(\.fws|\.fat|\.lpt|localhost|172\.16|127\.0)/i)){
          domain = "gateway.m.fws.qa.nt.ctripcorp.com"; //https和http下的地址是一样的
        }
        return {
          'domain': domain,
          'path': path
        };
      },

      buildurl: function () {
        if (cUtilCommon.isUrl(this.url)) {
          return this.url;
        }
        //目前没有https的接口，需要考虑https下使用的可能性
        return [this.protocol,'://',this.baseurl.domain,this.baseurl.path,this.url].join("");
      }
    });
    /**
     * 验证是否登录
     * @class
     * @extends cModel
     * @name cUserModel.ClientIdModel
     * @example
     * var ClientId = cUserModel.ClientIdModel;
     * ClientId.getInstance().excute();
     */
    UserModel.IsLoginModel = new cCoreInherit.Class(cModel, /** @lends cUserModel.ClientIdModel.prototype*/{
      /**
       * @private
       * @method cUserModel.ThirdPardMemberLogin.__propertys__
       * @returns void
       */
      __propertys__: function() {
        this.method = 'post';
        this.url = '10512/GetLoginStatusByTicket.json';
      },
      /**
       * @private
       * @method cUserModel.UserLoginModel.initialize
       * @param {function} $super
       * @param {object} options
       * @description 对象初始化工作
       * @returns void
       */
      initialize: function($super, options) {
        $super(options);
      },

      buildurl: function () {
        var host = window.location.host,
          path = '/restapi/soa2/',
          domain = "m.ctrip.com",
          isHttp = (this.protocol == "http")?true:false;
        if (host.match(/^(m|accounts|secure)\.ctrip\.com/i)){ //增加两个https下域名的处理
          if(isHttp){
            domain = "m.ctrip.com";
          }else{
            domain = "sec-m.ctrip.com";
          }
        }else if (host.match(/\.uat\.qa/i)){
          domain = "gateway.m.uat.qa.nt.ctripcorp.com"; //https和http下的地址是一样的
        }else if (host.match(/(\.fws|\.fat|\.lpt|localhost|172\.16|127\.0)/i)){
          domain = "gateway.m.fws.qa.nt.ctripcorp.com"; //https和http下的地址是一样的
        }
        //目前没有https的接口，需要考虑https下使用的可能性
        return [this.protocol,'://',domain,path,this.url].join("");
      }
    });

    /**
     * 根据auth获取用户信息,安全性较高的场景,请使用UserLoginModel
     * @class
     * @extends cModel
     * @name cUserModel.GetUserModel
     * @example
     * var GetUserModel = cUserModel.GetUserModel;
     * GetUserModel.getInstance().excute();
     */
    UserModel.GetUserModel = new cCoreInherit.Class(cModel, /** @lends cUserModel.GetUserModel.prototype*/{
      /**
       * @private
       * @method cUserModel.UserLoginModel.__propertys__
       * @returns void
       */
      __propertys__: function() {
        this.param = {};
        this.url = '10090/GetUserInfoToH5.json';
      },
      /**
       * @private
       * @method cUserModel.UserLoginModel.initialize
       * @param {function} $super
       * @param {object} options
       * @description 对象初始化工作
       * @returns void
       */
      initialize: function($super, options) {
        $super(options);
        this.baseurl = this.seturl();
      },
      /*
       * @method cUserModel.UserLoginModel.seturl
       * @description 获取用户登录页面的服务器地址，供内部使用
       */
      seturl:function(){
        var host = window.location.host,
          path = '/restapi/soa2/',
          domain = "m.ctrip.com";
        if (host.match(/^m\.ctrip\.com/i)){
          domain = "m.ctrip.com";
        }else if (host.match(/\.uat\.qa/i)){
          domain = "gateway.m.uat.qa.nt.ctripcorp.com";
        }else if (host.match(/(\.fws|\.fat|\.lpt|localhost|172\.16|127\.0)/i)){
          domain = "gateway.m.fws.qa.nt.ctripcorp.com";
        }
        return {
          'domain': domain,
          'path': path
        };
      },
      /*
       * 重写buildUrl
       * @returns {string}
       */
      buildurl: function () {
        if (cUtilCommon.isUrl(this.url)) {
          return this.url;
        }
        //目前没有https的接口，需要考虑https下使用的可能性
        return [this.protocol,'://',this.baseurl.domain,this.baseurl.path,this.url].join("");
      }
    });

    return UserModel;
  });
