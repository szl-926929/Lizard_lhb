define(['cCoreInherit', 'cWebApp', 'cHybridShell', 'cUtilCommon'], function (cCoreInherit, APP, cHybridShell, UtilCommon) {  
  return cCoreInherit.Class(APP, {
    start: function($super) {
      $super();
      this.startUrl = location.href;      
    },
    jump: function(url,opt){
      var openUrl = url,
        isLegalAgr = opt && _.isNumber(opt.targetModel),
        isMultView = (Lizard.config.multiView == "on"),
        index = url.toLowerCase().indexOf('/webapp/'),
        targetModel  = -1;
      if (url.indexOf('ctrip://') === 0) {
        //唤醒协议
        targetModel = 1;
      } else if (url.indexOf('.html#') > 0) {
        //路径有hash,本view打开
        targetModel = isLegalAgr ? opt.targetModel : 5;
        openUrl = index >= 0 ? url.substr(index + 8) : url;
      } else {
        targetModel = isLegalAgr ? opt.targetModel : (isMultView ? 2 : 0);
        if (targetModel >= 4) {
          var paths = url.match(/webapp\/([^\/]+)/i);
          if (paths.length > 1) {
            var sbuName = paths[1];
            openUrl = sbuName + "/index.html" + "#" + url.substr(url.indexOf('/webapp'));
          }
        } else {
          if(!UtilCommon.isUrl(url)){
            var domain = window.location.protocol + '//' + window.location.host;
            //如果没有webapp,不全格式
            if(url.toLowerCase().indexOf('/webapp') < 0 && url.toLowerCase().indexOf('/html5') == -1){
              openUrl = domain+"/webapp/"+url;
            }else{
              openUrl = domain+url;
            }
          }
        }  
      }
      if (targetModel == '0' && opt && opt.replace) {
        window.location.replace(openUrl);
        return;
      }
      var fn = new cHybridShell.Fn('open_url');
      fn.run(openUrl, targetModel, opt && opt.title || "", opt && opt.pageName || openUrl, opt && opt.isShowLoadingPage || false, opt && opt.meta);
    }, 
    
    goTo: function($super, url, opt){
      if (_.isString(url) && opt && ('targetModel' in opt)) {        
        var fn = new cHybridShell.Fn('open_url'), targetModel = opt.targetModel;
        if (targetModel >= 4) {
          if (UtilCommon.isUrl(url) || url.indexOf('http://localhost') === 0) {
            url = url.substr(url.indexOf('/webapp'));              
          }
          url = Lizard.appBaseUrl.substr(8) + 'index.html#' + url;
        }
        if (!Lizard.app.version.gte(6.4)) {
          this.hideLoading();
        }
        fn.run(url,targetModel, opt && opt.title||"", opt && opt.pageName || url, opt && opt.isShowLoadingPage, opt && opt.meta);
        return;        
      }
      $super(url, opt);
    },

    goBack: function ($super,url, opt) {          
      if (arguments.length === 1) {
        if (this.__startState.url == location.href || this.startUrl === location.href) {
          var fn = new cHybridShell.Fn('back_to_last_page');
          fn.run("BACK", false);
        } else {
          history.back();
        }
      }
      else {
        $super(url, opt);
      }
    }
  });
});