/**
 * @Description: Model抽象类，封装ajax访问
 * @author ouxingzhi@vip.qq.com l_wang@ctrip.com
 * @date  2013/6/23 16:26:12
 * @version V1.0
 */
define(['libs', 'cCoreInherit', 'cAjax', 'cUtilCommon', 'cUtilPath','cMessageCenter', Lizard.app.vendor.is('CTRIP') && Lizard.isHybrid ?"cHybridShell":""], function (libs, cCoreInherit, cAjax, cUtilCommon, pathUtil,MessageCenter,cHybridShell) {
/**
 * Model抽象类，封装ajax访问, 该类不能直接被实例化
 * @class
 * @name cAbstractModel
 */
  var AbstractModel = new cCoreInherit.Class(/** @lends cAbstractModel.prototype */{

    __propertys__: function () {

      /**
       * 数据请求url, 必填
       * @name cAbstractModel#url
       * @type {string}
       */
      this.url = null;

      /**
       * 请求参数,必选
       * @name cAbstractModel#param
       * @type {object}
       */
      this.param = null;

      /**
       * 数据返回时的自定义格式化函数
       * @method cAbstractModel#dataformat
       * @type {function}
       */
      this.dataformat = null;

      /**
       * 可选，存放用于验证的函数集合
       * @name cAbstractModel#validates
       * @type {array}
       */
      this.validates = [];


      /**
       * 通讯协议,http/https,默认为``location.protocol``
       * @name cAbstractModel#protocol
       * @type {string}
       */
      this.protocol = (window.location.protocol.indexOf("https") > -1) ? "https" : "http";


      /**
       * 提交数据格式 json/form/jsonp, 默认json
       * @name cAbstractModel#contentType
       * @type {string}
       */
      this.contentType = AbstractModel.CONTENT_TYPE_JSON;
      /**
       * 数据提交方式,post/get， 默认post
       * @name cAbstractModel#method
       * @type {string}
       */
      this.method = 'POST';

      /**
       * 是否强制Ajax获取,
       * @name cAbstractModel#ajaxOnly
       * @type {boolean}
       */
      this.ajaxOnly = false;

      /**
       * 超时时间
       * @name cAbstractModel#timeout
       * @type {number}
       */
      this.timeout = 30000;

      //当前的ajax对象
      this.ajax = null;
      //是否主动取消当前ajax
      this.isAbort = false;

      //参数设置函数
      this.onBeforeCompleteCallback = null;
      /**
       * 遇到跨域时，是否传递cookie，默认传递
       * @type {boolean}
       */
      this.noCookie = true;
      /**
       * 强制添加useTcp属性
       * @type {boolean}
       */
      this.useSotp = true;
    },

    /**
     * 复写自顶层Class的initialize，赋值队列
     * @param {Object} options
     */
    initialize: function (options) {
      this.assert();
      for (var key in options) {
        this[key] = options[key];
      }
    },


    assert: function () {
//      if (this.url === null) {
//        throw 'not override url property';
//      }
//      if (this.param === null) {
//        throw 'not override param property';
//      }
    },

    /**
     * 设置model属性值
     * @param {string} key 属性名，如url,protocol
     * @param {object} val 属性值
     * @deprecated
     */
    setAttr:function(key,val){
      this[key] = val;
    },

    /**
     * @param {function} handler
     * @description  将返回数据毁掉函数放到队列中
     */
    pushValidates: function (handler) {
      if (typeof handler === 'function') {
        this.validates.push($.proxy(handler, this));
      }
    },
    /**
     * 设置提交参数的值，如只传key一个参数，则置
     * @param {string|object} key 参数
     * @param {object} val 参数值
     */
    setParam: function (key, val) {
      if (typeof key === 'object' && !val) {
        this.param = key;
      } else {
        this.param[key] = val;
      }
    },
    /**
     * 获取model的查询参数
     * @returns {json|Store} param  查询参数
     */
    getParam: function () {
      var params;
      if(_.isObject(this.param)){  //model post请求参数只能为对象
        params = $.extend(true,{},this.param);
      }
      return params || {};
    },

    /**
     *  获得查询结果结果
     *  @returns {json|Store} result  查询结果
     */
    getResult: function () {
      return this.result;
    },
    /**
     * 获得查询结果结果，建议使用Model.cAbstractModel.getResult
     * @deprecated
     * @method Model.cAbstractModel.getResultStore
     * @returns {json|Store} result  查询结果
     * @see  cAbstractModel#getResult
     */
    getResultStore: function () {
      return this.getResult();
    },
    /**
     * 构建url请求地址，子类可复写，返回优先级为model.url是一个完整的url结构
     * @override
     * @example
     * var Model = CoreInherit.Class(cAbstractModel, {
     *   buildurl: function() {
     *     return Lizard.restfullApi + this.url; 
     *   }
     * });
     */
    buildurl: function () {
      var url = this.url;
      if (!cUtilCommon.isUrl(this.url)) {
        var domain = 'm.ctrip.com',restfulApi = "";

        if( this.protocol == "http" && Lizard.restfullApi){
          restfulApi = Lizard.restfullApi;
        }else if(this.protocol == "https" && Lizard.restfullApiHttps){
          restfulApi = Lizard.restfullApiHttps;
        }

        if (restfulApi && cUtilCommon.isUrl(restfulApi)) {
          domain = pathUtil.parseUrl(restfulApi).hostname;
        }

        url = this.protocol + '://' + domain + '/restapi' +  this.url;
      } else {
        if (url.trim().indexOf('http://') === 0 && location.protocol === 'https:') {
          url = 'https://' + url.trim().substr(7);
        }
      }
      return url;
    },

    //增加model url请求的后缀
    appendSuffix:function(url){
      //var cid = window.localStorage.getItem('GUID');
      var cid = cUtilCommon.getGuid();
      //如果h5,并且clienId为服务端下发
      if(!Lizard.isHybrid && !Lizard.isInCtripApp && cid && cid.indexOf('-') < 0){
        var segChar = url.indexOf('?')>-1 ? "&":'?' ;
        url = url + segChar + '_fxpcqlniredt=' + cid;
      }
      return url;
    },

    
    _execute: function (onComplete, onError, scope, onAbort, params) {

      // @description 定义是否需要退出ajax请求
      this.isAbort = false;

      // @description 请求数据的地址
      var url = this.appendSuffix(this.buildurl());

      var self = this;

      var __onComplete = $.proxy(function (data) {
        //保存服务请求日志
        // cLog.serverLog(self.buildurl(), self.getParam(), data);

        if (this.validates && this.validates.length > 0) {
          // @description 开发者可以传入一组验证方法进行验证
          for (var i = 0, len = this.validates.length; i < len; i++) {
            var validates = this.validates[i](data);
            if ((typeof validates === 'boolean')) {
              if (!validates) {
                //_.isFunction(this.onBeforeCompleteCallback) && this.onBeforeCompleteCallback(data);
                // @description 如果一个验证不通过就返回
                if (typeof onError === 'function') {
                  return onError.call(scope || this, data);
                } else {
                  return false;
                }
              }
            } else {
              if (validates && validates.overdue) {
                memberLogin();
                return;
              }
              }
            }
          }
        //auth过期时，跳转到登录
        function memberLogin(){
          require([(Lizard.app.vendor.is('CTRIP') || Lizard.isHybrid) ? 'cHybridMember' : 'cWebMember'], function (Member) {
            Member.memberLogin({'param': 'from=' + encodeURIComponent(window.location.href)});
          });
        }
        // @description 对获取的数据做字段映射
        var datamodel = typeof this.dataformat === 'function' ? this.dataformat(data) : data;

        if (typeof this.onBeforeCompleteCallback === 'function') {
          this.onBeforeCompleteCallback(datamodel);
        }

        if (typeof onComplete === 'function') {
          onComplete.call(scope || this, datamodel, data);
        }

      }, this);

      var __onError = $.proxy(function (e) {
        if (self.isAbort) {
          self.isAbort = false;

          if (typeof onAbort === 'function') {
            return onAbort.call(scope || this, e);
          } else {
            return false;
          }
        }
        function verificationCode(resBody){
          //此处需要添加弹出验证码的框
          require(["UIVerificationCode"],$.proxy(function(UIVerificationCode){
            var verificationCode = new UIVerificationCode();
            verificationCode.initFuncs($.proxy(function(){
              this._execute(onComplete, onError, scope, onAbort, params);
            },this),$.proxy(function(){
              if (typeof onError === 'function') {
                onError.call(scope || this, e);
              }
            },this));
            verificationCode.initResBody(resBody);
            verificationCode.call();
          },self));
        }
        function showAlertMessage(){
          //此处需要添加弹出验证码的框
          require(["UIAlert"],function(UIAlert){
            var uiAlert = new UIAlert();
            uiAlert.setDatamodel({
              content:"您访问的太快了，休息一下吧"
            });
            uiAlert.call();
          });
        }
        if(e && e.status == "431" || e.status == "432" ){
          //430时，需要弹出验证码，验证通过重发请求
          verificationCode(e.response);
          return;
        }
        if(e && e.status == "429" || e.status == "430" ){
          //430时，需要弹出验证码，验证通过重发请求
          showAlertMessage();
          return;
        }
        if (typeof onError === 'function') {
          onError.call(scope || this, e);
        }
      }, this);

      // @description 从this.param中获得数据，做深copy
      var reqParams = params || this.getParam();
      //暂时将head中的处理去掉
      //var origin = cUtilCommon.isCrossDomain(url);
      //if(!this.noCookie && origin ){
      //  if(reqParams.head && reqParams.head.extension && reqParams.head.extension.length){
      //    reqParams.head.extension.push({
      //      name:"cookieOrigin",
      //      value:origin
      //    });
      //  }
      //}
      //设置contentType无效BUG，改动一，将contentType保存
      reqParams.contentType = this.contentType;
      var paramsLen = cUtilCommon.getObjLength(reqParams);
      if(cHybridShell && this.useSotp && paramsLen < 20000 && cUtilCommon.isUseSOTPSendHTTPRequest() && Lizard.app.vendor.is('CTRIP') && Lizard.isHybrid && cUtilCommon.isSOA2Request(url)){ // jshint ignore:line
        var headers = {
          "Accept":"application/json",
          "Accept-Encoding":"gzip, deflate",
          "Accept-Language":"zh-CN,zh;q=0.8",
          "Cache-Control":"no-cache",
          "Connection":"keep-alive",
          "Content-Type":"application/json",
          "X-Requested-With":"XMLHttpRequest"
        };
        var callBackHandler = {
          __onComplete:__onComplete,
          __onError:__onError
        };
        var fn = new cHybridShell.Fn('sotp_send_http_requst', $.proxy(function(data,err){
          if(err){
            this.__onError(err);
            return;
          }
          try{
            var resBody = data.body;
            if(resBody){
              //http请求返回值
              this.__onComplete(JSON.parse(resBody));
            }else{
              this.__onError(err);
            }
          }catch(e){
            this.__onError(err);
          }
        },callBackHandler));
        fn.run(url,this.method || "POST",headers, _.isObject(reqParams) ? $.extend(true,{},reqParams) : reqParams);
      }else if (this.contentType === AbstractModel.CONTENT_TYPE_JSON) {
        // @description 跨域请求
        return this.ajax = cAjax.cros(url, this.method, reqParams, __onComplete, __onError,this.timeout);
      } else if (this.contentType === AbstractModel.CONTENT_TYPE_JSONP) {
        // @description jsonp的跨域请求
        return this.ajax = cAjax.jsonp(url, reqParams, __onComplete, __onError,this.timeout);
      } else {
        // @description 默认post请求
        return this.ajax = cAjax.post(url, reqParams, __onComplete, __onError,this.timeout);
      }
    },

    /**
     * 发送数据请求数据
     * @param {Function} onComplete 取完的回调函数
     * @param {Function} onError 发生错误时的回调
     * @param {Boolean} [ajaxOnly] 可选，默认为false当为true时只使用ajax调取数据
     * @param {Boolean} [scope] 可选，设定回调函数this指向的对象
     * @param {Function} [onAbort] 可选，取消时会调用的函数
     */
    execute: function (onComplete, onError, scope, onAbort, params) {
      this._execute(onComplete, onError, scope, onAbort, params);
    },
    /**
     * 终止请求
     */
    abort: function () {
      this.isAbort = true;
      if(this.ajax && this.ajax.abort){
        this.ajax.abort();
      }
    }

  });

  /**
   * Model的单例获取方式
   * @method cAbstractModel.getInstance
   * @returns {object}
   */
  AbstractModel.getInstance = function () {
    if (this.instance instanceof this) {
      return this.instance;
    } else {
      return this.instance = new this();
    }
  };

  /**
   * JSON方式提交请求
   * @constants
   * @name cAbstractModel.CONTENT_TYPE_JSON
   */
  AbstractModel.CONTENT_TYPE_JSON = 'json';
  /**
   * FORM方式提交请求
   * @constants
   * @name cAbstractModel.CONTENT_TYPE_FORM
   */
  AbstractModel.CONTENT_TYPE_FORM = 'form';
  /**
   * JSONP方式提交请求
   * @constants
   * @name cAbstractModel.CONTENT_TYPE_JSONP
   */
  AbstractModel.CONTENT_TYPE_JSONP = 'jsonp';

  return AbstractModel;
});


