/**
 * Created by bianyl on 2016/4/28.
 */
(function(LizardLite){
  var AK='C2iS1Mz9E4zRORAUm6tT4qO7';
  if(LizardLite.app.vendor.is("CTRIP")){
    LizardLite.requestCityInfo = function (callback, error, posCallback, posError, isAccurate, cityCallBack, cityErrorCallBack, isForceLocate) {
      var matchLocateInfo = function (info) {
        if(info){
          return (info.type == 'geo' || info.type == 'address' || info.type == 'CtripCity');
        }else{return false;}
      };
      var firstCalled = true;
      var successCallback = function (info,error_code) {
        var ERR_INFOs = {
          1: '网络不通，当前无法定位',
          2: '定位没有开启'
        };
        // 定义当获取的定位信息不合规时的错误代码
        var DEFAULT_ERR_NUM = 1,
          errNum = 0,absErrCode=window.Math.abs(error_code);

        if (!matchLocateInfo(info)) {
          errNum = DEFAULT_ERR_NUM;
        } else if (absErrCode > 0) {
          errNum =absErrCode;
        }

        if (errNum) {
          if (typeof errorCallback == 'function') {
            errorCallback(info, error_code);
          }
        } else {
          var v = info.value,
            detailed = (typeof v.addrs != 'undefined');

          if ('CityEntities' in v) {
            if (typeof cityCallBack == 'function') {
              cityCallBack(v);
            }
          }

          if (firstCalled && typeof posCallback == 'function') {
            posCallback(v.lng, v.lat);
          }

          if (detailed && typeof callback == 'function') {
            callback({
              lng: v.lng,
              lat: v.lat,
              city: v.city || v.ctyName || v.province,
              province: v.province,
              district: v.district,
              //+2……2014-09-04……JIANGJing
              country: v.country,
              countryShortName: v.countryShortName,
              address: v.addrs,
              detailAddress:v.detailAddress,
              pois:v.pois
            });
          }
        }
        firstCalled = false;
      };

      var errorCallback = function (err, error_code) {
        var errCode = (err && err.error_code) || error_code;
        if (errCode)
        {
          errCode += "";
          if (errCode.indexOf('201') > -1){
            posError(errCode);}
          else if (errCode.indexOf('202') > -1){
            posError(errCode);}
          else if (errCode.indexOf('203') > -1){
            posError(errCode);}
          else if (errCode.indexOf('204') > -1){
            error(errCode);}
          else if (errCode.indexOf('205') > -1) {
            if(cityErrorCallBack){ cityErrorCallBack(errCode);}
          }
        } else {
          console.log("(-201)定位未开启");
          posError("(-201)定位未开启");
        }
      };

      if(!window.app){
        window.app = {};
      }
      var tempCallback;
      if(window.app.callback){
        tempCallback = window.app.callback;
      }
      window.app.callback=function(options){
        tempCallback(options);
        if(options.tagName == "locate"){
          if(options.error_code){
            errorCallback(options,options.error_code);
          }else{
            successCallback(options.param,options.error_code || options.number);
          }
        }
      };
      var sequenceId = new Date().getTime(); //貌似这个没有返回，问题不大
      if(CtripUtil){
        CtripUtil.app_locate(20, true, true, sequenceId);
      }
    };
  }else{
      if(window.$ && typeof window.$.ajax == "function"){
        LizardLite.Utils.$.ajax = window.$.ajax; //如果有全局的
      }
      var CtripGeoHelper = {
        Aboard:2,
        Domestic:1,
        Unknown:-1,
        aroundAboardRectList:[
          [125478833, 40538425, 135928497, 16590043],
          [128054454, 54437790, 136370032, 49918776],
          [89567309, 54351906, 115617882, 47881407],
          [71832315, 54566279, 82281980, 46323836],
          [72788974, 28001436, 85887850, 16590043],
          [92510877, 48029708, 111570476, 45034268],
          [85593493, 26157025, 97294174, 16519064],
          [97073406, 20935216, 107743838, 16305964],
          [98324422, 45190596, 109142033, 42854577],
          [71979493, 45863038, 78896877, 41817208]
        ],
        chinaRectList:[
          [85374342, 41697126, 124486996, 28705892],
          [98942349, 28714002, 122527683, 23331042],
          [108012216, 23415965, 119252965, 17294543],
          [120025651, 51286036, 126391116, 41330674],
          [82936701, 46727439, 90553182, 41621242],
          [126188746, 48211817, 129757821, 42485061],
          [129518656, 47611932, 131468770, 44959641],
          [131376782, 47487374, 133805226, 46225387],
          [79753968, 41876130, 85604309, 30872189],
          [113457816, 44802677, 120117638, 41517618],
          [118977005, 23526282, 121975765, 21629857],
          [109667973, 17321053, 119050594, 14580095],
          [76258482, 40359687, 80011530, 35915704],
          [90534784, 44710915, 94030271, 41531444],
          [80710628, 45077082, 83028687, 41862379],
          [85935460, 48414308, 88437492, 46645143],
          [93975079, 42559912, 101462779, 41600531],
          [93956681, 44157262, 95354876, 42491869],
          [116695740, 46301949, 120117638, 44619006],
          [116401384, 49444657, 120191227, 48057877],
          [121000708, 53244099, 124569783, 51210984],
          [106724405, 42232628, 113494611, 41683336],
          [112133211, 44355602, 113568200, 42123151],
          [110918989, 43155464, 112206800, 42232628],
          [115150367, 45324216, 116769330, 44724032],
          [126299129, 49588397, 128102064, 48057877],
          [128065270, 49131761, 129757821, 48131826],
          [129721026, 48622090, 130530508, 47611932],
          [124349016, 52822665, 125710416, 51095279],
          [122325313, 28884167, 123760302, 25662561],
          [111029373, 14651757, 118388292, 10605300],
          [109778357, 10095218, 109778357, 10095218],
          [109631178, 10459649, 116548562, 7753573],
          [110514249, 7826971, 113678584, 4734480],
          [124330619, 41399976, 125480450, 40689610],
          [126345123, 42512290, 128046872, 41827986],
          [127973283, 42539507, 129104717, 42143692],
          [74510739, 40162360, 76350468, 38678393],
          [119087389, 21629857, 120706351, 20142916],
          [106853187, 23339537, 108067408, 21990651],
          [129707229, 44975967, 130985841, 43017244],
          [130958245, 44582859, 131169814, 43104932],
          [131418176, 46247729, 133129126, 45359896],
          [133073934, 48054793, 134269758, 47409374],
          [99701237, 23386249, 101577762, 22174986],
          [100179567, 22243514, 101559364, 21745927],
          [101485775, 23437187, 104245370, 22875776],
          [98008686, 25240784, 99057332, 24181992],
          [124463999, 40686109, 124905534, 40461646],
          [125457453, 41334141, 126055365, 40979564],
          [126368119, 41824546, 126607284, 41645397],
          [125475850, 40979564, 125687419, 40853958],
          [124477797, 40465160, 124728460, 40343852],
          [124470898, 40347371, 124618076, 40285757],
          [124891736, 40694862, 125153898, 40607283],
          [126046166, 41332407, 126262335, 41165784],
          [127214395, 41836586, 128083666, 41546995],
          [126386516, 50257998, 126386516, 50257998],
          [126280732, 50257998, 127513351, 49580921],
          [126363520, 50934256, 127117809, 50225552],
          [125669022, 52398490, 126276133, 51247082],
          [80948643, 30905163, 81403976, 30280446],
          [83574857, 30911112, 85488176, 29214825],
          [98136317, 28872274, 99079179, 27642374]
        ],
        largeChinaRect:[73083331, 54006559, 135266195, 17015367],
        isInRect:function(iLong, iLat, rectArr) {
          if ( (iLong >= rectArr[0] && iLong <= rectArr[2]) &&
            (iLat >= rectArr[3] &&  iLat <= rectArr[1]) ) {
            return true;
          }
          return false;
        },
        isInRectList:function(iLong, iLat, rectArrList) {
          for (var i = 0,smallRect; i < rectArrList.length - 1; i++) {
            smallRect = rectArrList[i];
            if (this.isInRect(iLong, iLat,smallRect)) {
              return true;
            }
          }

          return false;
        },
        getCountry:function(longitude, latitude) {
          var ret = this.Unknown;
          var newLat = latitude*1000000;
          var newLog = longitude*1000000;

          var isInAboard = !(this.isInRect(newLog, newLat, this.largeChinaRect)); //非大中华区域判断
          if (!isInAboard) {
            isInAboard = this.isInRectList(newLog, newLat,this.aroundAboardRectList); //中国周边的国外国家，日韩，泰国，印度等地区判断
          }

          if (isInAboard) {
            ret = this.Aboard; //国外
          }
          else {
            var inInLand = this.isInRectList(newLog, newLat, this.chinaRectList);
            if (inInLand) {
              ret = this.Domestic; //国内
            }
          }

          return ret;
        }
      };
      LizardLite.requestCityInfo = function(callback, error, posCallback, posError, isAccurate, cityCallBack, cityErrorCallBack,isForceLocate,needBaidu){
        var handlePos = function(pos,isBaidu,callback){
          var lng = pos.coords.longitude;
          var lat = pos.coords.latitude;
          //判断是国内地址，并且不是百度定位的坐标，需要做百度坐标转换处理
          var ret = 1; //默认的region地址是国内的，所以默认使用高德地图
          if (lng && lat) {
            //判断是否是国内的经纬度
            ret = CtripGeoHelper.getCountry(lng, lat);
          }
          if(needBaidu){
            if(ret == 1){
              if(!isBaidu){
                //国内坐标，并且是gps定位成功
                LizardLite.tansformLongitude(lng, lat, function (tLng, tLat) {
                  callback(tLng,tLat,true,ret); //使用百度转换坐标
                },function(){
                  var pos = LizardLite.aMapToBMap(lng,lat); //使用自定义方法转换坐标
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
              var posG = LizardLite.bMapToAMap(lng,lat);
              callback(posG.lng,posG.lat,false,ret);
            }else{
              //直接返回google坐标
              callback(lng,lat,false,ret);
            }
          }
        };
        var successCallback = function (pos,isBaidu,isIp) {
          //+1……2014-09-04……JIANGJing
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
                pos = LizardLite.bMapToAMap(data.lng,data.lat);
                data.lng = pos.lng;
                data.lat = pos.lat;
                data.location = data.lng + "," + data.lat;
              }
              //+1……2014-09-04……JIANGJing
              if (typeof cityCallBack == 'function')
              {
                var cityModel = function(){
                  var url = 'http://m.ctrip.com/restapi/soa2/10398/json/LBSLocateCity';
                  var cityModel = LizardLite.Model(
                    {
                      url:url,
                      checkAuth:false,
                      param:{Longitude: lng, Latitude: lat, CountryName: data.country, ProvinceName: data.province, L1CityName: data.city, L2CityName: data.district, TownName: '', Language: 'CN'}
                    });
                  return cityModel;
                };
                cityModel().execute(function(data){
                  cityCallBack(data);
                }, function(err){
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
              if (error) {
                error();
              }
            };

            if (!isAccurate || isBaidu) { //add by byl  此处如果是用百度地图定位成功，不需要使用坐标转换
              LizardLite.requestMapAddress(lng, lat, locateSuccessCallback, locateErrorCallback,isBaidu);
            } else {
              if(ret == 1 && !isBaidu){
                //国内坐标但不是百度坐标时
                LizardLite.tansformLongitude(lng, lat, function (lng, lat) {
                  LizardLite.requestMapAddress(lng, lat, locateSuccessCallback, locateErrorCallback,true);
                }, function (err) {
                  //-1……2014-09-12……JIANGJing……区分错误
                  //locateErrorCallback(err);
                  //+2……2014-09-12……JIANGJing……重新定义错误响应
                  if (error) {
                    error();
                  }
                },8000,true);
              }else{
                LizardLite.requestMapAddress(lng, lat, locateSuccessCallback, locateErrorCallback,isBaidu);
              }
            }
          });
        };

        var errorCallback = function (err, msg) {
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
      var  geolocation = function(callback,error){
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
          var param = "ak=C2iS1Mz9E4zRORAUm6tT4qO7&coor=bd09ll";
          LizardLite.Utils.$.ajax({
            url : "//api.map.baidu.com/location/ip?"+param,
            dataType : 'jsonp',
            success : function (data) {
              if (data && data.status === 0) {
                var content = (data.content && data.content.point) || {};
                if(callback){callback(content.x,content.y,false,true);}
              } else {
                if(error){error();}
              }
            },
            error : function (e) {
              if(error){error(e);}
            },
            timeout : 8000
          });
        }
      };
      LizardLite.requestGeographic = function (callback, error, timeout) {
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
          geoDone.navigator = position;
          if (!isReturn && (geoDone.baidu.coords || geoDone.baidu.err)) { //百度定位完成，返回原生定位
            isReturn = true;
            callback(position);
          }
          return;
        };
        var errorCallback = function (err) {
          geoDone.navigator.err = true;
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
        geolocation(function(lng,lat,isMap,isIp){
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
      LizardLite.requestMapAddress = function (lng, lat, callback, error, timeout,isBaidu) {
        var ret = 1; //默认的region地址是国内的，所以默认使用高德地图
        if (lng && lat) {
          //判断是否是国内的经纬度
          ret = CtripGeoHelper.getCountry(lng, lat);
        }
        if(typeof timeout == 'boolean'){
          isBaidu = timeout;
          timeout = null;
        }
        if(ret == 1){
          if(!isBaidu){ //国内如果不是百度地址，需要转成百度地址
            var pos = LizardLite.aMapToBMap(lng,lat);
            lng = pos.lng;
            lat = pos.lat;
          }
          requestBMapAddress(lng, lat, callback, error, timeout);
        }else{
          requestGoogleAddress(lng, lat, callback, error, timeout);
        }
      };
      function requestBMapAddress(lng, lat, callback, error, timeout){
        var regionBaidu = '31.230393,121.473704';
        if (lng && lat) {
          regionBaidu = lat + encodeURIComponent(",") + lng;
        }
        var param = "ak="+AK + "&output=json"+"&pois=1"+"&location="+regionBaidu;
        var url = "//api.map.baidu.com/geocoder/v2/?"+param;
        var _success = function(data){
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
          if (error) {
            error(e);
          }
        };
        LizardLite.Utils.$.ajax({
          url: url,
          dataType: 'jsonp',
          success: _success,
          error: _error,
          timeout: timeout || 8000
        });
      }
      function requestGoogleAddress(lng, lat, callback, error, timeout){
        var region = '31.230393,121.473704';
        if (lng && lat) {
          region = lat +  encodeURIComponent(",") + lng;
        }
        var param = "latlng="+region + "&sensor=false";
        var urls = [('https://maps.googleapis.com/maps/api/geocode/json?' + param),
          ('//ditu.google.cn/maps/api/geocode/json?language=zh-CN&' + param)
        ];
        var _success = function(data){
          if (!!~issuccess.indexOf("true")) {
            return;
          }
          issuccess.push("true");
          var district,city,province,addressComponent;
          var country = "";
          var countryShortName = "";
          var detailAddress = "";
          if (data && data.status === 'OK') {
            if (!data.results) {
              return false;
            }
            //从第一个详细地址中获取国家省市区信息
            var detailAdress = data.results[0] || {};
            addressComponent = detailAdress.address_components || {};
            for(var pro in  addressComponent){
              var item = addressComponent[pro];
              var politicalName = item && item.long_name;
              if (item.types) {
                //国家
                if (item.types[0] == 'country' && item.types[1] == 'political') {
                  country = politicalName;
                  countryShortName = item.short_name;
                }
                //省级、州级
                if (item.types[0] === 'administrative_area_level_1' && item.types[1] === 'political') {
                  province = politicalName;
                }
                //城市
                if (item.types[0] === 'locality' && item.types[1] === 'political') {
                  city = politicalName;
                }
                //县级
                if (item.types[0] === 'administrative_area_level_2' && item.types[1] === 'political') {
                  district = politicalName;
                }
                //区（此级别和上面的县级只能取一个，暂定取sublocality）
                if (item.types[0] === 'sublocality_level_1' && item.types[1] === 'sublocality') {
                  district = politicalName;
                }
              }
            }
            if ((typeof city != "string") && typeof province == "string") {
              city = province;
            }
            if (country === '' && province === '' && city === '' && district === '') {
              return false;
            }
            return callback({
              'address' : detailAdress.formatted_address ,
              'location' : lng + "," + lat,
              'info' : addressComponent,
              'city' : city,
              'province' : province,
              'district' : district,
              'lng' : lng,
              'lat' : lat,
              'country' : country,
              'countryShortName' : countryShortName,
              'detailAddress':detailAddress
            });
          } else {
            return false;
          }

        };
        var _error = function(e){
          if (!!~issuccess.indexOf("true")){
            return;
          }
          if (!~issuccess.indexOf("false")) {
            issuccess.push("false");
            return;
          }
          if (error) {
            error(e);
          }
        };
        var issuccess =[];
        for(var urlindex =0;urlindex<urls.length;urlindex++) {
          LizardLite.Utils.$.ajax({
            url: urls[urlindex],
            dataType: 'json',
            success: _success,
            error: _error,
            timeout: timeout || 8000
          });
        }
      }
      //目前只支持转国内百度的坐标,原生定位的只能使用这种方式转
      LizardLite.tansformLongitude = function(lng, lat, callback, error, timeout,isGPS){
        var param = "coords="+ lng + encodeURIComponent(",") + lat + "&ak=" + AK + "&output=json" + "&from=" + ( isGPS ? 1 : 3);
        LizardLite.Utils.$.ajax({
          url : "//api.map.baidu.com/geoconv/v1/?" + param,
          dataType : 'jsonp',
          success : function (data) {
            if (data && data.status === 0) {
              var result = (data.result && data.result[0]) || {};
              if(callback){callback(result.x,result.y);}
            } else {
              if(error){error();}
            }
          },
          error : function (e) {
            if(error){error(e);}
          },
          timeout : timeout || 8000
        });
      };
      //高德转成百度
      LizardLite.aMapToBMap = function(lng,lat){
        var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
        var x = lng,y=lat;
        var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
        var  theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
        return {
          lng:z * Math.cos(theta) + 0.0065,
          lat:z * Math.sin(theta) + 0.006
        };
      };
      //百度转成高德
      LizardLite.bMapToAMap = function(lng,lat){
        var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
        var x = lng - 0.0065,
          y = lat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
        var  theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
        return {
          lng : z * Math.cos(theta),
          lat : z * Math.sin(theta)
        };
      };
  }
  LizardLite.requestAMapKeyword = function (keywords, city, callback, error, timeout) {
    var param;
    param = "query=" + keywords + "&region=" + city + "&ak=" + AK + "&scope=2" + "&output=json";
    LizardLite.Utils.$.ajax({
      url : "https://api.map.baidu.com/place/v2/search?"+param,
      dataType : 'jsonp',
      success : function (data) {
        if (data && data.status === 0 && data.message == "ok") {
          var results = (data.results) || [];
          if(callback){callback(results);}
        } else {
          if(error){error();}
        }
      },
      error : function (e) {
        if(error){error(e);}
      },
      timeout : timeout || 8000
    });
  };

})(window.LizardLite);