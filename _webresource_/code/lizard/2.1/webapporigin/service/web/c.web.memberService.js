/**
 * @File c.web.memeberServic
 * @Description web下的登录服务
 * @author shbzhang@ctrip.com
 * @date  2014/09/19 15:06
 * @version V1.0
 */
define(['cUserModel', 'cUtilValidate', 'cUtilPath','cUtilCryptBase64', 'cCommonStore','cUtilCommon','cLocalStore','cCookieStorage', 'cMessageCenter'],
  function (UserModel, cUtilValidate,cUtilPath, CryptBase64, CommonStore,cUtilCommmon,cLocalStore,cCookieStorage, MessageCenter) {
  "use strict";

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

  var LINKS = {
    MEMBER_LOGIN: 'https://' + domain + '/H5Login/#login',
    REGISTER: 'https://' + domain + '/H5Register/'
  };

  /**
   * 获得url
   * @param link
   * @param options
   * @private
   */
  var _getLink = function (link, options) {
    var url = link, lt = location;
    var param = (options && options.param && typeof options.param === 'string') ? options.param : "";
    if (param) {
      param = cUtilPath.getUrlParams(options.param);
      var backUrl = (param && param.backurl) ? decodeURIComponent(param.backurl) : "";
      var from = (param && param.from) ? decodeURIComponent(param.from) : "";
      var pHost = lt.protocol + "//" + lt.host;
      //判断参数是否为完整url，不是的话，补全host
      if (cUtilValidate.isUrl(backUrl)) {
        param.backurl = backUrl;
      } else {
        if (backUrl !== "") {
          param.backurl = pHost + backUrl;
        }
      }
      if (cUtilValidate.isUrl(from)) {
        param.from = from;
      } else {
        if (from !== "") {
          param.from = pHost + from;
        }
      }
      var paramStr = $.param(param);
      if (paramStr) {
        url = url + "?" + paramStr;
      }
    }
    window.location.href = url;
  };

  var Member = {

    memberLogin: function (options) {
      _getLink(LINKS.MEMBER_LOGIN, options);
    },

    nonMemberLogin: function (options) {
      //_getLink(LINKS.NON_MEMBER_LOGIN, options);
      var model = UserModel.NotUserLoginModel.getInstance();

      options = _.extend({
        callback: function () {
        }
      }, options || {});

      model.excute(options.callback, options.callback);
    },

    register: function (options) {
      _getLink(LINKS.REGISTER, options);
    },

    /**
     * 检查url是否有token参数，如有则尝试自动登录
     * @param {object} [opt] 输入参数
     * @param {string} [opt.url=location.href] url
     */
    autoLogin: function (opt) {
      var url = opt.url || window.location.href;
      var host = window.location.host;
      var path = window.location.pathname;
      //var token = cUtilPath.getUrlParam(url, '__token__'),
      var  shortToken = cUtilPath.getUrlParam(url, 'GetUserInfos'),
        userStore = CommonStore.UserStore.getInstance(),
        headStore = CommonStore.HeadStore.getInstance(),
        cookieStorage = cCookieStorage.getInstance(),
        thirdPartMember =  cUtilPath.getUrlParam(url, '__ThirdPartMember__'),
        cookieAuth = cookieStorage.get('cticket'), //暂时加一下，解决微信中的问题
        self = this;

      //获取用户信息成功回调
      var sucCb = function (data) {
        //获取信息成功才替换本地用户信息
        if(data.UserID){
          data.LoginName = data.LoginName || "";
          if(data.ResponseStatus){
            delete data.ResponseStatus;
            delete data.Result;
          }
         // userStore.setAuth(data.Auth);
          data.Auth = data.Auth ? data.Auth : cookieAuth;
          userStore.setUser(data);
         if(new Date(data.ExpiredTime) != "Invalid Date") { userStore.setExpireTime(data.ExpiredTime);}
        }
        //先删除url中的getUserInfos参数
        removeGetUserInfos();
        //继续app初始化过程
        if(opt.callback){opt.callback();}
        //获取第三方信息
        getThirdParts();
      };

      //获取用户信息成功回调
      var errCb = function () {
        //此处 不跳不跳转登录？？
        self.memberLogin();
        //opt.callback && opt.callback();
      };

      //获取用户信息成功之后，删除url中的GetUserInfos参数
      var removeGetUserInfos = function(){
        var name = "GetUserInfos";
        var re = new RegExp("(\\\?|&)" + name + "=([^&]+)(&|$)", "i"), m = url.match(re);
        var tokenVal =  m?m[2]:"";
        if(tokenVal){
          //var tokenStr = "GetUserInfos="+tokenVal;
          //url = url.replace("?"+tokenStr,"").replace("&"+tokenStr,""); //判断多个参数
          url = url.replace(tokenVal,"").replace(/[\S\s]GetUserInfos=/,"");
          if(window.history.replaceState){
            window.history.replaceState(null,document.title,url);
          }else{
            window.location.replace(url);
          }
        }
      };

      //如果URL中存在用户auth,去取登录信息
      var userModel;
      if(shortToken){
        //首先删除老的用户信息
        userStore.removeUser();
        // 新的登录方式，获取需要jsonp请求,如果有值的话，直接请求新的用户信息
        userModel = UserModel.UserLoginModel.getInstance();
        userModel.param = {
          'token': shortToken,
          'IsH5' : 1,
          'jsonpCallback':'callbackfn'
        };
        userModel.excute(sucCb, errCb);
      }else if(cookieAuth && cookieAuth != userStore.getAuth() && Lizard.app.code.is('WEIXIN') && !host.match(/^accounts\.ctrip\.com/i) && path.indexOf("H5Login") < 0) {
        //只在微信下有小
        //如果cookie 中保存了auth, 且cookie中的auth 与 localStorage中auth不同,
        //根据auth获取用户信息
        userStore.isLogin(function(isLogin){
          if(isLogin){ //判断是会员登录时，才会考虑获取用户信息
            userStore.setAuth(cookieAuth);
            userModel = UserModel.GetUserModel.getInstance();
            userModel.param = {
              'Auth': cookieAuth
            };
            userModel.checkAuth = false; //cookie方式登陆下，不自动跳转到登录页面
            userModel.excute(sucCb, errCb);
          }else{
            //微信下非会员登录继续走！不要停~~
            if(opt.callback){opt.callback();}
          }
        });
      }else{
        //继续app初始化过程
        if(opt.callback){opt.callback();}
      }
      //在确保app渲染完成之后，在此处去调用获取第三方信息，要确保不是从登陆页过来，不然会影响到页面渲染
      if(!shortToken && thirdPartMember){
        //获取第三方信息
        getThirdParts();
      }
      if(!Lizard.app.code.is('TV')){
        //检查clientId
        getClientId();
      }

      //在此处添加第三方登录
      function getThirdParts(){
        //获取用户信息成功后，在此处添加调用获取用户第三方登录的信息
        var thirdPartModel = UserModel.ThirdPartInfoModel.getInstance();
        var sucFun = function(data){
          if(data.Members && data.Members.length > 0 ){
            //将信息写到缓存中
            userStore.setThirdParts(data.Members);
          }else{
            //如果查询到的数据没有第三方绑定帐号,置空
            userStore.setThirdPartsNon();
          }
        };
        var errFun = function(data){
          //暂不做处理
        };
        thirdPartModel.excute(sucFun,errFun);
      }
      //获得新的clientId
      function getClientId(){
        var
          clientModel = UserModel.ClientIdModel.getInstance(),
          headStore = CommonStore.HeadStore.getInstance(),
          cookieStorage = cCookieStorage.getInstance(),
          cookieCid = cookieStorage.get("GUID"),
          lstore = headStore.sProxy.proxy,
          cid = lstore.getItem('GUID');
          //protocol = location.protocol;
        //如果cid不存在或者是老的cid格式,发起查询服务
        if(!cookieCid && (!cid || cid.indexOf('-')>-1)){
          //如果CID存在,此时应为一个老格式,做一个备份
          if(cid){
            lstore.setItem('BGUID',cid);
            clientModel.setParam("PreviousID",cid);
          }
          clientModel.excute(function (data) {
            if(data && data.ClientID){
              lstore.setItem('GUID',data.ClientID);
              headStore.setAttr('cid',data.ClientID);
              cookieStorage.set("GUID",data.ClientID,new Date(new Date().getTime()+3*360*24*60*60*1000),"/",".ctrip.com");
              MessageCenter.publish('clientidGot', [data.ClientID]);
            }
          });
        }else {
          if(!cookieCid){
            //cookie中没有，但是localStorage中有，须写入cookie中,，默认存储三年时间
            cookieStorage.set("GUID",cid,new Date(new Date().getTime()+3*360*24*60*60*1000),"/",".ctrip.com");
          }
        }
      }
    },
      /**
       * 获取登录auth完成
       * @returns {boolean}
       */
      app_finished_login: function () {
        return false;
      }
    };

  return Member;

});
