/**
 * Created by shbzhang on 14/12/29.
 */

var requirejs = {
  options: {
    baseUrl                : "<%= config.SRC_DIR %>",
    preserveLicenseComments: false,
    optimize               : "none"
  },

  seed: {
    options: {
      paths  : {
        "json2"             : "3rdlibs/json2",
        "bridge"            : "3rdlibs/bridge",
        "react"             : "3rdlibs/react-lite",
        "jsxtransform"      : "3rdlibs/JSXTransformer",
        "R"                 : "3rdlibs/require",
        "$"                 : "3rdlibs/zepto",
        "_"                 : "3rdlibs/underscore",
        "B"                 : "3rdlibs/backbone",
        "F"                 : "3rdlibs/fastclick",
        "libs"              : "3rdlibs/libs",
        "seed"              : "lizard.seed",
        "config"            : "config",
        "cCoreInherit"      : "common/c.class.inherit",
        "cMessageCenter"    : "common/c.message.center",
        "cAjax"             : "common/c.ajax",
        "cPageParser"       : "app/c.page.parser",
        "cPageModelProcessor": "app/c.page.model.processor",
        "cParserUtil"       : "app/c.parser.util",
        "cOnlineRender"     : "app/c.online.render",
        "cUtilCacheView"    : "util/c.util.cacheview",
        "cUtilCommon"       : "util/c.util.common",
        "cUtilDate"         : "util/c.util.date",
        "cUtilObject"       : "util/c.util.object",
        "cUtilPath"         : "util/c.util.path",
        "cUtilPerformance"  : "util/c.util.performance",
        "cAbstractStore"    : "data/store/c.abstract.store",
        "cLocalStore"       : "data/store/c.local.store",
        "cUnderscorePlugin" : "plugins/c.underscore.plugin",
        "cMemoryStore"      : "data/store/c.memory.store",
        "cCommonStore"      : "data/store/c.common.store",
        "cHeadStore"        : "data/store/common/c.head.store",
        "cAuthStore"        : "data/store/common/c.auth.store",
        "cUserStore"        : "data/store/common/c.user.store",
        "cMarketStore"      : "data/store/common/c.market.store",
        "cMobileTokenStore" : "data/store/common/c.mobiletoken.store",
        "cAbstractModel"    : "data/model/c.abstract.model",
        "cModel"            : "data/model/c.model",
        "cUserModel"        : "data/model/c.user.model",
        "cAbstractStorage"  : "data/storage/c.abstract.storage",
        "cLocalStorage"     : "data/storage/c.local.storage",
        "cCookieStorage"    : "data/storage/c.cookie.storage",
        "cMemoryStorage"    : "data/storage/c.memory.storage",
        "text"              : "http://103",
        "UILoading"         : "http://104",
        "cHybridShell"      : "http://105"
      },
      include: [
        "R",
        "$",
        "_",
        "libs",
        "seed",
        "config",
        "cPageParser"
      ],
      out    : "<%= config.WEB_TEMP_DIR %>/lizard.parser.src.js"
    }
  },

  shell: {
    options: {
      paths  : {
        "cHybridShell": "app/hybrid/c.hybrid.shell"
      },
      include: [
        "cHybridShell"
      ],
      out    : "<%= config.WEB_TEMP_DIR %>/app/hybrid/c.hybrid.shell.js"
    }
  },

  seo: {
    options: {
      paths  : {
        "almond"        : "v8/almond",
        "seoUnderscore" : "v8/underscore_v8",
        "seoHtmlParser" : "v8/htmlParse_v8",
        "seoVm"         : "v8/vm_v8",
        "cSeoEntendUtil": "v8/c.seo.extendutils",
        "cSeoUrlmapping": "v8/c.seo.urlmapping",
        "cSeoGetModels" : "v8/c.seo.getmodels",
        "cSeoRender"    : "v8/c.seo.render",
        "cSeoMain"      : "v8/c.seo.main",
        "cParserUtil"   : "app/c.parser.util"
      },
      include: [
        "almond",
        "seoUnderscore",
        "seoHtmlParser",
        "seoVm",
        "cParserUtil",
        "cSeoEntendUtil",
        "cSeoUrlmapping",
        "cSeoGetModels",
        "cSeoRender",
        "cSeoMain"
      ],
      out    : "<%= config.WEB_TEMP_DIR %>/v8/parser.js"
    }
  },
  multi:{
    options: {
      paths  : {
        "text"              : "3rdlibs/require.text",
        "cImgLazyload"      : "common/c.img.lazyload",
        "cPageView"         : "page/c.page.view",
        "cPageList"         : "page/c.page.list",
        "cUtilHybrid"       : "util/c.util.hybrid",
        "cUtilValidate"     : "util/c.util.validate",
        "cUtilCryptBase64"  : "util/crypt/c.crypt.base64",
        "cUtilCryptRSA"     : "util/crypt/c.crypt.rsa",
        "cSessionStore"     : "data/store/c.session.store",
        "cSessionStorage"   : "data/storage/c.session.storage",
        "cUIBase"           : "ui/c.ui.base",
        "UIView"            : "ui/ui.abstract.view",
        "UILayer"           : "ui/ui.layer",
        "UIAlert"           : "ui/ui.alert",
        "UIMask"            : "ui/ui.mask",
        "UILoading"         : "ui/ui.loading",
        "UILoadingLayer"    : "ui/ui.loading.layer",
        "UIToast"           : "ui/ui.toast",
        "UIInlineView"      : "ui/ui.inline.view",
        "UINum"             : "ui/ui.num",
        "UISwitch"          : "ui/ui.switch",
        "UITab"             : "ui/ui.tab",
        "UIScroll"          : "ui/ui.scroll",
        "UIScrollLayer"     : "ui/ui.scroll.layer",
        "UIRadioList"       : "ui/ui.radio.list",
        "UISelect"          : "ui/ui.select",
        "UIGroupSelect"     : "ui/ui.group.select",
        "UIGroupList"       : "ui/ui.group.list",
        "UICalendar"        : "ui/ui.calendar",
        "UISlider"          : "ui/ui.slider",
        "UIImageSlider"     : "ui/ui.image.slider",
        "cUIInputClear"     : "ui/c.ui.input.clear",
        "UIWarning404"      : "ui/ui.warning404",
        //"UITemplates"   : "ui/ui.templates",
        "UIHeader"          : "ui/ui.header",
        "UICalendarCommon"  : "ui/ui.calendar.common",
        "UIIdentitycard"    : "ui/ui.identitycard",
        "UILayerList"       : "ui/ui.layer.list",
        "UIAnimation"       : "ui/c.ui.animation",
        'UIAdImageSlider'   : 'ui/ui.ad.image.slider', //加进来是为了获取UI模块名
        "UIBubbleLayer"     : "ui/ui.bubble.layer",
        'UIUpload'          : "ui/ui.upload",
        'UIPhotoBrowser'    : "ui/ui.photo.browser",
        'UIUploadImg'       : "ui/ui.upload.img",

        "cGeoService"       : "service/c.service.geo",
        "cGeoLocation"      : "service/c.geo.location",
        "cMemberService"    : "service/c.service.member",
        "cGuiderService"    : "service/c.service.guider",
        "cHybridMember"     : "service/hybrid/c.hybrid.memberService",
        "cHybridGuider"     : "service/hybrid/c.hybrid.guider",
        "cHybridGeolocation": "service/hybrid/c.hybrid.geolocation",
        "cGeoHelper"        : "service/web/c.geo.helper",
        "cStatic"           : "app/web/c.web.static",
        "cHybridApp"        : "app/hybrid/c.hybrid.app",
        "cBaseInit"         : "app/c.base.init",
        "cAbstractApp"      : "app/c.abstract.app",
        "cHybridAppInit"    : "app/hybrid/c.hybrid.init",
        "cWebApp"           : "app/web/c.web.app",
        "cPadExtend"        : "app/c.pad.extend",
        "cWebViewApp"       : "app/hybrid/c.webview.app",
        "cPlugins"          : "plugins/c.plugins",
        "cJsonPlugin"       : "plugins/c.json.plugin",
        "cMarketPlugin"     : "plugins/c.market.plugin",
        "cSafariPlugin"     : "plugins/c.safari.plugin",
        "cStatisticsPlugin" : "plugins/c.statistics.plugin",
        "cUnderscorePlugin" : "plugins/c.underscore.plugin",
        "cZeptoPlugin"      : "plugins/c.zepto.plugin",
        "cSvgPlugin"        : "plugins/c.svg.plugin",
        "cShell"            : "shell/c.shell",
        "loading"           : "http://webresource.c-ctrip.com/ResCRMOnline/R5/basewidget/ui.load",
        "loadFailed"        : "http://webresource.c-ctrip.com/ResCRMOnline/R5/basewidget/ui.loadFailed",

        "json2"             : "http://100",
        "bridge"            : "http://101",
        "R"                 : "http://102",
        "$"                 : "http://103",
        "_"                 : "http://104",
        "B"                 : "http://105",
        "F"                 : "http://106",
        "libs"              : "http://107",
        "cCoreInherit"      : "http://108",
        "cMessageCenter"    : "common/c.message.center",
        "cAjax"             : "common/c.ajax",
        "cPageParser"       : "http://111",
        "cPageModelProcessor": "http://112",
        "cParserUtil"       : "http://113",
        "cUtilCacheView"    : "http://114",
        "cUtilCommon"       : "http://115",
        "cUtilDate"         : "http://116",
        "cUtilObject"       : "http://117",
        "cUtilPath"         : "http://118",
        "cUtilPerformance"  : "util/c.util.performance",
        "cAbstractStore"    : "http://120",
        "cLocalStore"       : "http://121",
        "cMemoryStore"      : "http://122",
        "cCommonStore"      : "http://123",
        "cHeadStore"        : "http://124",
        "cAuthStore"        : "http://125",
        "cUserStore"        : "http://126",
        "cMarketStore"      : "http://127",
        "cMobileTokenStore" : "http://128",
        "cAbstractModel"    : "data/model/c.abstract.model",
        "cModel"            : "data/model/c.model",
        "cUserModel"        : "data/model/c.user.model",
        "cAbstractStorage"  : "http://132",
        "cLocalStorage"     : "http://133",
        "cCookieStorage"    : "data/storage/c.cookie.storage",
        "cMemoryStorage"    : "http://135",
        "cWebGeolocation"   : "http://136"
      },
      include: [
        "cMessageCenter",
        "cModel",
        "cUserModel",
        "cCookieStorage",
        "cImgLazyload",
        "cPageParser",
        "cUtilPerformance",
        "cUtilValidate",
        "cUtilCryptBase64",
        "cUtilCryptRSA",
        "cUtilHybrid",
        "cSessionStore",
        "cSessionStorage",
        "cJsonPlugin",
        "cMarketPlugin",
        "cSafariPlugin",
        "cStatisticsPlugin",
        "cUnderscorePlugin",
        "cZeptoPlugin",
        "cSvgPlugin",
        "cPlugins",
        "cPageView",
        "cPageList",
        "cGeoLocation",
        "cGeoService",
        "cMemberService",
        "cGuiderService",
        "cGeoHelper",
        "cStatic",
        "cBaseInit",
        "text!ui/ui.loading.html",
        "text!ui/ui.loading.failed.html",
        "text!ui/ui.loading.layer.html",
        "text!ui/ui.mask.html",
        "text!ui/ui.warning404.html",
        "text!ui/ui.alert.html",
        "text!ui/ui.toast.html",
        "text!ui/ui.header.html",
        "text!ui/ui.bubble.layer.html",
        "text!ui/ui.emotion.loading.html",
        "cShell"
      ],
      "out"  : "<%= config.WEB_TEMP_DIR %>/lizard.multi.src.js"
    }
  },
  webMulti: {
    options: {
      paths  : {
        "cWebMember"      : "service/web/c.web.memberService",
        "cWebGuider"      : "service/web/c.web.guider",
        "cWebGeolocation" : "service/web/c.web.geolocation",
        "cBGeo"           : "service/web/location/c.web.geolocation.bgeo",
        "cGGeo"           : "service/web/location/c.web.geolocation.ggeo",
        "cHybridShell"    : "app/hybrid/c.hybrid.shell",
        "cHybridFacade"   : "app/hybrid/c.hybrid.facade",
        "cUserModel"      : "http://1",
        "cUtilValidate"   : "http://2",
        "cUtilPath"       : "http://3",
        "cUtilCryptBase64": "http://4",
        "cCommonStore"    : "http://5",
        "cUtilCommon"     : "http://6",
        "cMessageCenter"  : "https://7",
        "cCookieStorage"  : "http://15",
        "cLocalStore"     : "https://16",
        "cGeoHelper"      : "http://8",
        "cUtilPerformance": "http://9",
        "cModel"          : "http://10",
        "cCoreInherit"    : "http://11"
      },
      include: [
        "cWebMember",
        "cWebGuider",
        "cWebGeolocation",
        "cHybridShell",
        "cHybridFacade"
      ],
      out    : "<%= config.WEB_TEMP_DIR %>/lizard.web.multi.src.js"
    }
  },
  hybridMulti: {
    options: {
      paths  : {
        "cHybridHeader"     : "app/hybrid/c.hybrid.header",
        "bridge"            : "3rdlibs/bridge",
        "cHybridStart"      : "app/hybrid/c.hybrid.start",
        "cHybridMember"     : "service/hybrid/c.hybrid.memberService",
        "cHybridGuider"     : "service/hybrid/c.hybrid.guider",
        "cHybridGeolocation": "service/hybrid/c.hybrid.geolocation",
        "cHybridFacade"     : "app/hybrid/c.hybrid.facade",
        "cHybridShell"      : "app/hybrid/c.hybrid.shell",
        "cUtilPath"         : "http://3",
        "libs"              : "http://2",
        "cCommonStore"      : "http://5",
        "cUtilPerformance"  : "http://9",
        "cUtilCommon"       : "http://12",
        "cCoreInherit"      : "http://14",
        "cWebApp"           : "http://15"
      },
      include: [
        "cHybridHeader",
        "bridge",
        "cHybridStart",
        "cHybridMember",
        "cHybridGuider",
        "cHybridGeolocation"
      ],
      out    : "<%= config.WEB_TEMP_DIR %>/lizard.hybrid.multi.src.js"
    }
  }
};