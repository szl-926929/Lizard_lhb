(function() {
  window.app = {};
  window.app.callback = function (options) {
    var methods = {
      'web_view_finished_load_lite' : function (params) {
        //在此处将clientId以及SystemCode写到localstorage中
        require(['cCommonStore', 'cMessageCenter'], function (CommonStore, MessageCenter) {
          var headStore = CommonStore.HeadStore.getInstance();
          var unionStore = CommonStore.UnionStore.getInstance();
          var wStore = window.localStorage;
          if (wStore && params) {
            if (params.systemCode) {
              headStore.setAttr("syscode", params.systemCode);
            }
            if (params.clientID) {
              headStore.setAttr("cid", params.systemCode);
              MessageCenter.publish("clientidGot", [params.clientID]);
              wStore.setItem('GUID', params.clientID);
            }
            //添加营销代码
            if (params.allianceId && params.sId) {
              var union = {
                "AllianceID" : params.allianceId,
                "SID" : params.sId,
                "OUID" : params.ouId ? params.ouId : ""
              };
              unionStore.set(union);
            }
            //保存原始参数值
            wStore.setItem('CINFO', JSON.stringify(params));
          }
        });
      }
    };
    if (options && typeof methods[options.tagname] === 'function') {
      methods[options.tagname](options.param);
    }
  };
})();
