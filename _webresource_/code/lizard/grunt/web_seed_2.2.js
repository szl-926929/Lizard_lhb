var isLizardUserBeta = false; //全局变量，后面会使用到
(function(){
  //获取最新的版本号
  var version = "{$version}" + "{timeString}";
  isLizardUserBeta = isUseBeta();
  //isLizardUserBeta = true;
  //cdncombo 加载器
  window.isLizardDebug = !!(window.location.href.indexOf("debug=1")>0);
  var scripts = document.getElementsByTagName('script') || [];
  var reg = /lizard\.seed\.(src\.)*js.*$/ig;
  var cdnComboUrl =  "/res/concat?f=";
  var lizardSeedUrl;
  var cruPath = "";
  var lizardTestDomian = null;
  try{
    var lizardTestType = window.localStorage.getItem("LIZARD_TEST_DOMAIN_TYPE");
    if(lizardTestType){
      (lizardTestType == "uat") ? (lizardTestDomian = "//webresource.uat.qa.nt.ctripcorp.com") : ((lizardTestType == "fat") ? (lizardTestDomian = "//webresource.fws.qa.nt.ctripcorp.com") :  "");
      if(lizardTestType.split(".").length == 4){
        lizardTestDomian = "//"+ lizardTestType + ":5389";
      }
      var lizardTestBeta = window.localStorage.getItem("LIZARD_TEST_BETA");
      if(lizardTestBeta == "beta"){
        isLizardUserBeta = true;
      }
      if(lizardTestDomian){
        window.isLizardDebug = true;
      }
      window.lizardTestDomian = lizardTestDomian;
    }
  }catch(e){}
  var comboModules = window.isLizardDebug ? [ "/code/lizard/2.2/web/lizard.parser.src.js"]: [ "/code/lizard/2.2/web/lizard.parser.js"];
  var env = isH5();
  //判断是否支持webP,尽早执行
  try{
    var WebP = new Image();
    WebP.onload = WebP.onerror = function(){
      window.supportWebP = !!(WebP.height == 1);
    };
    WebP.src = "data:image/webp;base64,UklGRiYAAABXRUJQVlA4IBoAAAAwAQCdASoBAAEAAAAMJaQAA3AA/v89WAAAAA==";
  }catch(e){}
  if(env.isInCtrip){
    //if(env.isNeedWeb){
    //  comboModules.push(!isLizardDebug?"/code/lizard/2.2/web/lizard.web.src.js":"/code/lizard/2.2/web/lizard.web.js");
    //}  
    if (env.ctripUA === 'AndroidTV_CtripWireless') {
      comboModules.push("/code/lizard/2.2/web/app/c.tv.start.js");
    } else if (env.ctripUA === 'Tieyou_TieyouWireless') {
      comboModules.push("/code/lizard/2.2/web/app/c.ty.start.js");
    } else {
      comboModules.push(window.isLizardDebug ? "/code/lizard/2.2/web/lizard.hybrid.src.js":"/code/lizard/2.2/web/lizard.hybrid.js");
    }
  }
  for (var i = 0,tempScript; i < scripts.length; i++) {
    tempScript = scripts[i];
    var src = tempScript.getAttribute("src");
    if (src && reg.test(src)) {
      lizardSeedUrl = src;
      var filePath = src.replace(reg, '');
      cruPath = filePath.substr(0, filePath.lastIndexOf('/code/lizard'));
      break;
    }
  }
  //有测试localstorage，则使用测试的地址，没有则使用生产地址
  lizardTestDomian ? (cdnComboUrl = lizardTestDomian + cdnComboUrl) : (cdnComboUrl = cruPath + cdnComboUrl);
  if(isLizardUserBeta){
    for (var j = 0;j <comboModules.length;j++){
      comboModules[j] = comboModules[j].replace("/web/","/beta/");
    }
  }
  if(window.isLizardDebug){
    var frameworkModules = comboModules.slice(0,3);
    for (var i = 0;i <frameworkModules.length;i++){
      if(lizardTestDomian){
        document.write("<script src='"+lizardTestDomian+frameworkModules[i]+"'><\/script>");
      }else{
        document.write("<script src='"+cruPath+frameworkModules[i]+"'><\/script>");
      }
    }
  }else{
    cdnComboUrl = cdnComboUrl + comboModules.join(",");
    if(version){
      cdnComboUrl += "&" + version;
    }
    try{
      var lastModified = window.localStorage.getItem("SEED2LASTMODIFIED");
      if(lastModified){
        cdnComboUrl += "&"+lastModified.split("&")[0];
      }
    }catch(e){
    }
    document.write("<script crossorigin src='"+cdnComboUrl+"'><\/script>");
  }
  ///**
  // * 判断是否是webresource资源
  // * @param modulesStr
  // * @returns {boolean}
  // */
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
   * @returns {}
   */
  function isH5(){
    var uaAtr = ['Ctrip_CtripWireless', 'Unicom_CtripWireless', 'Pro_CtripWireless','Youth_CtripWireless','gs_wireless','we_wireless', 'AndroidTV_CtripWireless', 'Tieyou_TieyouWireless'],
      RE = RegExp,
      UA = window.navigator.userAgent,
      res = {};
    // 逐一对比特征码与 userAgent 信息
    for (var i = 0; i < uaAtr.length; i++) {
      var tempUA = uaAtr[i];
      if (new RE(uaAtr[i] + '_([\\d.]+)$').test(UA)) {
        res.isInCtrip = true;
        if(tempUA == 'gs_wireless' || tempUA == 'we_wireless'){
          //如果是攻略app
          res.isNeedWeb = true;
        }
        res.ctripUA = tempUA;
        break;
      }
    }
    return res;
  }
  if (!window.isLizardDebug) {
    var appendChildFunc = Element.prototype.appendChild;
    Element.prototype.appendChild = function() {
      if (this === document.head) {
        var child = arguments[0];
        if (child.nodeType === 1 && child.tagName.toLowerCase() === 'script' && child.src.indexOf('//webresource.c-ctrip.com/') > -1) {
          child.setAttribute('crossorigin', 1);
        }
        return appendChildFunc.apply(this, arguments);
      } else {
        return appendChildFunc.apply(this, arguments);
      }
    };
  }
  //定时获取服务端的lastModify
  if(lizardSeedUrl){
    try{
      var lastModified = window.localStorage.getItem("SEED2LASTMODIFIED");
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
            window.localStorage.setItem("SEED2LASTMODIFIED",lastModified.getTime() + "&"+ new Date().getTime());
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

