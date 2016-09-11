/**
 * Created by chen on 16/5/24.
 */
import {CRNBridge as caller} from './ctrctbridge.js';

export default {
    /**
     * 拨打电话号码
     * @param phone
     */
    callPhone(phone) {
        caller.callNative("Call", "makeCall", {"phoneNumber":phone});
    },
    /**
     *
     * @param url
     * @param pageTitle
     */
    openURL(url, pageTitle):void{
        caller.callNative("URL", "openURL", {"url":url, "title":pageTitle});
    },
    /**
     *
     * @param module
     * @param methodName
     * @param params
     */
    callNative(module, methodName, params){
        caller.callNative(module, methodName, params);
    },
    sendUBT(key, value){

    }
}