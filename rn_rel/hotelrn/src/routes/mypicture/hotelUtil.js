'use strict';


  import {
  App,
  Fetch,
  User,
  Env,
  Bridge,
} from '@ctrip/crn';

import React from 'react-native'

var caller = React.NativeModules.CRNNativeCall;
var requestUrl = 'http://m.ctrip.com/restapi/soa2/10933/hotel/product/picturelist';

var HotelUtil = {
   goToImgDetail : function (params,index) {     
		caller.callNative("Hotel", "goToImgDetail",{"imgList":params,'index':index});
	},
  goToHotel : function (hotel) {
		caller.callNative("Hotel", "goToHotel",{"hotel":hotel});
	},

  getenv(callback) {

    // 判断环境，留着native给接口
    Env.getEnv(function resultCallback(statusInfo, msg) {

      var env = 'fws';

      var preproduction = msg && msg.isPreProduction; //容错；

      var networkstatus = msg && msg.networkStatus || "None"; //暂时不使用。没有网络登录时会提示

      switch (preproduction) {
        case '0':
          env = "fat";
          break;
        case '2':
          env = "uat";
          break;
        default:
          env = "fws";
          break;
      };

      callback(env);
    });
  }
}


export default HotelUtil;
