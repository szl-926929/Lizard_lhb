/**
 * 与用户登录相关的工具方法
 * @author shbzhang@ctrip
 * @namespace cMemberService
 * @example
 * define(['cMemberService'], function(member) {
 *   // 是否登录
 *   member.isLogin();
 *   // 获取用户
 *   member.getUser();
 * });
 */
define([(Lizard.app.vendor.is('CTRIP') || Lizard.isHybrid) ? 'cHybridMember' : 'cWebMember', 'cUserStore'], function (Member, UserStore) {

  var userStore = UserStore.getInstance(); //add by byl  此处修改原有bug并且兼容如下属性为方法

  /**
   * 判断当前用户是否登录
   * @method cMemberService.isLogin
   * @returns {Object|boolean} isLogin 当前用户是否登录
   * @see UserStore#isLogin
   */
  Member.isLogin = function(callback){return userStore.isLogin(callback);};

  /**
   * 判断当前用户是否是非会员登录
   * @method cMemberService.isLogin
   * @returns {Object|boolean} isLogin 当前用户是否登录
   * @see UserStore#isLogin
   */
  Member.isNonUser = function(callback){return userStore.isNonUser(callback);};

  /**
   * 返回用户信息
   * @method cMemberService.getUser
   * @returns {Object} userinfo 用户信息
   * @see UserStore#getUser
   */
  Member.getUser = function(){return userStore.getUser();};

  /**
   * 返回当前登录用户的用户名
   * @method cMemberService.getUserName
   * @returns {String} UserName 用户名
   * @see UserStore#getUserName
   */
  Member.getUserName = function(){return userStore.getUserName();};


  /**
   * 返回当前登录用户的ID
   * @method cMemberService.getUserId
   * @returns {*|string} userId 用户Id
   * @see UserStore#getUserId
   */
  Member.getUserId = function(){return userStore.getUserId();};


  return Member;
});