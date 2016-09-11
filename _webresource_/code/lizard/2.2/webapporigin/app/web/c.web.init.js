define(['cBaseInit', 'cWebMember','cMemoryStorage','cUtilCommon', 'cUserModel', 'cCommonStore', 'cCookieStorage', 'cMessageCenter'], 
function(initFunc, Member, cMemoryStorage, cUtilCommon, UserModel, CommonStore, cCookieStorage, MessageCenter){
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
  var clientModel = UserModel.ClientIdModel.getInstance(),
    headStore = CommonStore.HeadStore.getInstance(),
    cookieStorage = cCookieStorage.getInstance(),
    cookieCid = cookieStorage.get("GUID"),
    lstore = headStore.sProxy.proxy,
    cid = lstore.getItem('GUID'),
    domain = (window.location.origin && window.location.origin.indexOf(".ctrip.com") != -1) ? ".ctrip.com" : ".ctripcorp.com";
  //protocol = location.protocol;
  //如果cid不存在或者是老的cid格式,发起查询服务
  if (!cookieCid && (!cid || cid.indexOf('-') > -1)) {
    //如果CID存在,此时应为一个老格式,做一个备份
    if (cid) {
      lstore.setItem('BGUID', cid);
      clientModel.setParam("PreviousID", cid);
    }
    clientModel.excute(function (data) {
      if (data && data.ClientID) {
        lstore.setItem('GUID', data.ClientID);
        headStore.setAttr('cid', data.ClientID);
        cookieStorage.set("GUID", data.ClientID, new Date(new Date().getTime() + 3 * 360 * 24 * 60 * 60 * 1000), "/", domain);
        MessageCenter.publish('clientidGot', [data.ClientID]);
      }
    });
  } else {
    if (!cookieCid) {
      //cookie中没有，但是localStorage中有，须写入cookie中,，默认存储三年时间
      cookieStorage.set("GUID", cid, new Date(new Date().getTime() + 3 * 360 * 24 * 60 * 60 * 1000), "/", domain);
    }
  }

  Lizard.localRoute = {
    config: {},
    addConfig: function (routes) {
      _.each(routes, function(route){
        if (route.hasOwnProperty('urlschema')) {
          Lizard.localRoute.config[route.urlschema] = route;
        }  
      });
    },
    
    mapUrl: function (url) {
      var ret = '', lc = 0;
      _.each(Lizard.localRoute.config, function(item, urlSchema){
        if (Lizard.localRoute.config.hasOwnProperty(urlSchema)) {
          var parseRet = Lizard.schema2re(urlSchema, url);
          if (parseRet.reStr && parseRet.param) {
            if (parseRet.reStr.length > lc) {
              lc = parseRet.reStr.length;
              ret = Lizard.localRoute.config[urlSchema];
            }
          }
        }
      });      
      return ret;
    }
  };
  
  if (window.LizardH5Localroute) {
    Lizard.localRoute.addConfig(window.LizardH5Localroute);    
  }
  Member.autoLogin({
    callback: function(){
      require(['cStatic'], function(){
        $(document).ready(initFunc);
      });     
    }
  });
});