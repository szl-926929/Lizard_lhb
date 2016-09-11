 /**
 * 以SessionStorage为数据存储的Store, 浏览器关闭，数据自动清空
 * @author zsb张淑滨 <shbzhang@Ctrip.com>
 * @class
 * @name cSessionStore
 * @extends cAbstractStore
 * @example
 *  define(['cCoreInherit','cSessionStore'], function (cCoreInherit, SessionStore) {
 *    var DemoStore = new cCoreInherit.Class(SessionStore, {
 *      \_\_propertys\_\_: function () {
 *        this.lifeTime = '2D',          //浏览器不关闭情况下,超时时间两天
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
define(['cCoreInherit','cAbstractStore','cSessionStorage','cUtilPerformance'], function (cCoreInherit,cAbstractStore,cSessionStorage,cperformance) {

  var sessionStore = new cCoreInherit.Class(cAbstractStore,{
    __propertys__: function () {
	    /**
	     * store的数据存储对象
       * @name cSessionStore#sProxy
	     * @type {*|e.UnionStore.getInstance|e.SalesStore.getInstance|Object|c.common.store.UnionStore.getInstance|c.common.store.SalesStore.getInstance}
	     */
      this.sProxy = cSessionStorage.getInstance();
    },
	  /**
	   * 复写自顶层Class的initialize，赋值队列
	   */
    initialize: function ($super, options) {
      cperformance.log({
        name: 'FunUsed',
        url: window.location.href,
        fun: "cSessionStore"
      });
      $super(options);
    }
  });

  return sessionStore;
});
