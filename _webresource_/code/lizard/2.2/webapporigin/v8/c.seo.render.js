define(['cSeoEntendUtil'], function (ParserUtil) {
  var globalspaces = ["hotel", "CommentDeal","ddrUtils","NewsCommon","travelsFn","ShopsDataCommon","travelsFn","GsPlaceTtdList","commonUtil", "ddrParser", "ShopsListData", "ShopsBrandListData", "ShopsGlanceDetailData", "ShopsNearbyData", "Lipin", "skysea"];
  function _runUnderscore(tmpl, datas, script) {
    if (!datas) {
      datas = {};
    }
    var ret = '';
    if (tmpl) {
      var compiled = _.template(tmpl);
      var handler = Lizard.T;
      Lizard.T = function (id, datas) {
        return _runUnderscore(Lizard._T(id), datas, script);
      };
      Lizard.T.lizTmpl = Lizard._T.lizTmpl;
      if (!script)
        script = '';
      try {
        var context = {};
        _.each(globalspaces, function(space){          
          vm.eval('(function(){' + script + ';if (typeof ' + space + ' != "undefined"){context["' + space + '"] = ' + space +'};})()', {context: context}) ;
        });
        ret = compiled(datas, context).trim();
      }
      finally {
        Lizard.T = handler;
      }
    }
    return ret;
  }
  
  LizardRender = function () {
    var url = arguments[0],
    html = arguments[1],
    datas = arguments[2],
    parser = new htmlParse(html),
    TDK = {};
    Lizard.H = function () {
      return ParserUtil.urlParse(url).hash;
    }
    Lizard.P.lizParam = ParserUtil.getPageParams(url, ParserUtil.getPageUrlschema(parser.root.find('script', {
            type : 'text/lizard-config'
          }).text()));
    Lizard.T.lizTmpl = ParserUtil.getPageTemplates(parser);    
    var pageConfig = ParserUtil.getPageConfig(parser, datas[100]);
    
    if (pageConfig.model && _.isFunction(pageConfig.model.setTDK)) TDK = pageConfig.model.setTDK(datas);

    var title = parser.root.find('title');
    TDK.title && title && title.remove();

    var names = ['title', 'keywords', 'description', 'location']
    var metas = parser.root.findAll('meta');
    _.each(metas, function (meta) {
      if (meta._attrs && _.indexOf(names, meta._attrs['name']) > -1) {
        meta.remove();
      }
    });

    var tdkStr = [];
    _.each(_.keys(TDK), function (key) {
      if (key == 'title')
        tdkStr.push('<title>' + TDK.title + '</title>');
      tdkStr.push('<meta name="' + key + '" content="' + TDK[key] + '" />');
    });

    var pd_script = datas[100], mkt_script = datas[101];
    if (pageConfig.model && _.isFunction(pageConfig.model.filter)) {
      var context = {};
      _.each(globalspaces, function(space){
        vm.eval('(function(){' + pd_script + ';if (typeof ' + space + ' != "undefined"){context["' + space + '"] = ' + space +'};})()', {context: context}) ;
      });
      var seoDatas = [];
      _.each(datas, function(val, index){
        if (index >= 100) return;
        //攻略诡异问题，.net环境返回了JSON字符串
        if (_.isString(val)) {
          try {
            val = JSON.parse(val);
          } catch(e) {}
        }
        seoDatas[index] = val;
      });
      context = _.extend(context, {
        fn : pageConfig.model.filter,
        _this : null,
        datas : seoDatas,
        TDK : TDK
      })      
      datas = vm.eval('fn.call(_this, datas, TDK)', context);
    };

    var ret = {
      header : '',
      viewport : ''
    };

    _.each(_.keys(pageConfig.view), function (tmplName) {
      ret[tmplName] = _runUnderscore(pageConfig.view[tmplName], datas, pd_script);
    });

    if (ret.header) {
      ret.header = ret.header.replace(/<[\s|\B]+h1|<h1/gi, '<h2').replace(/h1[\s|\B]+>|h1>/gi, 'h2>');
    }

    ret.viewport = ('<div id="' + ParserUtil.getID() + '" page-url="' + url.replace('h5seo.mobile.ctripcorp.com', 'm.ctrip.com') + '">'
       + ret.viewport
       + '</div>').trim();

    var main_viewport = parser.root.find('*', {
        'class' : 'main-viewport'
      });
    if (main_viewport) {
      while (node = main_viewport.children()[0]) {
        node.remove();
      }
    }
    tdkStr = tdkStr.join('');
    var response = parser.root.html()
    .replace(/<div\b[^>]*?class=([\'\"])main-viewport\1[^>]*>/i, function (a) {
      return a.replace('>', ' renderat="server" >') + ret.viewport;
    })
    .replace(/<header\b[^>]*>/i, function (a) {
      return a.split('none').join('') + ret.header;
    })
    .replace(/<head\b[^>]*>/, function (a) {
      var ret = "";
      if (tdkStr) {
        ret = a + tdkStr;
      } else {
        ret = a;
      }
      return ret;
    }).replace(/<a\s+.*?\>([\w\W]*?)\<\/a\>/gi, function (linktag) {
      return linktag.replace(/href\s*=\s*[\"\']?([^\"\' ]+)[\"\']/gi, function (a, b) {
        return a.replace(b, b.replace('\/webapp\/', '\/html5\/'));
      })
    });    
    return response;
  };
});
