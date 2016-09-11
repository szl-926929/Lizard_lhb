/**
 * @Description 页面切换时写入隐藏域唤醒url
 * @author wang_l@ctrip.com
 * @date  2013/6/23 16:26:12
 * @version V1.0
 */
define(['cMessageCenter'], function (MessageCenter) {

  return function () {
    MessageCenter.subscribe('viewReady', function (inView) {
      //add by byl 在此处判断inView中的getAppUrl是否存在,如果存在将返回值添加到隐藏域app_url
      var appUrlDoom = document.getElementById('app_url');
      if (inView && typeof inView.getAppUrl === 'function') {
        var newAppUrl = inView.getAppUrl();
        if (newAppUrl && _.isString(newAppUrl)) {
          if (!appUrlDoom) {
            appUrlDoom = document.createElement('input');
            appUrlDoom.setAttribute("id", "app_url");
            appUrlDoom.value = newAppUrl;
            document.body.appendChild(appUrlDoom);
          } else {
            appUrlDoom.value = newAppUrl;
          }
        }
      } else {
        if (appUrlDoom > 0) {
          appUrlDoom.value = "";
        }
      }
    });
  };
});
