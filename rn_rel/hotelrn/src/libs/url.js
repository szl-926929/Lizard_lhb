//http://172.20.31.6:8081/index.android.bundle?platform=android&dev=true&CRNModuleName=hotelrn&CRNType=1&hideHeader=True
import {URL,Env} from '@ctrip/crn';
function getenv(callback) {

      // 判断环境，留着native给接口
      Env.getEnv(function resultCallback(statusInfo, msg){

          var env = 'fws';

          var preproduction = msg && msg.isPreProduction; //容错；

          var networkstatus = msg && msg.networkStatus || "None"; //暂时不使用。没有网络登录时会提示

          switch(preproduction){
              case '0':
                  env = "fat";
                  break;
              case '2':
                  env = "uat";
                  break;
              default :
                  env = "fws";
                  break;
          };

          callback(env);
      });
}
export class HotelURL{
  static openURL(url,title,flg){
    if(flg){
      URL.openURL(url,title);
      return;
    }
    getenv(function (env) {
      switch(env){
        case 'fat':
          URL.openURL(url.replace(/m\.ctrip\.com/ig,'w-hotel-m.fat9.qa.nt.ctripcorp.com'),title);
          break;
        case 'uat':
          URL.openURL(url.replace(/m\.ctrip\.com/ig,'m.uat.qa.nt.ctripcorp.com'),title);
          break;
        default :
          URL.openURL(url,title);
      }
    })

  }

  static getServiceHost() {
    return new Promise((resolve, reject) =>{
      getenv(function (env) {
        switch(env){
          case 'fat':
            resolve({
              domain:'http://gateway.m.fws.qa.nt.ctripcorp.com',
              subEnv: 'fat9',
            });
            break;
          case 'uat':
            resolve({domain :'http://gateway.m.uat.qa.nt.ctripcorp.com'});
            break;
          default :
            resolve({domain:'http://m.ctrip.com'});
        }
      })
    })
  }
}
