/**
 * @Description  underscroe的扩展方法
 * @author wang_l@ctrip.com
 * @date  2013/6/23 16:26:12
 * @version V1.0
 */

define(function () {

  // 全局可能用到的变量
  var arr = [];
  var slice = arr.slice;
  /**
   * inherit方法，js的继承，默认为两个参数
   * @method _.inherit
   * @see cCoreInherit.Class
   * @deprecated
   */
  _.inherit = function (origin, methods) {

    // 参数检测，该继承方法，只支持一个参数创建类，或者两个参数继承类
    if (arguments.length === 0 || arguments.length > 2) {throw '参数错误';}

    var parent = null;

    // 将参数转换为数组
    var properties = slice.call(arguments);

    // 如果第一个参数为类（function），那么就将之取出
    if (typeof properties[0] === 'function'){
      parent = properties.shift();
    }
    properties = properties[0];

    // 创建新类用于返回
    function klass() {
      if (_.isFunction(this.initialize)) {
        this.initialize.apply(this, arguments);
      }
    }

    klass.superclass = parent;

    // 父类的方法不做保留，直接赋给子类
    // parent.subclasses = [];

    if (parent) {
      // 中间过渡类，防止parent的构造函数被执行
      var Subclass = function () {
      };
      Subclass.prototype = parent.prototype;
      klass.prototype = new Subclass();

      // 父类的方法不做保留，直接赋给子类
      // parent.subclasses.push(klass);
    }

    var ancestor = klass.superclass && klass.superclass.prototype;
    for (var k in properties) {
      var value = properties[k];

      //满足条件就重写
      if (ancestor && typeof value == 'function') {
        var argslist = /^\s*function\s*\(([^\(\)]*?)\)\s*?\{/i.exec(value.toString())[1].replace(/\s/g, '').split(',');
        //只有在第一个参数为$super情况下才需要处理（是否具有重复方法需要用户自己决定）
        if (argslist[0] === '$super' && ancestor[k]) {
          value = getValue(k, value);
        }
      }

      //此处对对象进行扩展，当前原型链已经存在该对象，便进行扩展
      if (_.isObject(klass.prototype[k]) && _.isObject(value) && (typeof klass.prototype[k] != 'function' && typeof value != 'function')) {
        //原型链是共享的，这里处理逻辑要改
        var temp = {};
        _.extend(temp, klass.prototype[k]);
        _.extend(temp, value);
        klass.prototype[k] = temp;
      } else {
        klass.prototype[k] = value;
      }

    }
    function getValue(methodName, fn){
      return function () {
        var scope = this;
        var args = [
          function () {
            return ancestor[methodName].apply(scope, arguments);
          }
        ];
        return fn.apply(this, args.concat(slice.call(arguments)));
      };
    }

    if (!klass.prototype.initialize) {
      klass.prototype.initialize = function () {
      };
    }
    klass.prototype.constructor = klass;

    return klass;
  };

//flip手势工具
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
          if ((_y / _x) > sensibility) {dir = '';}
        } else if (dir == 'up' || dir == 'down') {
          if ((_x / _y) > sensibility) {dir = '';}
        }
      }
      return dir;
    }

    /**
     * 手指滑动函数, 这个函数在Android表现不行，``需要重构``
     * @method $.flip
     * @param {object} el jQuery对象
     * @param {string} dir 方向, left, right, up, down
     * @param {function} fn 回调函数
     * @param {function|boolean} noDefault 是否不阻止事件冒泡
     * @param {number} sensibility 设置灵敏度，值为0-1
     * @param {number} stepSet 设置步长
     * @example
     * $.flip(el, 'left', function() {}); // 这样注册后会阻止页面向上向下滚动
     * $.flip(el, 'left', function() {}, true); // 这样不阻止了，但是andriod事件也不能监听了
     */
    function flip(el, dir, fn, noDefault, sensibility, stepSet) {
      if (!el || !el[0]) {return;}
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

    /**
     * 注销手指滑动函数
     * @method $.flipDestroy
     * @param {object} el jQuery对象
     * @example
     * $.flipDestroy(el);
     */
    function flipDestroy(el) {
      if (!el || !el[0]) {return;}

      el.off(down).off(move).off(up);
      if (el[0].__hasFlipEvent) {delete el[0].__hasFlipEvent;}
      if (el[0].__flip_left) {delete el[0].__flip_left;}
      if (el[0].__flip_right) {delete el[0].__flip_right;}
    }
    /**
     * 手指滑动函数, 这个函数在Android表现不行，``需要重构``
     * @method _.flip
     * @see $.flip
     * @deprecated
     */
    _.flip = flip;
    /**
     * 注销手指滑动函数
     * @method _.flipDestroy
     * @see $.flipDestroy
     * @deprecated
     */
    _.flipDestroy = flipDestroy;
  })();

