/**
 * Created by bianyl on 2015/11/23.
 */
define(['cBMap','cGMap','cAMap'], function (cBMap,cGMap,cAMap) {
  var cMap = {};
  cMap.mapType = "BMap"; //默认是百度地图
  cMap.mapObj = null; //地图对象
  /**
   * 设置map类型
   * @param type
   */
  cMap.setMapType = function(type){
    if(!type){
      return;
    }
    if(type == "BMap" || type == 1 ){
      cMap.mapType = "BMap";
    }else if(type == "GMap" || type == 2){
      cMap.mapType = "GMap";
    }else{
      cMap.mapType = "AMap";
    }
  };
  /**
   * 创建简单地图
   * @param options
   */
  cMap.createMap = function(options,type){
    if(!options || !options.lat || !options.lng || !options.id){
      return ;
    }
    var map = getAbstractMap(type);
    if(map){
      var mapObj = map.createMap(options);
      cMap.mapObj = mapObj;
      return mapObj;
    }
  };

  /**
   * 创建地图marker对象
   * 返回值是根据所传入参数生成的地图marker对象
   */
  cMap.createMarkers = function(options,type){
    if(!options){return;}
    if(!(options instanceof Array)){
      options = [options];
    }
    if(!options.length){
      return false;
    }
    return runMethod.call(this,"createMarkers",type,arguments);
  };

  /**
   * 创建infowindow
   * 每次仅限创建一个
   * @param options
   * @param type
   */
  cMap.createInfoWindow = function(options,type){
    if(typeof options != "object"){
      return;
    }
    if(options instanceof Array){
      options = options[0];
    }
    return runMethod.call(this,"createInfoWindow",type,[options]);
  };
  /**
   * 创建地图overyLay对象
   * @param options
   * @param type
   * @returns {*}
   */
  cMap.createCustomOverlays = function(options,type){
    if(!options){return;}
    if(!(options instanceof Array ) ){
      options = [options];
    }
    if(!options.length){
      return false;
    }
    return runMethod.call(this,"createCustomOverlays",type,arguments);
  };

  /**
   * 创建自定义的control
   * @param options
   * @param type
   * @returns {*}
   */
  cMap.createControl = function(options,type){
    if(!options){return;}
    return runMethod.call(this,"createControl",type,arguments);
  };

  /**
   * 将自定义的control放到地图上
   * @param options
   * @param type
   * @returns {*}
   */
  cMap.addControl = function(options,type){
    if(!options){return;}
    return runMethod.call(this,"addControl",type,[options,cMap.mapObj]);
  };
  /**
   * 展示marker节点
   * 所传参数均为覆盖物
   * @param options
   */
  cMap.showOverLays = function(options,mapObj,type){
    if(!options || !options.length){
      return;
    }
    if(typeof mapObj == "string" ){
      type = mapObj;
      mapObj = null;
    }
    if(mapObj){
      cMap.mapObj = mapObj;
    }
    return runMethod.call(this,"showOverLays",type,[options,cMap.mapObj]);
  };
  /**
   * 隐藏指定的覆盖物
   * @param options
   * @param mapObj
   * @param type
   */
  cMap.hideOverlays = function(options,mapObj,type){
    if(!options || !options.length){
      return;
    }
    if(mapObj){
      cMap.mapObj = mapObj;
    }
    return runMethod.call(this,"hideOverlays",type,[options,cMap.mapObj]);
  };

  /**
   * 绑定事件，目前只支持
   * infowindow click
   * marker click
   * mapObj zoomChange
   * @param obj
   * @param type
   */
  cMap.addEventListener = function(obj,type,callback,mapType){
    if(!obj || !type){
      return ;
    }
    return runMethod.call(this,"addEventListener",mapType,[obj,type,callback]);
  };

  /**
   * 根据传入点，来设置地图自动缩放大小
   * 注意会触发zoom事件，应与zoom事件处理
   * @param options
   * @param type
   */
  cMap.fitBounds = function(options,mapObj,type){
    if(!options || (options instanceof Array && !options.length)){
      return false;
    }
    if(typeof mapObj == 'string'){
      type = mapObj;
      mapObj = null;
    }
    if(mapObj){
      cMap.mapObj = mapObj;
    }
    return runMethod.call(this,"fitBounds",type,[options,cMap.mapObj]);
  };

  /**
   *
   * @param mapObj
   */
  cMap.getZoom = function(mapObj,type){
    if(mapObj){
      cMap.mapObj = mapObj;
    }
    return runMethod.call(this,"getZoom",type,[cMap.mapObj]);
  };

  /**
   * 根据地图对象获取当前的中心点
   * @param mapObj
   * @param type
   */
  cMap.getCenter = function(mapObj,type){
    if(mapObj){
      cMap.mapObj = mapObj;
    }
    return runMethod.call(this,"getCenter",type,[cMap.mapObj]);
  };

  /**
   * 重设地图的中心点
   * @param mapObj
   * @param type
   */
  cMap.setCenter = function(point,mapObj,type){
    if(mapObj){
      cMap.mapObj = mapObj;
    }
    return runMethod.call(this,"setCenter",type,[point,cMap.mapObj]);
  };

  /**
   * 根据地图对象获取地图的西南角和东北角的点
   * @param mapObj
   * @param type
   */
  cMap.getBounds = function(mapObj,type){
    if(mapObj){
      cMap.mapObj = mapObj;
    }
    return runMethod.call(this,"getBounds",type,[cMap.mapObj]);
  };

  /**
   * 判断地图上是否包含某个点
   * @param point
   * @param type
   * @returns {*}
   */
  cMap.containsPoint = function(point,type){
    return runMethod.call(this,"containsPoint",type,[point,cMap.mapObj]);
  };
  /**
   *
   * @param point
   * @param type
   */
  cMap.panTo = function(point,mapObj,type){
    if(!point){
      return;
    }
    if(typeof mapObj == 'string'){
      type = mapObj;
      mapObj = null;
    }
    if(mapObj){
      cMap.mapObj = mapObj;
    }
    return runMethod.call(this,"panTo",type,[point,cMap.mapObj]);
  };

  /**
   * google坐标转高德坐标
   */
  cMap.aMapToBMap = function(){
    return transformPos.call(this,"BMap",arguments);
  };

  /**
   * google坐标转高德坐标
   */
  cMap.bMapToAMap = function(){
    return transformPos.call(this,"AMap",arguments);
  };

  /**
   * 根据坐标生成对应的地图点
   * {lng:"",lat:""}
   * [{lng:"",lat:""}]
   */
  cMap.createPoints = function(points,type){
    var pos = {};
    if(typeof points == 'object'){
      var className = Object.prototype.toString.call(points);
      if(className){
        className = className.slice(8,-1);
      }
      if(className == 'Object'){
        pos = [points];
      }else if(className == 'Array'){
        pos = points;
      }
    }
    return runMethod.call(this,"createPoints",type,[pos]);
  };

  /**
   * 获取两点的直线距离
   * @param pointFrom
   * @param pointTo
   * @param mapObj
   * @param type
   * @returns {*}
   */
  cMap.getDistance = function(pointFrom,pointTo,mapObj,type){
    if(typeof mapObj == 'string'){
      type = mapObj;
      mapObj = null;
    }
    if(!mapObj){
      mapObj = cMap.mapObj;
    }
    return runMethod.call(this,"getDistance",type,[pointFrom,pointTo,mapObj]);
  };

  /**
   * 根据类型加载地图api
   * 加载google地图时，如果能判断当前位置是在国外
   * 可以传参数加载https://ditu.google.com/的地图
   * @param type
   * @param postion
   */
  cMap.loadMapScript = function(type,callback,postion){
    if(!type){
      type = cMap.mapType;
    }
    //绑定全局回调
    window.lizardInitMap = function(){
      if(callback){
        callback();
      }
    };
    var url;
    if(type == "GMap"){
      var website = '//ditu.google.cn';
      if(postion  == "oversea"){
        website = 'https://ditu.google.com';
      }
      url = website + "/maps/api/js?libraries=geometry&sensor=true&language=zh-CN&callback=lizardInitMap";
    }else if(type == "BMap"){
      if(window.location.protocol.indexOf("https:") != -1){
        url = 'https://api.map.baidu.com/api?v=2.0&ak=C2iS1Mz9E4zRORAUm6tT4qO7&callback=lizardInitMap&s=1';
      }else{
        url = 'http://api.map.baidu.com/api?v=2.0&ak=C2iS1Mz9E4zRORAUm6tT4qO7&callback=lizardInitMap';
      }
    }else{
      url = '//webapi.amap.com/maps?v=1.3&key=0b895f63ca21c9e82eb158f46fe7f502';
    }
    var s = document.getElementsByTagName('script')[0];
    var bf = document.createElement('script');
    bf.type = 'text/javascript';
    bf.charset = 'utf-8';
    bf.async = true;
    bf.src = url;
    s.parentNode.insertBefore(bf, s);
  };

  /**
   * 根据类型
   * 坐标互转
   * @param type
   * @returns {*}
   */
  function transformPos(type){
    var methodName,map;
    if(type == "GMap"){
      methodName = "bMapToAMap";
      map = cGMap;
    }else{
      methodName = "aMapToBMap";
      map = cBMap;
    }
    var handler = map[methodName];
    if(arguments.length <2){
      return;
    }
    var args = arguments[1];
    var arg = args[0];
    if(typeof arg == 'object'){
      var className = Object.prototype.toString.call(arg);
      if(className){
        className = className.slice(8,-1);
      }
      if(className == 'Object'){
        return handler(arg.lng,arg.lat);
      }else if(className == 'Array'){
        var pos = [];
        for(var i=0;i<arg.length;i++){
          pos.push(handler(arg[i].lng,arg[i].lat));
        }
        return pos;
      }
    }if(typeof arg == 'string' && arg.split(',').length == 2){
      //'116.417685,39.948919'类型
      return handler(arg.split(',')[0],arg.split(',')[1]);
    }
    else{
      if(args[0] && args[1]){
        return handler(args[0],args[1]);
      }
    }
  }

  /**
   * 根据传入方法名，以及地图类型
   * 执行该方法，并返回相应的值
   * @param methodName
   * @param type
   * @returns {*}
   */
  function runMethod(methodName,type,args){
    var map = getAbstractMap(type);
    if(map){
      return map[methodName].apply(this,args);
    }
  }
  /**
   * 获取当前的map基类
   * 目前只有百度和google两种
   * @param type
   * @returns {*}
   */
  function getAbstractMap(type){
    if(type){
      cMap.mapType = type; //重置map的类型
    }
    if(cMap.mapType == "BMap"){
      if(!cBMap.hasBaidu()){
        return false;
      }
      return cBMap;
    }else if(cMap.mapType == "GMap"){
      if(!cGMap.hasGoogle()){
        return false;
      }
      return cGMap;
    }else{
      if(!cAMap.hasAMap()){
        return false;
      }
      return cAMap;
    }
  }

  return cMap;
});