﻿define(function(){
  
  /**
   * @class CtripGeoHelper provided by vzxg
   * @description Geo 获取国内外API
   * @brief Geo 获取国内外API
   */
  var CtripGeoHelper = {

    /**
     * @brief 国外
     * @description  国外
     * @type Int
     * @property Aboard
     * @author jimzhao
     */
    Aboard:2,

    /**
     * @brief 国内(包含港澳台)
     * @description  国内(包含港澳台)
     * @type Int
     * @property Domestic
     * @author jimzhao
     */
    Domestic:1,

    /**
     * @brief 未知国内外
     * @description  未知国内外，需要发送谷歌API确定
     * @type Int
     * @property Unknown
     * @author jimzhao
     */
    Unknown:-1,

    /**
     * @brief 中国周边国家经纬度范围
     * @description  中国周边国家经纬度范围，主要是日韩，泰国，新德里等
     * @type Array<Rect>
     * @property aroundAboardRectList
     * @author jimzhao
     */
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

    /**
     * @brief 中国国内按板块经纬度范围
     * @description  中国国内按板块经纬度范围，被分为60多个矩阵
     * @type Array<Rect>
     * @property chinaRectList
     * @author jimzhao
     */
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

    /**
     * @brief 大中华区域矩形框，包含日韩，泰国，印度，蒙古部分区域
     * @description  中国国内按板块经纬度范围，被分为60多个矩阵
     * @type Rect
     * @property largeChinaRect
     * @author jimzhao
     */
    largeChinaRect:[73083331, 54006559, 135266195, 17015367],

    /**
     * @brief 是否在矩形范围内
     * @description  是否在矩形范围内
     * @param {long} iLong 精度，long类型，乘以了1000000
     * @param {long} iLat 纬度，long类型，乘以了1000000
     * @param {Array} rectArr 矩形框的左上，右下两个点的左边，数组类型，rect
     * @return {Boolean} 是否在矩形框内
     * @method isInRect
     * @author jimzhao
     */
    isInRect:function(iLong, iLat, rectArr) {
        if ( (iLong >= rectArr[0] && iLong <= rectArr[2]) &&
         (iLat >= rectArr[3] &&  iLat <= rectArr[1]) ) {
          return true;
        }
        return false;
    },

    /**
     * @brief 是否在一组矩形框范围内
     * @description  是否在一组矩形框范围内
     * @param {long} iLong 精度，long类型，乘以了1000000
     * @param {long} iLat 纬度，long类型，乘以了1000000
     * @param {Array<Rect>} rectArrList  一组坐标的矩形框，rect
     * @return {Boolean} 是否在一组坐标矩形框内
     * @method isInRectList
     * @author jimzhao
     */
    isInRectList:function(iLong, iLat, rectArrList) {
        for (var i = 0,smallRect; i < rectArrList.length - 1; i++) {
            smallRect = rectArrList[i];
            if (this.isInRect(iLong, iLat,smallRect)) {
                return true;
            }
        }

        return false;
    },

    /**
     * @brief 获取国内外标识
     * @description 获取国内外标识， 返回为未知时候，请使用Google 逆地址API发送请求，根据google返回，确定国家.
     * @param {float} longitude 精度，定位获取
     * @param {float} latitude 纬度，定位获取
     * @return {Int}  Unknown=-1/Domestic=1/Aboard=2,未知，国内，国外
     * @method getCountry
     * @author jimzhao
     * @example

        japanRet = CtripGeoHelper.getCountry(130.460979,31.665179);
        if (japanRet == CtripGeoHelper.Domestic) {
            //TODO:国内
        } else if (japanRet == CtripGeoHelper.Aboard) {
            //TODO:国外
        } else {
            //TODO未知:send API request to Google, 根据国家代码确定国家
            //API－－－－ http://ditu.google.cn/maps/api/geocode/json?latlng=37.332331410000002,-122.0312186
        }
     */
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
  
  return CtripGeoHelper;
});