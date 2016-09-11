define(['cPageModelProcessor', 'cMessageCenter', 'cUtilPerformance', 'cPageParser'], function (callModels, MessageCenter, cperformance) {
  var pageConfig = Lizard._initParser(location.href, document.body.innerHTML);
  pageConfig.isLoadingstep = true;
  if (pageConfig.init_data && Lizard.renderAt !== 'server') {
    var renderObj = Lizard.render(pageConfig, pageConfig.init_data, Lizard.renderAt);
    if (renderObj.header) {
      var header = $('<div class="cm-header" id="ui-view-12" style=""><span class=" cm-header-icon fl  js_back"><i class="icon-back"></i></span><h1 class="cm-page-title js_title"></h1></div>');
      header.find('h1').text($('<div>' + renderObj.header + '</div>').find('h1').text() || $('<div>' + renderObj.header + '</div>').find('h2').text());
      header.appendTo($('#headerview').html(''));
    }
    Lizard.__fakeViewnode = $(renderObj.viewport).prependTo($('#main').find('.main-viewport'));
  }
  //机票特殊处理
  try {
    pageConfig.serverData = window.Fp.getData('datas') || {};
  } catch (e) {}
  callModels(pageConfig, function (datas, pageConfig) {
    if (pageConfig.model.apis && pageConfig.model.apis.length === 0 && pageConfig.init_data) {
      datas = pageConfig.init_data;
    }
    var renderObj = Lizard.__firstPageRenderObj = Lizard.render(pageConfig, datas, Lizard.renderAt);
    if (!MessageCenter.publish('firt_screen_data_fetched', [datas])) {
      Lizard.serverData = datas;
    }
    //SEO 下不渲染
    if (Lizard.renderAt == 'server') {
      return;
    }
    if (!(Lizard.app.vendor.is('CTRIP') || Lizard.isHybrid) || Lizard.app.code.is('WE')) {      
      if (renderObj.header) {
        $('#headerview').css({
          display : ''
        });
        var header = $('<div class="cm-header" id="ui-view-12" style=""><span class=" cm-header-icon fl  js_back"><i class="icon-back"></i></span><h1 class="cm-page-title js_title"></h1></div>');
        header.find('h1').text($('<div>' + renderObj.header + '</div>').find('h1').text() || $('<div>' + renderObj.header + '</div>').find('h2').text());
        header.appendTo($('#headerview').html(''));
      }
    }
    $(renderObj.viewport).prependTo($('#main').find('.main-viewport'));
  }, function (datas) {
    if (!MessageCenter.publish('firt_screen_data_error', [datas])) {
      Lizard.errorServerData = datas;
    }
  });
  return pageConfig;
});
