define(['UIImageSlider', 'cUserStore', 'cUtilDate', 'cMessageCenter'], function (UIImageSlider, UserStore, cDate, MessageCenter) { 
  var userStore = new UserStore(), userId = userStore.getUserId();
  return _.inherit(UIImageSlider, {
    initialize: function ($super, opts) {
      $super(opts);
      this.__isStatic = true;
      this.__statics = [];
      MessageCenter.subscribe('switchview', this.setStatic, this);
      this.__sendImgPv(0);
    },
    
    setStatic: function (inView, outView) {      
      this.__isStatic = inView.$el.find(this.$el).length;
      this.__statics = [];
    },
    
    itemLoad: function() {
      this.__sendImgPv(this.getIndex());
    },
    
    __sendImgPv: function(index) {
      var data = this.datamodel.data[index];
      if (!data || !this.__isStatic || this.__statics[index]){
        return;
      }
      var values = this.__getUBTData(data);
      this.__statics[index] = 1; 
      window.__bfi.push(["_tracklog","AdPV", values.join('&')]);
    },
    
    __getUBTData: function (data) { 
      var tempVal = {UserId: userId, PageId: this.pageId, PositionId: data.positionId, AdId: data.adId, DateTime: cDate.getServerDate(), src: data.src};
      var values = [];
      _.each(tempVal, function(value, key){
        values.push(key + '=' + value);
      });
      return values;
    },
    
    itemClickAction: function($super, e) {
      $super(e);
      window.__bfi.push(["_tracklog","AdClick", this.__getUBTData(this.datamodel.data[this.getIndex()]).join('&')]);
    },
    
    destroy: function($super) { 
      MessageCenter.unsubscribe('switchview', this.setStatic);
      $super();
    }
  });
});


