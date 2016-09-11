/**
 * Created by bianyl on 2015/8/24.
 */
define(['cCoreInherit','cLocalStore'], function (cCoreInherit, cLocalStore) {

  var authStore = new cCoreInherit.Class(cLocalStore, {
    __propertys__: function () {
      /**
       * HeadStore的键值，默认为HEADSTORE
       * @var {string} cHeadStore.key
       */
      this.key = 'AUTHSTORE';
      /**
       * HeadStore的数据过期时间,默认为15D
       * @var {string} cHeadStore.lifeTime
       */
      this.lifeTime = '7D';
    },
    /*
     * @method cCommonStore.HeadStore.initialize
     * @param $super
     * @param options
     * @description 复写自顶层Class的initialize，赋值队列
     */
    initialize: function ($super, options) {
      $super(options);
    }
  });
  return authStore;
});