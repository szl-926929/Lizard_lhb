define(['cHybridFacade'], function (Facade) {
  "use strict";
  var HybridMember = {
    /**
     * 跳转至用户登录
     * @method cMemberService.memberLogin
     * @param {object} options
     * @param {boolean} options.isShowNonMemberLogin 是否用户登录界面显示非会员登录入口
     * @param {function} [options.callback] 仅hybrid可用 登录成功失败的回调
     * @param {string} [options.param] 仅web可用, 向登录页面传递参数
     * @example
     * member.memberLogin({
     *   callback: function() {},
     *   param: 'from=url&backurl=url'
     * });
     */
    memberLogin: function (options) {
      var callback = function(data){
        try{
          if(data && data.data && data.data.UserID){
            //登录成功
            require(['cCommonStore'],function(CommonStore){
              var userStore = CommonStore.UserStore.getInstance();
              userStore.setUser(data.data);
              options.callback(data); //回调先执行
            });
          }else{
            options.callback(data); //即使没有登陆成功，仍然要执行BU回调
          }
        }catch(e){
          options.callback(data); //如果上面执行错误 仍然要执行bu的回调
        }
      };
      Facade.request({ name: Facade.METHOD_MEMBER_LOGIN, callback: callback, isShowNonMemberLogin: options.isShowNonMemberLogin });
    },
    //* @param {string} [options.from] 仅web可用，登录成功跳转页
    //  * @param {string} [options.backurl] 仅web可用，登录页面回退跳转页
    /**
     * 非会员登录
     * @method cMemberService.nonMemberLogin
     * @param {object} options
     * @param {function} options.callback 非会员登录成功的回调
     */
    nonMemberLogin: function (options) {
      Facade.request({ name: Facade.METHOD_NON_MEMBER_LOGIN, callback: options.callback });
    },

    /**
     * 用户注册
     * @method cMemberService.register
     * @param {object} options
     * @param {function} options.callback 注册成功的回调
     * @param {string} [options.param] 仅web可用, 向登录页面传递参数
     */
    register: function (options) {
      Facade.request({ name: Facade.METHOD_REGISTER, callback: options.callback });
    },

    /**
     * 用户自动登录
     * @method cMemberService.autoLogin
     * @param {object} options
     * @param {function} options.callback 自动登录成功的回调
     */
    autoLogin: function (options) {
      Facade.request({ name: Facade.METHOD_AUTO_LOGIN, callback: options.callback });
    },


    /**
     * H5登陆完成，将注册信息告知Native
     * @method cMemberService.finishedLogin
     * @param {object} options
     * @param {object} options.userInfo H5登录用户数据
     * @param {function} options.callback Native登录成功的回调
     */
    finishedLogin: function (options) {
      Facade.request({ name: Facade.METHOD_APP_FINISHED_LOGIN, userInfo: options.userInfo, callback: options.callback });
    }
  };

  return HybridMember;
});
