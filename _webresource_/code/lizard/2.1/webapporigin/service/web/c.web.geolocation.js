/**
 * @File c.web.geolocation
 * @Description: web环境下定位
 * @author ouxz@ctrip.com/shbzhang@ctrip.com
 * @date 2014-09-19 17:46:07
 * @version V1.0
 */
define(['cGeoHelper', 'cUtilPerformance', 'cModel', 'cCoreInherit','cBGeo','cGGeo'], function (cGeoHelper, cperformance, cModel, cCoreInherit,cBGeo,cGGeo) {
  var Geo = {};
  var cityModel = cCoreInherit.Class(cModel, {
    __propertys__: function() {
      this.url = 'http://m.ctrip.com/restapi/soa2/10398/json/LBSLocateCity';
    }
  }).getInstance();

  /**
   * @description 待地图上显示单个POI
   * @param {JSON}
   * options.latitude, 纬度2567.
   * options.longitude, 经度2568.
   * options.title, 在地图上显示的点的主标题2569.
   * options.subtitle, 在地图上显示点的附标题
   * options.zoomCallBack  地图比例变化时的回调
   */
  Geo.showMapWithPOI = function (options) {
    //此处webMap 和 WebMapOverseas 需要合并，都包含了多个marker节点以及marker节点的点击回调事件
    var webMap = function (config) {
      if (!config || !config.lat || !config.lng || !config.id) {
        if(config.error){config.error();}
        return false;
      }
      // @description 初始化地图信息
      var mapContainer;
      var isDomestic = cGeoHelper.getCountry(config.lng, config.lat);
      // @description 在web环境中，如果缺少AMap对象和定位点信息，直接返回false，标记错误，无法加载地图,唉谷歌地图api加载不完全的情况，需要处理
      if (isDomestic != 1 && cGGeo.hasGoogle()) {
        //创建googl地图
        mapContainer = cGGeo.createMapOld(config);
      } else {
        if(cBGeo.hasBaidu()){
          //显示国内地址，并且在国内，使用百度地图
          mapContainer = cBGeo.createMapOld(config);
        }else{
          if(config.error){
            config.error();
          }
          console.log("未加载地图插件");
          return "error:no Map Plugins";
        }
      }
      //添加地图对象的返回，提供BU删除操作
      return mapContainer;
    };
    return webMap(options);
  };

  /**
   * @description 在地图上显示多个POI位置点
   * @param {Array} poiList
   */
  Geo.showMapWithPOIList = function (poiList) {
  };

  /**
   * 获得城市信息
   * @param callback {Function} 成功时的回调
   * @param erro {Function} 失败时的回调
   * @param posCallback {Function} 获取经纬度成功的回调
   * @param posError {Function} 获取经纬度失败的回调
   * @param isAccurate {Boolean} 是否通过高精度查询 (如果使用高精度定位会发起两次请求，定位会需要更多时间，如只需定位城市，不需开启此开关，此开关在app中无效)
   */
  Geo.requestCityInfo = function (callback, error, posCallback, posError, isAccurate, cityCallBack, cityErrorCallBack,isForceLocate,needBaidu) {
    var uuidGeoRequest = {
      number: cperformance.getUuid(),
      detail: cperformance.getUuid(),
      city: cperformance.getUuid(),
      error: cperformance.getUuid()
    };

    //+……2014-09-04……JIANGJing
    for (var i in uuidGeoRequest) {
      cperformance.group(uuidGeoRequest[i], {
        name: 'GeoRequest',
        url: 'Web function ' + i
      });
    }
    var handlePos = function(pos,isBaidu,callback){
      var lng = pos.coords.longitude;
      var lat = pos.coords.latitude;
      //判断是国内地址，并且不是百度定位的坐标，需要做百度坐标转换处理
      var ret = 1; //默认的region地址是国内的，所以默认使用高德地图
      if (lng && lat) {
        //判断是否是国内的经纬度
        ret = cGeoHelper.getCountry(lng, lat);
      }
      if(needBaidu){
        if(ret == 1){
          if(!isBaidu){
            //国内坐标，并且是gps定位成功
            Geo.tansformLongitude(lng, lat, function (tLng, tLat) {
              callback(tLng,tLat,true,ret); //使用百度转换坐标
            },function(){
              var pos = cBGeo.aMapToBMap(lng,lat); //使用自定义方法转换坐标
              callback(pos.lng,pos.lat,true,ret);
            },8000,true);
          }else{
            //百度定位成功的，直接返回
            callback(lng,lat,true,ret);
          }
        }else{
          //国外坐标直接返回google坐标
          callback(lng,lat,false,ret);
        }
      }else{
        if(isBaidu && ret == 1){
          //国内坐标，并且是百度坐标，转成google坐标
          var posG = cGGeo.bMapToAMap(lng,lat);
          callback(posG.lng,posG.lat,false,ret);
        }else{
          //直接返回google坐标
          callback(lng,lat,false,ret);
        }
      }
    };
    var successCallback = function (pos,isBaidu,isIp) {
      //+1……2014-09-04……JIANGJing
      cperformance.groupEnd(uuidGeoRequest.number);
      handlePos(pos,isBaidu,function(lng,lat,isBaidu,ret){
        if(!isIp || !isAccurate){ //不是ip定位或者不需要精准定位,可以直接返回坐标，默认isAccurate是true
          if(posCallback){
            posCallback(lng,lat,isBaidu); //文档中需要添加，国外坐标时，没有百度坐标
          }
        }else{
          //if (typeof posError === 'function') {
          //  posError();
          //}
        }
        var locateSuccessCallback = function (data) {
          var pos;
          if(data.isBMap && !needBaidu){
            pos = cGGeo.bMapToAMap(data.lng,data.lat);
            data.lng = pos.lng;
            data.lat = pos.lat;
            data.location = data.lng + "," + data.lat;
          }
          //+1……2014-09-04……JIANGJing
          cperformance.groupEnd(uuidGeoRequest.detail);
          if (_.isFunction(cityCallBack))
          {
            cityModel.setAttr('param', {Longitude: lng, Latitude: lat, CountryName: data.country, ProvinceName: data.province, L1CityName: data.city, L2CityName: data.district, TownName: '', Language: 'CN'});
            cityModel.excute(function(data){
              cperformance.groupEnd(uuidGeoRequest.city);
              cityCallBack(data);
            }, function(err){
              cperformance.groupTag(uuidGeoRequest.error, 'errno', '23');
              cperformance.groupEnd(uuidGeoRequest.error);
              if (cityErrorCallBack) { cityErrorCallBack(err); }
            });
          }
          if(!isIp || !isAccurate){ //不是ip定位或者不需要精准定位,可以直接返回坐标，默认isAccurate是true
            if (callback) {
              callback(data);
            }
          }else{
            if (error) {
              error();
            }
          }

        };

        var locateErrorCallback = function (err, msg) {
          //+……2014-09-12……JIANGJing……记录错误响应代码
          cperformance.groupTag(uuidGeoRequest.error, 'errno', '21');
          //+1……2014-09-04……JIANGJing
          cperformance.groupEnd(uuidGeoRequest.error);
          if (error) {
            error();
          }
        };

        if (!isAccurate || isBaidu) { //add by byl  此处如果是用百度地图定位成功，不需要使用坐标转换
          Geo.requestAMapAddress(lng, lat, locateSuccessCallback, locateErrorCallback,isBaidu);
        } else {
          if(ret == 1 && !isBaidu){
            //国内坐标但不是百度坐标时
            Geo.tansformLongitude(lng, lat, function (lng, lat) {
              Geo.requestAMapAddress(lng, lat, locateSuccessCallback, locateErrorCallback,true);
            }, function (err) {
              //-1……2014-09-12……JIANGJing……区分错误
              //locateErrorCallback(err);
              //+2……2014-09-12……JIANGJing……重新定义错误响应
              cperformance.groupTag(uuidGeoRequest.error, 'errno', '22');
              cperformance.groupEnd(uuidGeoRequest.error);
              if (error) {
                error();
              }
            },8000,true);
          }else{
            Geo.requestAMapAddress(lng, lat, locateSuccessCallback, locateErrorCallback,isBaidu);
          }
        }
      });
    };

    var errorCallback = function (err, msg) {
      //-1……2014-09-04……JIANGJing
      //cperformance.groupEnd(uuidGeoService);

      //+……2014-09-12……JIANGJing……记录错误响应代码
      cperformance.groupTag(uuidGeoRequest.error, 'errno', '20');
      //+1……2014-09-04……JIANGJing
      cperformance.groupEnd(uuidGeoRequest.error);

      if (typeof posError === 'function') {
        posError(msg, err);
        return;
      }
      if (error) {
        error(msg);
      }
    };
    this.requestGeographic(successCallback, errorCallback);
  };

  /**
   * 获得设备经纬度
   * @param {function} callback 获得经纬度的回调
   * @param {function} error  发生错误时的回调
   * @param {timeout} 超时时间
   */
  Geo.requestGeographic = function (callback, error, timeout) {
    var uuidGeoService = cperformance.getUuid();
    cperformance.group(uuidGeoService, {
      name: "GeoRequest",
      url: "Google service",
      type: "Google service"
    });
    var geoDone = {
      baidu:{},
      navigator:{},
      errObj:{
        err:"",
        err_msg:""
      }
    };
    var isReturn = false;
    var successCallback = function (position) {
      cperformance.groupEnd(uuidGeoService);
      geoDone.navigator = position;
      if (!isReturn && (geoDone.baidu.coords || geoDone.baidu.err)) { //百度定位完成，返回原生定位
        isReturn = true;
        callback(position);
      }
      return;
    };
    var errorCallback = function (err) {
      geoDone.navigator.err = true;
      cperformance.groupEnd(uuidGeoService);
      var err_msg = '未能获取到您当前位置，请重试或选择城市'; // '获取经纬度失败!';
      switch (err.code) {
        case err.TIMEOUT:
          err_msg = "获取您当前位置超时，请重试或选择城市！";
          break;
        case err.PERMISSION_DENIED:
          err_msg = "您拒绝了使用位置共享服务，查询已取消，请开启位置共享或选择城市！";
          break;
        case err.POSITION_UNAVAILABLE:
          err_msg = "获取您当前位置信息失败，请重试或选择城市！";
          break;
      }
      if(!geoDone.baidu.coords && !geoDone.baidu.err){ //百度定位未完成
        geoDone.errObj.err = err;
        geoDone.errObj.err_msg = err_msg;
        return;
      }
      if(!isReturn){
        isReturn = true;
        if(geoDone.baidu.coords){ //百度地图已经定位完成并且成功,ip定位成功
          callback(geoDone.baidu,true,geoDone.baidu.isIp);
        }else{
          if (error) { //百度地图已经定位完成并且失败
            error(err, err_msg);
          }
        }
      }
    };

    //此处设计为，浏览器定位于百度定位同时进行，并且浏览器定为优先
    cBGeo.geolocation(function(lng,lat,isMap,isIp){
      geoDone.baidu.coords = {};
      geoDone.baidu.coords.latitude = lat;
      geoDone.baidu.coords.longitude = lng;
      geoDone.baidu.isIp = isIp;
      //geoDone.baidu.isMap = isMap;
      if(!isReturn && (isMap || geoDone.navigator.err)){ //地图定位 或者 原生定位失败后可以返回
        isReturn = true;
        callback(geoDone.baidu,true,isIp);//isIp为true时，返回是ip定位的值
        return;
      }else if(!isReturn && geoDone.navigator.coords){ //如果原生定位成功
        isReturn = true;
        callback(geoDone.navigator);
        return;
      }
      setTimeout(function(){ //由于某些浏览器定位失败也不返回，故20s之后执行百度成功回调
        if(!isReturn){
          isReturn = true;
          callback(geoDone.baidu,true,isIp);
        }
      },20000);
    },function(){
      geoDone.baidu.err = true; //标记百度地图定位失败
      if(!isReturn && geoDone.navigator.err){
        //百度定位失败，并且原生定位也失败
        isReturn = true;
        error(geoDone.errObj.err,geoDone.errObj.err_msg);
        return;
      }else if(!isReturn && geoDone.navigator.coords){ //原生定位成功
        isReturn = true;
        callback(geoDone.navigator);
        return;
      }
      setTimeout(function(){ //由于某些浏览器定位失败也不返回，故20s之后执行百度错误回调
        if(!isReturn){
          isReturn = true;
          error(3,"获取您当前位置超时，请重试或选择城市！");
        }
      },20000);
    });
    //此处应该添加浏览器是否支持navigator的判断，并且enableHighAccuracy参数需要考虑，pc端不需要使用精确定位
    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
        enableHighAccuracy : true,
        maximumAge : 5000,
        timeout : timeout || 15000
      });
    } else {
      if (error && !isReturn) {
        error("", "获取您当前位置信息失败，浏览器不支持定位！");
      }
    }
  };

  /**
   * @description: 获取转换过的经纬度
   * 默认需要传高德地图的坐标，不传为浏览器定位坐标
   * @param lng {Number} 经度
   * @param lat {Number} 维度
   * @param callback {Function} 成功回调
   * @param error {Function} 错误回调
   * @param isGPS {boolean} 是否是GPS定位
   * @author: ouxz
   */
  Geo.tansformLongitude = function (lng, lat, callback, error, timeout,isGPS) {
    cBGeo.tansformLongitude(lng, lat, callback, error, timeout,isGPS);
  };

  /**
   * 高德api经纬度获得详细地址信息
   * @param lng {Number} 经度
   * @param lat {Number} 纬度
   * @param callback {Function} 完成时回调,回传参数为高德下发城市数据
   * @param error {Function} 超时回调
   * @param timeout {Number} 超时的时间长度，默认为8秒
   * @author ouxingzhi
   */
  Geo.requestAMapAddress = function (lng, lat, callback, error, timeout,isBaidu) {
    var ret = 1; //默认的region地址是国内的，所以默认使用高德地图
    if (lng && lat) {
      //判断是否是国内的经纬度
      ret = cGeoHelper.getCountry(lng, lat);
    }
    if(typeof timeout == 'boolean'){
      isBaidu = timeout;
      timeout = null;
    }
    if(ret == 1){
      if(!isBaidu){ //国内如果不是百度地址，需要转成百度地址
        var pos = cBGeo.aMapToBMap(lng,lat);
        lng = pos.lng;
        lat = pos.lat;
      }
      cBGeo.requestBMapAddress(lng, lat, callback, error, timeout);
    }else{
      cGGeo.requestGoogleAddress(lng, lat, callback, error, timeout);
    }
  };
  return Geo;
});
