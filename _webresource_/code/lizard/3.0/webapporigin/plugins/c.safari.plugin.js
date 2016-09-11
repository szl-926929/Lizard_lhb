/**
 * @Description 修复safari下,修复safari下 回退不执行JS的问题
 * @author wang_l@ctrip.com
 * @date  2013/6/23 16:26:12
 * @version V1.0
 */
define(function () {
  window.shown = false;
  window.onpageshow = function (e) {
    if (window.shown) {
      window.location.reload();
    }
    window.shown = true;
  };

  window.onunload = function () {
  };
});

