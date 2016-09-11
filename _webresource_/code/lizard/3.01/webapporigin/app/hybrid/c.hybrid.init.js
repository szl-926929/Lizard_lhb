define(['cHybridGuider'], function(Guider){

  
  Lizard.localRoute = {
    config: {},
    addConfig: function (obj) {
      for (var urlschema in obj) {
        if (obj.hasOwnProperty(urlschema)) {
          Lizard.localRoute.config[urlschema] = obj[urlschema];
        }
      }
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
  
  if (window.LizardLocalroute) {
    Lizard.localRoute.addConfig(window.LizardLocalroute);
    var el = document.getElementById("LizardLocalroute");
    if (el) {
      Lizard.weinre = el.getAttribute("LizardWeinre");
      Lizard.ip = el.getAttribute("LizardIP");
      Lizard.chanal = el.getAttribute("LizardChanal");
    }
  }
  
  //如果是pc端打开的话，直接主动触发init_member_H5_info  
  if (_.isUndefined(Lizard.app.vendor.toString())) {    
    var appInfo = {
      "tagname": "web_view_finished_load",
      "param": {
        "platform": "2",
        "osVersion": "Android_18",
        "extSouceID": "",
        "version": "5.5"
      }
    };
    if (_.isUndefined(window.Internal)) {
      window.Internal = {};
    }
    Internal.isAndroid = (appInfo.param.platform == "2");
    Internal.isInApp = true;
    Internal.appVersion = appInfo.param.version;
    Internal.osVersion = appInfo.param.osVersion;
    if (window.localStorage) {
      window.localStorage.clear();
      if (appInfo) {
        window.localStorage.setItem('APPINFO', JSON.stringify(appInfo));
      }
      window.localStorage.setItem('ISINAPP', '1');
    }
    window.Util_a = {};
    window.Util_a.h5Log = function(paramString) {
      console.log('h5Log::', paramString);
    };
    window.Util_a.openUrl = function(paramString) {
      console.log('h5Log::', paramString);
    };
    window.Util_a.checkNetworkStatus = function(paramString) {
      console.log('h5Log::', paramString);
    };
    window.Locate_a = {};
    window.Locate_a.locate = function(paramString) {};
    window.NavBar_a = {};
    window.NavBar_a.setNavBarHidden = function(paramString) {};
    window.User_a = {};
    window.User_a.initMemberH5Info = function(paramString) {};
    window.Business_a = {};
    window.Business_a.sendUBTLog = function(paramString) {};
    window.Business_a.logGoogleRemarking = function(paramString) {};
    window.app.callback({
      'tagname': 'web_view_finished_load'
    });
    window.app.callback({
      'tagname': 'init_member_H5_info',
      'param': {
        appId: "ctrip.android.view",
        clientID: "32043596200000129090",
        device: "samsung_GT-N7102",
        extSouceID: "",
        isPreProduction: "0",
        osVersion: "Android_18",
        platform: "2",
        serverVersion: "5.7",
        sourceId: "8892",
        timestamp: "1402930469100",
        userInfo: {
          data: {
            Auth: "",
            BMobile: "",
            BindMobile: "",
            IsNonUser: true,
            UserID: ""
          },
          timeby: 1,
          timeout: "2015/06/16"
        },
        version: "5.5"
      }
    });
  }
});