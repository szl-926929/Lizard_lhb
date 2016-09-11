define(['cModel', 'cMemoryStore', 'cUtilPath', 'cUtilCacheView', 'cCoreInherit', 'cLocalStore', 'cMessageCenter'], function(cModel, MStore, path, CacheViews, cCoreInherit, CStore, MessageCenter){
  var cacheModels = new CacheViews();
  function callModels(pageConfig, callback, errorback)
  {
    //只有非Hybrid才会存在这个
    if (!Lizard.isHybrid) {
      if (Lizard.serverData) {
        callback(Lizard.serverData, pageConfig);
        delete Lizard.serverData;        
        return;
      }
      else if (Lizard.errorServerData) {
        errorback(Lizard.errorServerData, pageConfig);
        delete Lizard.errorServerData;
        return;
      }
      if (!Lizard.instance && !pageConfig.isLoadingstep) {      
        MessageCenter.subscribe('firt_screen_data_fetched', function(datas){
          callback(datas, pageConfig);
        });
        MessageCenter.subscribe('firt_screen_data_error', function(datas){
          errorback(datas, pageConfig.errorBack);           
        });
        return;
      }
    }
    Lizard.ajaxDatas = {};
    pageConfig.models = Lizard.getModels(pageConfig);
    _.each(pageConfig.models, function(model, index){
      model.modelIndex = index;
    });    
    _processModels(pageConfig, pageConfig.models, [], callback, errorback);
  }
  
  function _processModels(pageConfig, models, datas, callback, errorback)
  {
    if (models.length === 0) {
      callback(datas, pageConfig);
    }    
    else if (!_.some(models, function(model){ return model.error;}))
    {
      var sortedModels = _resortModels(models);
      //出现这种情况一版是被依赖的Model请求失败，处理后退出
      if (_.size(sortedModels.left) == _.size(models)) {
        _.each(models, function(model){
          model.done = true;
          datas[model.modelIndex] = {};
          if (model.name) {
            Lizard.ajaxDatas[model.name] = {};
          }
        });
        onSuccess(pageConfig, datas, sortedModels, callback, errorback);
        return;
      }
      _.each(sortedModels.todo, function(model){
        var index = model.modelIndex;
        var url = model.url, emodel = cacheModels.findById([pageConfig.viewName, model.modelIndex, url].join('|'));
        if (!emodel) {
          emodel = cCoreInherit.Class(cModel, {
            __propertys__: function() {
              this.urlParseRet = path.parseUrl(url);
              if (location.protocol === 'https:') {
                this.protocol = 'https:'; 
              } else {
                this.protocol = this.urlParseRet.protocol.substr(0, this.urlParseRet.protocol.length - 1);  
              }              
              this.checkAuth = false;
              this.requireCid = model.requireCid;
              if(Lizard.config.isUseH5Sys){
                this.isUseH5Sys = true;
              }
            }
          }).getInstance();
          emodel.setAttr('url', (Lizard.restfullApi?path.parseUrl(Lizard.restfullApi).domain : emodel.urlParseRet.domain) + emodel.urlParseRet.pathname + emodel.urlParseRet.search);
          _transfuncToVal(model.postdata);
          emodel.setAttr('param', _.clone(model.postdata));
          if (model.postdata && model.postdata.head && model.postdata.head.extension) {
            emodel.extension = model.postdata.head.extension;
          }
          if (pageConfig.extension) {
            if (!emodel.extension) {
              emodel.extension = [];
            }
            emodel.extension = emodel.extension.concat(pageConfig.extension);
          }
          var cacheStore = emodel.getResultStore();
          if (!cacheStore) {
            var cachStore = model.storeKey?new CStore({
                key: model.storeKey
            }): new MStore({
                key : [pageConfig.viewName, model.modelIndex, url].join('|')
            });            
            emodel.setAttr('result', cachStore);
          }
          cacheModels.add([pageConfig.viewName, model.modelIndex, url].join('|'), emodel);
        } else {
          _transfuncToVal(model.postdata);
          if (_.isEqual(emodel.param, model.postdata)) {
            model.paramChange = false;
          } else {
            model.paramChange = true;
          }          
          emodel.setAttr('param', _.clone(model.postdata));
        }
        if (model.suspend && eval('(' + model.suspend + ')()'))
        {
          model.done = true;
          datas[index] = {};
          if (model.name) {
            Lizard.ajaxDatas[model.name] = {};
          }
          onSuccess(pageConfig, datas, sortedModels, callback, errorback);       
        }
        else
        {
          if (pageConfig.serverData && pageConfig.serverData[index]) {
            emodel.result.set(pageConfig.serverData[index], emodel.getTag());
          }
          emodel.excute(function(data) {
            model.done = true;
            datas[index] = data;
            if (model.name) {
              Lizard.ajaxDatas[model.name] = data;
            }
            onSuccess(pageConfig, datas, sortedModels, callback, errorback);
          },
          function(error) {
            if (_.isFunction(pageConfig.validate) || !(error instanceof XMLHttpRequest)) {
              model.done = true;
              datas[index] = error;              
              onSuccess(pageConfig, datas, sortedModels, callback, errorback);
            } else {
              model.error = true;
              errorback(datas, pageConfig.errorBack);              
            }
          },
          model.ajaxOnly, this);
        }
      });  
    }    
  }
  
  function onSuccess(pageConfig, datas, sortedModels, callback, errorback)
  {    
    if (pageConfig.processed) {
      return;
    }
    if (_.every(pageConfig.models, function(model){return (model.done || model.priority);})) {
      _.each(pageConfig.models, function(model){        
        var emodel = cacheModels.findById([pageConfig.viewName, model.modelIndex, model.url].join('|'));
        if (emodel) {
          emodel.abort();
        }
      });
      pageConfig.processed = true;
      callback(datas, pageConfig);
    } else if (_.every(sortedModels.todo, function(model){return model.done;})){
      _processModels(pageConfig, sortedModels.left, datas, callback, errorback);
    }
  }
  
  function _transfuncToVal(obj) {
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (_.isString(obj[p]) && obj[p].indexOf('function') === 0) {
          obj[p] = eval('(' + obj[p] + ')()');
        } else if (_.isObject(obj[p]) || _.isArray(obj[p])) {
          _transfuncToVal(obj[p]);
        }
      }
    }
  }
  
  function _resortModels(models)
  {
    return _.groupBy(models, function(model){
      if (!model.depends || _.every(model.depends, function(depend) {
          return (depend in Lizard.ajaxDatas);
      }))
      {
        return 'todo';
      }
      else
      {
        return 'left';
      }        
    });    
  }
  
  return callModels;
});
