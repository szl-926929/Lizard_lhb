define(function(){
    function CacheViews() {
      //缓存view实例
      this.catchs = {};
      //缓存view的重要信息，以便可以恢复view实例
      this.backups = {};
      this.orderCaches = [];
    }

    CacheViews.prototype = {
      add:                   function (key, val) {

        this.catchs[key] = val;
       
        this.orderCaches.push({
          key:      key,
          url:      val.url,
          viewName: val.viewName
        });
        this.backups[key] = {
          url:      val.url,
          opts:     val.opts,
          text:     val.text,
          datas:    val.datas,
          viewName: val.viewName
        };
      },
      
      _delElemFromCollection: function(collection, key, val)
      {
        collection = _.reject(collection, function(item){
          return item[key] == val;
        });
      },
      
      delOrderCaches:        function (key, val) {
        this._delElemFromCollection(this.orderCaches, key, val);
      },
      
      delById:               function (key) {
        if (this.catchs[key]) {
          delete this.catchs[key];
        }
        this.delOrderCaches("key", key)
      },
      
      delByName:             function (viewName) {
        this._delElemFromCollection(this.catchs, 'viewName', viewName);     
        this.delOrderCaches("viewName", viewName);
      },
      
      delByURL:              function (URL) {
        this._delElemFromCollection(this.catchs, 'url', URL);   
        this.delOrderCaches("url", URL);
      },
      
      delByIdFromBackups:    function (key) {
        if (this.backups[key]) {
          delete this.backups[key];
        }
        this.delOrderCaches("key", key);
      },
      
      delByNameFromBackups:  function (viewName) {
        this._delElemFromCollection(this.backups, 'viewName', viewName);
        this.delOrderCaches("viewName", viewName);
      },
      
      delByURLFromBackups:   function (URL) {
        this._delElemFromCollection(this.backups, 'url', URL);  
        this.delOrderCaches("url", URL);
      },
      findById:              function (key) {
        return this.catchs[key];
      },
      
      findByName:            function (viewName) {
        return _.findWhere(this.catchs, {viewName: viewName});
      },
      
      findByIdFromBackups:   function (key) {
        return this.backups[key];
      },
      
      findByNameFromBackups: function (viewName) {
        return _.findWhere(this.backups, {viewName: viewName});
      },
      
      findByURLFromBackups:  function (URL) {
        return _.findWhere(this.backups, {url: URL});
      },
      
      length:                function () {
        return _.size(this.catchs);
      },
      each:                  function (callback) {
        if (_.isFunction(callback))
        {
          _.each(this.catchs, function(val, key){
            callback(key, val);
          });       
        }       
      }
    }
    
    return CacheViews;
});
