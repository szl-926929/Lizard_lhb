var isLizardUserBeta = false; //全局变量，后面会使用到
(function(){
//获取最新的版本号
  var version = "{$version}" + "{timeString}";
  isLizardUserBeta = isUseBeta();
  //isLizardUserBeta = true;
//cdncombo 加载器
  var isDebug = !!(window.location.href.indexOf("debug=1")>0);
  var scripts = document.getElementsByTagName('script') || [];
  var reg = /lizard\.seed\.(src\.)*js.*$/ig;
  var cdnComboUrl =  "/res/concat?f=";
  var comboModules = !isDebug ? [ "/code/lizard/2.1/web/lizard.core.js"] : [ "/code/lizard/2.1/web/lizard.core.src.js"];
  var lizardConfig;
  var lizardSeedUrl;
  var cruPath = "";
  var env = isH5();
  //判断是否支持webP,尽早执行
  try{
    var WebP = new Image();
    WebP.onload = WebP.onerror = function(){
      window.supportWebP = !!(WebP.height == 1);
    };
    WebP.src = "data:image/webp;base64,UklGRiYAAABXRUJQVlA4IBoAAAAwAQCdASoBAAEAAAAMJaQAA3AA/v89WAAAAA==";
  }catch(e){

  }
  if(!env.isInCtrip){
    if(!isDebug){
      comboModules.push("/code/lizard/2.1/web/lizard.web.js");
    }
  }else{
    comboModules.push("/code/lizard/2.1/web/lizard.hybrid.js");
    if(env.isNeedWeb){
      comboModules.push("/code/lizard/2.1/web/lizard.web.js");
    }
  }
  for (var i = 0,tempScript; i < scripts.length; i++) {
    tempScript = scripts[i];
    var src = tempScript.getAttribute("src");
    if (src && reg.test(src)) {
      //var regStr = src.match(reg);
      //if(regStr && regStr.length && regStr[0].indexOf("?") > 0){
      //  version = regStr[0].split("?")[1];
      //}
      lizardSeedUrl = src;
      var filePath = src.replace(reg, '');
      cruPath = filePath.substr(0, filePath.lastIndexOf('/code/lizard'));
      cdnComboUrl = cruPath + cdnComboUrl;
      var pdConfig = tempScript.getAttribute("pdConfig"),
        lConfig = tempScript.getAttribute("lizardConfig");
      if(lConfig){
        try{
          eval('lizardConfig = {' + lConfig + '}');
        }catch (e){
          lizardConfig = {};
          console.log(e.stack);
        }
      }
      if(lizardConfig && lizardConfig.plainloading){
        comboModules.push("/code/lizard/2.1/web/ui/ui.loading.layer.js");
        comboModules.push("/code/lizard/2.1/web/ui/ui.warning404.js");
      }else {
        comboModules.push("/ResCRMOnline/R5/basewidget/ui.loadFailed.js");
        comboModules.push("/ResCRMOnline/R5/basewidget/ui.loading.js");
      }
      //if(pdConfig){
      //  var isWeb = getWebResources(pdConfig);
      //  if(isWeb){
      //    tempScript.removeAttribute("pdConfig");
      //  }
      //}
      break;
    }
  }
  if(isLizardUserBeta){
    for (var j = 0;j <comboModules.length;j++){
      comboModules[j] = comboModules[j].replace("/web/","/beta/");
    }
  }
  if(!isDebug){
    cdnComboUrl = cdnComboUrl + comboModules.join(",");
    if(version){
      cdnComboUrl += "&" + version;
    }
    try{
      var lastModified = window.localStorage.getItem("SEEDLASTMODIFIED");
      if(lastModified){
        cdnComboUrl += "&"+lastModified.split("&")[0];
      }
    }catch(e){
    }
    document.write("<script src='"+cdnComboUrl+"'><\/script>");
  }else{
    var frameworkModules = comboModules.slice(0,3);
    for (var i = 0;i <frameworkModules.length;i++){
      document.write("<script src='"+cruPath+frameworkModules[i]+"'><\/script>");
    }
  }
  /**
   * 判断是否是webresource资源
   * @param modulesStr
   * @returns {boolean}
   */
//function getWebResources(modulesStr){
//  var isWebResources =false;
//  var modulesArr = modulesStr.split(",");
//  var reg = /(http:|https:)?\/\/webresource[\w\W]+com/g;
//  for (var i = 0,module; i< modulesArr.length;i++){
//    module = modulesArr[i];
//    if(reg.test(module)){
//      comboModules.push(module.replace(reg,""));
//      isWebResources = true;
//    }
//  }
//  return isWebResources;
//}

  /**
   *
   * @returns {}
   */
  function isH5(){
    var uaAtr = ['Ctrip_CtripWireless', 'Unicom_CtripWireless', 'Pro_CtripWireless','Youth_CtripWireless','gs_wireless','we_wireless', 'Discount_CtripWireless'],
      RE = RegExp,
      UA = window.navigator.userAgent,
      res = {};
    // 逐一对比特征码与 userAgent 信息
    for (var i = 0; i < uaAtr.length; i++) {
      var tempUA = uaAtr[i];
      if (new RE(uaAtr[i] + '_([\\d.]+)$').test(UA)) {
        res.isInCtrip = true;
        if(tempUA == 'gs_wireless' || tempUA == 'we_wireless' || tempUA == 'Discount_CtripWireless'){
          //如果是攻略app
          res.isNeedWeb = true;
        }
        break;
      }
    }
    return res;
  }
  if(lizardSeedUrl){
    try{
      var lastModified = window.localStorage.getItem("SEEDLASTMODIFIED");
      if(lastModified){
        var lastGetTime = lastModified.split("&")[1];
        if(lastGetTime && ((new Date().getTime() -lastGetTime ) >= 5*60*1000)){
          getSeedLastModify(lizardSeedUrl);
        }else if(!lastGetTime){
          getSeedLastModify(lizardSeedUrl);
        }
      }else{
        getSeedLastModify(lizardSeedUrl);
      }
    }catch(e){
    }
  }
  function getSeedLastModify(url) {
    var xmlHttp;
    var requestType = "";
    function createXMLHttpRequest() {
      if (window.ActiveXObject) {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
      } else if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
      }
    }

    function doHeaderRequest(request, url) {
      requestType = request;
      createXMLHttpRequest();
      xmlHttp.onreadystatechange = handleStateChange;
      xmlHttp.open("GET", url, true);
      xmlHttp.setRequestHeader('Cache-Control', 'no-cache');
      xmlHttp.setRequestHeader('Content-Type', 'text/plain');
      xmlHttp.send(null);
    }

    doHeaderRequest("lastModified", url);
    function handleStateChange() {
      if (xmlHttp.readyState == 4) {
        try{
          var lastModified = new Date(xmlHttp.getResponseHeader("Last-Modified"));
          if(lastModified && lastModified.getTime()){
            window.localStorage.setItem("SEEDLASTMODIFIED",lastModified.getTime() + "&"+ new Date().getTime());
          }
        }catch(e){
        }
      }
    }
  }
  function isUseBeta(){
    try{
      var guid = window.localStorage.getItem("GUID");
      if(guid  && (guid.substr(-1) == 1)){
        return true;
      }
    }catch(e){
    }
    return false;
  }
})();
