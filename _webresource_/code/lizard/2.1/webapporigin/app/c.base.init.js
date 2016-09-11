define(['cPlugins', 'cCoreInherit', Lizard.isHybrid ? 'cHybridApp' : (Lizard.app.code.is('MASTER') || Lizard.app.code.is('YOUTH') ? 'cWebViewApp' : 'cWebApp'), 'cPadExtend', 'cGuiderService'], function (plugins, cCoreInherit, APP, cPadExtend, Guider) {
  if (Lizard.config.isPad) {
    APP = cCoreInherit.Class(APP, cPadExtend);
  } 
  function createLizardins() {
    // bu项目加版本号，这里添加的目的是只影响BU的模块
    if (Lizard.config.version) {
      require.config({
        urlArgs: Lizard.config.version
      });
    }
    if (Lizard.pdConfig) {
      require(Lizard.pdConfig, function () {
        _createLizardIns();
      });
    }
    else {
      _createLizardIns();
    }
  }

  function _createLizardIns() {
    //此处new Lizard 初始化
    Lizard.instance = new APP({});
    for (var n in Lizard.instance.interface()) {
      Lizard[n] = $.proxy(Lizard.instance.interface()[n], Lizard.instance);
    }
    plugins.regStatisticsEvent();
    plugins.regMarketEvent();
    if (Lizard.readyQueue) { 
      _.each(Lizard.readyQueue, function(fn){
        Lizard.viewReady(fn);
      });
    }
    delete Lizard.readyQueue;

    Guider.create();
  }

  return createLizardins;
});