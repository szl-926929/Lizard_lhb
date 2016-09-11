var requirejs = {
  options: {
    baseUrl                : "<%= config.SRC_DIR %>",
    preserveLicenseComments: false,
    optimize               : "none"
  },

  libs: {
    options: {
      paths  : {
        "json2" : "3rdlibs/json2",
        "bridge": "3rdlibs/bridge",
        "R"     : "3rdlibs/require",
        "$"     : "3rdlibs/zepto",
        "_"     : "3rdlibs/underscore",
        "B"     : "3rdlibs/backbone",
        "F"     : "3rdlibs/fastclick",
        "P"     : "parser",

        "libs"        : "3rdlibs/libs",
        "text"        : "3rdlibs/require.text",
        "cCoreInherit": "core/c.core.inherit",


        "cView"          : "business/c.business.view",
        "rsa"            : "business/c.business.rsa",
        "cBusinessCommon": "business/c.business.common",


        "c"             : "common/c",
        "cBase"         : "common/c.base",
        "cLog"          : "common/c.log",
        "cSales"        : "common/c.sales",
        "cLazyload"     : "common/c.lazyload",
        "cListAdapter"  : "common/c.common.listadapter",
        "cGeoService"   : "common/c.geo.service",
        "cGeoHelper"    : "common/c.geo.helper",
        "cMessageCenter": "common/c.message.center",
        "cAjax"         : "common/c.ajax",
        "cImgLazyload"  : "common/c.img.lazyload",
        "cPageParser"   : "page/c.page.parser",

        "cUtilityPerformance" : "util/c.utility.performance",
        "cUtilityPath"        : "util/c.utility.path",
        "cUtilityUtil"        : "util/c.utility.utils",
        "cUtilityStateHistory": "util/c.utility.state.history",

        "cUtilityCacheView": "util/c.utility.cacheview",

        "cUtilityHybrid"    : "util/c.utility.hybrid",
        "cUtilityHash"      : "util/c.utility.hash",
        "cUtilityDate"      : "util/c.utility.date",
        "cUtilityServertime": "util/c.utility.servertime",
        "cUtilityCrypt"     : "util/c.utility.crypt",
        "cUtility"          : "util/c.utility",
        "cUtilityFlip"      : "util/c.utility.flip",

        "Validate": "util/c.validate",

        "cAbstractStore"  : "store/c.abstract.store",
        "cAbstractStorage": "store/c.abstract.storage",
        "cStore"          : "store/c.local.store",
        "cStorage"        : "store/c.local.storage",
        "cSessionStore"   : "store/c.session.store",
        "cSessionStorage" : "store/c.session.storage",
        "memStore"        : "store/c.memorystore",
        "CommonStore"     : "store/c.common.store",
        "PageStore"       : "store/c.store.package",


        "cAbstractModel": "model/c.abstract.model",
        "cModel"        : "model/c.model",
        "cUserModel"    : "model/c.user.model",
        "cMultipleDate" : "model/c.multiple.data",


        "cUI"            : "ui/c.ui",
        "cUICore"        : "ui/c.ui.core",
        "cHistory"       : "ui/c.ui.history",
        "cUIView"        : "ui/c.ui.view",
        "cDataSource"    : "ui/c.ui.datasource",
        "cUIBase"        : "ui/c.ui.base",
        "cUIAbstractView": "ui/c.ui.abstract.view",
        "cAdView"        : "ui/c.ui.ad",
        "cUIAlert"       : "ui/c.ui.alert",
        "cUIHeader"      : "ui/c.ui.header",

        "cUIAnimation"   : "ui/c.ui.animation",
        "cUICitylist"    : "ui/c.ui.citylist",
        "cUIHeadWarning" : "ui/c.ui.head.warning",
        "cUIInputClear"  : "ui/c.ui.input.clear",
        "cUILayer"       : "ui/c.ui.layer",
        "cUILoading"     : "ui/c.ui.loading",
        "cUILoadingLayer": "ui/c.ui.loading.layer",
        "cUIMask"        : "ui/c.ui.mask",
        "cUIPageview"    : "ui/c.ui.page.view",

        "cUIScrollRadio"      : "ui/c.ui.scroll.radio",
        "cUIScrollRadioList"  : "ui/c.ui.scroll.radio.list",
        "cUIScrollList"       : "ui/c.ui.scrolllist",
        "cUIToast"            : "ui/c.ui.toast",
        "cUIWarning"          : "ui/c.ui.warning",
        "cUIWarning404"       : "ui/c.ui.warning404",
        "cUIHashObserve"      : "ui/c.ui.hash.observe",
        "cUIEventListener"    : "ui/c.ui.event.listener",
        "cUISwitch"           : "ui/c.ui.switch",
        "cUIScroll"           : "ui/c.ui.scroll",
        "cUINum"              : "ui/c.ui.num",
        "cUIGroupList"        : "ui/c.ui.group.list",
        "cUIBusinessGroupList": "ui/c.ui.business.group.list",
        "cUITab"              : "ui/c.ui.tab",
        "cUIImageSlider"      : "ui/c.ui.imageSlider",
        "cUIBubbleLayer"      : "ui/c.ui.bubble.layer",
        "cUILayerList"        : "ui/c.ui.layer.list",
        "cUIIdentitycard"     : "ui/c.ui.identitycard",
        "cUISidebar"          : "ui/c.ui.sidebar",

        "cWidgetFactory"         : "widget/c.widget.factory",
        "cWidgetHeaderView"      : "widget/c.widget.headerview",
        "cWidgetListView"        : "widget/c.widget.listview",
        "cWidgetTipslayer"       : "widget/c.widget.tipslayer",
        "cWidgetInputValidator"  : "widget/c.widget.inputValidator",
        "cWidgetPublisher"       : "widget/c.widget.publisher",
        "cWidgetGeolocation"     : "widget/c.widget.geolocation",
        "cWidgetAbstractCalendar": "widget/c.widget.abstract.calendar",
        "cWidgetCalendar"        : "widget/c.widget.calendar",
        "cWidgetCalendarPrice"   : "widget/c.widget.calendar.price",
        "cWidgetSlide"           : "widget/c.widget.slide",
        "cWidgetMember"          : "widget/c.widget.member",
        "cWidgetGuider"          : "widget/c.widget.guider",
        "cWidgetCaptcha"         : "widget/c.widget.captcha",

        "cCalendar"            : "widget/c.calendar",
        "cHolidayCalendar"     : "widget/c.holiday.calendar",
        "cHolidayPriceCalendar": "widget/c.holiday.price.calendar",


        "cBasePageView"     : "page/c.page.base",
        "cCommonPageFactory": "page/c.page.factory",
        "cCommonListPage"   : "page/c.page.common.list",
        "cPageView"         : "page/c.page.view",

        "cHybridFacade": "hybrid/c.hybrid.facade",
        "cHybridShell" : "hybrid/c.hybrid.shell",
        "cShell"       : "shell/c.shell"
      },
      include: [
        "bridge",
        "R",
        "$",
        "_",
        "B",
        "F",

        "libs",
        "text",
        "lizard.seed",
        "lizard",

        "c",
        "cBase",

        "cSales",
        "cLazyload",
        "cListAdapter",
        "cGeoService",
        "cGeoHelper",
        "cMessageCenter",
        "cAjax",


        "cUtilityHash",

        "cUtility",


        "cStore",
        "cStorage",

        "CommonStore",


        "cAbstractModel",
        "cModel",

        "cMultipleDate",


        "cUI",
        "cUICore",
        "cHistory",

        "cDataSource",

        "cUIAnimation",


        "cUIScrollList",


        "cWidgetFactory",


        "cPageView",
        "cPageParser",

        "cWidgetMember",
        "cUserModel",
        "cUtilityCrypt",
        "cShell"
      ],
      out    : "<%= config.WEB_TEMP_DIR %>/lizard.seed.src.js"
    }
  },

  "defer": {
    "options": {
      "paths"  : {
        "cSessionStorage": "store/c.session.storage",
        "cSessionStore"  : "store/c.session.store",
        "PageStore"      : "store/c.store.package",
        "cAdView"        : "ui/c.ui.ad",

        "cUIView"        : "ui/c.ui.view",
        "cUILayerList"   : "ui/c.ui.layer.list",
        "cUIIdentitycard": "ui/c.ui.identitycard",

        "cCalendar"            : "widget/c.calendar",
        "cHolidayCalendar"     : "widget/c.holiday.calendar",
        "cHolidayPriceCalendar": "widget/c.holiday.price.calendar",


        "rsa": "business/c.business.rsa",

        "cWidgetHeaderView"      : "widget/c.widget.headerview",
        "cWidgetListView"        : "widget/c.widget.listview",
        "cWidgetTipslayer"       : "widget/c.widget.tipslayer",
        "cWidgetInputValidator"  : "widget/c.widget.inputValidator",
        "cWidgetPublisher"       : "widget/c.widget.publisher",
        "cWidgetGeolocation"     : "widget/c.widget.geolocation",
        "cWidgetAbstractCalendar": "widget/c.widget.abstract.calendar",
        "cWidgetCalendar"        : "widget/c.widget.calendar",
        "cWidgetCalendarPrice"   : "widget/c.widget.calendar.price",
        "cWidgetSlide"           : "widget/c.widget.slide",
        "cWidgetCaptcha"         : "widget/c.widget.captcha",

        "cBasePageView"     : "page/c.page.base",
        "cCommonPageFactory": "page/c.page.factory",
        "cCommonListPage"   : "page/c.page.common.list",
        "cImgLazyload"      : "common/c.img.lazyload",

        "$"               : "http://0",
        "libs"            : "http://libs",
        "cCoreInherit"    : "http://cCoreInherit",
        "cBase"           : "http://cBase",
        "c"               : "http://c",
        "cUI"             : "http://cUI",
        "cUIBase"         : "http://cUIBase",
        "cUtility"        : "http://cUtility",
        "cUICore"         : "http://cUICore",
        "cModel"          : "http://cModel",
        "cAbstractStore"  : "http://cAbstractStore",
        "cAbstractStorage": "http://cAbstractStorage",
        "cUIAbstractView" : "http://cUIAbstractView",
        "cUIAlert"        : "http://cUIAlert",
        "cUIMask"         : "http://cUIMask",
        "cUIHashObserve"  : "http://cUIHashObserve",
        "cStorage"        : "http://cStorage",
        "cStore"          : "http://cStore",
        "cSales"          : "http://cSales",
        "cWidgetFactory"  : "http://cWidgetFactory",
        "CommonStore"     : "http://CommonStore",
        "cUIWarning"      : "http://cUIWarning",
        "cUIWarning404"   : "http://cUIWarning404",
        "cUIHeadWarning"  : "http://cUIHeadWarning",
        "cUIToast"        : "http://cUIToast",
        "cUILoading"      : "http://cUILoading",
        "cUIBubbleLayer"  : "http://cUIBubbleLayer",
        "cUIScroll"       : "http://cUIScroll",
        "cUIScrollList"   : "http://cUIScrollList",
        "cGeoHelper"      : "http://cGeoHelper",
        "cPageView"       : "http://cPageView",
        "cWidgetGuider"   : "http://cWidgetGuider",
        "cHybridFacade"   : "http://cHybridFacade",
        "cHybridShell"    : "http://hybrid/c.hybrid.shell"

      },
      "include": [
        "cSessionStorage",
        "cSessionStore",
        "PageStore",
        "cUIView",
        "cAdView",
        "cUILayerList",
        "cUIIdentitycard",
        "cCalendar",
        "cHolidayCalendar",
        "cHolidayPriceCalendar",
        "rsa",

        "cWidgetHeaderView",
        "cWidgetListView",
        "cWidgetTipslayer",
        "cWidgetInputValidator",
        "cWidgetPublisher",
        "cWidgetAbstractCalendar",
        "cWidgetCalendar",
        "cWidgetCalendarPrice",
        "cWidgetSlide",
        "cWidgetCaptcha",

        "cBasePageView",
        "cCommonPageFactory",
        "cCommonListPage",
        "cImgLazyload"
      ],
      "out"    : "<%= config.WEB_TEMP_DIR %>/lizard.defer.src.js"
    }
  }
};