/**
 * @File c.user.store.js
 * @author zsb张淑滨 <oxz@ctrip.com|shbzhang@ctrip.com>
 * @description  用户数据Store
 */

define(['cCoreInherit', 'cLocalStore', 'cLocalStorage', 'cUtilCommon','cHeadStore','cAuthStore'], function (cCoreInherit, cLocalStore, cLocalStorage,cUtilCommon,cHeadStore,cAuthStore) {

  var ls = cLocalStorage.localStorage;
  /**
   * 用户数据Store,同时操作USER和USERINFO, 其中USERINFO是兼容老的数据格式,可以去掉.
   * 大部分的操作，已封装至cMemberService,
   * @namespace Store.cCommonStore.cUserStore
   * @example 使用方式
   *  var userStore = UserStore.getInstance();
   * @example 数据格式为
   * {
   *  "Address": "",
   *  "Auth": "E82047658BD3D8321E1EEB0F7F5D63EB1A5566AA70098AFE847505E34BD8BD5B",
   *  "Birthday": "19920624",
   *  "BMobile": "13814555555",
   *  "Email": "",
   *  "Experience": 106663,
   *  "ExpiredTime": "/Date(-62135596800000-0000)/",
   *  "Gender": 1,
   *  "IsNonUser": false,
   *  "LoginName": "",
   *  "Mobile": "13814555555",
   *  "PostCode": "",
   *  "UserID": "21634352BAC43044380A7807B0699491",
   *  "UserName": "ggggg",
   *  "VipGrade": 30,
   *  "VipGradeRemark": "钻石贵宾"
   * }
   */
  var UserStore = new cCoreInherit.Class(cLocalStore, {
    __propertys__: function () {
      /**
       * Store Key值为USER
       * @readonly
       * @var {string} [Store.cCommonStore.cUserStore.key=USER]
       */
      this.key = 'USER';

      /**
       * Store数据过期时间，默认为30D
       * @var {string} [Store.cCommonStore.cUserStore.lifeTime=30D]
       */
      this.lifeTime = '30D';

      this.isInApp = Lizard.app.vendor.is("CTRIP") || Lizard.app.code.is('TV') || Lizard.app.code.is('TY');
    },
    /*
     * @method cCommonStore.UserStore.initialize
     * @param $super
     * @param options
     * @description 复写自顶层Class的initialize，赋值队列
     */
    initialize: function ($super, options) {
      $super(options);
    },

    /**
     * 返回用户信息
     * @method Store.cCommonStore.cUserStore.getUser
     * @param Function callback 强制去取用户信息
     * @returns {Object} userinfo 用户信息
     * @example 格式为
     * value": {
		 *    "Address": "",
		 *    "Auth": "CF7D8226D139CF771E2C860CA32EDEA01DDD8DDF07B72BB372B5C8726F718475",
		 *    "Birthday": "20071211",
		 *    "BMobile": "13814555555",
		 *    "Email": "",
		 *    "Experience": 106663,
		 *    "ExpiredTime": "/Date(-62135596800000-0000)/",
		 *    "Gender": 1,
		 *    "IsNonUser": false,
		 *    "LoginName": "",
		 *    "Mobile": "13814555555",
		 *    "PostCode": "",
		 *    "UserID": "21634352BAC43044380A7807B0699491",
		 *    "UserName": "呵呵呵呵呵呵",
		 *    "VipGrade": 30,
		 *    "VipGradeRemark": "钻石贵宾"
		 * }
     * @deprecated cServiceMember.getUser
     */
    getUser: function (callback) {
      if(_.isFunction(callback)){
        //如果有回调函数，则使用回调函数强制获取用户信息
        var scop = this;
        require(['cUserModel'],function (UserModel) {
          //获取用户信息成功回调
          var sucCb = function (data) {
            //获取信息成功才替换本地用户信息
            if(data.UserID){
              data.LoginName = data.LoginName || "";
              if(data.ResponseStatus){
                delete data.ResponseStatus;
                delete data.Result;
              }
              data.Auth = data.Auth ? data.Auth : cookieAuth;
              scop.setUser(data);
              if(new Date(data.ExpiredTime) != "Invalid Date"){
                scop.setExpireTime(data.ExpiredTime);
              }
            }
            callback(scop.getUser());
          };
          //获取用户信息成功回调
          var errCb = function () {
            callback(scop.getUser());
          };
          var cookieAuth = cUtilCommon.getCookie("authkey");
          if(cookieAuth){
            scop.setAuth(cookieAuth);
            var userModel = UserModel.GetUserModel.getInstance();
            userModel.param = {
              'Auth': cookieAuth
            };
            userModel.checkAuth = false; //cookie方式登陆下，不自动跳转到登录页面
            userModel.excute(sucCb, errCb);
          }
        });
      }else{
        //如果没有回调，还走老的方式
        var userinfo = ls.oldGet('USERINFO');
        userinfo = userinfo && userinfo.data || null;
        if (userinfo) {
          this.set(userinfo);
        }
        return userinfo || this.get();
      }
    },

    /**
     * 保存用户信息
     * @method Store.cCommonStore.cUserStore.setUser
     * @param {Object}  data UserInfo用户信息
     */
    setUser: function (data) {
      this.set(data);
      var timeout = ls.getExpireTime('USER');
      var userinfo = { data: data, timeout: timeout };
      ls.oldSet('USERINFO', JSON.stringify(userinfo));
    },

    /**
     * 移除用户信息，只清空本地登录状态
     * @method Store.cCommonStore.cUserStore.removeUser
     * @description 建议使用cMemberService.logout
     */
    removeUser: function () {
      ls.oldRemove('USERINFO');
      this.remove();
    },

    /**
     * 返回当前用户是否是未注册用户
     * @method Store.cCommonStore.cUserStore.isNonUser
     * @returns {boolean} isNonUser 返回当前用户是否是未注册用户
     * @deprecated
     */
    isNonUser: function (callback) {
      var user = this.getUser();
      var isNonUser = user && !!user.IsNonUser;
      if(!this.isInApp){ //H5
        var cookieDuid =  cUtilCommon.getCookie("DUID"),
          nonUser =  cUtilCommon.getCookie("IsNonUser");
        isNonUser = (!!cookieDuid && nonUser == "T") || (user && !!user.IsNonUser);
      }
      if(_.isFunction(callback)){
        //如果有回调函数，则使用回调函数强制获取用户信息
        if(isNonUser || this.isInApp){
          callback(isNonUser);
        }else{
          loginAndNonUser(callback,"isNonUser");
        }
      }else{
        //如果没有回调，还走老的方式
        return isNonUser;
      }
    },
    /**
     * 返回当前用户登录，包括会员以及非会员
     * @method Store.cCommonStore.cUserStore.isLoginWithoutType
     * @returns {boolean} isNonUser 返回当前用户是否是未注册用户
     * @deprecated
     */
    isLoginWithoutType:function(callback){
      var user = this.getUser();
      var isLoginWithoutType = user && !!user.Auth;
      if(!this.isInApp){
        var cookieDuid =  cUtilCommon.getCookie("DUID");
        isLoginWithoutType = (!!cookieDuid) || (user && !!user.Auth); //只要有auth即可以判断登录，或者cookie中存入了DUID也是可以判断登录
      }
      if(_.isFunction(callback)){
        if(isLoginWithoutType || this.isInApp){
          callback(isLoginWithoutType);
        }else{
          loginAndNonUser(callback,"isLoginWithoutType");
        }
      }else{
        return isLoginWithoutType;
      }
    },
    /**
     * 判断当前用户是否登陆
     * @method UserStore.isLogin
     * @returns {Object|boolean} isLogin 当前用户是否登陆
     * @deprecated 建议使用memberService.isLogin代替
     */
    isLogin: function (callback) {
      var user = this.getUser();
      var isLogin = user && !!user.Auth && !user.IsNonUser;
      if(!this.isInApp){
        var cookieDuid =  cUtilCommon.getCookie("DUID"),
          isNonUser =  cUtilCommon.getCookie("IsNonUser");
        isLogin =  (!!cookieDuid && isNonUser != "T") || (user && !!user.Auth && !user.IsNonUser);
      }
      if(_.isFunction(callback)){
        //如果有回调函数，则使用回调函数强制获取用户信息
        if(isLogin || this.isInApp){
          callback(isLogin);
        }else{
          loginAndNonUser(callback,"isLogin");
        }
      }else{
        //如果没有回调，还走老的方式
        return isLogin;
      }
    },


    /**
     * 返回当前登陆用户的用户名
     * @method Store.cCommonStore.cUserStore.getUserName
     * @returns {String} UserName 用户名
     * @deprecated 建议使用cMemberService.getUserName代替
     */
    getUserName: function () {
      var user = this.getUser();
      return user && user.UserName; //add by byl 此处支持localstorage中的user信息被删除
    },

    /**
     * 返回当前登陆用户的ID
     * @method Store.cCommonStore.cUserStore.getUserId
     * @returns {*|string} userId 用户Id
     */
    getUserId: function () {
      var user = this.getUser() || {};
      return user.UserID || cUtilCommon.getGuid();
    },

    /**
     * @method Store.cCommonStore.cUserStore.getAuth
     * @returns {*|string}
     * @description 返回当前登陆用户的Auth值
     */
    getAuth: function () {
      var userinfo = this.getUser();
      return userinfo && userinfo.Auth;
    },

    /**
     * @method Store.cCommonStore.cUserStore.setAuth
     * @param {String} auth 用户auth字段
     * @description 返回当前登陆用户的Auth值
     * @
     */
    setAuth: function (auth) {
      var isLogin = this.isLogin(),
        userinfo = this.getUser() || {};
      userinfo.Auth = auth;
      userinfo.IsNonUser = isLogin ? false : true;
      this.setUser(userinfo);
    },
    /**
     * @method Store.cCommonStore.cUserStore.setThirdParts
     * @param {Object} membersInfo 所有第三方用户信息
     * @description 存储当前用户所有的第三方登录信息
     */
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
    /**
     * @method Store.cCommonStore.cUserStore.setThirdPartsNull
     * @description 删除当前缓存中的第三方信息
     */
    setThirdPartsNon:function(){
      var isLogin = this.isLogin(),
        userinfo = this.getUser() || {};
      //此过程中如果退出登录的话，不写入第三方用户信息
      if(!isLogin){
        return;
      }
      userinfo.thirdParts = "";
      this.setUser(userinfo);
    },
    /**
     * @method Store.cCommonStore.cUserStore.getThirdParts
     * @description 获取当前用户的所有的第三方登录信息
     */
    getThirdParts:function(){
      var userinfo = this.getUser();
      return userinfo && userinfo.thirdParts;
    },
    /**
     * @method Store.cCommonStore.cUserStore.getThirdPart
     * @param {String} thirdPartType 必填，所有第三方用户信息
     * @description 获取当前用户的某个第三方登录信息
     */
    getThirdPart:function(thirdPartType){
      var userinfo = this.getUser();
      if(thirdPartType && userinfo && userinfo.thirdParts && userinfo.thirdParts.length > 0){
        var thirdParts = userinfo.thirdParts;
        return _.find(thirdParts,function(item){
          if(item.ThirdPartType == thirdPartType){
            return item;
          }
        });
      }
    },
    /**
     * @method Store.cCommonStore.cUserStore.setNonUser
     * @param {String} auth 用户auth
     * @description 设置当前用户为非注册用户
     */
    setNonUser: function (auth) {
      var HeadStore = cHeadStore.getInstance();
      HeadStore.setAttr('auth', auth);
      var data = {};
      data.Auth = auth;
      data.IsNonUser = true;
      this.setUser(data);
    },

    /**
     * @method Store.cCommonStore.cUserStore.setExpireTime
     * @param $super
     * @param timeout
     * @description 设置过期时间，同时会操作USERINFO
     */
    setExpireTime: function ($super, timeout) {
      $super(timeout);
      var data = this.get();
      var userinfo = { data: data, timeout: timeout };
      ls.oldSet('USERINFO', JSON.stringify(userinfo));
    },

    /**
     * 删除authStore中的sAuth的内容
     */
    removeSAuth:function(){
      var authStore = cAuthStore.getInstance();
      authStore.remove();
    }
  });

  function loginAndNonUser(callback,type){
    require(['cUserModel'],function (UserModel) {
      //获取用户信息成功回调
      var sucCb = function (data) {
        var isLogin = data.IsLogin,
          isNonUser = data.IsNonUser;
        if(type == "isLogin"){
          if(isLogin == "T" && isNonUser != "T" ){
            //此处跟以前逻辑一样，非会员登录的isLogin 返回false
            callback(true);
          }else{
            callback(false);
          }
        }else if(type == "isNonUser"){
          if(isNonUser == "T"){
            callback(true);
          }else{
            callback(false);
          }
        }else if(type == "isLoginWithoutType" ){
          if(isLogin == "T"){
            //此处跟以前逻辑一样，非会员登录的isLogin 返回false
            callback(true);
          }else{
            callback(false);
          }
        }
      };
      //获取用户信息成功回调
      var errCb = function () {
        callback(false);
      };
      var loginModel = UserModel.IsLoginModel.getInstance();
      loginModel.checkAuth = false; //cookie方式登陆下，不自动跳转到登录页面
      loginModel.excute(sucCb, errCb);
    });
  }
  return UserStore;
});