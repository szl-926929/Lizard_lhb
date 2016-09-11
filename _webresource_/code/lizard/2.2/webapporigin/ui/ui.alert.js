
/*
 用于继承的类，会自动垂直居中

 */
define(['UILayer', getAppUITemplatePath('ui.alert')], function (UILayer, template) {

  var alertGlobalCon = {
    isShowing:false
  };
  return _.inherit(UILayer, {
    propertys: function ($super) {
      $super();
    },

    resetDefaultProperty: function ($super) {
      $super();

      this.maskToHide = false;

      //数据模型
      this.datamodel = {
        title: '',
        content: 'content',
        btns: [
          { name: '知道了', className: 'cui-btns-ok' }
        ]
      };

      //html模板
      this.template = template;

      //事件机制
      this.addEvents({
        'click .cui-btns-ok': 'okAction',
        'click .cui-btns-cancel': 'cancelAction'
      });

      this.okAction = function () {
        this.hide();
      };

      this.cancelAction = function () {
        this.hide();
      };

    },

    initialize: function ($super, opts) {
      $super(opts);
    },

    addEvent: function ($super) {
      $super();
      this.on('onCreate', function () {
//        this.$el.addClass('cui-alert');
      });
      this.on('onHide', function () {
        alertGlobalCon.isShowing = false;
      });
      this.on('onShow', function () {
        alertGlobalCon.isShowing = true;
      });
    },
    call:function(){
      if(!alertGlobalCon.isShowing){
        this.show();
        this.$el.css("z-index","4008 !important");
      }
    },
    setDatamodel: function (datamodel, okAction, cancelAction) {
      if (!datamodel){
        datamodel = {};
      }
      _.extend(this.datamodel, datamodel);
      if(okAction){
        this.okAction = okAction;
      }
      if(cancelAction){
        this.cancelAction = cancelAction;
      }
      this.refresh();
    }

  });

});
