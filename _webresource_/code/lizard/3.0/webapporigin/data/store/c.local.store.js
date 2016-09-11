/**
 * 以localstorage为数据存储的Store
 * @author zsb张淑滨 <shbzhang@Ctrip.com>
 * @class
 * @name cStore
 * @extends cAbstractStore
 * @example
 *  define(['cCoreInherit','cStore'], function (cCoreInherit, Store) {
 *    var DemoStore = new cCoreInherit.Class(Store, {
 *      \_\_propertys\_\_: function () {
 *        this.lifeTime = '2D',          //超时时间两天
 *        this.defaultData = {
 *          name : ""
 *        },
 *        this.key = 'demo_key';
 *      }
 *    });
 *
 *    return new DemoStore();
 *  });
 *
 * var data = {'name':'擎天柱' };
 * demoStore.set(data);
 */
define(['cCoreInherit','cAbstractStore','cLocalStorage','cMemoryStorage','cUtilCommon'], function (cCoreInherit,cAbstractStore,cLocalStorage,cMemoryStorage,cUtilCommon) {



  var LocalStore = new cCoreInherit.Class(cAbstractStore,{
    __propertys__: function () {
	    /**
	     * 本地存储对象, 如果是隐私模式，就存入内存中，否则存入localStorage中
       * @name cStore.sProxy
	     * @type {Object}
	     */
      this.sProxy = cUtilCommon.isPrivateModel? cMemoryStorage.getInstance() : cLocalStorage.getInstance();
    },
	  /**
	   * 复写自顶层Class的initialize，赋值队列
	   */
    initialize: function ($super, options) {
      $super(options);
    }
  });

  return LocalStore;
});
