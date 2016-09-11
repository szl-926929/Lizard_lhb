(function() {
  window.app = {};
  window.app.callback = function (options) {
    var methods = {
      'init_member_H5_info_tieyou' : function (params) {
        require(['cCommonStore'], function (CommonStore) {
          var wStore = window.localStorage;
          var userStore = CommonStore.UserStore.getInstance();
          var headStore = CommonStore.HeadStore.getInstance();
          //用户信息
          if (params.userInfo) {
            try {
              params.userInfo.data.BMobile = params.userInfo.data.BindMobile;
              userStore.setUser(params.userInfo.data);
              headStore.setAuth(params.userInfo.data.Auth);
            } catch (e) {
              console.log('set data error');
            }
          } else {
            userStore.removeUser();
          }
          //保存原始参数值
          wStore.setItem('CINFO', JSON.stringify(params));
        });
      }
    };
    if (options && typeof methods[options.tagname] === 'function') {
      methods[options.tagname](options.param);
    }
  };
})();