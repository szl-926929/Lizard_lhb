/**
 * Created by wjp on 2015/12/4.
 */
define(['UIView', getAppUITemplatePath('ui.loading.failed')], function(UIView, template) {
  return _.inherit(UIView, {
    propertys: function ($super) {
      $super();

      this.template = template;

      this.events = {
        'click .btn-retry': 'retryAction'
      };

      this.retryAction = null;
    },
    initialize: function($super, options) {
      $super(options);
    },
    show: function($super) {
      $super();
      this.$el.parent().show();
    }
  });
});
