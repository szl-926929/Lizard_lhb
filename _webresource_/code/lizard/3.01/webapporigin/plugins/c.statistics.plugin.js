/**
 * @Description 页面切换时送UBT,K
 * @author wang_l@ctrip.com
 * @date  2013/6/23 16:26:12
 * @version V1.0
 */
define(['cMessageCenter'], function (MessageCenter) {

  return function () {
    //注册切换时,发送统计数据
    MessageCenter.subscribe('viewReady', function (view) {
      Lizard.sendUbt(view);
    });


    /**
     * 发送UBT统计数据
     * @method Lizard.sendUbt
     * @param {View} view 页面view对象
     */
    Lizard.sendUbt = function (view) {
      if(!view || (view.config && view.config.preventUBT)) {return;}
      if (!window.__bfi) {window.__bfi = [];}
      var url = view.$el.getAttribute('page-url'),
        pageId = getPageId(view),
        orderId = Lizard.P("orderid") || Lizard.P("oid") || "";
      if (pageId === 0) {
        return;
      }
      if(document.getElementById('bf_ubt_orderid')){
        document.getElementById('bf_ubt_orderid').value = orderId;
      }
      //var ubtURL = window.location.protocol + '//' + window.location.host + url;
      var refererView = Lizard.instance.views[view.referrer];
      window.__bfi.push(['_asynRefresh', {
        page_id: pageId,
        orderid: orderId,
        url: getViewUrl(view),
        refer: refererView ? getViewUrl(refererView) : document.referrer
      }]);
    };

    /*
     * 页面切换时,应首先向ubt发送unload
     * @method Lizard.unloadUbt
     * @param {View} view 页面view对象
     */
    Lizard.unloadUbt = function (view) {
      if(!view || (view.config && view.config.preventUBT)) {return;}
      if (!window.__bfi) {window.__bfi = [];}
      window.__bfi.push(['_unload', {
        page_id: getPageId(view),
        url: getViewUrl(view),
        refer: view ? getViewUrl(view) : document.referrer
      }]);
    };

    var getViewUrl = function (view) {
      var url = "";
      if (!view) {return;}
      if (Lizard.isHybrid ) { //直连时，不走该逻辑
        url = view.$el.getAttribute('page-url');
        url = 'http://hybridm.ctrip.com' + ((url.indexOf('/') === 0) ? view.$el.getAttribute('page-url') : '/' + (view.$el.getAttribute('page-url')) );
      } else {
        url = window.location.protocol + '//' + window.location.host + view.$el.getAttribute('page-url');
      }
      return url;
    };

    var getPageId = function (view) {
      return (Lizard.isHybrid || Lizard.app.vendor.is('CTRIP')) ? view.hpageid : view.pageid;
    };
  };
});
