/**
 * Created by mikejay on 16/4/27.
 */
import React, {
    AsyncStorage
    } from 'react-native';

class cUtilCommon{
    constructor(){}
    static isFunction(obj){
        return typeof obj === 'function';
    }
    static isUrl(url) {
        return /^http(s)?:\/\/[A-Za-z0-9\-]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\:+!]*([^<>])*$/.test(url);
    }
    static async getGuid(){
         await AsyncStorage.setItem('GUID',"222222");
         let guid =  await AsyncStorage.getItem('GUID');

        return guid;
    }
    static isObj(obj) {
        return Object.prototype.toString.call(obj) != "[object Object]" && obj != null && obj != obj.window && Object.getPrototypeOf(obj) == Object.prototype;
    }
    static isArray(object){
        Array.isArray || function(object){ return object instanceof Array };
    }

    static isString(obj){
        return toString.call(obj) == '[object ' + 'String' + ']';
    }

    static isEmpty(obj) {
        if (obj == null) return true;
        if (cUtilCommon.isArray(obj) || cUtilCommon.isString(obj)) return obj.length === 0;
        for (var key in obj) if (cUtilCommon.has(obj, key)) return false;
            return true;
    }

    static has(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    };

    static extend (target){
        function _extend(target, source, deep,self) {
            for (var key in source)
                if (deep && (self.isObj(source[key]) || self.isArray(source[key]))) {
                    if (self.isObj(source[key]) && !self.isObj(target[key]))
                        target[key] = {}
                    if (self.isArray(source[key]) && !self.isArray(target[key]))
                        target[key] = []
                    _extend(target[key], source[key], deep,self);
                }
                else if (source[key] !== undefined)
                {
                    target[key] = source[key];
                }
        };
        var deep, args = [].slice.call(arguments, 1),self=this;
        if (typeof target == 'boolean') {
            deep = target;
            target = args.shift()
        }
        args.forEach(function(arg){
            _extend(target, arg, deep,self)
        });
        return target;
    }

}



module.exports=cUtilCommon;
