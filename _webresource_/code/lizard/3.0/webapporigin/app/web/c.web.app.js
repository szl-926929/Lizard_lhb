define(['cUtilCommon', 'cCoreInherit', 'cAbstractApp', 'cUtilPath', 'cAjax'], function (UtilCommon, cCoreInherit, APP, Path, cAjax) { 
  return cCoreInherit.Class(APP, {
    bindEvents: function ($super) {
      $super();
      $(window).bind('popstate', _.bind(function (e) {
        if (this.__isLanding && !e.state) {return;}
        if (_.size(this._stateCallbacks)) {
          this._callObserveBack();
          return;
        }
        //IOS下的微信， 首页进去，返回会触发popstate这里屏蔽这个多余的处理
        if ($.os.ios && Lizard.app.code.is('WEIXIN') && history.length == 1) {
          return;
        }
        var data = e.state || (e.originalEvent && e.originalEvent.state);
        if (_.isUndefined(data) && location.href.substring(location.href.indexOf(Path.parseUrl(location.href).pathname)) == this.__startState.url) {
          data = this.__startState;
        }
        if (Lizard.stopStateWatch || !data) {
          return;
        }
        if (data.options) {
          data.options.pushState = false;
          data.options.landingpage = 0;
          data.options.hideloading = true;
          delete data.options.renderAt;
        }
        
        history.replaceState({url: data.url, text: data.text, options: data.options}, document.title, data.url);
        this.navigationType = 'back';
        if (_.isUndefined(data.options)) {
          data.options = {};
        }        
        data.options.animatName = this.animBackwardName;
        this.showView(data);
        if (Lizard.__fakeViewNode) {
          Lizard.__fakeViewNode.remove();
        }
      }, this));
    },

    start: function () {      
      if (Lizard.config.urlMappingModule) {
        var self = this;
        require([Lizard.config.urlMappingModule], function(mappfunc){
          var landingpath = mappfunc(location.href);
          if (self.judgeForward(landingpath)) {
            self._loadViewByLocationUrl();    
          } else {
            self.goTo(landingpath, {pushState: false, renderAt: Lizard.renderAt, landingpage: 1, hideloading: Lizard.config.isFirstPageHideLoading});    
          }          
        });  
      } else {
        this._loadViewByLocationUrl();  
      }
      this.__isLanding = true;
    },
    
    _loadViewByLocationUrl: function()
    {
      var landingpath = Path.parseUrl(location.href).pathname;
      if (landingpath == '/') {
        landingpath = '/index';
      }
      else {
        landingpath = location.href.substring(location.href.indexOf(Path.parseUrl(location.href).pathname));
      }
      this.__startState = {url: landingpath, text: document.documentElement.innerHTML, options: {pushState: false, renderAt: 'server', landingpage: 1, hideloading: Lizard.config.isFirstPageHideLoading}};
      if (!Lizard.app.vendor.is('CTRIP')) {
        history.replaceState({url: landingpath, text: document.documentElement.innerHTML, options: {pushState: false, renderAt: 'server', landingpage: 1, hideloading: Lizard.config.isFirstPageHideLoading}}, document.title, landingpath);
      }
      //history.replaceState({url: landingpath, text: document.documentElement.innerHTML, options: {pushState: false, renderAt: Lizard.renderAt, landingpage: 1, hideloading: Lizard.config.isFirstPageHideLoading}}, document.title, landingpath);
      this.loadView(landingpath, document.documentElement.innerHTML, {pushState: false, renderAt: 'server', landingpage: 1, hideloading: Lizard.config.isFirstPageHideLoading});
    },

    /*
     * 见cAbstractApp.goTo
     * @param url
     * @param opt
     */
    goTo: function (url, opt) {
      var now = new Date();
      if ((opt && !opt.forcegoto) && this.lastGoto && now - this.lastGoto < 500) {
        console.log('return');
        return;
      }
      this.navigationType = 'forward';
      this.lastGoto = now;
      this.__isLanding = false;
      if (_.isObject(url)) {
        if (history.length > 1) {
          this.goBack();
          return;
        }
        else {
          var opts = url;
          opts.animatName = opts.animatName || this.animBackwardName;
          //这个时候需要处理 firsState
          opts.replaceFirstState = true;
          opts.isPushState = true;
          this.goTo(opts.defaultView, opts);
          return;
        }
      }      
      
      if (UtilCommon.isUrl(url) || url.indexOf('http://localhost') === 0) {
        if (url.indexOf('/webapp') > -1) {
            url = url.substr(url.indexOf('/webapp'));
        }
        if (url.indexOf('/html5') > -1) {
            url = url.substr(url.indexOf('/html5'));
        }
      }
      var pageName = opt && (opt.viewName || opt.pageName);
      var forcegetschema = opt && (opt.forcegetschema);
      var self = this;
      if (opt && pageName && Lizard.viewHtmlMap[pageName]) {
        self._loadViewByOptions(url, Lizard.viewHtmlMap[pageName], opt);
        return;
      } else if (Lizard.viewSchemaMap && !forcegetschema) {
        var queryStr=url.replace(/^[^\?#]*\??/g,'').replace(/#DIALOG_.*$/g,'').replace(/#\|cui-.*$/g,'');
        var path = queryStr?url.substr(0, url.indexOf(queryStr) - 1):url;
        var htmlItem = '', length = 0;
        _.each(Lizard.viewSchemaMap, function(value, key){
          if ((new RegExp(key)).test(path)) {
            if (key.length > length) {
              htmlItem = value;
            }
          }
        });
        if (htmlItem) {
          self._loadViewByOptions(url, htmlItem, opt);
          return;
        }
      }
      var geturl = url;
      var version = Lizard.config.version;
      if (version) {
        geturl = geturl.replace(/(\?|#|$)/, function(match, $1) {
          if ($1 === '#') {
            return '?' + version + '#'; 
          } else if ($1 === '?') {
            return '?' + version + '&';
          } else {
            return '?' + version;
          }
        });
      }
      if (window.LizardH5Localroute) {
        var configObj = Lizard.localRoute.mapUrl(url); 
        if (configObj) {
          this._loadViewByOptions(url, '<SCRIPT type="text/lizard-config">' + JSON.stringify(configObj) + '</SCRIPT>', opt);
          return;
        }        
      }
      cAjax.get(geturl, opt ? opt.data : {}, function (html) {
        self._loadViewByOptions(url, html, opt);
      }, _.bind(function () {
        this.showWarning404(function () {
          Lizard.goTo(url, {pushState: false});
        }, null, {headData: {view: this, title: '网络不给力', back: true, events: {returnHandler: function () {
          if (this.curView) {
            Lizard.goTo(this.lastView.$el.attr('page-url'), {pushState: false});
          } else {
            Lizard.goBack();
          }
        }}}});
      }, this));
    },
    
    _loadViewByOptions: function(url, html, opt)
    {
      var goToPath = Path.parseUrl(url).pathname;      
      if (opt && opt.pushState === false) {
        history.replaceState({url: url, text: html, options: {pushState: false}}, document.title, url);
      }
      else {
        history.pushState({url: url, text: html, options: {pushState: true}}, document.title, url);
      }
      if (html.indexOf('lizard.seed.js') == -1 && !window.LizardH5Localroute) {
        window.location.reload();
      }
      if (_.isEmpty(opt)) {
        opt = {};
      }
      opt.pushState = true;
      opt.animatName = opt.animatName;
      this.loadView(url, html, opt); 
    },

    /*
     * 见cAbstractApp.goTo
     */
    goBack: function (url, opt) {
      if (arguments.length === 0) {
        history.back();        
      }
      else {
        this.goTo.apply(this, arguments);
        this.navigationType = 'back';
      }
    },

    /*
     * 见见cAbstractApp.jump
     */
    jump: function(url,opt){
      var openUrl = url;
      //如果不是url格式,直接跳转
      if(!UtilCommon.isUrl(url)){
        if (url.indexOf('//') === 0) {
          openUrl = window.location.protocol + url;
        } else {
          var domain = window.location.protocol + '//' + window.location.host;
          //如果没有webapp,不全格式
          if(url.toLowerCase().indexOf('/webapp') < 0 && url.toLowerCase().indexOf('/html5') == -1){
            openUrl = domain+"/webapp/"+url;
          }else{
            openUrl = domain+url;
          }
        }        
      }

      if (opt && opt.replace) {
        window.location.replace(openUrl);
      } else {
        window.location.href = openUrl;
      }
    },

    judgeForward: function (url) {
      if (url.indexOf('//') === 0) {
        url = window.location.protocol + url;
      }
      if (!UtilCommon.isUrl(url) && url.indexOf('http://localhost') !== 0) {
        url = window.location.protocol + '//' + window.location.host + (url.indexOf('/') === 0 ? url : '/' + url);  
      }
      var parseResult = Path.parseUrl(url), reg = new RegExp(parseResult.pathname.replace('(', '\\(').replace(')', '\\)') + "$"); 
      return reg.test(window.location.pathname) || reg.test(decodeURIComponent(window.location.pathname));
    },
    
    stateObserve: function($super, callback, scope, args) {
      $super(callback, scope, args);
      history.pushState({url: this.curView.config.pageUrl, text: Lizard.viewHtmlMap[this.curView.config.viewName], options: {pushState: true}}, document.title, this.curView.config.pageUrl);
    }
  });
});