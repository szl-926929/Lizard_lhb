var scripts = document.getElementsByTagName('script') || [];
var reg = /lizard\.seed\.(src\.)*js.*$/ig;
var curPath = "";
for (var i = 0; i < scripts.length; i++) {
  var src = scripts[i].getAttribute("src");
  if (src && reg.test(src)) {
    var filePath = src.replace(reg, '').replace("2.1","2.2");
    curPath = filePath.substr(0, filePath.lastIndexOf('code/lizard'));
    break;
  }
}
window.isUserHybridSeed = true;
//判断是否支持webP,尽早执行
try{
  var WebP = new Image();
  WebP.onload = WebP.onerror = function(){
    window.supportWebP = !!(WebP.height == 1);
  };
  WebP.src = "data:image/webp;base64,UklGRiYAAABXRUJQVlA4IBoAAAAwAQCdASoBAAEAAAAMJaQAA3AA/v89WAAAAA==";
}catch(e){

}
var lizardTestDomian = null;
try{
  var lizardTestType = window.localStorage.getItem("LIZARD_TEST_DOMAIN_TYPE");
  if(lizardTestType){
    if(lizardTestType.split(".").length == 4){
      lizardTestDomian = "http://"+ lizardTestType + ":5389/";
    }
  }
}catch(e){}
if(lizardTestDomian){
  //本地测试时，直连src文件，不会被native替换掉
  document.write("<script src='"+lizardTestDomian+"code/lizard/2.2/hybrid/src/lizard/webresource/code/lizard/libs/lizard.libs.src.js'><\/script>");
  document.write("<script src='"+lizardTestDomian+"code/lizard/2.2/hybrid/src/lizard/webresource/code/lizard/2.2/web/lizard.common.src.js'><\/script>");
}else{
  document.write("<script src='"+curPath+"code/lizard/libs/lizard.libs.js'><\/script>");
  document.write("<script src='"+filePath+"lizard.common.js'><\/script>");
}
