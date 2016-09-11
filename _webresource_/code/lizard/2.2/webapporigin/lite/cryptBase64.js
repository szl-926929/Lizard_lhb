var Crypt = {};
//  if (typeof window.btoa === 'function' && typeof window.atob === 'function') {
//    Crypt.Base64 = {
//      encode: window.btoa,
//      decode: window.atob
//    };

//    return Crypt;
//  }

// existing version for noConflict()
var _Base64 = Crypt.Base64;
var version = "2.1.4";
// if node.js, we use Buffer
var Buffer;
if (typeof module !== 'undefined' && module.exports) {
  Buffer = require('buffer').Buffer;
}
// constants
var b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var b64tab = function(bin) {
  var t = {};
  for (var i = 0, l = bin.length; i < l; i++) {
    t[bin.charAt(i)] = i;
  }
  return t;
}(b64chars);
var fromCharCode = String.fromCharCode;
// encoder stuff
var cb_utob = function(c) {
  var cc = '';
  if (c.length < 2) {
    cc = c.charCodeAt(0);
    return cc < 0x80 ? c : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6)) + fromCharCode(0x80 | (cc & 0x3f))) : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f)) + fromCharCode(0x80 | ((cc >>> 6) & 0x3f)) + fromCharCode(0x80 | (cc & 0x3f)));
  } else {
    cc = 0x10000 + (c.charCodeAt(0) - 0xD800) * 0x400 + (c.charCodeAt(1) - 0xDC00);
    return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07)) + fromCharCode(0x80 | ((cc >>> 12) & 0x3f)) + fromCharCode(0x80 | ((cc >>> 6) & 0x3f)) + fromCharCode(0x80 | (cc & 0x3f)));
  }
};
var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
var utob = function(u) {
  return u.replace(re_utob, cb_utob);
};
var cb_encode = function(ccc) {
  var padlen = [0, 2, 1][ccc.length % 3],
    ord = ccc.charCodeAt(0) << 16 | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8) | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
    chars = [
      b64chars.charAt(ord >>> 18),
      b64chars.charAt((ord >>> 12) & 63),
      padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
      padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
    ];
  return chars.join('');
};
var btoa = Crypt.btoa ? function(b) {
  return Crypt.btoa(b);
} : function(b) {
  return b.replace(/[\s\S]{1,3}/g, cb_encode);
};
var _encode = Buffer ? function(u) {
  return (new Buffer(u)).toString('base64');
} : function(u) {
  return btoa(utob(u));
};
/**
 * base64加密
 * @method Util.cUtilCryptBase64.Base64.encode
 * @param {string} encodeStr 加密字符串
 * @param {boolen} urisafe uri是否转义，默认为false
 */
var encode = function(u, urisafe) {
  return !urisafe ? _encode(u) : _encode(u).replace(/[+\/]/g, function(m0) {
    return m0 == '+' ? '-' : '_';
  }).replace(/=/g, '');
};
var encodeURI = function(u) {
  return encode(u, true);
};
// decoder stuff
var re_btou = new RegExp([
  '[\xC0-\xDF][\x80-\xBF]',
  '[\xE0-\xEF][\x80-\xBF]{2}',
  '[\xF0-\xF7][\x80-\xBF]{3}'
].join('|'), 'g');
var cb_btou = function(cccc) {
  switch (cccc.length) {
    case 4:
      var cp = ((0x07 & cccc.charCodeAt(0)) << 18) | ((0x3f & cccc.charCodeAt(1)) << 12) | ((0x3f & cccc.charCodeAt(2)) << 6) | (0x3f & cccc.charCodeAt(3)),
        offset = cp - 0x10000;
      return (fromCharCode((offset >>> 10) + 0xD800) + fromCharCode((offset & 0x3FF) + 0xDC00));
    case 3:
      return fromCharCode(
        ((0x0f & cccc.charCodeAt(0)) << 12) | ((0x3f & cccc.charCodeAt(1)) << 6) | (0x3f & cccc.charCodeAt(2))
      );
    default:
      return fromCharCode(
        ((0x1f & cccc.charCodeAt(0)) << 6) | (0x3f & cccc.charCodeAt(1))
      );
  }
};
var btou = function(b) {
  return b.replace(re_btou, cb_btou);
};
var cb_decode = function(cccc) {
  var len = cccc.length,
    padlen = len % 4,
    n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0) | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0) | (len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0) | (len > 3 ? b64tab[cccc.charAt(3)] : 0),
    chars = [
      fromCharCode(n >>> 16),
      fromCharCode((n >>> 8) & 0xff),
      fromCharCode(n & 0xff)
    ];
  chars.length -= [0, 0, 2, 1][padlen];
  return chars.join('');
};
var atob = Crypt.atob ? function(a) {
  return Crypt.atob(a);
} : function(a) {
  return a.replace(/[\s\S]{1,4}/g, cb_decode);
};
var _decode = Buffer ? function(a) {
  return (new Buffer(a, 'base64')).toString();
} : function(a) {
  return btou(atob(a));
};

/**
 * base64解密
 * @method Util.cUtilCryptBase64.Base64.decode
 * @param  {String} decodeStr 解密字符串
 * @return {String}  解密后结果
 */
var decode = function(a) {
  return _decode(
    a.replace(/[-_]/g, function(m0) {
      return m0 == '-' ? '+' : '/';
    })
      .replace(/[^A-Za-z0-9\+\/]/g, '')
  );
};
var noConflict = function() {
  var Base64 = Crypt.Base64;
  Crypt.Base64 = _Base64;
  return Base64;
};
// export Base64

/**
 * 获得周边查询信息
 * @namespace Util.cUtilCryptBase64.Base64
 */
Crypt.Base64 = {
  VERSION: version,
  atob: atob,
  btoa: btoa,
  fromBase64: decode,
  toBase64: encode,
  utob: utob,
  encode: encode,
  encodeURI: encodeURI,
  btou: btou,
  decode: decode,
  noConflict: noConflict
};
// if ES5 is available, make Base64.extendString() available
if (typeof Object.defineProperty === 'function') {
  var noEnum = function(v) {
    return {
      value: v,
      enumerable: false,
      writable: true,
      configurable: true
    };
  };
  Crypt.Base64.extendString = function() {
    Object.defineProperty(
      String.prototype, 'fromBase64', noEnum(function() {
        return decode(this);
      }));
    Object.defineProperty(
      String.prototype, 'toBase64', noEnum(function(urisafe) {
        return encode(this, urisafe);
      }));
    Object.defineProperty(
      String.prototype, 'toBase64URI', noEnum(function() {
        return encode(this, true);
      }));
  };
}

if(typeof liteUtil != "undefined"){
  liteUtil.Crypt = Crypt;
}