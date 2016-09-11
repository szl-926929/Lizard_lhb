/**
 * Created by bianyl on 2015/11/16.
 */
define([], function () {
  var BM ={};

  /**
   * 定义百度地图覆盖物的基类
   * @param point
   * @param content
   * @constructor
   */
  function ComplexCustomOverlay(point, options){
    this._point = point;
    this._content = options.content;
    this._offset = options.offset;
    this._callBack = options.callBack;
    this._options = options;
  }

  /**
   * 自定义控件类
   * @param options
   * @constructor
   */
  function CustomControls(options){
    this._options = options;
    this._div = options.content;
    this.anchor = options.anchor;
    var anchor;
    if(this.anchor == "top-left"){
      anchor = BMAP_ANCHOR_TOP_LEFT;
    }else if(this.anchor == "top-right"){
      anchor = BMAP_ANCHOR_TOP_RIGHT;
    } else if(this.anchor == "bottom-right"){
      anchor = BMAP_ANCHOR_BOTTOM_RIGHT;
    } else{
      anchor = BMAP_ANCHOR_BOTTOM_LEFT;
    }
    // 默认停靠位置和偏移量
    //BMAP_ANCHOR_TOP_LEFT  BMAP_ANCHOR_TOP_RIGHT  BMAP_ANCHOR_BOTTOM_LEFT BMAP_ANCHOR_BOTTOM_RIGHT
    this.defaultAnchor = anchor;
    var offset = new BMap.Size(0, 0);
    if(options && options.offset){
      offset = new BMap.Size(options.offset.x, options.offset.y);
    }
    this.defaultOffset = offset;
  }

  /**
   * 判断是否加载百度地图
   * @returns {boolean}
   */
  BM.hasBaidu = function(){
    if(typeof BMap != 'undefined'){
      return true;
    }else{
      return false;
    }
  };

  /**
   * 兼容以前老的方案处理
   * @param config
   * @returns {BMap.Map}
   */
  BM.createMapOld = function(config){
    if(typeof BMap == "undefined"){
      return ;
    }
    var mapContainer = new BMap.Map(config.id);
    if(!config.isBMap){
      //高德地图进行转换
      var pos = BM.aMapToBMap(config.lng,config.lat);
      config.lng = pos.lng;
      config.lat = pos.lat;
    }
    var point = new BMap.Point(config.lng, config.lat);
    mapContainer.centerAndZoom(point,config.zoom || 16);

    //创建marker
    var markrViews = BM.createMarkerOld(config,mapContainer);

    if (config.zoomCallBack) {
      mapContainer.addEventListener("zoomend",function(){
        var newMarkers;
        if(config.zoomCallBack){
          newMarkers = config.zoomCallBack(this.getZoom());
        }
        //由于google的zoomchange事件不好解决暂时取消这个功能
        if (newMarkers) {
          //删除原有的markers
          if (markrViews.marekrs && markrViews.marekrs.length > 0) {
            for (var i = 0; i < markrViews.marekrs.length; i++) {
              if(markrViews.marekrs[i].remove){markrViews.marekrs[i].remove(null);}
            }
            markrViews = {
              marekrs : []
            };
          }
          BM.createMarkerOld(newMarkers, this);
        }
      });
    }
    return mapContainer;
  };

  /**
   * 兼容老的方案
   * 创建POI
   * @param config
   * @param mapObj
   */
  BM.createMarkerOld = function(config, mapObj){
    var params ;
    if ((config.markers instanceof Array) && config.markers.length > 0) {
      params = config.markers;
    } else if(config instanceof  Array){
      params = config;
    }else {
      params = [config];
    }
    var markrViews = {
      marekrs : []
    };
    var handleBMapClick = function(){
      if(this.callBack){this.callBack(this.markerId);}
    };
    for (var i = 0,tempConfig; i < params.length; i++) {
      var marker;
      tempConfig = params[i];
      if (!tempConfig || !tempConfig.lat || !tempConfig.lng) {
        continue;
      }
      if(!tempConfig.isBMap){
        //高德地图进行转换
        var posM = BM.aMapToBMap(tempConfig.lng,tempConfig.lat);
        tempConfig.lng = posM.lng;
        tempConfig.lat = posM.lat;
      }
      var myIcon = new BMap.Icon(tempConfig.icon || "//pic.c-ctrip.com/platform/h5/common/map_address.png", new BMap.Size(30,60));
      marker = new BMap.Marker(new BMap.Point(tempConfig.lng, tempConfig.lat),{icon:myIcon});
      marker.addEventListener("click", _.bind(handleBMapClick,tempConfig));
      if (params.id) {
        //在zoom时，可以重设这个中心点
        mapObj.setCenter(new BMap.Point(tempConfig.lng, tempConfig.lat));
      }
      mapObj.addOverlay(marker);
      if(tempConfig.content){
        //创建文字提示
        var label = new BMap.Label(tempConfig.content,{offset:new BMap.Size(30,-10)});
        label.setStyle(_.extend({},tempConfig.style));
        marker.setLabel(label);
      }
      markrViews.marekrs.push(marker);
    }
    return markrViews;
  };
  /**
   * 创建百度地图
   * 坐标需要指定isBMap=true
   * 默认传递的坐标都是按照高德坐标处理
   * @param config
   * @returns {BMap.Map}
   */
  BM.createMap = function(config){
    var mapContainer = new BMap.Map(config.id);
    if(!config.isBMap){
      //高德地图进行转换
      var pos = BM.aMapToBMap(config.lng,config.lat);
      config.lng = pos.lng;
      config.lat = pos.lat;
    }
    var point = new BMap.Point(config.lng, config.lat);
    mapContainer.centerAndZoom(point,config.zoom || 16);
    if(!config.DoubleClickZoom){
      mapContainer.disableDoubleClickZoom(); //默认关闭双击缩放
    }
    mapContainer.enableScrollWheelZoom(); //默认开启滚轮缩放
    return mapContainer;
  };
  /**
   * 创建POI
   * @param config
   * @param mapObj
   */
  BM.createMarkers = function(config){
    var markers = [];
    for(var i= 0,tempConfig;i < config.length;i++){
      tempConfig = config[i];
      if (!tempConfig || !tempConfig.lat || !tempConfig.lng) {
        continue;
      }
      if(!tempConfig.isBMap){
        //高德地图坐标进行转换
        var posM = BM.aMapToBMap(tempConfig.lng,tempConfig.lat);
        tempConfig.lng = posM.lng;
        tempConfig.lat = posM.lat;
      }
      var point = new BMap.Point(tempConfig.lng, tempConfig.lat);
      var iconObj = tempConfig.icon;
      var hasImg = !!iconObj && iconObj.url;
      var imgSize = iconObj && iconObj.size;
      var url = (iconObj && iconObj.url) || "//pic.c-ctrip.com/platform/h5/common/map_address.png",
        contentSize = (imgSize) ? new BMap.Size(imgSize.w,imgSize.h) : new BMap.Size(20,45),
        size = (imgSize) ? new BMap.Size(imgSize.w,imgSize.h) : new BMap.Size(20,45);
      //anchor = (iconObj && iconObj.anchor) ? new BMap.Size(iconObj.anchor.w,iconObj.anchor.h) : new BMap.Size(10,40);
      var defaultOffset = {
        w:(tempConfig.offset && tempConfig.offset.w) ? tempConfig.offset.w :  0,
        h:(tempConfig.offset && tempConfig.offset.h) ? tempConfig.offset.h  : (!hasImg) ? (-22.5): 0
      };
      var myIcon = new BMap.Icon(url, contentSize);
      myIcon.setImageSize(size);
      //myIcon.setAnchor(anchor);
      var marker = new BMap.Marker(point,{
        icon:myIcon,
        offset:new BMap.Size(defaultOffset.w,defaultOffset.h)
      });
      markers.push(marker);
    }
    return markers;
  };

  /**
   * 创建infowindow
   * @param config
   * @returns {*}
   */
  BM.createInfoWindow = function(config){
    if(!config.content){
      return false;
    }
    var infoWindow = new BMap.InfoWindow(config.content,config.options || {});
    return infoWindow;
  };
  /**
   * 创建百度地图的overlays
   */
  BM.createCustomOverlays = function(config){
    var overlays = [];
    //初始化覆盖物基类
    ComplexCustomOverlay.prototype = new BMap.Overlay();
    ComplexCustomOverlay.prototype.initialize = function(map){
      this._map = map;
      var div = this._div = document.createElement("div");
      div.style.position = "absolute";
      div.style.zIndex = BMap.Overlay.getZIndex() + 1;
      div.style.padding = "2px";
      div.appendChild($('<div>'+  (this._content || "")  +'</div>')[0]);
      map.getPanes().labelPane.appendChild(div);
      if(this._callBack){
        var scope = this;
        var isRun = false;
        div.onclick = function(){
          if(isRun){
            return false;
          }
          scope._callBack(scope._options);
        };
        div.addEventListener("touchstart",function(){
          isRun = true; //如果isRun执行了 则不执行touchstart事件
          scope._callBack(scope._options);
        },false);
      }
      return div;
    };
    ComplexCustomOverlay.prototype.draw = function(){
      var map = this._map;
      var pixel = map.pointToOverlayPixel(this._point);
      this._div.style.left = pixel.x  + ((this._offset && this._offset.x) || 0) + "px";
      this._div.style.top  = pixel.y + ((this._offset && this._offset.y) || 0) + "px";
    };
    ComplexCustomOverlay.prototype.setPoint = function(point){
      if(point instanceof  BMap.Point){
        this._point = point;
      }
    };
    ComplexCustomOverlay.prototype.open = function(mapObj,point){
      if(!this._map && !mapObj){
        return false;
      }
      if(point instanceof BMap.Point ){
        this._point = point;
      }
      if(!this._map){
        mapObj.addOverlay(this);
      }else{
        this.draw();
      }
    };
    for (var i = 0,tempConfig; i < config.length; i++) {
      tempConfig = config[i];
      if(!tempConfig.isBMap){
        //高德地图坐标进行转换
        var posM = BM.aMapToBMap(tempConfig.lng,tempConfig.lat);
        tempConfig.lng = posM.lng;
        tempConfig.lat = posM.lat;
      }
      var point = new BMap.Point(tempConfig.lng, tempConfig.lat);
      var overlay = new ComplexCustomOverlay(point,tempConfig);
      overlays.push(overlay);
    }
    return overlays;
  };

  /**
   * 创建自定义的控制器
   * @param config
   */
  BM.createControl = function(config){
    CustomControls.prototype = new BMap.Control();
    CustomControls.prototype.initialize = function(map){
      // 创建一个DOM元素
      var div = document.createElement("div");
      // 添加文字说明
      div.appendChild($(this._div)[0]);
      // 绑定事件,点击一次放大两级
      if(this._options && this._options.callBack){
        var scop = this;
        div.onclick = function(e){
          scop._options.callBack(e);
        };
      }
      // 添加DOM元素到地图中
      map.getContainer().appendChild(div);
      // 将DOM元素返回
      return div;
    };
    // 创建控件
    return new CustomControls(config);
  };

  /**
   * 添加自定义control
   * @param config
   * @param map
   */
  BM.addControl = function(config,map){
    if(! (config instanceof CustomControls)){
      return ;
    }
    map.addControl(config);
  };
  /**
   * 在指定地图上显示覆盖物
   * @param config
   * @param mapObj
   */
  BM.showOverLays = function(config,mapObj){
    for(var i = 0,overlay;i<config.length;i++){
      overlay = config[i];
      var map;
      if(overlay.getMap){
        map = overlay.getMap();
      }
      if(overlay._map){
        map = overlay._map;
      }
      if(!map){
        mapObj.addOverlay(overlay);
      }else{
        overlay.show();
      }
    }
  };
  /**
   * 隐藏地图上的覆盖物
   * @param config
   */
  BM.hideOverlays = function(config){
    for(var i = 0,overlay;i < config.length;i++){
      overlay = config[i];
      if(overlay.hide){
        overlay.hide();
      }
    }
  };

  /**
   * 统一注册事件
   * @param obj
   * @param type
   * @param callback
   */
  BM.addEventListener = function(obj,type,callback){
    if(type == "zoom"){
      type = "zoomend";
    }
    obj.addEventListener(type,function(e){
      callback(e);
    });
  };

  /**
   * 根据所传坐标，返回对应的百度地图点对象
   * @param points
   */
  BM.createPoints = function(points){
    var pos = [];
    for(var i= 0,point; i<points.length; i++){
      point = points[i];
      if(!point.lng || !point.lat){
        continue;
      }
      if(!point.isBMap){
        //高德地图坐标进行转换
        var posM = BM.aMapToBMap(point.lng,point.lat);
        point.lng = posM.lng;
        point.lat = posM.lat;
      }
      pos.push(new BMap.Point(point.lng, point.lat));
    }
    return pos;
  };
  /**
   * 根据传入坐标，将地图调整到合适的大小
   * @param config
   * @param mapObj
   */
  BM.fitBounds = function(config,mapObj){
    if(!(config instanceof Array)){
      config = [config];
    }
    var points = [];
    for(var i= 0; i<config.length; i++){
      var point = config[i];
      if(point instanceof  BMap.Point){
        points.push(point);
      }
    }
    mapObj.setViewport(points,{enableAnimation:true});
  };

  /**
   * 获取map对象的缩放值
   * @param mapObj
   */
  BM.getZoom = function(mapObj){
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
  BM.getCenter = function(mapObj){
    if(!mapObj){
      return false;
    }
    var point = mapObj.getCenter();
    return {
      lng : point.lng,
      lat : point.lat,
      isBMap:true
    };
  };
  /**
   * 设置地图中心点
   * @param mapObj
   * @returns {*}
   */
  BM.setCenter = function(point,mapObj){
    if(!(point instanceof BMap.Point) || !mapObj){
      return false;
    }
    mapObj.setCenter(point);
  };

  /**
   * 获取地图的边缘点
   * @param mapObj
   * @returns {*}
   */
  BM.getBounds = function(mapObj){
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
          isBMap:true
        },
        NE:{
          lng : pointNE.lng,
          lat : pointNE.lat,
          isBMap:true
        }
      };
    }
  };

  /**
   * 判断地图是否包含某个点
   * @param point
   * @param map
   */
  BM.containsPoint = function(point,map){
    if(!(point instanceof BMap.Point) || !map){
      return false;
    }
    var bounds = map.getBounds();
    return bounds.containsPoint(point);
  };

  /**
   * 获取两点间的距离
   * @param pointFrom
   * @param pointTo
   * @param map
   * @returns {*}
   */
  BM.getDistance = function(pointFrom,pointTo,map){
    if(!map || !pointFrom || !pointTo ){
      return false;
    }
    return map.getDistance(pointFrom,pointTo);
  };
  /**
   * 将地图平移到某个位置
   * @param point
   * @param mapObj
   */
  BM.panTo = function(point,mapObj){
    if(!point || !mapObj){
      return false;
    }
    if(point instanceof BMap.Point){
      mapObj.panTo(point);
    }
  };
  /**
   * 本地将高德地图坐标转成百度
   */
  BM.aMapToBMap = function(lng,lat){
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    var x = lng,y=lat;
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
    var  theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
    return {
      lng:z * Math.cos(theta) + 0.0065,
      lat:z * Math.sin(theta) + 0.006,
      isBMap:true
    };
  };

  return BM;
});