/**
 * Created by shbzhang on 14/12/3. reedseu 01/20/15
 */
define(function(){
  var oHtml = $.fn.html;
  $.fn.html = function (html) {
    if (html === undefined) {
      return (this.length > 0 ? this[0].innerHTML : null);
    } else {
      return  oHtml.call(this, html);
    }
  };

  var oText = $.fn.text;
  $.fn.text = function (text) {
    if (text === undefined) {
      return (this.length > 0 ? this[0].textContent : null);
    } else {
      return oText.call(this, text);
    }
  };

  var oData = $.fn.data;
  $.fn.data = function(attr, value) {
    if (this.attr('data-' + attr) === '0' && _.isUndefined(value)){
      return '0';
    } else {
      return oData.apply(this, arguments);
    }
  };
});