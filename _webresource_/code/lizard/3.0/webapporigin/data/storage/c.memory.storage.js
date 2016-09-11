/**
 * @File c.local.storage.js
 * @author zsb张淑滨 <shbzhang@Ctrip.com>
 * @description LocalStorage 存储类
 */
/**
 * 内存对象模拟LocalStorage储类,继承自cAbstractStorage
 * @namespace Storage.cMemoryStorage
 * @extends Storage.cAbstractStorage
 */
define(['cCoreInherit', 'cUtilDate', 'cAbstractStorage','cUtilCommon'], function (cCoreInherit, cDate, cAbstractStorage,cUtilCommon) {
  var host = window.location.host;
  var hostObj = {};
  var MemoryStorage = {
    dataMap : {},
    setItem : function(key,val){
      MemoryStorage.dataMap[key] = val;
      MemoryStorage.reSetName();
    },
    getItem: function(key){
      if(_.isEmpty(MemoryStorage.dataMap)){
        try{
          var nameObj = JSON.parse(window.name)[host];
          if(_.isObject(nameObj)){
            MemoryStorage.dataMap = nameObj;
          }
        }catch(e) {
        }
      }

      return MemoryStorage.dataMap[key];
    },
    removeItem :function(key){
      delete MemoryStorage.dataMap[key];
      MemoryStorage.reSetName();
    },
    clear :function(){
      MemoryStorage.dataMap = {};
      MemoryStorage.reSetName();
    },
    reSetName :function(){
      if(cUtilCommon.isPrivateModel){ //此处添加无痕判断，只有无痕浏览时，才放到window.name中
        hostObj[host] = MemoryStorage.dataMap;
        window.name = JSON.stringify(hostObj);
      }
    }
  };

  var Storage = new cCoreInherit.Class(cAbstractStorage, {
    __propertys__: function () {

    },

    /**
     * @method Storage.cMemoryStorage.initialize
     * @param {Object} $super
     * @param {Object} options
     * @description 复写自顶层继承自cAbstractStorage的initialize，赋值队列
     */
    initialize: function ($super, opts) {
      this.proxy = MemoryStorage;
      $super(opts);
    }
  });

  Storage.getInstance = function () {
    if (this.instance) {
      return this.instance;
    } else {
      return this.instance = new this();
    }
  };

  return Storage;

});