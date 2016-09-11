/**
 * @File c.web.guider
 * @Description:  web 环境下的操作
 * @author shbzhang
 * @date 2014-09-24 11:08:08
 * @version V1.0
 */
define(['cUtilPerformance'], function (cperformance) {
  "use strict";
  var Guider = {
    jump: function (options) {
      cperformance.log({
        name: 'FunUsed',
        url: window.location.href,
        fun: "cWebGuider.jump"
      });
      if (options && options.url && typeof options.url === 'string') {
        window.location.href = options.url;
      }
    },

    apply: function (options) {
      cperformance.log({
        name: 'FunUsed',
        url: window.location.href,
        fun: "cWebGuider.apply"
      });
      if (options && options.callback && typeof options.callback === 'function') {
        options.callback();
      }
    },

    call: function (options) {
      cperformance.log({
        name: 'FunUsed',
        url: window.location.href,
        fun: "cWebGuider.call"
      });
      var $caller = document.getElementById('h5-hybrid-caller');
      var isstring = (typeof options.url === 'string');
      if (!options || !options.url || !isstring ) {
        return false;
      } else if ($caller && $caller.src == options.url) {
        $caller.contentDocument.location.reload();
      } else if ($caller && $caller.src != options.url) {
        $caller.src = options.url;
      } else {
        $caller = document.createElement('iframe');
        $caller.id = 'h5-hybrid-caller';
        $caller.src = options.url;
        $caller.style.display = 'none';
        document.body.appendChild($caller);
      }
    },

    log: function (options) {
      cperformance.log({
        name: 'FunUsed',
        url: window.location.href,
        fun: "cWebGuider.log"
      });
      if (window.console) {
        window.console.log(options.name);
      }
    },

    print: function (options) {
      cperformance.log({
        name: 'FunUsed',
        url: window.location.href,
        fun: "cWebGuider.print"
      });
      return console.log(options.log, options.result);
    },

    callService: function () {
      cperformance.log({
        name: 'FunUsed',
        url: window.location.href,
        fun: "cWebGuider.callService"
      });
      window.location.href = 'tel:4008206666';
    },

    backToLastPage: function () {
      cperformance.log({
        name: 'FunUsed',
        url: window.location.href,
        fun: "cWebGuider.backToLastPage"
      });
      window.location.href = document.referrer;
    },

    home: function () {
      cperformance.log({
        name: 'FunUsed',
        url: window.location.href,
        fun: "cWebGuider.home"
      });
      window.location.href = '/';
    }
  };

  return Guider;
});