/**
 * Created by mikejay on 16/5/5.
 */

class cUtilObject{
    constructor(){

    }
    Obj(){
        let tpobj ={};
        return tpobj;
    }


    static createObject(){
        return new cUtilObject();
    };
    /**
     * @description 设置对象某个路径上的值
     * @method Util.cUtilObject.set
     * @param {object} obj
     * @param {string} string
     * @param {object|array|int} value
     * @returns {object}
     */
    set(obj, path, value) {
        if (!path){
            return null;
        }

        var array = path.split('.');

        obj = obj || {};

        for (var i = 0, len = array.length, last = Math.max(len - 1, 0); i < len; i++) {
            if (i < last) {
                obj = (obj[array[i]] = obj[array[i]] || {});
            } else {
                obj[array[i]] = value;
            }
        }

        return obj;
    }

    /**
     * @description 获得对象在某个路径上的值
     * @method Util.cUtilObject.get
     * @param {object} obj
     * @param {string} path
     * @returns {object}
     */
    get(obj, path) {
        if (!obj || !path){
            return null;
        }

        var array = path.split('.');

        obj = obj || {};

        for (var i = 0, len = array.length, last = Math.max(len - 1, 0); i < len; i++) {
            obj = obj[array[i]];

            if (obj === null || typeof obj === 'undefined') {
                return null;
            }
        }

        return obj;
    }


}


module.exports=cUtilObject;
