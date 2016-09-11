define(['cBase','cStore'], function(cBase,cStore){
  "use strict";

  var MemStore = new cBase.Class(cStore,{
    __propertys__: function () {
      //数据变更检查字段
      this.idField = '';
      //内存区数据
      this.data = null;
      //持久化数据
      this.store = null;
      //是否使用LocalStore
      this.useLocalStore = false;
    },

    initialize: function (options) {
      //根据参数,生成cStore
      var attrs = ['key','lifeTime','useServerTime','isLocal','defaultData','rollbackEnabled', 'useLocalStore'];
      var opt = {};
      for (var i = 0,ln = attrs.length; i<ln;i++){
          var val = options[attrs[i]] || this[attrs[i]];
          if( typeof val !== 'undefined'){
            opt[attrs[i]] = val;
          }
      }
      this.store = new cStore(opt);
      },

    refresh:function(){
      var storeData  = this.store.get();
      //内存区为空 && 持久化区有数据，复制数据到内存区
      //内存区数据不为空 && 内存区标识值不同于持久层，复制数据
      if((!this.data && storeData)&&
        (this.data && this.data[this.idField] !== storeData[this.idField])){
        this.data = storeData;
      }
    },

    commit:function(){
      this.store.set(this.data);
    },

    rollback:function(){
      this.data = null;
    },

    set:function(data, key){
      this.data = data;
      if (key)
      {
        if (!this.dataMap)
        {
          this.dataMap = {};
        }
        this.dataMap[key] = data;
        if (this.store.useLocalStore) this.store.set(_.pick(this.dataMap, [key]));
      }
    },

    setAttr:function(attrName,attrValue){
      this.data[attrName] = attrValue;
    },

    set2Store:function(data){
      this.set(data);
      this.commit();
    },

    get: function(key){
      if (key)
      {
        if (!this.dataMap)
        {
          this.dataMap = this.store.get();
        }
        if (this.dataMap && this.dataMap[key])
        {
          return this.dataMap[key];
        }
        else
        {
          return null;
        }
      }
      else
      {
        return this.data;
      }
    },

    getAttr: function(attrName){
      return this.data[attrName];
    }
  });

  MemStore.getInstance = function () {
      if (this.instance) {
          return this.instance;
      } else {
          return this.instance = new this();
      }
    };
  return MemStore;
});