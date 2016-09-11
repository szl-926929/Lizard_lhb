define(function () {
  require.config({
    waitSeconds: 20,
    shim       : {
      _             : {
        exports: '_'
      },
      F             : {
        exports: 'Fastclick'
      },
      cAjax         : {
        exports: 'cAjax'
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
      "_"           : Lizard.dir + "3rdlibs/underscore",
      "F"           : Lizard.dir + "3rdlibs/fastclick",
      "text"        : Lizard.dir + "3rdlibs/require.text",
      "react"       : Lizard.dir + "3rdlibs/react-lite",
      "jsxtransform": Lizard.dir + "3rdlibs/JSXTransformer",
      "cCoreInherit": Lizard.dir + "common/c.class.inherit",

      "cBusinessCommon": Lizard.dir + "app/c.app.interface",

      "cMessageCenter": Lizard.dir + "common/c.message.center",
      "cAjax"         : Lizard.dir + "common/c.ajax",
      "cImgLazyload"  : Lizard.dir + "common/c.img.lazyload",
      "cGeo"          : Lizard.dir + "common/c.geo",

      "cUtil"           : Lizard.dir + "util/c.util",
      "cUtilCacheView"  : Lizard.dir + "util/c.util.cacheview",
      "cUtilCommon"     : Lizard.dir + "util/c.util.common",
      "cUtilDate"       : Lizard.dir + "util/c.util.date",
      "cUtilHybrid"     : Lizard.dir + "util/c.util.hybrid",
      "cUtilObject"     : Lizard.dir + "util/c.util.object",
      "cUtilXhr"        : Lizard.dir + "util/c.util.xhr",
      "cUtilPath"       : Lizard.dir + "util/c.util.path",
      "cUtilPerformance": Lizard.dir + "util/c.util.performance",
      "cUtilValidate"   : Lizard.dir + "util/c.util.validate",
      "cUtilEvent"      : Lizard.dir + "util/c.util.event",
      "cUtilDom"        : Lizard.dir + "util/c.util.dom",
      "cUtilCryptBase64": Lizard.dir + "util/crypt/c.crypt.base64",
      "cUtilCryptRSA"   : Lizard.dir + "util/crypt/c.crypt.rsa",
      
      "cPageParser"        : Lizard.dir + "app/c.page.parser",
      "cParserUtil"        : Lizard.dir + "app/c.parser.util",
      "cPageModelProcessor": Lizard.dir + "app/c.page.model.processor",

      "cPageView": Lizard.dir + "page/c.page.view",      

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
      
      "UIHeader"          : Lizard.dir + "ui/ui.header",      
      "UIAnimation"       : Lizard.dir + 'ui/c.ui.animation',                    
      "cGeoService"       : Lizard.dir + "service/c.service.geo",
      "cGeoLocation"      : Lizard.dir + "common/c.geo.location",
      "cMemberService"    : Lizard.dir + "service/c.service.member",
      "cGuiderService"    : Lizard.dir + "service/c.service.guider",
      "cQrcodeService"    : Lizard.dir + "service/c.service.qrcode",
      
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

      //UI 文件夹
      "UIMask"         : Lizard.dir + "ui/ui.mask",
      "UIAlert"        : Lizard.dir + "ui/ui.alert",

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
