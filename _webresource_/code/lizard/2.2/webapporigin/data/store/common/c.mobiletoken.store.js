/**
 * @File c.mobiletoken.store.js
 * @author zsb张淑滨 <oxz@ctrip.com|shbzhang@ctrip.com>
 * @description 手机号查询临时Token Store
 */
/**
 * 手机号查询TokenStore
 * @namespace Store.cCommonStore.cMobileTokenStore
 */
define(['cCoreInherit','cLocalStore'], function (cCoreInherit, cLocalStore) {


  var cMobileTokenStore = new cCoreInherit.Class(cLocalStore, {
    __propertys__: function () {
      /**
       * HeadStore的键值，默认为HEADSTORE
       * @var {string} cMobileTokenStore.key
       */
      this.key = 'PAUTH';
      /**
       * HeadStore的数据过期时间,默认为15D
       * @var {string} cMobileTokenStore.lifeTime
       */
      this.lifeTime = '30M';

    },

    set:function($super,data){
      $super(data);

      require(['cHybridShell'],function(cHybridShell){
        var fn = new cHybridShell.Fn('do_business_job');
        fn.run(1,'setMobileToken',{
          'MobileToken': data
        });
      });
    }
  });


  return cMobileTokenStore;
});