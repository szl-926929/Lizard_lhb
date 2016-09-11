define(['$'], function () {
  //处理path
  var path = {
    urlParseRE      : /^\s*(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/,
    getLocation     : function (url) {
      var uri = url ? this.parseUrl(url) : location;
      var hash = this.parseUrl(url || location.href).hash;
      hash = hash === "#" ? "" : hash;
      return uri.protocol + "//" + uri.host + uri.pathname + uri.search + hash;
    },
    parseLocation   : function () {
      return this.parseUrl(this.getLocation());
    },
    isRelativeUrl   : function (url) {
      // All relative Url variants have one thing in common, no protocol.
      return path.parseUrl(url).protocol === "";
    },
    parseUrl        : function (url) {
      var matches = path.urlParseRE.exec(url || "") || [];
      return {
        href        : matches[0] || "",
        hrefNoHash  : matches[1] || "",
        hrefNoSearch: matches[2] || "",
        domain      : matches[3] || "",
        protocol    : matches[4] || "",
        doubleSlash : matches[5] || "",
        authority   : matches[6] || "",
        username    : matches[8] || "",
        password    : matches[9] || "",
        host        : matches[10] || "",
        hostname    : matches[11] || "",
        port        : matches[12] || "",
        pathname    : matches[13] || "",
        directory   : matches[14] || "",
        filename    : matches[15] || "",
        search      : matches[16] || "",
        hash        : matches[17] || ""
      };
    },
    isSameDomain    : function (absUrl1, absUrl2) {
      return path.parseUrl(absUrl1).domain === path.parseUrl(absUrl2).domain;
    },
    makePathAbsolute: function (relPath, absPath) {
      var absStack, relStack, i, d;

      if (relPath && relPath.charAt(0) === "/") {
        return relPath;
      }

      relPath = relPath || "";
      absPath = absPath ? absPath.replace(/^\/|(\/[^\/]*|[^\/]+)$/g, "") : "";

      absStack = absPath ? absPath.split("/") : [];
      relStack = relPath.split("/");

      for (i = 0; i < relStack.length; i++) {
        d = relStack[i];
        switch (d) {
          case ".":
            break;
          case "..":
            if (absStack.length) {
              absStack.pop();
            }
            break;
          default:
            absStack.push(d);
            break;
        }
      }
      return "/" + absStack.join("/");
    },
    makeUrlAbsolute : function (relUrl, absUrl) {

      if (!path.isRelativeUrl(relUrl)) {
        return relUrl;
      }

      if (absUrl === undefined) {
        absUrl = this.documentBase;
      }

      var relObj = path.parseUrl(relUrl),
        absObj = absUrl,
      //path.parseUrl( absUrl ),
        protocol = relObj.protocol || absObj.protocol,
        doubleSlash = relObj.protocol ? relObj.doubleSlash : (relObj.doubleSlash || absObj.doubleSlash),
        authority = relObj.authority || absObj.authority,
        hasPath = relObj.pathname !== "",
        pathname = path.makePathAbsolute(relObj.pathname || absObj.filename, absObj.pathname),
        search = relObj.search || (!hasPath && absObj.search) || "",
        hash = relObj.hash;

      return protocol + doubleSlash + authority + pathname + search + hash;
    },

    formatHybridUrl: function (url, prefix) {
      var openUrl = "";
      if (!url) {
        return openUrl;
      } else {
        openUrl = url
      }
      if (!url.match(/^(http|ctrip)/img)) {
        //如果为部分url,检查是否符合跳转格式
        url = url.replace(/file:[/]*/, '');
        var reg = /(webapp|webapp_work)\/([^\/]*)\/([\S\s]*)/;
        var pathAry = url.match(reg);
        if (pathAry && pathAry.length > 3) {
          var channel = pathAry[2],
            pageName = pathAry[3];
          //没有传#hash值的情况,需要进行转换
          if (pageName.indexOf('.html#') < 0) {
            openUrl = channel + "/index.html" + "#/webapp/" + channel + '/' + pageName;
          } else {
            openUrl = channel + '/' + pageName;
          }
        }
        //add by byl  如果不是http和ctrip的话，改变文件协议
        if (prefix) {
          openUrl = prefix + openUrl;
        }
      }
      return openUrl;
    }
  }

  path.documentUrl = path.parseLocation();
  var $base = $("head").find("base");
  path.documentBase = $base.length ? path.parseUrl(path.makeUrlAbsolute($base.attr("href"), path.documentUrl.href)) : path.documentUrl;

  return path;
});

    