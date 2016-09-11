/**
 * @author l_wang王磊 <l_wang@Ctrip.com>
 * @class cBusinessCommon
 * @description 分离公共业务逻辑至此
 */
define(['cStorage', 'cWidgetFactory', 'cWidgetGuider'], function (cStorage,WidgetFactory) {

  return function () {
    var Guider = WidgetFactory.create('Guider');
    //广告业务
    Lizard.viewReady(function (inView) {
      var ua = window.navigator.userAgent;
      if (ua.indexOf('CtripWireless') > -1) {
        return true;
      }
      //add by byl 将BU 实现的getAppUrl的返回值绑定到隐藏域app_url中
      Lizard.saveAppUrl(inView);
     
	    //Kenshoo统计代码
	    _sendKenshoo();
	    _sendMarin();
	    //在此处添加删除清楚缓存的操作 add by byl
	    try {
		    cStorage.getInstance().removeOverdueCathch();
	    } catch (e) {
		    console && console.log(e);
	    }
    });

    //add by byl 添加saveAppUrl方法，保存BU中getAppUrl中返回值到隐藏域app_url中
    Lizard.saveAppUrl = function (inView) {
      //add by byl 在此处判断inView中的getAppUrl是否存在,如果存在将返回值添加到隐藏域app_url
      var appUrlDoom = $('#app_url');
      var isNewAppUrl = false;
      if (inView && inView.getAppUrl && typeof inView.getAppUrl === 'function') {
        var newAppUrl = inView.getAppUrl();
        if (newAppUrl && _.isString(newAppUrl)) {
          isNewAppUrl = true;
          if (!appUrlDoom.length) {
            //创建隐藏域节点
            $('<INPUT type="hidden" id="app_url" value="' + newAppUrl + '"/>').appendTo($('body'));
          } else {
            appUrlDoom.val(newAppUrl);
          }
        }
      }
      if (!isNewAppUrl) {
        if (appUrlDoom.length > 0) {
          appUrlDoom.val("");
        }
      }
    }
    //GA
    Lizard.viewReady(function (inView) {
      /*if (typeof ga !== 'undefined') {
        // _gaq.push(['_trackPageview', location.href]);
        ga('send', 'pageview', location.href);
      }
      */
      if (Lizard.isHybrid) {
        //处理inView._getViewUrl不存在的问题
        if (!inView || !inView._getViewUrl)
          return;
        var url = inView._getViewUrl();
        Guider.app_log_google_remarkting(url);
      }
    }); 
	  /**
	   * Kenshoo统计代码
	   * add by byl 09/23
	   */
	  var _sendKenshoo = function () {
		  var orderID = Lizard.P("orderID"), // || Lizard.P("oId") ; 此处暂不写oid的统计，没有明确文档说明oid需要统计
			  type = Lizard.P("type") || Lizard.P("busType") || '',
			  val = Lizard.P("val") || Lizard.P("price") || '';
		  if (orderID) {
			  var kurl = "https://2113.xg4ken.com/media/redir.php?track=1&token=8515ce29-9946-4d41-9edc-2907d0a92490&promoCode=&valueCurrency=CNY&GCID=&kw=&product="
			  kurl += "&val=" + val + "&orderId=" + orderID + "&type=" + type;
			  var imgHtml = "<img style='position: absolute;' width='1' height='1' src='" + kurl + "'/>"
			  $('body').append(imgHtml);
		  }
	  }

	  /**
	   * 发送Marinsm 统计
	   * add by byl 09/23
	   */
	  var _sendMarin = function () {
		  var orderID = Lizard.P("orderID"), // || Lizard.P("oId") ;
			  type = Lizard.P("type") || Lizard.P("busType") || '',
			  val = Lizard.P("val") || Lizard.P("price") || '';
		  if (orderID) {
			  var murl = "https://tracker.marinsm.com/tp?act=2&cid=6484iki26001&script=no"
			  murl += "&price=" + val + "&orderid=" + orderID + "&convtype=" + type;
			  var imgHtml = "<img style='position: absolute;' width='1' height='1' src='" + murl + "'/>"
			  $('body').append(imgHtml);
		  }
	  }
  };
});
