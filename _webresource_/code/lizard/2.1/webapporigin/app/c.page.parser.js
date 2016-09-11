/**
 * Lizard 解析类
 * @author wxj@ctrip.com/luwei@ctripcom
 * @version V2.1
 */
define(['cCoreInherit', 'cLocalStore', 'cCommonStore', 'cParserUtil'], function(cCoreInherit, cStore, CommonStore, ParseUtil){
  var pageDocNode = null;
  
  /**
   * 为什么要配置首屏？  
   * 1. 不需要自己写代码组装页面渲染     
   * 2. SEO程序根据首屏配置生成SEO页面  
   *   
   * 是否必须配置首屏？  
   * 答：如果这个页面不需要SEO,只需要配置最简单的结构就行了
   * @namespace lizard-config
   * @example
   * // 最简单的两个数据接口配置
   * &lt;script type="text/lizard-config"&gt;
   * {
   *   url_schema: 'list/{city}', // Lizard.P和hybrid包需要这个配置
   *   viewName: 'list',          // Lizard缓存加载过的模板
   *   model: {
   *     apis: [{
   *       url: 'http://m.ctrip.com/data1',
   *       postdata: {
   *         cityid: Lizard.P('city')
   *         name: Lizard.P('name')   // url问号后面的参数可以直接取
   *       }
   *     }, {
   *       url: 'http://m.ctrip.com/data2',
   *       postdata: {}
   *     }],
   *     filter: function(datas) {
   *       // datas[0] <-> 1接口返回的数据
   *       // datas[1] <-> 2接口返回的数据
   *       // 处理数据后，返回数据用于viewportTmpl模板渲染
   *       return datas;
   *     }
   *   },
   *   view:{
   *     viewport: Lizard.T("viewportTmpl")
   *   },
   *   controller: '/webapp/demo/webresource/controller/list.js'
   * }
   * &lt;/script&gt;
   * @example
   * // 数据接口有依赖
   * model: {
   *   apis: [{
   *     url: 'http://m.ctrip.com/data1'
   *     name: 'data1'
   *   }, {
   *     url: 'http://m.ctrip.com/data2',
   *     postdata: {
   *       city: Lizard.D('data1').city   // 接口2依赖data1接口的数据
   *     }
   *   }]
   * }
   * @example
   * // 数据接口发不发
   * model: {
   *   apis: [{
   *     url: '',
   *     // 这个函数的返回值可以保证这个数据接口是否发起请求
   *     suspend: function() {
   *       var data1 = Lizard.D('data1');
   *       return data1.send; 
   *     }
   *   }]
   * }
   * @example
   * // 首屏完全自己控制,这个页面不需要SEO
   * {
   *   url_schema: '',
   *   models: {
   *     apis: [],
   *     filter: function() {
   *       return {};
   *     }
   *   },
   *   view:{
   *     viewport: Lizard.T("viewportTmpl")
   *   },
   *   viewName: 'index',
   *   controller: '/webapp/demo/webresource/controllers/index.js'
   * }
   */
  function getPageConfigStr()
  {    
    var configStr = pageDocNode.find('script[type="text/lizard-config"]').text();
    if (!configStr)
    {
      configStr = '{"url_schema": "","model": {"apis": []},"view":{}}';
    }
    return configStr;
  }
  /**
    获取页面配置
   */
  function getPageConfig(){  
    var configStr = getPageConfigStr();  
    var dataexpr = ParseUtil.parseDepend(configStr), ret = {};
    eval('ret = ' + configStr); 
    if (!ret.viewName)
    {
      if (ret.controller) {
        var viewName = ret.controller.substring(ret.controller.lastIndexOf('/') + 1);
        ret.viewName = viewName.substring(0, viewName.indexOf('.'));  
      } else {
        ret.viewName = 'emptyName';  
      }
    }
    ret.dataexpr = dataexpr;
    return ret;
  }
  /**
    获取页面templates
  */
  function getPageTemplates(){    
    var ret={}, templates = pageDocNode.find('script[type="text/lizard-template"]');
    _.each(templates, function(template){
      var tmplNode = $(template);
      if (tmplNode.attr('id')){
        ret[tmplNode.attr('id')]={
          'runat': tmplNode.attr('runat')||'all',
          'text': removeTags(tmplNode.text(), 'client')
        };
      }
    });
    return ret;
  }
  function removeTags(html,runat){
    var pageNode = $('<SCRIPT>' + html + '</SCRIPT>');
    pageNode.find('[runat=' + runat + ']').remove();
    return pageNode.text();
  }
  
  Lizard._initParser = function(url, html)
  {
    pageDocNode = $('<DIV>' + html + '</DIV>'); 
    Lizard.T.lizTmpl = getPageTemplates();
    Lizard.P.lizParam = ParseUtil.getPageParams(url, ParseUtil.getPageUrlschema(getPageConfigStr()));
    var pageConfig = getPageConfig();
    pageConfig.pageUrl = url;
    return pageConfig;
  };  

  /**
   * 获取localStorage, 主要是在模板的filter中使用, SEO中只能返回defaultvalue
   * @method Lizard.S
   * @param {String} storeName 要存取到localStorage中的key
   * @param {String} [key]  返回对象的某个属性值
   * @param {Object|*} defaultvalue 缓存中没有值时，默认返回的值
   * @returns {Object|*} 返回存储的数据
   * @example
   * Lizard.S('localstorageKey',  key, '上海')
   * // 注意在SEO情况下，没有localstorage,只能返回上海，如果没有defaultvalue,则返回空值
   */
  Lizard.S = function(stroename, key, defaultvalue)
  {
    if (!this.loacaStores)
    {
      this.loacaStores = {};
    }
    if (!this.loacaStores[stroename])
    {
      if (stroename == 'SALES')
      {
        this.loacaStores[stroename] = CommonStore.SalesStore;
      }
      else if (stroename == 'SALES_OBJECT')
      {
        this.loacaStores[stroename] = CommonStore.SalesObjectStore;
      }
      else if (stroename == 'UNION')
      {
        this.loacaStores[stroename] = CommonStore.UnionStore;
      }
      else
      {
        this.loacaStores[stroename]  = new cCoreInherit.Class(cStore, {
          __propertys__: function () {
            this.key = stroename;
          }
        });
      }
    }
    if (!key)
    {
      return this.loacaStores[stroename].getInstance().get();
    }
    if (!this.loacaStores[stroename].getInstance().get())
    {
      return defaultvalue;
    }
    return this.loacaStores[stroename].getInstance().get().hasOwnProperty(key)? this.loacaStores[stroename].getInstance().get()[key] :defaultvalue;         
  };
  
  Lizard.H = function() {
    return window.location.hash;
  };
  
  Lizard.Url = function() {
    return window.location.href;
  };

 /**
  * 根据lizard-config的Models的配置，获取相应ajax请求值
  * @param {String} apiName  models中的apis
  * @return {Object| null} api的请求返回值
  * @Method Lizard.D
  * @example
  * "model":{
  *    apis:[
  *       {
  *         url:'http://m.ctrip.com/d/list2',
  *         postdata: {
  *           limit: 2
  *         },
  *         name: 'list2'
  *       }
  *    ]
  * }
  * Lizard.D('list2')
  */
  Lizard.D = function(apiName)
  {
    if (this.ajaxDatas && this.ajaxDatas[apiName])
    {
      return this.ajaxDatas[apiName];
    }       
    return null;
  };  
  
  function _setTDKInfo(datas, pageConfig)
  {
    var TDKStr = [];
    var TDK = pageConfig.model.setTDK ? pageConfig.model.setTDK(datas) : {};
    var title = pageDocNode.find('title');
    if (TDK.title) {
      if(title) {
        title.remove();
      }
      TDKStr.push('<title>'+TDK.title+'</title>');
      document.title = TDK.title;
    }
    _.each(TDK, function(val, key){
      if (!val)
      {
        return;
      } 
      var metaNode = pageDocNode.find('meta[name="' + key + '"]');
      if (metaNode) {
        metaNode.remove();
      }
      TDKStr.push('<meta name="' + key + '" content="' + val + '" />');
    });
            
    return {TDK: TDK, TDKStr: TDKStr.join('')};            
  }
  
  function _setUBTInfo()
  {
    var varNames = ['page_id', 'bf_ubt_orderid', 'ab_testing_tracker'], result = {};
    _.each(varNames,function(varName){
      var values = '';
      var node = pageDocNode.find('#' + varName);
      if (node.get(0))
      {
        values = node.val();
      }
      result[varName] = values;  
    });
    if(_.isArray(result.ab_testing_tracker) ){
      var ret = [];
      _.each(result.ab_testing_tracker, function(val,key){
        _.each(val.attr("value").split(";"),function(val1,key1){
          if(val1){
            ret.push(val1);
          }
        });
      });
      result.ab_testing_tracker = ret.join(";");
    }
    return result;
  }
  
  Lizard.render = function(pageConfig, datas, renderAt)
  {
    var ret = {
      header: '',
      viewport: ''
    };
    
    var validateRet = true;
    if (_.isFunction(pageConfig.validate))
    {
      validateRet = pageConfig.validate(datas);
      if (!validateRet && _.isFunction(pageConfig.modelOnError))
      {
        ret = pageConfig.modelOnError(datas);
      }         
    }
    else
    {
      var result = _setTDKInfo(datas, pageConfig);
      _.extend(ret, _setUBTInfo());
      if (pageConfig.model.filter){
        datas = pageConfig.model.filter.call(this, datas, result.TDK);
      }
      ret.TDK = result.TDKStr;
    }
    
    if (renderAt != 'server') {
      for (var tmplName in pageConfig.view){
        if (pageConfig.view.hasOwnProperty(tmplName)){
          ret[tmplName] = ParseUtil._runUnderscore(pageConfig.view[tmplName],datas);
        }
      }
    }

    var id = ParseUtil.getID(pageConfig.pageUrl); 
    
    ret.viewport = ['<div id="', id, '" page-url="', pageConfig.pageUrl, '">', ret.viewport, '</div>'].join('').trim();
    ret.id = id;
    ret.controller = pageConfig.controller;
    ret.config = pageConfig;
    ret.datas = datas;
    ret.lizTmpl = Lizard.T.lizTmpl;
    ret.lizParam = Lizard.P.lizParam;    
    ret.validateRet = validateRet;    
    return ret; 
  };
  
  Lizard.getController = function(pageConfig)
  {
    return pageConfig.controller;
  };
});