/**
 * Created by bianyl on 2015/11/16.
 */
define(['cUtilPerformance', 'cUtilXhr'], function (cperformance, ajaxHelper) {
  var BGeo ={},AK='C2iS1Mz9E4zRORAUm6tT4qO7';
  /**
   * 百度地图根据经纬度获取详细地址信息
   * @param lng
   * @param lat
   * @param callback
   * @param error
   * @param timeout
   */
  BGeo.requestBMapAddress = function(lng, lat, callback, error, timeout){
    var uuidGeoService = cperformance.getUuid();
    cperformance.group(uuidGeoService, {
      name : "GeoRequest",
      url : "//api.map.baidu.com/geocoder/v2",
      type : "BMap service"
    });
    var regionBaidu = '31.230393,121.473704';
    if (lng && lat) {
      regionBaidu = lat + ',' + lng;
    }
    var url = "//api.map.baidu.com/geocoder/v2/?"+$.param({
        'ak' : AK,
        //'callback' : "renderReverse",
        'output' : "json",
        'pois' : '1',
        'location':regionBaidu
      });
    var _success = function(data){
      cperformance.groupEnd(uuidGeoService);
      var district,city,province,addressComponent,address,country,countryShortName,detailAddress,pois;
      country = "中国";
      countryShortName = "CHN";
      detailAddress = "";
      var addrs = (data && data.result) || {};
      addressComponent = addrs.addressComponent || {};
      address = addrs.formatted_address || "";
      city = addressComponent.city || "";
      province = addressComponent.province || "";
      district = addressComponent.district || "";
      pois = addrs.pois || [];
      if (country === '' && province === '' && city === '' && district === '') {
        if (error) {
          error(data);
        }
        return false;
      }
      return callback({
        'address' : address ,
        'location' : lng + "," + lat,
        'info' : addressComponent,
        'city' : city,
        'province' : province,
        'district' : district,
        'pois':pois,
        'lng' : lng,
        'lat' : lat,
        'country' : country, //国内的固定传中国
        'countryShortName' : countryShortName,
        'detailAddress':detailAddress,
        'isBMap':true
      });
    };
    var _error = function(e){
      cperformance.groupEnd(uuidGeoService);
      if (error) {
        error(e);
      }
    };
    ajaxHelper({
      url: url,
      dataType: 'jsonp',
      success: _success,
      error: _error,
      timeout: timeout || 8000
    });
  };

  /**
   * 坐标转换,高德地图坐标或者GPS坐标转换成百度坐标
   * @param lng
   * @param lat
   * @param callback
   * @param error
   * @param timeout
   * @param isGPS
   */
  BGeo.tansformLongitude = function(lng, lat, callback, error, timeout,isGPS){
    var uuidGeoService = cperformance.getUuid();
    cperformance.group(uuidGeoService, {
      name : "GeoRequest",
      url : "//api.map.baidu.com/geoconv/v1/?",
      type : "BMap service"
    });
    var param = $.param({
      coords : lng + ',' + lat,
      ak : AK,
      output : 'json',
      from : isGPS ? 1 : 3   //默认是高德地图坐标
    });
    ajaxHelper({
      url : "//api.map.baidu.com/geoconv/v1/?" + param,
      dataType : 'jsonp',
      success : function (data) {
        cperformance.groupEnd(uuidGeoService);
        if (data && data.status === 0) {
          var result = (data.result && data.result[0]) || {};
          if(callback){callback(result.x,result.y);}
        } else {
          if(error){error();}
        }
      },
      error : function (e) {
        cperformance.groupEnd(uuidGeoService);
        if(error){error(e);}
      },
      timeout : timeout || 8000
    });
  };

  /**
   * 百度地图定位功能
   * 目前使用的定位功能有两种，一种是使用地图定位，一种是调用百度接口定位
   * 在此API中，使用地图定位优先
   */
  BGeo.geolocation = function(callback,error){
    if(typeof BMap != "undefined"){
      //使用百度
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(function(r){
        if(this.getStatus() === 0 && r){
          if(callback && r.point){
            callback(r.point.lng,r.point.lat,true);
          }
        }
        else {
          error(this.getStatus());
        }
      },{enableHighAccuracy: true});
    }else{
      var uuidGeoService = cperformance.getUuid();
      cperformance.group(uuidGeoService, {
        name : "GeoRequest",
        url : "//api.map.baidu.com/location/ip",
        type : "BMap Ip service"
      });
      var param = $.param({
        ak : AK,
        coor: "bd09ll"  //默认是高德地图坐标
      });
      ajaxHelper({
        url : "//api.map.baidu.com/location/ip?"+param,
        dataType : 'jsonp',
        success : function (data) {
          cperformance.groupEnd(uuidGeoService);
          if (data && data.status === 0) {
            var content = (data.content && data.content.point) || {};
            if(callback){callback(content.x,content.y,false,true);}
          } else {
            if(error){error();}
          }
        },
        error : function (e) {
          cperformance.groupEnd(uuidGeoService);
          if(error){error(e);}
        },
        timeout : 8000
      });
    }
  };

  /**
   * 百度地图根据关键字获取周边信息
   * @param keywords
   * @param city
   * @param callback
   * @param error
   * @param timeout
   */
  BGeo.requestBMapKeyword = function(keywords, city, callback, error, timeout){
    var uuidGeoService = cperformance.getUuid();
    cperformance.group(uuidGeoService, {
      name : "GeoRequest",
      url : "//api.map.baidu.com/place/v2/search",
      type : "BMap Keyword service"
    });
    var param = $.param({
      query: keywords,
      region:city,
      ak : AK,
      scope:2,
      output: "json"  //默认是高德地图坐标
    });
    ajaxHelper({
      url : "//api.map.baidu.com/place/v2/search?"+param,
      dataType : 'jsonp',
      success : function (data) {
        cperformance.groupEnd(uuidGeoService);
        if (data && data.status === 0 && data.message == "ok") {
          var results = (data.results) || [];
          if(callback){callback(results);}
        } else {
          if(error){error();}
        }
      },
      error : function (e) {
        cperformance.groupEnd(uuidGeoService);
        if(error){error(e);}
      },
      timeout : timeout || 8000
    });
  };

  /**
   * 本地将高德地图坐标转成百度
   */
  BGeo.aMapToBMap = function(lng,lat){
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    var x = lng,y=lat;
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
    var  theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
    return {
      lng:z * Math.cos(theta) + 0.0065,
      lat:z * Math.sin(theta) + 0.006
    };
  };

  return BGeo;
});