/**
* @author l_wang王磊 <l_wang@Ctrip.com>
* @class cUIGroupList
* @description 分组列表，多用于城市相关
*/
define(['cBase', 'cUIAbstractView'], function (cBase, AbstractView) {

  return new cBase.Class(AbstractView, {
    __propertys__: function () {
      this.template = [
	    '<section class="cm-pop cm-pop--triangle-up cm-pop--user-nav">',
          '<i class="icond-pop-triangle"></i>',
          '<div class="cm-pop-bd">',
            '<ul class="cm-pop-list">',
              '<%for(var i = 0, len = data.length; i < len; i++) {%>',
                '<li data-index="<%=i%>" class="js_<%=data[i].tagname%>" ><i class="<%=data[i].className%>"></i><%=data[i].value%></li>',
              '<%}%>',
            '</ul>',
          '</div>',
        '</section>'
      ].join('');
    },

    resetProperty: function () {
      this.viewdata = {
        data: this.moreMenus
      };

      this.eventArr = {};

      for (var i = 0, len = this.moreMenus.length; i < len; i++) {
        var item = this.moreMenus[i];
        if (item.className) {
          this.eventArr['click .js_' + item.tagname] = item.callback;
        }
      }

    },

    initialize: function ($super, opts) {
      for (var k in opts) {
        this[k] = opts[k];
      }
      this.resetProperty();

      $super(opts);
    },

    createHtml: function () {
      return _.template(this.template)(this.viewdata);
    }

  });

});