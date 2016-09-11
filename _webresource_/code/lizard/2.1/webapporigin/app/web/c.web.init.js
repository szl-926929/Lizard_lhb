define(['cBaseInit', 'cWebMember','cMemoryStorage','cUtilCommon'], function(initFunc, Member,cMemoryStorage,cUtilCommon){
  //当localStorage 不可用时，重写window.localStorage
  if(cUtilCommon.isPrivateModel){
    var oldLocalstorage = window.localStorage;
    var storage = cMemoryStorage.getInstance();
    window.localStorage.setItem = storage.proxy.setItem;
    window.localStorage.getItem = storage.proxy.getItem;
    window.localStorage.removeItem = storage.proxy.removeItem;
    window.localStorage.clear = storage.proxy.clear;
    try{
      //尝试获取localstorage中的东西，如果能拿到的话，塞到现有的逻辑中
      for(var pro in oldLocalstorage){
        if(oldLocalstorage[pro] && typeof oldLocalstorage[pro] != 'function'){
          window.localStorage.setItem(pro,oldLocalstorage[pro]);
        }
      }
    }catch(e){

    }
  }
  Member.autoLogin({
    callback: function(){
      require(['cStatic'], function(){
        $(document).ready(initFunc);
      });     
    }
  });
});