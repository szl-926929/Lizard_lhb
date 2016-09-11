/**
 * Created by shbzhang on 15/3/13.
 */
define(['cCoreInherit', 'cUtilDate', 'cAbstractStorage'], function (cCoreInherit, cDate, cAbstractStorage) {

  var Storage = new cCoreInherit.Class(cAbstractStorage, {
    __propertys__: function () {
      this.proxy = document.cookie;
    },
    /**
     * @method Storage.cLocalStorage.initialize
     * @param {Object} $super
     * @param {Object} options
     * @description 复写自顶层继承自cAbstractStorage的initialize，赋值队列
     */
    initialize   : function ($super, opts) {
      $super(opts);
    },

    /**
     * 写入cookie
     * @param {String} key cookie 名称
     * @param {String|Object} value 可以为字符串或者json对象
     * @param {Date} [timeout=Session] 有效期
     * @param {String} [path=/] 路径
     * @param {String} [domain] 域名,默认为当前域名
     * @param {boolean} [secure=false] 安全级别
     */
    set: function (key, value, timeout, path, domain, secure) {
      value = _.isObject(value)?JSON.stringify(value):value;
      document.cookie = key + "=" + escape(value) +
      ((timeout) ? "; expires=" + timeout : "") +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      ((secure) ? "; secure" : "");
    },

    /**
     * 读取cookie值
     * @param {String} key cookie名称
     * @returns {String|Object} value cookie值
     */
    get: function (key) {
      var cookie = document.cookie;
      var arg = key + "=";
      var alen = arg.length;
      var clen = cookie.length;

      var i = 0;
      while (i < clen) {
        var j = i + alen;
        if (cookie.substring(i, j) == arg) {
          return this.getCookieVal(j);
        }
        i = cookie.indexOf(" ", i) + 1;
        if (i === 0) {break;}
      }
      return null;
    },

    /**
     * 返回cookien值
     * @param {int} offset
     * @returns {*} value
     */
    getCookieVal: function (offset) {
      var endstr = document.cookie.indexOf(";", offset),result;
      if (endstr == -1) {
        endstr = document.cookie.length;
      }
      var str = unescape(document.cookie.substring(offset, endstr));
      try{
        result = JSON.parse(str);
      }catch(e){
        result = str;
      }
      return result;
    },

    /**
     * 值cookie为无效
     * @param {String} key cookie name
     * @param {String} [path] path
     * @param {String} [domain] 域名
     */
    remove: function (key, path, domain) {
      if (this.get(key)) {
        document.cookie = key + "=" +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        "; expires=Thu, 01-Jan-1970 00:00:01 GMT";
      }
    }

  });

  Storage.getInstance = function () {
    if (this.instance) {
      return this.instance;
    } else {
      return this.instance = new this();
    }
  };
  return Storage;
});