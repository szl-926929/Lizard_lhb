define([],function(){var a={};return a.isInApp=function(){var a=window.navigator.userAgent;if(a.indexOf("CtripWireless")>-1)return!0;var b=window.localStorage.getItem("isInApp");if(b)return"1"==b?!0:!1;var c=window.localStorage.getItem("ISINAPP");return c?"1"==c?!0:!1:void 0},a.isInWeichat=function(){var a=window.navigator.userAgent;return a.indexOf("MicroMessenger")>-1?!0:!1},a.isPreProduction=function(){return window.localStorage.getItem("isPreProduction")},a.getAppSys=function(){var a=navigator.userAgent,b=/.+_(\w+)_CtripWireless_/,c=b.exec(a);return c&&c[1]?c[1].toLowerCase():null},a});