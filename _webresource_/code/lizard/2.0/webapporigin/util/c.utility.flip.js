define(function(){
  //l_wang flip手势工具
  (function () {

    //偏移步长
    var step = 20;

    var touch = {};
    var down = 'touchstart';
    var move = 'touchmove';
    var up = 'touchend';
    if (!('ontouchstart' in window)) {
      down = 'mousedown';
      move = 'mousemove';
      up = 'mouseup';
    }

    //简单借鉴ccd思维做简要处理
    function swipeDirection(x1, x2, y1, y2, sensibility) {

      //x移动的步长
      var _x = Math.abs(x1 - x2);
      //y移动步长
      var _y = Math.abs(y1 - y2);
      var dir = _x >= _y ? (x1 - x2 > 0 ? 'left' : 'right') : (y1 - y2 > 0 ? 'up' : 'down');

      //设置灵敏度限制
      if (sensibility) {
        if (dir == 'left' || dir == 'right') {
          if ((_y / _x) > sensibility) dir = '';
        } else if (dir == 'up' || dir == 'down') {
          if ((_x / _y) > sensibility) dir = '';
        }
      }
      return dir;
    }

    //sensibility设置灵敏度，值为0-1
    function flip(el, dir, fn, noDefault, sensibility) {
      if (!el) return;

      el.on(down, function (e) {
        var pos = (e.touches && e.touches[0]) || e;
        touch.x1 = pos.pageX;
        touch.y1 = pos.pageY;

      }).on(move, function (e) {
        var pos = (e.touches && e.touches[0]) || e;
        touch.x2 = pos.pageX;
        touch.y2 = pos.pageY;

        //如果view过长滑不动是有问题的
        if (!noDefault) { e.preventDefault(); }
      }).on(up, function (e) {


        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > step) ||
        (touch.y2 && Math.abs(touch.y1 - touch.y2) > step)) {
          var _dir = swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2, sensibility);
          if (dir === _dir) {
            typeof fn == 'function' && fn();
          }
        } else {
          //tap的情况
          if (dir === 'tap') {
            typeof fn == 'function' && fn();
          }
        }
      });
    }

    function flipDestroy(el) {
      if (!el) return;
      el.off(down).off(move).off(up);
    }

    $.flip = flip;
    $.flipDestroy = flipDestroy;
  })();
});