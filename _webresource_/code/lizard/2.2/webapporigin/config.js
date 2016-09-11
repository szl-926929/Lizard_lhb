define(function () {  
  //TODO jquery 加载判断
  var libs = Lizard.dir + '3rdlibs/zepto';
  var iswinphone = window.navigator.userAgent.indexOf('IEMobile') > -1;
  var version;
  if (iswinphone) {
    version = window.navigator.userAgent.match(/IEMobile\/\d+/);
    if (version.length > 0) {
      version = version[0].split('/');
      version = version[1];
    }
  }
  /*by wxj start*/
  if (!('__proto__' in {}) || (iswinphone && version < 10))
  /*by wxj end*/
  {
    //if ( (isie && !iswinphone) || (iswinphone && version < 10)){
    libs = Lizard.dir + '3rdlibs/jquery';
  }

  require.config({
    waitSeconds: 20,
    shim       : {
      $             : {
        exports: 'zepto'
      },
      _             : {
        exports: '_'
      },
      B             : {
        deps   : ['_', '$'],
        exports: 'Backbone'
      },
      F             : {
        deps   : ['$'],
        exports: 'Fastclick'
      },
      libs          : {
        deps   : ['_', '$', 'B'],
        exports: 'libs'
      },
      common        : {
        deps: ['libs']
      },
      cAjax         : {
        exports: 'cAjax'
      },
      UIView        : {
        deps   : ['B'],
        exports: 'UIView'
      },
      cServiceGuider: {
        deps   : ['_'],
        exports: 'cServiceGuider'
      }
    },
    "paths"    : {
      "json2"       : Lizard.dir + "3rdlibs/json2",
      "bridge"      : Lizard.dir + "3rdlibs/bridge",
      "R"           : Lizard.dir + "3rdlibs/require",
      '$'           : libs,
      "_"           : Lizard.dir + "3rdlibs/underscore",
      "B"           : Lizard.dir + "3rdlibs/backbone",
      "F"           : Lizard.dir + "3rdlibs/fastclick",
      "libs"        : Lizard.dir + "3rdlibs/libs",
      "text"        : Lizard.dir + "3rdlibs/require.text",
      "cCoreInherit": Lizard.dir + "common/c.class.inherit",

      "cBusinessCommon": Lizard.dir + "app/c.app.interface",

      "cMessageCenter": Lizard.dir + "common/c.message.center",
      "cAjax"         : Lizard.dir + "common/c.ajax",
      "cImgLazyload"  : Lizard.dir + "common/c.img.lazyload",
      "cGeo"          : Lizard.dir + "common/c.geo",

      "cUtil"           : Lizard.dir + "util/c.util",
      "cLz"             : Lizard.dir + "util/c.lz",
      "cUtilCacheView"  : Lizard.dir + "util/c.util.cacheview",
      "cUtilCommon"     : Lizard.dir + "util/c.util.common",
      "cUtilDate"       : Lizard.dir + "util/c.util.date",
      "cUtilHybrid"     : Lizard.dir + "util/c.util.hybrid",
      "cUtilObject"     : Lizard.dir + "util/c.util.object",
      "cUtilPath"       : Lizard.dir + "util/c.util.path",
      "cUtilPerformance": Lizard.dir + "util/c.util.performance",
      "cUtilValidate"   : Lizard.dir + "util/c.util.validate",
      "cUtilCryptBase64": Lizard.dir + "util/crypt/c.crypt.base64",
      "cUtilCryptRSA"   : Lizard.dir + "util/crypt/c.crypt.rsa",

      "cPageParser"        : Lizard.dir + "app/c.page.parser",
      "cParserUtil"        : Lizard.dir + "app/c.parser.util",
      "cPageModelProcessor": Lizard.dir + "app/c.page.model.processor",

      "cPageView": Lizard.dir + "page/c.page.view",
      "cPageList": Lizard.dir + "page/c.page.list",

      "cAbstractModel": Lizard.dir + "data/model/c.abstract.model",
      "cModel"        : Lizard.dir + "data/model/c.model",
      "cUserModel"    : Lizard.dir + "data/model/c.user.model",

      "cAbstractStore": Lizard.dir + "data/store/c.abstract.store",
      "cLocalStore"   : Lizard.dir + "data/store/c.local.store",
      "cSessionStore" : Lizard.dir + "data/store/c.session.store",
      "cMemoryStore"  : Lizard.dir + "data/store/c.memory.store",
      "cCommonStore"  : Lizard.dir + "data/store/c.common.store",
      "cHeadStore"    : Lizard.dir + "data/store/common/c.head.store",
      "cAuthStore"    : Lizard.dir + "data/store/common/c.auth.store",
      "cUserStore"    : Lizard.dir + "data/store/common/c.user.store",
      "cMarketStore"  : Lizard.dir + "data/store/common/c.market.store",
      "cMobileTokenStore"  : Lizard.dir + "data/store/common/c.mobiletoken.store",

      "cAbstractStorage": Lizard.dir + "data/storage/c.abstract.storage",
      "cLocalStorage"   : Lizard.dir + "data/storage/c.local.storage",
      "cCookieStorage"   : Lizard.dir + "data/storage/c.cookie.storage",
      "cSessionStorage" : Lizard.dir + "data/storage/c.session.storage",
      "cMemoryStorage"  : Lizard.dir + "data/storage/c.memory.storage",

      "cPublic"       : Lizard.dir + "ui/cPublic",
      "cUIInputClear" : Lizard.dir + "ui/c.ui.input.clear",
      "cUIBase"       : Lizard.dir + "ui/c.ui.base",

      //新UI组件
      'UIView'        : Lizard.dir + 'ui/ui.abstract.view',
      'UILayer'       : Lizard.dir + 'ui/ui.layer',
      'UIAlert'       : Lizard.dir + 'ui/ui.alert',
      'UIVerificationCode'        : Lizard.dir + 'ui/ui.verification.code',
      'UIMask'        : Lizard.dir + 'ui/ui.mask',
      'UILoadingLayer': Lizard.dir + 'ui/ui.loading.layer',
      // 情感化loading

      'UILoading'     : Lizard.dir + 'ui/ui.loading',

      'UILoadingFailed'     : Lizard.dir + 'ui/ui.loading.failed',
      //'UILoadingFailedHtml'     : Lizard.dir + 'ui/ui.loading.failed.html',
      'UINetwork': Lizard.dir + 'ui/ui.network.base',

      'UIToast'       : Lizard.dir + 'ui/ui.toast',
      'UIInlineView'  : Lizard.dir + 'ui/ui.inline.view',
      'UINum'         : Lizard.dir + 'ui/ui.num',
      'UISwitch'      : Lizard.dir + 'ui/ui.switch',
      'UIBubbleLayer' : Lizard.dir + 'ui/ui.bubble.layer',
      'UITab'         : Lizard.dir + 'ui/ui.tab',
      'UIScroll'      : Lizard.dir + 'ui/ui.scroll',
      'UIScrollLayer' : Lizard.dir + 'ui/ui.scroll.layer',
      'UIRadioList'   : Lizard.dir + 'ui/ui.radio.list',
      'UISelect'      : Lizard.dir + 'ui/ui.select',
      'UIGroupSelect' : Lizard.dir + 'ui/ui.group.select',
      'UIGroupList'   : Lizard.dir + 'ui/ui.group.list',
      'UICalendar': Lizard.dir  + 'ui/ui.calendar',

      'UICalendarCommon': Lizard.dir + 'ui/ui.calendar.common',

      'UISlider'      : Lizard.dir + 'ui/ui.slider',
      'UIImageSlider' : Lizard.dir + 'ui/ui.image.slider',
      'UIAdImageSlider': Lizard.dir + 'ui/ui.ad.image.slider',
      'UIWarning404'  : Lizard.dir + 'ui/ui.warning404',
      'UIHeader'      : Lizard.dir + 'ui/ui.header',

      'UIIdentitycard': Lizard.dir + 'ui/ui.identitycard',
      'UILayerList'   : Lizard.dir + 'ui/ui.layer.list',
      'UIAnimation'   : Lizard.dir + 'ui/c.ui.animation',

      //上传组件lh_wang
      'UIUpload'      : Lizard.dir + 'ui/ui.upload',
      'UIPhotoBrowser'      : Lizard.dir + 'ui/ui.photo.browser',
      // 针对图片浏览器埋点
      'UIUbtPB'      : Lizard.dir + 'ui/ui.ubt.pb',
      // 手指缩放
      'UIPinchZoom': Lizard.dir + 'ui/ui.pinch.zoom',
      // 上传图片
      'UIUploadImg'              : Lizard.dir + 'ui/ui.upload.img',
      'uiLoadFailedWithCall'      : Lizard.dir + 'ui/ui.load.failed.with.call',
      'uiNoSearch'               : Lizard.dir + 'ui/ui.nosearch',
      'uiLoad404'                : Lizard.dir + 'ui/ui.load404',
      'uiLoad'                   : Lizard.dir + 'ui/ui.load',
       // crem动态合并
      'loading'       : Lizard.isHybrid ? Lizard.dir.substr(0,Lizard.dir.indexOf('lizard/webresource')) + 'basewidget/res/js/ui.loading':'//webresource.c-ctrip.com/ResCRMOnline/R5/basewidget/ui.loading',
      'loadFailed'    : Lizard.isHybrid ? Lizard.dir.substr(0,Lizard.dir.indexOf('lizard/webresource')) + 'basewidget/res/js/ui.loadFailed':'//webresource.c-ctrip.com/ResCRMOnline/R5/basewidget/ui.loadFailed',
      //所有模板在此
//      'UITemplates': Lizard.dir + 'ui/ui.templates',

      "cGeoService"   : Lizard.dir + "service/c.service.geo",
      "cGeoLocation"  : Lizard.dir + "common/c.geo.location",
      "cMemberService": Lizard.dir + "service/c.service.member",
      "cGuiderService": Lizard.dir + "service/c.service.guider",
      "cQrcodeService": Lizard.dir + "service/c.service.qrcode",
      
      "cHybridMember"     : Lizard.dir + "service/hybrid/c.hybrid.memberService",
      "cHybridGuider"     : Lizard.dir + "service/hybrid/c.hybrid.guider",
      "cHybridGeolocation": Lizard.dir + "service/hybrid/c.hybrid.geolocation",
      "cGeoHelper"        : Lizard.dir + "service/web/c.geo.helper",
      "cWebMember"        : Lizard.dir + "service/web/c.web.memberService",
      "cWebGuider"        : Lizard.dir + "service/web/c.web.guider",
      "cWebGeolocation"   : Lizard.dir + "service/web/c.web.geolocation",
      "cBGeo"             : Lizard.dir + "service/web/location/c.web.geolocation.bgeo",
      "cGGeo"             : Lizard.dir + "service/web/location/c.web.geolocation.ggeo",
      "cAMap"             : Lizard.dir + "service/web/map/c.web.geolocation.amap",
      "cBMap"             : Lizard.dir + "service/web/map/c.web.geolocation.bmap",
      "cGMap"             : Lizard.dir + "service/web/map/c.web.geolocation.gmap",
      "cMap"              : Lizard.dir + "service/web/c.web.map",
      "cStatic"       : Lizard.dir + "app/web/c.web.static",
      "cBaseInit"     : Lizard.dir + "app/c.base.init",
      "cAbstractApp"  : Lizard.dir + "app/c.abstract.app",
      "cOnlineRender" : Lizard.dir + "app/c.online.render",
      "cWebApp"       : Lizard.dir + "app/web/c.web.app",
      "cPadExtend"    : Lizard.dir + "app/c.pad.extend",
      "cPadApp"       : Lizard.dir + "app/web/c.pad.app",
      "cHybridApp"    : Lizard.dir + "app/hybrid/c.hybrid.app",
      "cWebViewApp"   : Lizard.dir + "app/hybrid/c.webview.app",
      "cHybridFacade" : Lizard.dir + "app/hybrid/c.hybrid.facade",
      "cHybridShell"  : Lizard.dir + "app/hybrid/c.hybrid.shell",
      "cHybridHeader": Lizard.dir + "app/hybrid/c.hybrid.header",
      "cHybridAppInit": Lizard.dir + "app/hybrid/c.hybrid.init",
      "cWebAppInit"   : Lizard.dir + "app/web/c.web.init",

      "cJsonPlugin"      : Lizard.dir + "plugins/c.json.plugin",
      "cMarketPlugin"    : Lizard.dir + "plugins/c.market.plugin",
      "cSafariPlugin"    : Lizard.dir + "plugins/c.safari.plugin",
      "cStatisticsPlugin": Lizard.dir + "plugins/c.statistics.plugin",
      "cUnderscorePlugin": Lizard.dir + "plugins/c.underscore.plugin",
      "cZeptoPlugin"      : Lizard.dir + "plugins/c.zepto.plugin",
      "cSvgPlugin"       : Lizard.dir + "plugins/c.svg.plugin",
      "cPlugins"         : Lizard.dir + "plugins/c.plugins",

      /*…jiangjing@ctrip.com…2015-01-23…*/
      // cShell_<VENDOR>_<APPCODE> 命名的模块仅供 cShell 内部引用
      "cShell": Lizard.dir + "shell/c.shell",
      "cShell_CTRIP_MASTER": Lizard.dir + "shell/c.shell.ctrip.master",
      "cShell_TECENT_WEIXIN": Lizard.dir + "shell/c.shell.tecent.weixin",
      'AdSlider'       : Lizard.isHybrid ? Lizard.dir.substr(0,Lizard.dir.indexOf('lizard/webresource')) + 'advertisement/aframe/1.0/aSlider.min':'//webresource.c-ctrip.com/ResMarketOnline/R2/js/aFrame/aSlider.min'
    },
    "map"      : {
      "*": {
        "cUtility"   : "cUtilCommon",
        "cStore"     : "cLocalStore",
        "cGuider"    : "cGuiderService",
        "CommonStore": "cCommonStore"
      }
    }
  });
});
