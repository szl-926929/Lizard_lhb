/**
 * Created by bianyl on 2016/4/25.
 */

/*
 用于继承的类，会自动垂直居中

 */
define(['UILayer', getAppUITemplatePath('ui.verification.code')], function (UILayer, template) {
  var globalController = {
    sucCallBack:[],
    errCallBack:[],
    isShowing:false
  };
  return _.inherit(UILayer, {
    propertys: function ($super) {
      $super();
    },
    resetDefaultProperty: function ($super) {
      $super();
      this.maskToHide = false;
      this.needMask = true;
      this.defaultUrl = this._getUrlByEnv();
      //数据模型
      this.datamodel = {
        message:"",
        imgUrl:""
      };
      //事件机制
      this.addEvents({
        'click .cui-ok-g-btn-s': '_confirmAction',
        'click .cui-cancel-close-pop': '_cancelAction',
        'click .cui-change-captcha': '_changeAction'
      });
      //html模板
      this.template = template;
    },
    initialize: function ($super, opts) {
      $super(opts);
    },
    initFuncs:function(confirm,cancel){
      globalController.sucCallBack.push(confirm);
      globalController.errCallBack.push(cancel);
    },
    confirmAction:function(){
      var suc = null;
      while(suc = globalController.sucCallBack.shift() ){
        suc();
      }
      globalController.sucCallBack = [];
    },
    cancelAction:function(){
      var err = null;
      while(err = globalController.errCallBack.shift() ){
        err();
      }
      globalController.errCallBack = [];
    },
    initResBody:function(response){
      if(response){
        try{
          this.resBody = JSON.stringify({response:response});
        }catch(e){}
      }
    },
    addEvent: function ($super) {
      $super();
      this.on('onCreate', function () {
        if(!globalController.isShowing){
          this._setDatamodel();
        }
        this.$el.removeClass('cui-layer');
      });
      this.on('onHide', function () {
        globalController.isShowing = false;
      });
      this.on('onShow', function () {
        globalController.isShowing = true;
      });
    },
    call:function(){
      if(!globalController.isShowing){
        this.show();
      }
    },
    _setDatamodel: function (message) {
      if(message){
        this.datamodel.message = message;
      }else{
        this.datamodel.imgUrl = this.defaultUrl.captcha + "?v="+new Date().getTime();
      }
      this.refresh();
    },
    _confirmAction:function(){
      var $input = this.$el.find(".cui-verification-input");
      var value = $input && $input.val() && $input.val().toUpperCase();
      if(!value){
        this._setDatamodel("验证码不能为空，请重新输入");
        return;
      }
      try{value = value.trim();}catch(e){}
      this._getAjaxData(value, $.proxy(function(data){
        if(data && data.result == "OK"){
          this.hide();
          this.confirmAction();
        }else{
          this._setDatamodel();
          this._setDatamodel("验证码不正确，请重新输入");
        }
      },this),$.proxy(function(){
        this._setDatamodel("验证码不正确，请重新输入");
      },this));
    },
    _changeAction:function(){
      this._setDatamodel();
    },
    _cancelAction:function(){
      this.hide();
      this.cancelAction();
    },
    _getUrlByEnv:function(){
      var host = window.location.host;
      var protocol = (window.location.protocol.indexOf("http") != -1) ? "http://" : "https://";
      var captcha = "/restapi/searchapi/appcaptcha/h5/captcha";
      var verificate = "/restapi/searchapi/appcaptcha/h5/verificate";
      var domain = "m.ctrip.com";
      if (host.match(/^m\.ctrip\.com/i)){
        domain = "m.ctrip.com";
      }else if (host.match(/\.uat\.qa/i)){
        domain = "m.uat.ctripqa.com";
      }else if (host.match(/\.ui\.|\.dev\.|\.fat/i) || (host.match(/\.lpt/i))|| host.match(/\.fws/i) || host.match(/^(localhost|172\.16|127\.0)/i)) {
        domain = "m.fat.ctripqa.com";
      } else if(host.match(/\.uat\.ctripqa\.com/i)){
        domain = "m.uat.ctripqa.com";
      }
      return  {
        captcha:[protocol,domain,captcha].join(""),
        verificate:[protocol,domain,verificate].join("")
      };
    },
    _getAjaxData:function(data,suc,err){
      var origin = window.location.origin;
      if(!origin){
        origin = window.location.protocol + "//"+window.location.host;
      }
      var url = this.defaultUrl.verificate+"?captchauserinput=" + data;
      var obj = {
        type:"post",
        url:url,
        dataType :'json',
        contentType:'application/json',
        data: this.resBody || "",
        success:suc,
        error:err,
        beforeSend:function (xhr) {
          try{
            xhr.setRequestHeader("cookieOrigin", origin);
          }catch(e){

          }
        },
        xhrFields:{withCredentials: true}
      };
      try{
        return  $.ajax(obj);
      }catch(e){
        if(e && e.message == "INVALID_STATE_ERR: DOM Exception 11"  && window.XMLHttpRequest){
          var xhrObj = new XMLHttpRequest();
          xhrObj.onreadystatechange = function () {
            if (xhrObj.readyState == 4) {
              var status = xhrObj.status;
              if (status >= 200 && status < 300) {
                if(obj.success){
                  obj.success($.parseJSON(xhrObj.responseText), xhrObj.responseXML);
                }
              } else {
                if(obj.error){
                  obj.error(status);
                }
              }
            }
          };
          xhrObj.open(obj.type, obj.url, true);
          xhrObj.setRequestHeader("cookieOrigin", origin);
          xhrObj.setRequestHeader("Content-Type", "application/json");
          xhrObj["withCredentials"] = true;
          xhrObj.send(obj.data || "");
          return xhrObj;
        }
      }

    }
  });

});
