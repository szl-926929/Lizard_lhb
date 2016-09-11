define(['libs', 'cBase', 'AbstractAPP', 'cWidgetFactory', 'cWidgetGuider'], function (libs, cBase, AbstractAPP, WidgetFactory) {

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
    function flip(el, dir, fn, noDefault, sensibility, stepSet) {
      if (!el || !el[0]) return;
      var _dir = '', _step = stepSet || step;

      /*
      这里原来的逻辑是绑定几次flip便会执行几次，这里做一次优化
      */
      el[0]['__flip_' + dir] = fn;
      if (el[0].__hasFlipEvent) {
        return;
      }
      el[0].__hasFlipEvent = true;

      //var _step = sensibility || step;
      el.on(down, function (e) {
        var pos = (e.touches && e.touches[0]) || e;
        touch.x1 = pos.pageX;
        touch.y1 = pos.pageY;

      }).on(move, function (e) {

        var pos = (e.touches && e.touches[0]) || e;
        touch.x2 = pos.pageX;
        touch.y2 = pos.pageY;

        //如果view过长滑不动是有问题的
        //if (!noDefault) { e.preventDefault(); }
        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > _step) ||
          (touch.y2 && Math.abs(touch.y1 - touch.y2) > _step)) {
          _dir = swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2, sensibility);
        }
        var preventDefultFlag = typeof noDefault == 'function' ? noDefault(_dir) : noDefault;
        if (!preventDefultFlag) {
          e.preventDefault();
        }
      }).on(up, function (e) {
        var pos = (e.changedTouches && e.changedTouches[0]) || e;
        touch.x2 = pos.pageX;
        touch.y2 = pos.pageY;

        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > _step) ||
        (touch.y2 && Math.abs(touch.y1 - touch.y2) > _step)) {
          var _dir = swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2, sensibility);

          if (_.isFunction(el[0]['__flip_' + _dir])) {
            el[0]['__flip_' + _dir]();
          }

        } else {

          if (_.isFunction(el[0]['__flip_tap'])) {
            el[0]['__flip_tap']();
          }
        }
        //l_wang 每次up后皆重置
        touch = {};
      });
    }

    function flipDestroy(el) {
      if (!el || !el[0]) return;

      el.off(down).off(move).off(up);
      if (el[0].__hasFlipEvent) delete el[0].__hasFlipEvent;
      if (el[0].__flip_left) delete el[0].__flip_left;
      if (el[0].__flip_right) delete el[0].__flip_right;


    }

    $.flip = flip;
    $.flipDestroy = flipDestroy;

  })();

  var Appliction = new cBase.Class(AbstractAPP, {
    __propertys__: function () {

    },

    cleanCache: function () {

      var DEPRECATED_FLIGHT_MAP = [
      // ----------------------------------
      // CLEAR DEPRECATED INFO
        "FLIGHT_SEARCH",
        "FLIGHT_SEARCH_SUBJOIN",
        "FLTINTL_SEARCH",
        "FLIGHT_LIST",
        "FLIGHT_INTER_CITY_LIST",
        "FLIGHT_CITY_LIST",
        "zqInCityInfo",
        "zqInCityDateStore",
        "LastInCitySelectDateTime",
        "LastzqInAirportSelectDateTime",
        "zqInAirportInfo",
        "zqInAirportDateStore",
        "zqInAirportDateAndAddressStore",
        "zqInCityDateAndAddressStore",
        "zqInCitySelectStore",
        "zqInAirportSelectStore",
        "FLIGHT_DETAILS",
        "FLIGHT_DETAILS_PARAM",
        "FLIGHT_ORDERINFO",
        "USER_FLIGHT_ORDERLIST",
        "USER_FLIGHT_ORDERDETAIL",
        "USER_FLIGHT_ORDERPARAM",
        "FLIGHT_RETURNPAGE",
        "FLIGHT_SELECTED_INFO",
        "FLIGHT_PICK_TICKET_SELECT",
        "FLIGHT_AIRLINE",
        "FLIGHT_AIRCTRAFT",
        "FLIGHT_ENUM_TAKETIME",
        "FLIGHT_ENUM_CABINS",
        "FLIGHT_LIST_FILTER",
        "FLIGHT_PICK_TICKET",
        "FLIGHT_PICK_TICKET_PARAM",
        "FLIGHT_AD_TIMEOUT",
      // ----------------------------------
      // CLEAR LIST INFO AND USER INFO
        "P_FLIGHT_TicketList",
        "U_FLIGHT_ORDERLIST",
        "U_FLIGHT_ORDERDETAIL"
      ];

      var map = {
        "flight": DEPRECATED_FLIGHT_MAP
      }

      var array = map[this.channel];

      if (Array.isArray(array)) {
        for (var value in array) {
          window.localStorage.removeItem(value);
        }
      };
    },

    initialize: function ($super, options) {

      $super(options);

      //适配app 张爸爸
      var Guider = WidgetFactory.create('Guider');
      Guider.create();

      //l_wang提升响应速度
      $.bindFastClick && $.bindFastClick();

      //l_wang flip手势工具



      this.cleanCache();
    }

  });
  return Appliction;
});
