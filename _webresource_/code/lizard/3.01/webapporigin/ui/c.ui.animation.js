/**
* @author zsb张淑滨 <shbzhang@Ctrip.com> / ghj龚汉金 <hjgong@Ctrip.com>
* @class cLog
* @description 提供App在手机端的后门
* @comment 需要zsb与新代码再核对一遍
*/
define(["cUtilEvent", "cUtilDom"], function (EventUtil, DomUtil) {
  var animationName = "webkitAnimationEnd";

  return {
    slideleft: function (inView, outView, callback, scope) {
      var $inView = inView.$el;
      var $outView = outView.$el;
      outView.hide();
      $inView.style.display = 'block';
      EventUtil.addHandler($inView, animationName,
        function (event) {
          EventUtil.removeHandlers($inView, animationName);
          DomUtil.removeClass(document.body, 'hiddenx');
          DomUtil.removeClass($inView, 'animatestart');
          DomUtil.removeClass($inView, 'sliderightin');
          if(inView.onShowed){
            $inView.style.display = 'block';
          }else{
            inView.show();
          }
          if(typeof callback === 'function'){
            if(scope){
               callback.call(scope, inView, outView);
            }else{
              callback(inView, outView);
            }
          }
        });
      DomUtil.addClass(document.body, 'hiddenx');
      DomUtil.addClass($inView, 'animatestart');
      DomUtil.addClass($inView, 'sliderightin');
    },
    slideright: function (inView, outView, callback, scope) {      
      var $inView = inView.$el;
      var $outView = outView.$el;
      $outView.style.display = 'block';
      //l_wang 缺少兼容处理
      EventUtil.addHandler($outView, animationName, function (event) {
        EventUtil.removeHandlers($outView, animationName);
        DomUtil.removeClass(document.body, 'hiddenx');
        DomUtil.removeClass($outView, 'animatestart');
        DomUtil.removeClass($outView, 'sliderightout');        
        outView.hide();
        if(inView.onShowed){
          $inView.style.display = 'block';
        } else {
          inView.show();
        }
        if(typeof callback === 'function'){
          if(scope){
            callback.call(scope, inView, outView);
          }else{
            callback(inView, outView);
          }
        }
      });
      DomUtil.addClass(document.body, 'hiddenx');
      DomUtil.addClass($outView, 'animatestart');
      DomUtil.addClass($outView, 'sliderightout'); 
    },


    noAnimate: function (inView, outView, callback, scope) {
      if (outView){
        outView.__hide(inView.viewname);
      }
      inView.__show();
      if(callback){
        callback.call(scope, inView, outView);
      }
    }

  };
});