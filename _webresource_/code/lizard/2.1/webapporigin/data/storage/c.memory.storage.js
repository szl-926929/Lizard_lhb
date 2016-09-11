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
define(['cCoreInherit', 'cUtilDate', 'cAbstractStorage',Lizard.isPrivateModel ? 'cLz':""], function (cCoreInherit, cDate, cAbstractStorage,clz) {
  var origin = window.location.origin;
  var hostKey = clz ? clz.compress(origin) : "";
  var reg = /@@##([\S]+)##@@/g;
  var MemoryStorage = {
    dataMap : {}, //当前域名下的localstorage对象
    _storage:{},//最终存入window.name的对象
    whiteList:[
      "PAYMENT2_","SALESOBJ","SALES_OBJECT","UNION","SALES","USER","USERINFO",
      "AUTHSTORE","HEADSTORE","PAUTH","C_CLEAR_OVERDUE_CATCH","memory_store",
      "MC_INDEX_RED_POINT_TIME","SOURCEID","SEL_POST_CITY_DATA","BANK_INFO_LIST","edit_POST_CITY_DATA",
      "CAR_POST_CITY_DATA","Wechat_CityList_Proto","Wechat_CityList_Category","Wechat_CityList_HisHot",
      "Wechat_CityList_Words","Wechat_SelectedCity","PRIZE_BOOKINGSTATE","PRIZE_BOOKINGINFO"
    ],
    init:function(){
      var compressSt = window.name.match(reg);
      if(clz && compressSt){
        compressSt = compressSt[0].replace("@@##","").replace("##@@","");
        try{
          MemoryStorage._storage = JSON.parse(compressSt);
        }catch(e){
          console.log("初始化无痕模式数据失败");
        }
        if(hostKey && MemoryStorage._storage && MemoryStorage._storage[hostKey] && clz){ //非无痕模式下,不用care  window.name
          var hostObj = MemoryStorage._storage[hostKey];
          for(var cKey in hostObj){
            if (hostObj.hasOwnProperty(cKey)){
              var key = clz.decompress(cKey);
              var val = clz.decompress(hostObj[cKey]);
              MemoryStorage.dataMap[key] = val;
            }
          }
        }
      }
    },
    setItem : function(key,val){
      MemoryStorage.dataMap[key] = val;
      MemoryStorage._reSetName(key,val);
    },
    getItem: function(key){
      return MemoryStorage.dataMap[key];
    },
    removeItem :function(key){
      delete MemoryStorage.dataMap[key];
      MemoryStorage._reSetName(key);
    },
    clear :function(){
      //clear方法只有无痕模式下才会调用
      var tempMap = {},tempCMap = {};
      var itemFun = function(pro,v){
        _.each(MemoryStorage.whiteList,function(t){
          if(pro.indexOf(t) !=  -1){
            var cKey = clz.compress(pro);
            tempMap[pro] = v;
            tempCMap[cKey] = clz.compress(v);
          }
        });
      };
      for(var pro in MemoryStorage.dataMap ){
        var v = MemoryStorage.dataMap[pro];
        itemFun(pro,v);
      }
      MemoryStorage.dataMap = tempMap;
      if(hostKey){
        MemoryStorage._storage[hostKey] = tempCMap;
      }
      MemoryStorage._reSetName();
    },
    __clearAll:function(){
      MemoryStorage.dataMap = {};
      if(hostKey){
        MemoryStorage._storage[hostKey] = {};
      }
      MemoryStorage._reSetName();
    },
    _reSetName :function(key,val){
      if(Lizard.isPrivateModel && clz && hostKey){ //此处添加无痕判断，只有无痕浏览时，才放到window.name中
        if(!MemoryStorage._storage[hostKey]){
          MemoryStorage._storage[hostKey] = {};
        }
        var cKey = clz.compress(key),cValue = null;
        if(key && val){ //表示塞数据
          cValue = clz.compress(val);
          MemoryStorage._storage[hostKey][cKey] = cValue;
        }else if(key){ //没有val默认删除数据
          delete MemoryStorage._storage[hostKey][cKey];
        }
        try{
          //搞成单个处理，不搞全量
          window.name = "@@##" + JSON.stringify(MemoryStorage._storage) + "##@@";
        }catch(e){
          console.log("绑定window.name 失败！！");
        }
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
      this.proxy.init();
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