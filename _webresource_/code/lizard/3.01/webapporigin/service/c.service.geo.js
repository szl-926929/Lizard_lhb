/**
 * @File
 * @Description: (用一句话描述该文件做什么)
 * @author shbzhang@ctrip.com
 * @date 2014-09-19 16:26:12
 * @version V1.0
 */
/**
 * 与用户登录相关的工具方法
 * @namespace Service.cGeoService
 */
define(['cUtilPerformance','cUtilCommon', 'cLocalStore', 'cCoreInherit', 'cGuiderService', (Lizard.app.code.is('MASTER') || Lizard.app.code.is('YOUTH') || Lizard.isHybrid) ? 'cHybridGeolocation' : 'cWebGeolocation', 'cUtilXhr'],
  function (cperformance,cUtilCommon, cStore, cCoreInherit, Guider, TGeoLocation, ajaxHelper) {
    var geoService = {}, GeoLocation = {},isUseBaiDu = false;

    var KEY = '0b895f63ca21c9e82eb158f46fe7f502',AK='C2iS1Mz9E4zRORAUm6tT4qO7';

    var PositionStore = cCoreInherit.Class(cStore, {
      __propertys__: function () {
        this.key = 'POSITION_CITY';
        this.lifeTime = '10M';
      },
      initialize: function ($super, options) {
        $super(options);
      }
    });

    var posStore = PositionStore.getInstance();

    /**
     * 高德api经纬度获得周边信息
     * 默认是按照高德地图坐标处理
     * @param lng {Number} 经度
     * @param lat {Number} 纬度
     * @param callback {Function} 完成时回调,回传参数为高德下发城市数据
     * @param error {Function} 超时回调
     * @param timeout {Number} 超时的时间长度，默认为8秒
     */
    GeoLocation.requestAMapAround = function (lng, lat, callback, error, timeout,isBaiDu) {
      var uuidGeoService = cperformance.getUuid();
      var urlPath = "//restapi.amap.com/v3/place/around";
      if(isBaiDu){
        urlPath = "https://api.map.baidu.com/geocoder/v2";
      }
      cperformance.group(uuidGeoService, {
        name : "GeoRequest",
        url : urlPath,
        type : "BMap service"
      });
      if(typeof timeout == 'boolean'){
        isBaiDu = timeout;
        timeout = null;
      }
      var regionBaidu = '31.230393,121.473704';
      var region = '121.473704,31.230393';
      if (lng && lat) {
        regionBaidu = lat + ',' + lng;
        region = lng + ',' + lat;
      }
      if(isBaiDu || isUseBaiDu){
        var url = "https://api.map.baidu.com/geocoder/v2/?"+$.param({
            'ak' : AK,
            'callback' : "renderReverse",
            'output' : "json",
            'pois' : '1',
            'location':regionBaidu
          });
        var _success = function(data){
          cperformance.groupEnd(uuidGeoService);
          var pois = (data && data.status ===0 && data.result && data.result.pois) || [];
          if(callback){ callback(pois);}
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
      }else{
        var param = $.param({
          'location': region,
          'key': KEY,
          'radius': 500,
          'offset': 4,
          'page': 1
        });
        timeout = timeout || 8000;
        ajaxHelper({
          url: "//restapi.amap.com/v3/place/around?" + param,
          dataType: 'jsonp',
          success: function (data) {
            cperformance.groupEnd(uuidGeoService);
            var pois = (data && data.pois) || [];
            if(callback){ callback(pois);}
          },
          error: function (e) {
            cperformance.groupEnd(uuidGeoService);
            if(error){ error(e);}
          },
          timeout: timeout
        });
      }
    };


    /**
     * 高德api关键字查询
     * @param lng {Number} 经度
     * @param lat {Number} 纬度
     * @param callback {Function} 完成时回调,回传参数为高德下发城市数据
     * @param error {Function} 超时回调
     * @param timeout {Number} 超时的时间长度，默认为8秒
     */
    GeoLocation.requestAMapKeyword = function (keywords, city, callback, error, timeout,isBaiDu) {
      var uuidGeoService = cperformance.getUuid();
      cperformance.group(uuidGeoService, {
        name : "GeoRequest",
        url : "http://restapi.amap.com/v3/place/text",
        type : "BMap Keyword service"
      });
      var param;
      if(isBaiDu || isUseBaiDu){
        param = $.param({
          query: keywords,
          region:city,
          ak : AK,
          scope:2,
          output: "json"  //默认是高德地图坐标
        });
        ajaxHelper({
          url : "https://api.map.baidu.com/place/v2/search?"+param,
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
      }else{
        param = $.param({
          'keywords': keywords,
          'city': city,
          'key': KEY,
          'offset': 10,
          'page': 1,
          'extensions': 'all'
        });
        timeout = timeout || 8000;
        ajaxHelper({
          url: "https://restapi.amap.com/v3/place/text?" + param,
          dataType: 'jsonp',
          success: function (data) {
            cperformance.groupEnd(uuidGeoService);
            var pois = (data && data.pois) || [];
            if(callback){callback(pois);}
          },
          error: function (e) {
            cperformance.groupEnd(uuidGeoService);
            if(error){error(e);}
          },
          timeout: timeout
        });
      }
    };

    //将不同环境的实现载入
    _.extend(GeoLocation, TGeoLocation);


    /**
     * 获得周边查询信息
     * @namespace Service.cGeoService.GeoLocation
     */
    geoService.GeoLocation = function () {
      var STATE_INITIALIZE = 0,
        STATE_START = 1,
        STATE_COMPLETE = 2,
        STATE_ERROR = 3;

      //定位回调
      var handler = {},
      //初始状态
        state = STATE_INITIALIZE,
        resource = null;
      //调用回调函数

      function runCallback(name, args, clearHandler) {
        for (var i in handler) {
         if( handler[i] && (typeof handler[i][name] === 'function') ){
           handler[i][name].apply(handler[i].scope, args);
         }
        }
        if(clearHandler) {(handler = {});}
      }

      return {
        /**
         * 获得当前城市信息
         * @method Service.cGeoService.GeoLocation.Subscribe
         * @param {String} name 一个字符串标记，用于标记当前请求
         * @param {Object} event 要注册的事件
         * @param {function}  [event.onStart] 可选,开始时的回调
         * @param {function}  [event.onComplete] 可选,完成时的回调
         * @param {function}  [event.onError]  可选,当定位成功，但高德定位错误时的回调
         * @param {function}  [event.onPosComplete] 可选,获取经纬度成功后的回调
         * @param {function}  [event.onPosError] 可选，当定位失败的回调
         * @param {function}  [event.onCityComplete] 可选，当定位城市成功的回调
         * @param {function}  [event.onCityError] 可选，当定位城市失败的回调
         * @param {boolean}   [event.isForceLocate] 可选，Hybrid下是否强制使用APP发起定位
         * @param {Object} [scope] 可选，当前执行上下文
         * @param {boolean} [nocache=true] 可选，是否不使用缓存
         * @param {number} [timeout=35s] 过期时间，默认为35S         
         */
        Subscribe: function (name, events, scope, nocache, timeout,needBaidu,isNotAccurate) {
          var i;
          isNotAccurate = !!isNotAccurate;// jshint ignore:line
          events = events || {};
          //之前没有注册过则加入到队列中
          if (!handler[name]) {
            handler[name] = {
              name: name,
              onStart: events.onStart,
              onComplete: events.onComplete,
              onError: events.onError,
              onPosComplete: events.onPosComplete,
              onPosError: events.onPosError,
              onCityComplete: events.onCityComplete,
              nCityError: events.onCityError,
              scope: scope
            };
          }
          var locationinfo = posStore.get();
          //此参数为真，则强制请求
          if (nocache) {
                    locationinfo = null;
          }
          //有缓存直接调用成功回调，回传结果
          if (locationinfo && locationinfo.posinfo && locationinfo.cityInfo) {
            state = STATE_START;
            runCallback('onStart', null);
            state = STATE_COMPLETE;
            runCallback('onPosComplete', [locationinfo.posinfo.lng, locationinfo.posinfo.lat]);
            runCallback('onComplete', [locationinfo.posinfo]);
            runCallback('onCityComplete', [locationinfo.cityInfo], true);
            //无缓存则调用加载中回调，并发起请求
          } else {
            clearTimeout(resource);
            resource = setTimeout(function () {
              if (state === STATE_START) {
                state = STATE_ERROR;
                Guider.print({ log: '#cGeoService -- 22 second timeout call onError' });
                runCallback('onError', [null], true);
              }
            }, timeout || 35000);
            //当在加载中时,加入队列
            if (state === STATE_START) {
              if(handler[name] && (typeof handler[name].onStart === 'function')){ handler[name].onStart.call(scope);}
              return;
            }
            state = STATE_START;
            runCallback('onStart', null);
            Guider.print({ log: '#cGeoService -- start request city info' });
            GeoLocation.requestCityInfo(function (posinfo) {              
              if (!locationinfo){ locationinfo = {};}
              locationinfo.posinfo = posinfo;
              //add by byl 在此处判断，hybrid定位不将城市信息写到缓存中
              if (!Lizard.app.code.is('MASTER') || Lizard.app.code.is('YOUTH')) {
                  posStore.set(locationinfo);
              }
              runCallback('onComplete', [posinfo]);
            }, function (msg, e) {
              state = STATE_ERROR;
              //app那边禁用定位，这个值会返回e为2
              if (typeof e === 'number' && e === 2){ e = { code: 1 };}
              Guider.print({ log: '#cGeoService -- locate onError' });
              runCallback('onError', [msg, e], true);
            }, function (lng, lat,isBaidu) {
              runCallback('onPosComplete', [lng, lat,isBaidu]);
            }, function (msg, e) {
              state = STATE_ERROR;
              //app那边禁用定位，这个值会返回e为2
              if (typeof e === 'number' && e === 2){ e = { code: 1 };}
              runCallback('onPosError', [msg, e], true);
            }, !isNotAccurate , function(cityInfo){
              state = STATE_COMPLETE;
              if (!locationinfo) {locationinfo = {};}
              locationinfo.cityInfo = cityInfo;
              //add by byl 在此处判断，hybrid定位不将城市信息写到缓存中
              if (!Lizard.app.code.is('MASTER') || Lizard.app.code.is('YOUTH')) {
                  posStore.set(locationinfo);
              }
              runCallback('onCityComplete', [cityInfo], true);
            }, function(msg, e){
              state = STATE_ERROR;
              //app那边禁用定位，这个值会返回e为2
              if (typeof e === 'number' && e === 2){ e = { code: 1 };}
              Guider.print({ log: '#cGeoService -- locate onError' });
              runCallback('onCityError', [msg, e], true);
            }, events.isForceLocate,needBaidu);
          }
        },
        /**
         * 取消某个请求服务
         * @method service.GeoLocation.UnSubscribe
         */
        UnSubscribe: function (name) {
          name = _.isArray(name) ? name : [name];
          for (var i = 0; i < name.length; i++){ delete handler[name[i]];}
        },
        /**
         * 清空缓存
         * @method service.GeoLocation.ClearPosition
         */
        ClearPosition: function () {
          posStore.remove();
        }
      };
    }();


    /**
     * 获得周边查询信息
     * @namespace Service.cGeoService.GeoAround
     */
    geoService.GeoAround = function () {

      return {
        /**
         * 获得周边查询信息
         * @method Service.cGeoService.GeoAround.Subscribe
         * @param {string} pos 经纬度，经纬度之间以,分割，如lng,lat
         * @param {function} onComplete  完成时的回调
         * @param {function}  onError 错误时的回调
         * @param {object} [scope] 可选，当前执行上下文
         */
        Subscribe: function (pos, onComplete, onError, scope,timeout,isBaiDu) {
          var lng = pos.split(',')[0];
          var lat = pos.split(',')[1];
          GeoLocation.requestAMapAround(lng,lat, function (posinfo) {
            onComplete.call(scope, posinfo);
          }, function (e) {
            onError.call(scope);
          },timeout,isBaiDu);
        }
      };

    }();

    /**
     * 获得关键字查询信息
     * @namespace Service.cGeoService.GeoKeyword
     */
    geoService.GeoKeyword = {

        /**
         * 获得关键字查询信息
         * @method Service.cGeoService.GeoKeyword.Subscribe
         * @param {string}  keywords 查询关键字
         * @param {string} city 查询所在城市
         * @param {function} onComplete  完成时的回调
         * @param {function} onError  错误时的回调
         * @param {Object} [scope] 可选，当前执行上下文
         */
        Subscribe: function (keywords, city, onComplete, onError, scope,isBaidu) {
          GeoLocation.requestAMapKeyword(keywords, city, function (posinfo) {
            onComplete.call(scope, posinfo);
          }, function (e) {
            onError.call(scope);
          },8000,isBaidu);
        }
      };


    return geoService;
  });