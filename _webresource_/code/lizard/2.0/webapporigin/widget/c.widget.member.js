/**********************************
 * @author:       cmli@Ctrip.com
 * @description:  组件Member
 * @see: http://git.dev.sh.ctripcorp.com/cmli/ctrip-h5-document/blob/master/widget/t.widget.member.md
 *
 */
define(['cUserModel', 'cWidgetFactory', 'cHybridFacade', 'cUtility', 'cUtilityCrypt', 'CommonStore'], function ( UserModel, WidgetFactory, Facade, cUtility, cUtilityCrypt, CommonStore) {
  "use strict";

  var WIDGET_NAME = 'Member';
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
    REGISTER: 'https://' + domain + '/H5Register/index.html#register'
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
      param = cUtility.getUrlParams(options.param);
      var backUrl = (param && param.backurl) ? decodeURIComponent(param.backurl) : "";
      var from = (param && param.from) ? decodeURIComponent(param.from) : "";
      var pHost = lt.protocol + "//" + lt.host;
      //判断参数是否为完整url，不是的话，补全host
      if (cUtility.validate.isUrl(backUrl)) {
        param.backurl = backUrl;
      } else {
        if (backUrl !== "") {
          param.backurl = pHost + backUrl;
        }
      }
      if (cUtility.validate.isUrl(from)) {
        param.from = from;
      } else {
        if (from !== "") {
          param.from = pHost + from;
        }
      }
      var paramStr = $.param(param);
      if(paramStr != ""){
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
     * 自动登录
     * @param url
     */
    autoLogin: function (opt) {
      var url = opt.url || window.location.href;
      //var result = cUtility.urlParse(url),
      var shortToken = window.localStorage.getItem("LIZARD_GETUSERINFOS"),
        userStore = CommonStore.UserStore.getInstance(),
        headStore = CommonStore.HeadStore.getInstance(),
        thirdPartMember =  cUtility.getUrlParam(url, '__ThirdPartMember__'),
        self = this;
      //如果URL中存在shortToken,去取登录信息
      if(shortToken){
        //获取到shortToken之后，删除缓存中的shortToken
        window.localStorage.removeItem("LIZARD_GETUSERINFOS");
        //首先删除老的用户信息
        userStore.removeUser();
        // 新的登录方式，获取需要jsonp请求,如果有值的话，直接请求新的用户信息
        var userModel = UserModel.UserLoginModel.getInstance();
        userModel.param = {
          'token': shortToken,
          'IsH5' : 1,
          'jsonpCallback':'callbackfn'
        };
        var sucCb = function (data) {
          //获取信息成功才替换本地用户信息
          if(data.UserID){
            data.LoginName = data.LoginName || "";
            headStore.setAuth(data.Auth);
            userStore.setUser(data);
            userStore.setExpireTime(data.ExpiredTime);
          }
          //继续app初始化过程
          opt.callback && opt.callback();
          //获取第三方信息
          getThirdParts();
        };
        var errCb = function () {
          self.memberLogin();
        };
        userModel.excute(sucCb, errCb);
      } else {
        //继续app初始化过程
        opt.callback && opt.callback();
      }
      //在确保app渲染完成之后，在此处去调用获取第三方信息，要确保不是从登陆页过来，不然会影响到页面渲染
      if(!shortToken && thirdPartMember){
        //获取第三方信息
        getThirdParts();
      }


      getClientId();

      //在此处添加第三方登录
      function getThirdParts(){
        //获取用户信息成功后，在此处添加调用获取用户第三方登录的信息
        var thirdPartModel = UserModel.ThirdPartInfoModel.getInstance();
        var sucFun = function(data){
          if(data.Members && data.Members.length > 0 ){
            //调用localstorage，将信息写到缓存中
            userStore.setThirdParts(data.Members);
          }else{
            //如果查询到的数据没有第三方绑定帐号,置空
            userStore.setThirdPartsNon();
          }
        };
        var errFun = function(data){
          //暂不做处理
        }
        thirdPartModel.excute(sucFun,errFun);
      }

      //获得新的clientId
      function getClientId(){
        var lstore = window.localStorage,
          cid = lstore.getItem('GUID'),
          cookieCid = cUtility.getCookie("GUID"),
          clientModel = UserModel.ClientIdModel.getInstance();

        //如果cid不存在,发起查询服务
        if(!cookieCid && (!cid || cid.indexOf('-')>-1) ){
          if(cid){
            //老的cid
            lstore.setItem('BGUID',cid);
            clientModel.setParam("PreviousID",cid);
          }
          clientModel.excute(function (data) {
            if(data && data.ClientID){
              lstore.setItem('GUID',data.ClientID);
              headStore.setAttr('cid',data.ClientID)
              cUtility.setCookie("GUID",data.ClientID,new Date(new Date().getTime()+3*360*24*60*60*1000),"/",".ctrip.com");
            }
          })
        }else {
          if(!cookieCid){
            //cookie中没有，但是localStorage中有，须写入cookie中,，默认存储三年时间
            cUtility.setCookie("GUID",cid,new Date(new Date().getTime()+3*360*24*60*60*1000),"/",".ctrip.com");
          }
        }
      }
    },
    /**
     * 获取登录auth完成
     * @returns {boolean}
     */
    app_finished_login: function () {
      return false
    }
  };

  var HybridMember = {
    memberLogin: function (options) {
      Facade.request({ name: Facade.METHOD_MEMBER_LOGIN, callback: options.callback, isShowNonMemberLogin: options.isShowNonMemberLogin });
    },

    nonMemberLogin: function (options) {
      Facade.request({ name: Facade.METHOD_NON_MEMBER_LOGIN, callback: options.callback });
    },

    register: function (options) {
      Facade.request({ name: Facade.METHOD_REGISTER, callback: options.callback });
    },

    autoLogin: function (options) {
      Facade.request({ name: Facade.METHOD_AUTO_LOGIN, callback: options.callback });
    },
    app_finished_login: function (options) {
      Facade.request({ name: Facade.METHOD_APP_FINISHED_LOGIN, userInfo: options.userInfo, callback: options.callback });
    }
  };

  WidgetFactory.register({
    name: WIDGET_NAME,
    fn: (cUtility.isInApp() || Lizard.app.code.is('GS')) ? HybridMember : Member
  });
});
