/**
 * @version: 1.0.0 beta
 * @date 2016/5/27
 * @author lixn<lixn@ctrip.com>
 */

/**
 * UBT FOR RN mixin
 *
 * 统一Native APP 及 UBT JS SDK 接口， 方便BU通过一套代码调用UBT接口发送数据
 *
 *
 * 数据发送规则：
 *
 *  1. 如果有props.pageid， componentDidMount的时候发送PV数据
 *  2. 默认pageid值为wait，componentWillReceiveProps的时候触发PV发送，在有pageid值的前提下
 *
 * 示例：
 *
 * -------------------CODE Example------------------
 *
    import UBT from "./UBTMixin.jsx";

 *
 */


// import {CRNBridge as caller} from './ctrctbridge.js'
import Bridge from './Bridge/Bridge';
//var caller = {
//    callNative: function(){
//        console.log(arguments);
//    }
//}


var m = {
    validName: function(o){
        return typeof o === 'string' && o.length < 100;
    },

    isNumeric: function(o){
        return o === null ? false : (isNaN(parseFloat(o)) ? false : true);
    }
}


var ubt = {
    actions: {
        'send': true,
        'set': true,
        'get': true
    },

    sendPage: function(pageId, options){
        debugger;
        if(pageId == 'wait' || !pageId){
            return;
        }

        var param = {
            page: pageId,
            info: options
        }
        debugger
        console.log(param);
        Bridge.callNative('Log', 'logPage', param);
    },

    sendTrace: function(name, info){
        if(!m.validName(name)){
            return 0;
        }

        var param = {
            traceName: name,
            userInfo: info
        }

        Bridge.callNative('Log', 'logTrace', param);
        return 1;
    },

    /**
     *
     * @param {String} name
     * @param {Number} value
     * @param {JSON} info
     */
    sendMetric: function(name, value, info){
        if(typeof name == 'object'){
            value = name.value;
            info = name.info;
            name = name.name;
        }

        if(!m.validName(name)){
            return 0;
        }

        if(!m.isNumeric(value)){
            return 0;
        }

        var param = {
            metricName: name,
            metricValue: value,
            userInfo: info
        };
        Bridge.callNative('Log', 'logMetric', param);
        return 1;
    },

    /**
     *
     * @param {string} name
     * @param {number} value
     * @param {JSON} info
     */
    sendMonitor: function(name, value, info){
        if(typeof name == 'object'){
            value = name.value;
            info = name.info;
            name = name.name;
        }

        if(!m.validName(name)){
            return 0;
        }

        if(!m.isNumeric(value)){
            return 0;
        }

        var param = {
            monitorName: name,
            monitorValue: value,
            userInfo: info
        }

        Bridge.callNative('Log', 'logMonitor', param);
        return 1;
    },

    /**
     *
     * @param {string} name
     * @param {json} info
     */
    sendClick: function(name, info){
        if(!typeof name != 'string'){
            return 0;
        }

        var param = {
            code: name,
            info: info
        }
        Bridge.callNative('Log', 'logMonitor', param);
    }

}


var UBTMixin = {

    componentDidMount(){
        // debugger;
        var pageId = this.props.pageId;
        ubt.sendPage(pageId);

    },

    componentWillReceiveProps(nextProps){
        if(nextProps.pageId != this.props.pageId){
            ubt.sendPage(nextProps.pageId);
        }
    },

    ubt: function(action, type, options){

        if(ubt.actions[action] && typeof type === 'string' && type.length > 1) {

            var fn = action + type[0].toUpperCase() + type.substring(1);

            if(typeof ubt[fn] === 'function') {
                var args = Array.prototype.slice.call(arguments, 2);
                ubt[fn].apply(ubt, args);
                return true;
            }
        }

        return false;
    }
}

export default UBTMixin;
