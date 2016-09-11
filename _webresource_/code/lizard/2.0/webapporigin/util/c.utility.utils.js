define(['cUtilityPath'], function(path){
    var utils = {};

    utils.isSupportPushState = (function () {
      //如果是hybrid则走hashchange,不走pushstate
      if (Lizard.isHybrid && window.location.protocol == "file:")return false;
      // return false;
      return !!(window.history && window.history.pushState && window.history.replaceState);
      /**/
    })();

    utils.uuid = 0;
    utils.dialogUuid = 0;
    
    utils.isExternalLink = function (url) {
      var RegH5NewType = new RegExp(/^mailto:|^tel:|^javascript:/);
      return RegH5NewType.test(url);
    }
    
    utils.goExternalLink = function (url, opts) {
      var isSameDomain = path.isSameDomain(path.makeUrlAbsolute(url), window.location.href);
      
      //opts.target\opts.jump是否是新窗口打开
      var opts = opts || {};
      var type = opts.type || 'get';
      var data = opts.data || {};
      
      if (isSameDomain) {
        //hybrid的情况下，如果是同域的话，则交给框架来调用
        if (Lizard.isHybrid) {
          if (type == 'get') {
            if ((opts.target || opts.jump)) {
              var reqs = ['cWidgetFactory', 'cWidgetGuider'];
              require(reqs, function () {
                var WidgetFactory = arguments[0];
                var Guider = WidgetFactory.create('Guider');
                Guider.jump({ targetModel: 'open', url: location.href.replace(/[\?#].+$/, '') + "#" + encodeURIComponent(url), title: '' });
              });
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        } else {
          //同域中执行新窗口打开
          if (opts.target || opts.jump || !utils.isSupportPushState) {
            return request(type, url, data);
          }
        }
      } else {
        //要处理不同域下的跳转
        return request(type, url, data);
      }      
      return false;
    }

    function request(type, url, data) {
      if (type != "post") {
        location.href = url;
      } else {
        post(url, data)
      }
      return true;
    }

    function post(url, data) {
      var HIDDEN = 'hidden', NONE = 'none', doc = window.document;  
      // create the form        
      var name, form = $('<FORM/>').attr({method: 'post', action: url,  target: "_blank"}).css({display: NONE}).appendTo(doc.body).eq(0);
      // add the data
      for (name in data) {
        $('<INPUT/>').attr({type:  HIDDEN, name:  name, value: data[name]}).appendTo(form);       
      }
      // submit
      form.submit();
      // clean up
      $(form).remove();
    }
    return utils;
});
