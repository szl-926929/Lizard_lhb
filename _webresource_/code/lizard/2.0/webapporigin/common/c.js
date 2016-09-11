/**
 * @author cmli@ctrip.com / oxz欧新志 <ouxz@Ctrip.com>
 * @class c
 * @description Lizard框架集合
 */
define(['cBase', 'cUI', 'cUtility', 'cPageView', 'cModel', 'cStore', 'cStorage', 'cAjax', 'CommonStore', 'cLazyload'],
  function(cBase, cUI, cUtility, cView, cModel, cStore, cStorage, cAjax, cCommonStore, lazyload) {

  var c = {
    base: cBase,
    ui: cUI,
    view: cView,
    utility: cUtility,
    store: cStore,
    storage: cStorage,
    model: cModel,
    ajax: cAjax,
    /***log: cLog,***/
    commonStore: cCommonStore,
    lazyload: lazyload
  };

  return c;

});