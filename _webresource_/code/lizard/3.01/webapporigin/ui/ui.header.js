define([getAppUITemplatePath('ui.header'), "cUtilEvent"], function (template, EventUtil) {
  function Header() {
    this.template = _.template(template);
  }
  Header.prototype = {
    set: function (data) {
      var btns = [];
      if (this.data) {
        btns = this.data.left.concat(this.data.right);
        _.each(btns, function(btn){
          EventUtil.removeHandler(document.getElementById('headerview').querySelector('.js_' + btn.tagname), 'click', btn.callback);
        });
      }
      this.data = data;      
      document.getElementById('headerview').style.display = '';      
      if (!data.left) {
        data.left = [{tagname: 'back', callback: function(){
          history.back();
        }}];  
      }
      if (!data.right) {
        data.right = [];
      }
      if (!data.center) {
        data.center = [];
      }
      if (data.title) {
        data.center = {tagname: 'title', value: data.title};
      }
      document.getElementById('headerview').innerHTML = this.template(data);
      btns = data.left.concat(data.right);
      _.each(btns, function(btn){
        EventUtil.addHandler(document.getElementById('headerview').querySelector('.js_' + btn.tagname), 'click', btn.callback);
      });
    }
  };
  
  return Header;
});
