/**
 * @File c.util.object.js
 * @Description: hybrid环境的常用工具方法
 * @author shbzhang@ctrip.com
 * @date 2014-09-28 15:10:38
 * @version V1.0
 */

/**
 * 与Hybrid相关的工具方法
 * @namespace Util.cUtilObject
 */
define([], function () {

  var Obj = {};

  /**
   * @description 设置对象某个路径上的值
   * @method Util.cUtilObject.set
   * @param {object} obj
   * @param {string} string
   * @param {object|array|int} value
   * @returns {object}
   */
  Obj.set = function (obj, path, value) {
    if (!path) {
      return null;
    }

    var array = path.split('.');

    obj = obj || {};

    for (var i = 0, len = array.length, last = Math.max(len - 1, 0); i < len; i++) {
      if (i < last) {
        obj = (obj[array[i]] = obj[array[i]] || {});
      } else {
        obj[array[i]] = value;
      }
    }

    return obj;
  };

  /**
   * @description 获得对象在某个路径上的值
   * @method Util.cUtilObject.get
   * @param {object} obj
   * @param {string} path
   * @returns {object}
   */
  Obj.get = function (obj, path) {
    if (!obj || !path) {
      return null;
    }

    var array = path.split('.');

    obj = obj || {};

    for (var i = 0, len = array.length, last = Math.max(len - 1, 0); i < len; i++) {
      obj = obj[array[i]];

      if (obj === null || typeof obj === 'undefined') {
        return null;
      }
    }

    return obj;
  };

  Obj.isObj = function(obj) {
    return Object.prototype.toString.call(obj) !== "[object Object]" && obj !== null && obj !== obj.window && Object.getPrototypeOf(obj) === Object.prototype;
  };
  Obj.isArray = Array.isArray ||
  function (object) {
    return object instanceof Array;
  };
  function extend(target, source, deep) {
    for (var key in source) {
      if (deep && (Obj.isObj(source[key]) || Obj.isArray(source[key]))) {
        if (Obj.isObj(source[key]) && !Obj.isObj(target[key])) {
          target[key] = {};
        }
        else if (Obj.isArray(source[key]) && !Obj.isArray(target[key])) {
          target[key] = [];
        }
        extend(target[key], source[key], deep);
      } else if (source[key] !== undefined) {
        target[key] = source[key];
      }
    }
  }
  Obj.extend = function (target) {
    var deep,
    args = [].slice.call(arguments, 1);
    if (typeof target == 'boolean') {
      deep = target;
      target = args.shift();
    }
    args.forEach(function (arg) {
      extend(target, arg, deep);
    });
    return target;
  };

  return Obj;
});
