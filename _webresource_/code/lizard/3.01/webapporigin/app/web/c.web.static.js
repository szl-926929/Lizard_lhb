define(function () {


  //GA代码
 /*
  (function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
      (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
      m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
  })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

  ga('create', 'UA-3748357-1', 'auto');
  ga('send', 'pageview');
*/

  //UBT代码  
  var s = document.getElementsByTagName('script')[0];    
  var d = new Date(), v = '?v=' + d.getFullYear() + d.getMonth() + '_' + d.getDate() + '.js';
  var bf = document.createElement('script');
  bf.type = 'text/javascript';
  bf.charset = 'utf-8';
  bf.async = true;  
  
  var e = bf.cloneNode(true);
  e.src = "//webresource.c-ctrip.com/ResMarketOnline/R2/js/aFrame/aSlider.min.js" + v;
  s.parentNode.insertBefore(e, s);
  
  if ((window.$_bf && window.$_bf.loaded) || window.$LAB || window.CtripJsLoader) {
    return;
  }
  var reg = /_bfa\.min\.js/i;
  if (_.some(document.getElementsByTagName('SCRIPT'), function (script) {
    return reg.test(script.src);
  })) {
    return;
  }
  
  e = bf.cloneNode(true);
  e.src = "//webresource.c-ctrip.com/code/ubt/_mubt.min.js" + v;
  s.parentNode.insertBefore(e, s);
});