//日期操作类
  (function () {

    /**
     * 静态日期操作类，封装系列日期操作方法.
     * @namespace
     */
    _.dateUtil = {
      /**
       * @description 1-9返回01,02,...
       * @param {number} n
       * @return {string} 返回处理后的数字
       * @example
       * \_.dateUtil.formatNum(5)   // 05
       * \_.dateUtil.formatNum(5)   // 10
       */
      formatNum         : function (n) {
        if (n < 10) {return '0' + n;}
        return n.toString();
      },
      /**
       * @description 将字符串转换为日期，支持格式y-m-d ymd (y m r)以及标准的
       * @return {Date} 返回日期对象
       */
      parse             : function (dateStr, formatStr) {
        if (typeof dateStr === 'undefined') {return null;}
        if (typeof formatStr === 'string') {
          var _d = new Date(formatStr);
          //首先取得顺序相关字符串
          var arrStr = formatStr.replace(/[^ymd]/g, '').split('');
          if (!arrStr && arrStr.length != 3) {return null;}

          formatStr = formatStr.replace(/y|m|d/g, function (k) {
            switch (k) {
              case 'y':
                return '(\\d{4})';
              case 'm':
              case 'd':
                return '(\\d{1,2})';
            }
          });

          var reg = new RegExp(formatStr, 'g');
          var arr = reg.exec(dateStr);

          var dateObj = {};
          for (var i = 0, len = arrStr.length; i < len; i++) {
            dateObj[arrStr[i]] = arr[i + 1];
          }
          return new Date(dateObj['y'], dateObj['m'] - 1, dateObj['d']);
        }
        return null;
      },
      /**
       * @description将日期格式化为字符串
       * @param {date} date 时间对象
       * @param {string} [format=Y年M月D日 H时F分S秒] 格式化结构
       * @return {string} 常用格式化字符串
       * @example
       * var d = new Date();
       * \_.dateUtil.format(d, 'Y/m/d');
       * \_.dateUtil.format(d, 'Y/m/d h:f:s');
       */
      format            : function (date, format) {
        if (arguments.length < 2 && !date.getTime) {
          format = date;
          date = new Date();
        }
        if(typeof format != 'string' ){
          (format = 'Y年M月D日 H时F分S秒');
        }
        return format.replace(/[ymdhfs]/gi, function (a) {
          switch (a) {
            case "y":
              return (date.getFullYear() + "").slice(2);
            case "Y":
              return date.getFullYear();
            case "m":
              return date.getMonth() + 1;
            case "M":
              return _.dateUtil.formatNum(date.getMonth() + 1);
            case "d":
              return date.getDate();
            case "D":
              return _.dateUtil.formatNum(date.getDate());
            case "h":
              return date.getHours();
            case "H":
              return _.dateUtil.formatNum(date.getHours());
            case "f":
              return date.getMinutes();
            case "F":
              return _.dateUtil.formatNum(date.getMinutes());
            case "s":
              return date.getSeconds();
            case "S":
              return _.dateUtil.formatNum(date.getSeconds());
          }
        });
      },
      /**
       * 判断是不是时间对象
       * @method _.dateUtil.isDate
       * @see http://underscorejs.org/#isDate
       * @deprecated
       */
      isDate            : _.isDate,
      /**
       * 是否为闰年
       * @param {num|date} year
       * @return {boolean} 返回值
       * @example
       * \_.dateUtil.isLeapYear(new Date());
       * \_.dateUtil.isLeapYear(2015);
       */
      isLeapYear        : function (year) {
        //传入为时间格式需要处理
        if (_.isDate(year)) {year = year.getFullYear();}
        if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {return true;}
        return false;
      },

      /**
       * 获取一个月份的天数
       * @param {num|date} year
       * @param {num} [month] 月份
       * @return {num} 返回天数
       * @example
       * \_.dateUtil.getDaysOfMonth(new Date());  // 当前时间
       * \_.dateUtil.getDaysOfMonth(2014, 3);     // 2014, 3月份
       */
      getDaysOfMonth    : function (year, month) {
        //自动减一以便操作
        if (_.isDate(year)) {
          month = year.getMonth(); //注意此处月份要加1，所以我们要减一
          //month = year.getMonth()+1; //注意此处月份要加1，使用日期API
          year = year.getFullYear();
        } else {
          month--;
        }
        //return new Date(year,month,0).getDate();
        return [31, _.dateUtil.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
      },

      /**
       * 获取一个月份1号是星期几，注意此时的月份传入时需要自主减一
       * @param {num|date} year 可能是年份或者为一个date时间
       * @param {num} [month] 月份
       * @return {num} 当月一号为星期几，0是星期天，1是星期一
       * @example
       * \_.dateUtil.getBeginDayOfMouth(new Date());  // 当前月份一号是星期几
       * \_.dateUtil.getBeginDayOfMouth(2014, 3);     // 2014年3月1号是星期几
       */
      getBeginDayOfMouth: function (year, month) {
        //自动减一以便操作
        if (_.isDate(year)) {
          month = year.getMonth();
          year = year.getFullYear();
        } else {
          month--;
        }
        var d = new Date(year, month, 1);
        return d.getDay();
      }
    };

  })();
});
