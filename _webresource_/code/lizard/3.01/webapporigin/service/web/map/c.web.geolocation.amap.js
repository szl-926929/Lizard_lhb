/**
 * Created by bianyl on 2016/01/07.
 */
define([], function () {
  var AM ={};

  function CustomControls(options){
    this._options = options;
    var div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.zIndex = 100;
    var x="0px",y="0px";
    if(options && options.offset){
      y = options.offset.y + "px";
      x = options.offset.x + "px";
    }
    div.appendChild($(options.content)[0]);
    this._div = div;
    this._id = "googleControl" + new Date().getTime();
    div.id = this._id;
    var anchor = options.anchor;
    if(anchor == "top-left"){
      div.style.top = y;
      div.style.left = x;
    }else if(anchor == "top-right"){
      div.style.top = y;
      div.style.right = x;
    } else if(anchor == "bottom-right"){
      div.style.bottom = y;
      div.style.right = x;
    } else{
      div.style.bottom = y;
      div.style.left = x;
    }
    if(options.callBack){
      div.addEventListener("click",function(e){
        options.callBack.call(this,e);
      });
    }
    this.remove = function(){
      div.remove();
    };
  }

  /**
   * 判断是否加载百度地图
   * @returns {boolean}
   */
  AM.hasAMap = function(){
    if(typeof AMap != 'undefined'){
      return true;
    }else{
      return false;
    }
  };

  /**
   * 创建高德地图
   * 坐标需要指定isBMap=true
   * 默认传递的坐标都是按照高德坐标处理
   * @param config
   * @returns {AMap.Map}
   */
  AM.createMap = function(config){
    if(config.isBMap){
      //百度地图进行转换
      var pos = AM.bMapToAMap(config.lng,config.lat);
      config.lng = pos.lng;
      config.lat = pos.lat;
    }
    var doubleClickZoom = true;
    if(!config.DoubleClickZoom){
      doubleClickZoom = false; //默认关闭双击缩放
    }
    var mapContainer = new AMap.Map(config.id, {
      // @description 地图中心点
      center : new AMap.LngLat(config.lng,config.lat),
      level :  config.zoom || 16, // @description 地图显示的比例尺级别
      doubleClickZoom : doubleClickZoom
    });
    //增加Google的支持
    var googleGD = new AMap.TileLayer({
      tileUrl : "http://mt{1,2,3,0}.google.cn/vt/lyrs=m@142&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galil" //图块取图地址
    });
    googleGD.setMap(mapContainer);
    return mapContainer;
  };
  /**
   * 创建POI
   * @param config
   * @param mapObj
   */
  AM.createMarkers = function(config){
    var markers = [];
    function openInfoWindow(infoWindow){
      var map = this.getMap();
      infoWindow.open(map, this.getPosition());
    }
    for (var i = 0,tempConfig; i < config.length; i++) {
      var marker;
      tempConfig = config[i];
      if (!tempConfig || !tempConfig.lat || !tempConfig.lng) {
        continue;
      }
      if(tempConfig.isBMap){
        //百度地图坐标进行转换
        var posM = AM.bMapToAMap(tempConfig.lng,tempConfig.lat);
        tempConfig.lng = posM.lng;
        tempConfig.lat = posM.lat;
      }
      var point = new AMap.LngLat(tempConfig.lng, tempConfig.lat);
      var iconObj = tempConfig.icon;
      var hasImg = !!iconObj && iconObj.url;
      var imgSize = iconObj && iconObj.size;
      var image = {
        image : hasImg || "//pic.c-ctrip.com/platform/h5/common/map_address.png",
        //imageOffset : (iconObj && iconObj.anchor) ? new AMap.Pixel(iconObj.anchor.w,iconObj.anchor.h) : new AMap.Pixel(0,0),
        imageSize : (imgSize) ? new AMap.Size(imgSize.w,imgSize.h) : new AMap.Size(20,45),
        size : (imgSize) ? new AMap.Size(imgSize.w,imgSize.h) : new AMap.Size(20,45)
      };
      //高德地图默认是右上角在地图点，移动到中心点
      var dw = -((iconObj && iconObj.contentSize && iconObj.contentSize.w) ? iconObj.contentSize.w/2 : 10);
      var dh = -((iconObj && iconObj.contentSize && iconObj.contentSize.h) ? iconObj.contentSize.h/2 : 22.5);
      var defaultOffset = {
        w:(tempConfig.offset && tempConfig.offset.w) ? tempConfig.offset.w + dw : dw,
        h:(tempConfig.offset && tempConfig.offset.h) ? tempConfig.offset.h + dh : (!hasImg) ? (dh - 22.5): dh
      };
      marker = new AMap.Marker({
        position : point,
        icon : new AMap.Icon(image),
        offset:new AMap.Pixel(defaultOffset.w,defaultOffset.h)
      });
      //扩展marker方法
      marker.openInfoWindow = openInfoWindow;
      markers.push(marker);
    }
    return markers;
  };

  /**
   * 创建infowindow
   * @param config
   * @returns {*}
   */
  AM.createInfoWindow = function(config){
    if(!config.content){
      return false;
    }
    var size;
    if(config.options){
      size = new AMap.Size(config.options.width,config.options.height);
    }
    if(size){
      config.size = size;
    }
    var infoWindow = new AMap.InfoWindow(config);
    return infoWindow;
  };

  /**
   * 创建高德地图的覆盖物
   * @param config
   * @param mapObj
   */
  AM.showOverLays = function(config,mapObj){
    for(var i = 0,overlay;i<config.length;i++){
      overlay = config[i];
      overlay.setMap(mapObj);
    }
  };

  /**
   * 隐藏高德地图的覆盖物
   * @param config
   * @param mapObj
   */
  AM.hideOverlays = function(config){
    for(var i = 0,overlay;i<config.length;i++){
      overlay = config[i];
      overlay.setMap(null);
    }
  };

  /**
   * 创建高德自定义覆盖物
   * @param config
   * @param mapObj
   * @returns {{points: Array}}
   */
  AM.createCustomOverlays = function(config){
    var overlays = [];
    for (var i = 0,tempConfig; i < config.length; i++) {
      tempConfig = config[i];
      if(tempConfig.isBMap){
        //高德地图坐标进行转换
        var posM = AM.bMapToAMap(tempConfig.lng,tempConfig.lat);
        tempConfig.lng = posM.lng;
        tempConfig.lat = posM.lat;
      }
      var point = new AMap.LngLat(tempConfig.lng, tempConfig.lat);
      var markerObj = {};
      markerObj.position = point;
      if(tempConfig.offset){
        markerObj.offset = new AMap.Pixel(tempConfig.offset.x,tempConfig.offset.y);
      }
      markerObj.content = $(tempConfig.content)[0];
      markerObj.title = tempConfig.title || "";
      if(tempConfig.extData){
        markerObj.extData = tempConfig.extData;
      }
      var overlay = new AMap.Marker(markerObj);
      overlay.getPoint = overlay.getPosition;
      var dom = overlay.getContent();
      dom.title = tempConfig.title || '';
      if (tempConfig.callBack) {
        dom.addEventListener('click', _.bind(handleDomCliclk,tempConfig));
      }
      overlays.push(overlay);
    }
    function handleDomCliclk(e){
      if(this.callBack){
        this.callBack(this,e);
      }
    }
    return overlays;
  };

  /**
   * 创建高德地图的控制器
   * @param config
   * @returns {CustomControls}
   */
  AM.createControl = function(config){
    if(!config.content){
      return;
    }
    return new CustomControls(config);

  };
  /**
   * 添加自定义control
   * @param config
   * @param map
   */
  AM.addControl = function(config,map){
    try{
      var doom = $(map.getContainer());
      doom.append(config._div);
    }catch(e){
      console.log("添加自定义control失败");
    }
  };

  /**
   * 统一注册事件
   * @param obj
   * @param type
   * @param callback
   */
  AM.addEventListener = function(obj,type,callback){
    if(type == "moving"){
      type = "mapmove";
    }
    if(type == "zoom"){
      type = "zoomend";
    }
    obj.on(type,function(e){
      callback(e);
    });
  };

  /**
   * 根据所传坐标，返回对应的百度地图点对象
   * @param points
   */
  AM.createPoints = function(points){
    var pos = [];
    for(var i= 0,point; i<points.length; i++){
      point = points[i];
      if(!point.lng || !point.lat){
        continue;
      }
      if(point.isBMap){
        //高德地图坐标进行转换
        var posM = AM.bMapToAMap(point.lng,point.lat);
        point.lng = posM.lng;
        point.lat = posM.lat;
      }
      pos.push(new AMap.LngLat(point.lng, point.lat));
    }
    return pos;
  };

  /**
   * 根据传入坐标，将地图调整到合适的大小
   * 因为高德地图的fitView只识别markers等覆盖物，所以将所有的点都转换成marker
   * @param config
   * @param mapObj
   */
  AM.fitBounds = function(config,mapObj){
    if(!(config instanceof Array)){
      config = [config];
    }
    var markers = [];
    for(var i= 0; i<config.length; i++){
      var point = config[i];
      if(point instanceof  AMap.LngLat){
        markers.push(new AMap.Marker({
          position : point
        }));
      }
    }
    mapObj.setFitView(markers);
  };

  /**
   * 获取map对象的缩放值
   * @param mapObj
   */
  AM.getZoom = function(mapObj){
    if(!mapObj){
      return false;
    }
    return mapObj.getZoom();
  };

  /**
   * 获取地图中心点
   * @param mapObj
   * @returns {*}
   */
  AM.getCenter = function(mapObj){
    if(!mapObj){
      return false;
    }
    var point = mapObj.getCenter();
    return {
      lng : point.lng,
      lat : point.lat,
      isBMap:false
    };
  };

  /**
   * 设置地图中心点
   * @param mapObj
   * @returns {*}
   */
  AM.setCenter = function(point,mapObj){
    if(!(point instanceof AMap.LngLat) || !mapObj){
      return false;
    }
    mapObj.setCenter(point);
  };
  /**
   * 获取地图的边缘点
   * @param mapObj
   * @returns {*}
   */
  AM.getBounds = function(mapObj){
    if(!mapObj){
      return false;
    }
    var bounds = mapObj.getBounds();
    if(bounds){
      var pointSW = bounds.getSouthWest();
      var pointNE = bounds.getNorthEast();
      return {
        SW:{
          lng : pointSW.lng,
          lat : pointSW.lat,
          isBMap:false
        },
        NE:{
          lng : pointNE.lng,
          lat : pointNE.lat,
          isBMap:false
        }
      };
    }
  };
  /**
   * 判断地图是否包含某个点
   * @param point
   * @param map
   */
  AM.containsPoint = function(point,mapObj){
    if(!(point instanceof AMap.LngLat) || !mapObj){
      return false;
    }
    var bounds = mapObj.getBounds();
    return bounds.contains(point);
  };

  /**
   * 获取两点间的距离
   * @param pointFrom
   * @param pointTo
   * @param map
   * @returns {*}
   */
  AM.getDistance = function(pointFrom,pointTo){
    if(!pointFrom || !pointTo ){
      return false;
    }
    return pointFrom.distance(pointTo);
  };

  /**
   * 将地图平移到某个位置
   * @param point
   * @param mapObj
   */
  AM.panTo = function(point,mapObj){
    if(!point || !mapObj){
      return false;
    }
    if(point instanceof AMap.LngLat){
      mapObj.panTo(point);
    }
  };

  /**
  /**
   * 将百度地图转为高德地图坐标
   * @param lng
   * @param lat
   * @returns {{lng: number, lat: number}}
   */
  AM.bMapToAMap = function(lng,lat){
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    var x = lng - 0.0065,
      y = lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    var  theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    return {
      lng : z * Math.cos(theta),
      lat : z * Math.sin(theta),
      isBMap:false
    };
  };

  return AM;
});