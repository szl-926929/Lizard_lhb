define(['cCoreInherit', 'cAbstractStore', 'cHeadStore','cAuthStore','cUserStore','cMarketStore','cMobileTokenStore','cAbstractModel', 'cUtilObject', 'cUtilCommon', 'cMessageCenter'],
  function (cCoreInherit, AbstractStore, cHeadStore,cAuthStore, cUserStore,cMarketStore,cMobileTokenStore,baseModel, cObject,cUtilCommon, MessageCenter) {
/**
 * Model类,继承自cAbstractModel,封装SOA2访问，和Store缓存
 * @author ouxingzhi@vip.qq.com l_wang@ctrip.com
 * @class
 * @extends cAbstractModel
 * @name cModel
 * @example
 * define([
 *   'cCoreInherit',
 *   'cModel'
 * ], function(
 *   CoreInherit,
 *   Model
 * ) {
 *   var ListModel = CoreInherit.Class(Model, {
 *     buildurl: function() {
 *       return Lizard.restfullApi + 'list';
 *     },
 *     propertys: function () {
 *       this.param = {
 *         cityid: ''
 *       };
 *     }
 *   });
 *
 *   return new ListModel();
 * });
 */
    var Model = new cCoreInherit.Class(baseModel, /** @lends cModel.prototype */{
        /**
         * @description 复写自顶层Class的__propertys__，初始化队列
         * @private
         */
      __propertys__: function () {
        /**
         * 报文是否加入head部分, 默认true
         * @name cModel#usehead
         * @type {boolean}
         */
        this.usehead = true;
        //head数据
        this.headStore = cHeadStore.getInstance();
        //二级授权auth
        this.authStore = cAuthStore.getInstance();
        //user 
        this.userStore = cUserStore.getInstance();
        //手机号查询临时token
        this.mTokenStore = cMobileTokenStore.getInstance();
        //营销数据
        this.salesStore = cMarketStore.SalesStore.getInstance();
        /**
         * 自定义head结构
         * @name cModel#headinfo
         * @type {object}
         */
        this.headinfo = null;
        /**
         * 查询结果
         * @name cModel#result
         * @type {object|localstorage}
         * @example
         * // 先创建一个localStorage对象
         * var City = CoreInherit.Class(Store, {__propertys__: function() {
         *   this.key = 'demo_city';
         * }});
         * this.result = City.getInstance();
         */
        this.result = null;

        /**
         * 请求如果返回auth是否，是否跳转至登录页, 默认true
         * @name cModel#checkAuth
         * @type {boolean}
         */
        this.checkAuth = true;
        /**
         * 自定义扩展head，自定义head放到getway请求的extension中
         * @type []
         */
        this.extension = null;
        /**
         * 是否使用H5的sysCode
         * @type {boolean}
         */
        this.isUseH5Sys = false;
      },
        /**
         * @param $super
         * @param options
         * @description 复写自顶层Class的initialize，赋值队列
         */
      initialize: function ($super, options) {
        $super(options);
      },


        /**
       * 用户数据，返回数据存储的tag
       * @method Model.cModel.getTag
         * @returns {*|JSON.stringify}
         */
      getTag: function () {
        var params = this.getParamData();
        return JSON.stringify(params);
      },
      /**
       * 获取查询参数，如果param设置的一个Store,则返回store的值
       * @method Model.cModel.getParamData
       * @returns {*}
       */
      getParamData: function () {
        var params = this.param instanceof AbstractStore ? this.param.get() : this.param;
        if(!_.isObject(params)){
          params = {};
        }
        return $.extend(true,{},params);
      },
      getProtocol:function(){
        if(window.location && window.location.protocol){
          if(window.location.protocol == "https:"){
            return "https";
          }else if(window.location.protocol == "file:"){
            return "file";
          }else{
            return "http";
          }
        }
      },
      protocolFilter:function(content,hosts){
        return cUtilCommon.protocolFilter(content,hosts);
      },
      /**
       * @param onComplete 取完的回调函 传入的第一个参数为model的数第二个数据为元数据，元数据为ajax下发时的ServerCode,Message等数
       * @param onError 发生错误时的回调
       * @param ajaxOnly 可选，默认为false当为true时只使用ajax调取数据
       * @param scope 可选，设定回调函数this指向的对象
       * @param onAbort 可选，但取消时会调用的函数
       * @description 取model数据
       */
      execute: function (onComplete, onError, ajaxOnly, scope, onAbort) {
        var mobileToken = this.mTokenStore.get();
        if(mobileToken){
          this.headStore.setAttr('pauth',mobileToken);
        }else{
          this.headStore.removeAttr('pauth');
        }
        //add by byl
        var guid = cUtilCommon.getGuid(),cid =  this.headStore.getAttr("cid");
        if(guid &&  guid != cid){
          this.headStore.setAttr("cid", guid || "");
        }
        //每次请求前设置用户Auth
        this.headStore.setAuth(this.userStore.getAuth());
        //设置头部的sid
        if(!Lizard.app.code.is('MASTER') && !Lizard.app.code.is('YOUTH')){
          this.headStore.setAttr('sid',this.salesStore.getAttr('sourceid')||'8888');
        }
        var params = this.getParamData();

        //验证错误码
        this.pushValidates(function (data) {
          //兼容soa2.0 和 restful api
          var rsphead = this._getResponseHead(data);
          if (rsphead.overdue) {
            return {'overdue': rsphead.overdue};
          }
          if(rsphead.verification){
            return {'verification': rsphead.verification};
          }
          return rsphead.success;

        });

        // @description 业务相关，获得localstorage的tag
        var tag = this.getTag();
        // @description 业务相关，从localstorage中获取上次请求的数据缓存
        var cache = this.result && this.result.get(tag);

        //如果没有缓存，或者指定网络请求，则发起ajax请求
        if (!cache || this.ajaxOnly || ajaxOnly) {

          if (this.method.toLowerCase() !== 'get' && this.usehead && this.contentType !== baseModel.CONTENT_TYPE_JSONP) {
            params.head = this.headStore.get() || {};
            //设置使用H5的sysCode
            if(this.isUseH5Sys && params.head){
               params.head.syscode = '09';
            }
            //设置头部的二级授权,有的话就加上
            var sauth = this.authStore.get();
            if(sauth){ //必须用户登录状态才能带sauth
              params.head.sauth = sauth; //改成直接添加sauth，不写入headStore中
              //this.headStore.setAttr('sauth',sauth);
            }
            var protocalExten = {
              name:"protocal",
              value:this.getProtocol()
            };
            //add by byl 在此处添加,BU自定义扩展
            if(!_.isEmpty(this.extension)){
                if(_.isArray(this.extension)){
                  params.head.extension = this.extension;
                }else if(_.isObject(this.extension)){
                  params.head.extension = [];
                  params.head.extension.push(this.extension);
                }
              params.head.extension.push(protocalExten);
            }else{
              params.head.extension = [protocalExten];
            }
          } else if (this.method.toLowerCase() !== 'get' && !this.usehead && this.contentType !== baseModel.CONTENT_TYPE_JSONP) {
            if (this.headinfo) {
              params.head = this.headinfo;
            }
          }

          this.onBeforeCompleteCallback = function (datamodel) {
            if (this.result instanceof AbstractStore) {
              //soa 数据量大,为精简locastorage,去掉ResponseStatus部分 shbzhang 2014.4.17
              try {
                //              if(datamodel.ResponseStatus){
                //                delete datamodel.ResponseStatus;
                //              }
                var tagNew = this.getTag();
                this.result.set(datamodel, tagNew);
              } catch (e) {
              }
            }
          };
          
          //调用父类的数据请求方法
          if (params.head && !params.head.cid) {
            MessageCenter.subscribe('clientidGot', _.bind(function(cid){
              params.head.cid = cid;
              this._execute(onComplete, onError, scope, onAbort, params);  
            }, this));
          } else {
            this._execute(onComplete, onError, scope, onAbort, params); 
          }
        } else {
          if (typeof onComplete === 'function') {
            onComplete.call(scope || this, cache);
          }
        }
      },
        /**
       * @see cModel#excute
       * @deprecated
       */
      excute: function (onComplete, onError, ajaxOnly, scope, onAbort) {
        this.execute(onComplete, onError, ajaxOnly, scope, onAbort);
      },

      /*
       * 返回response head,兼容restful和SOA2
       * @param {Object} data 返回数据
       * @return {Object} head 格式为{'success':true}
       * @private
       */
      _getResponseHead: function (data) {
        var fromSOA = !!data.ResponseStatus;
        var head = fromSOA ? data.ResponseStatus : data.head,
           success = false, overdue = false,verification = false;
        if (fromSOA && head) {
          //如果head中有二级授权，更新二级授权
          var extension = head.Extension;
          if(extension && extension.length){
            var scop = this;
            _.each(extension,function(item){
              if(item && item.Id == "sauth"){
                scop.authStore.set(item.Value);
              }
            });
          }
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
                  if (this.checkAuth) {
                    overdue = true;
                    //在此将所有的auth信息都置空
                    this.headStore.setAuth("");
                    this.userStore.removeUser();
                    //删除二级授权的sAuth内容
                    this.authStore.remove();
                  }
                  break;
                }else if(error && error.ErrorCode && error.ErrorCode == '需要soa新增返回值'){
                  verification = true;
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
        return {
          'success': success,
          'overdue': overdue,
          'verification':verification
        };
      },
      
      /**
       * 设置model 的param对象，有两种使用情况  
       * 1. 当只传一个参数key，且key为对象，此时key为要设置的值  
       * 2. 传两个参数，第一个参数key为字符串(允许.分隔),第二个参数val为要设置的值
       * 注意两次调用setParam,两次参数会做合并处理
       * 
       * @param {Object|string} key 参数，
       * @param {Object} [val] 参数值
       */
      setParam: function (key, val,replace) {
        var param = {},isStore = this.param instanceof AbstractStore;
        if(_.isObject(key)){
          param = key;
          if(_.isUndefined(replace) && _.isBoolean(val)){
            replace = val;
          }
        }else {
          param[key] = val;
        }
        if(replace){ //替换需要整体替换
          if(isStore){
            this.param.set(param);
          }else{
            this.param = param;
          }
        }else{ //修改属性的话，只需要修改个别属性
          for (var i in param) {
            if (isStore) {
              this.param.setAttr(i, param[i]);
            } else {
              if (this.param === null){this.param = {};}
              cObject.set(this.param, i, param[i]);
            }
          }
        }
      },
      /**
       * 清空结果数据git
       */
      clearResult: function () {
        if (this.result && typeof this.result.remove === 'function') {
          this.result.remove();
        } else {
          this.result = null;
        }
      }
    });


    return Model;
  });
