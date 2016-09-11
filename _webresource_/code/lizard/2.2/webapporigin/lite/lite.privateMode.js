/**
 * Created by bianyl on 2016/5/23.
 */
/**
 * Created by bianyl on 2016/4/28.
 */
(function(LizardLite){
  if(!LizardLite){return;}
  LizardLite.isPrivateModel = (function(){
    var testKey = "TEST_PRIVATE_MODEL",
      storage = window.localStorage;
    try{
      storage.setItem(testKey,1);
      storage.removeItem(testKey);
    }catch(e){
      // QuotaExceededError: DOM Exception 22
      //todo 需要判断无痕模式下的error 暂时先不处理
      return true;
    }
    return false;
  })();
  if(!LizardLite.isPrivateModel){
    return;
  }
  var defkey = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-"];
  function getCLKey() {
    var key =  LizardLite.Utils.getCookie("_lizard_LZ");
    if (key) {
      return key;
    }
    var nKey = defkey.sort(function(){ return 0.5 - Math.random()}).join("");
    LizardLite.Utils.setCookie("_lizard_LZ", nKey, new Date(new Date().getTime() + 3 * 360 * 24 * 60 * 60 * 1000), "/", ".ctrip.com");
    return nKey;
  }
  var LZ = {
    keyStrUriSafe : getCLKey(),
    baseReverseDic : {},

    getBaseValue : function (alphabet, character) {
      if (!this.baseReverseDic[alphabet]) {
        this.baseReverseDic[alphabet] = {};
        for (var i = 0; i < alphabet.length; i++) {
          this.baseReverseDic[alphabet][alphabet.charAt(i)] = i;
        }
      }
      return this.baseReverseDic[alphabet][character];
    },

    //compress into a string that is already URI encoded
    compress : function (input) {
      if (input == null)
        return "";
      var _this = this;
      return _this._compress(input, 6, function (a) {
        return _this.keyStrUriSafe.charAt(a);
      });
    },

    //decompress from an output of compressToEncodedURIComponent
    decompress : function (input) {
      if (input == null)
        return "";
      if (input == "")
        return null;
      var _this = this;
      input = input.replace(/ /g, "+");
      return _this._decompress(input.length, 32, function (index) {
        return _this.getBaseValue(_this.keyStrUriSafe, input.charAt(index));
      });
    },

    _compress : function (uncompressed, bitsPerChar, getCharFromInt) {
      if (uncompressed == null)
        return "";
      var i,
        value,
        context_dictionary = {},
        context_dictionaryToCreate = {},
        context_c = "",
        context_wc = "",
        context_w = "",
        context_enlargeIn = 2, // Compensate for the first entry which should not count
        context_dictSize = 3,
        context_numBits = 2,
        context_data = [],
        context_data_val = 0,
        context_data_position = 0,
        ii;

      for (ii = 0; ii < uncompressed.length; ii += 1) {
        context_c = uncompressed.charAt(ii);
        if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
          context_dictionary[context_c] = context_dictSize++;
          context_dictionaryToCreate[context_c] = true;
        }

        context_wc = context_w + context_c;
        if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
          context_w = context_wc;
        } else {
          if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
            if (context_w.charCodeAt(0) < 256) {
              for (i = 0; i < context_numBits; i++) {
                context_data_val = (context_data_val << 1);
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
              }
              value = context_w.charCodeAt(0);
              for (i = 0; i < 8; i++) {
                context_data_val = (context_data_val << 1) | (value & 1);
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
                value = value >> 1;
              }
            } else {
              value = 1;
              for (i = 0; i < context_numBits; i++) {
                context_data_val = (context_data_val << 1) | value;
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
                value = 0;
              }
              value = context_w.charCodeAt(0);
              for (i = 0; i < 16; i++) {
                context_data_val = (context_data_val << 1) | (value & 1);
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
                value = value >> 1;
              }
            }
            context_enlargeIn--;
            if (context_enlargeIn == 0) {
              context_enlargeIn = Math.pow(2, context_numBits);
              context_numBits++;
            }
            delete context_dictionaryToCreate[context_w];
          } else {
            value = context_dictionary[context_w];
            for (i = 0; i < context_numBits; i++) {
              context_data_val = (context_data_val << 1) | (value & 1);
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }

          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
          // Add wc to the dictionary.
          context_dictionary[context_wc] = context_dictSize++;
          context_w = String(context_c);
        }
      }

      // Output the code for w.
      if (context_w !== "") {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
          if (context_w.charCodeAt(0) < 256) {
            for (i = 0; i < context_numBits; i++) {
              context_data_val = (context_data_val << 1);
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
            }
            value = context_w.charCodeAt(0);
            for (i = 0; i < 8; i++) {
              context_data_val = (context_data_val << 1) | (value & 1);
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          } else {
            value = 1;
            for (i = 0; i < context_numBits; i++) {
              context_data_val = (context_data_val << 1) | value;
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = 0;
            }
            value = context_w.charCodeAt(0);
            for (i = 0; i < 16; i++) {
              context_data_val = (context_data_val << 1) | (value & 1);
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
          delete context_dictionaryToCreate[context_w];
        } else {
          value = context_dictionary[context_w];
          for (i = 0; i < context_numBits; i++) {
            context_data_val = (context_data_val << 1) | (value & 1);
            if (context_data_position == bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }

        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
      }

      // Mark the end of the stream
      value = 2;
      for (i = 0; i < context_numBits; i++) {
        context_data_val = (context_data_val << 1) | (value & 1);
        if (context_data_position == bitsPerChar - 1) {
          context_data_position = 0;
          context_data.push(getCharFromInt(context_data_val));
          context_data_val = 0;
        } else {
          context_data_position++;
        }
        value = value >> 1;
      }

      // Flush the last char
      while (true) {
        context_data_val = (context_data_val << 1);
        if (context_data_position == bitsPerChar - 1) {
          context_data.push(getCharFromInt(context_data_val));
          break;
        } else
          context_data_position++;
      }
      return context_data.join('');
    },

    _decompress : function (length, resetValue, getNextValue) {
      var f = String.fromCharCode;
      var dictionary = [],
        next,
        enlargeIn = 4,
        dictSize = 4,
        numBits = 3,
        entry = "",
        result = [],
        i,
        w,
        bits,
        resb,
        maxpower,
        power,
        c,
        data = {
          val : getNextValue(0),
          position : resetValue,
          index : 1
        };

      for (i = 0; i < 3; i += 1) {
        dictionary[i] = i;
      }

      bits = 0;
      maxpower = Math.pow(2, 2);
      power = 1;
      while (power != maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb > 0 ? 1 : 0) * power;
        power <<= 1;
      }

      switch (next = bits) {
        case 0:
          bits = 0;
          maxpower = Math.pow(2, 8);
          power = 1;
          while (power != maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
          }
          c = f(bits);
          break;
        case 1:
          bits = 0;
          maxpower = Math.pow(2, 16);
          power = 1;
          while (power != maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
          }
          c = f(bits);
          break;
        case 2:
          return "";
      }
      dictionary[3] = c;
      w = c;
      result.push(c);
      while (true) {
        if (data.index > length) {
          return "";
        }

        bits = 0;
        maxpower = Math.pow(2, numBits);
        power = 1;
        while (power != maxpower) {
          resb = data.val & data.position;
          data.position >>= 1;
          if (data.position == 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
          }
          bits |= (resb > 0 ? 1 : 0) * power;
          power <<= 1;
        }

        switch (c = bits) {
          case 0:
            bits = 0;
            maxpower = Math.pow(2, 8);
            power = 1;
            while (power != maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;
              if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }
              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }

            dictionary[dictSize++] = f(bits);
            c = dictSize - 1;
            enlargeIn--;
            break;
          case 1:
            bits = 0;
            maxpower = Math.pow(2, 16);
            power = 1;
            while (power != maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;
              if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }
              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }
            dictionary[dictSize++] = f(bits);
            c = dictSize - 1;
            enlargeIn--;
            break;
          case 2:
            return result.join('');
        }

        if (enlargeIn == 0) {
          enlargeIn = Math.pow(2, numBits);
          numBits++;
        }

        if (dictionary[c]) {
          entry = dictionary[c];
        } else {
          if (c === dictSize) {
            entry = w + w.charAt(0);
          } else {
            return null;
          }
        }
        result.push(entry);

        // Add w+entry[0] to the dictionary.
        dictionary[dictSize++] = w + entry.charAt(0);
        enlargeIn--;

        w = entry;

        if (enlargeIn == 0) {
          enlargeIn = Math.pow(2, numBits);
          numBits++;
        }

      }
    }
  };
  var origin = window.location.origin;
  var hostKey = LZ.compress(origin);
  var reg = /@@##([\S]+)##@@/g;
  var MemoryStorage = {
    dataMap : {}, //当前域名下的localstorage对象
    _storage:{},//最终存入window.name的对象
    whiteList:[
      "PAYMENT2_","SALESOBJ","SALES_OBJECT","UNION","SALES","USER","USERINFO",
      "AUTHSTORE","HEADSTORE","PAUTH","C_CLEAR_OVERDUE_CATCH","memory_store",
      "MC_INDEX_RED_POINT_TIME","SOURCEID","SEL_POST_CITY_DATA","BANK_INFO_LIST","edit_POST_CITY_DATA",
      "CAR_POST_CITY_DATA","Wechat_CityList_Proto","Wechat_CityList_Category","Wechat_CityList_HisHot",
      "Wechat_CityList_Words","Wechat_SelectedCity","PRIZE_BOOKINGSTATE","PRIZE_BOOKINGINFO"
    ],
    init:function(){
      var compressSt = window.name.match(reg);
      if(compressSt){
        compressSt = compressSt[0].replace("@@##","").replace("##@@","");
        try{
          MemoryStorage._storage = JSON.parse(compressSt);
        }catch(e){
          console.log("初始化无痕模式数据失败");
        }
        if(hostKey && MemoryStorage._storage && MemoryStorage._storage[hostKey]){ //非无痕模式下,不用care  window.name
          var hostObj = MemoryStorage._storage[hostKey];
          for(var cKey in hostObj){
            if (hostObj.hasOwnProperty(cKey)){
              var key = LZ.decompress(cKey);
              var val = LZ.decompress(hostObj[cKey]);
              MemoryStorage.dataMap[key] = val;
            }
          }
        }
      }
    },
    setItem : function(key,val){
      MemoryStorage.dataMap[key] = val;
      MemoryStorage._reSetName(key,val);
    },
    getItem: function(key){
      return MemoryStorage.dataMap[key];
    },
    removeItem :function(key){
      delete MemoryStorage.dataMap[key];
      MemoryStorage._reSetName(key);
    },
    clear :function(){
      //clear方法只有无痕模式下才会调用
      var tempMap = {},tempCMap = {};
      var itemFun = function(pro,v){
        _.each(MemoryStorage.whiteList,function(t){
          if(pro.indexOf(t) !=  -1){
            var cKey = LZ.compress(pro);
            tempMap[pro] = v;
            tempCMap[cKey] = LZ.compress(v);
          }
        });
      };
      for(var pro in MemoryStorage.dataMap ){
        var v = MemoryStorage.dataMap[pro];
        itemFun(pro,v);
      }
      MemoryStorage.dataMap = tempMap;
      if(hostKey){
        MemoryStorage._storage[hostKey] = tempCMap;
      }
      MemoryStorage._reSetName();
    },
    __clearAll:function(){
      MemoryStorage.dataMap = {};
      if(hostKey){
        MemoryStorage._storage[hostKey] = {};
      }
      MemoryStorage._reSetName();
    },
    _reSetName :function(key,val){
      if(Lizard.isPrivateModel && hostKey){ //此处添加无痕判断，只有无痕浏览时，才放到window.name中
        if(!MemoryStorage._storage[hostKey]){
          MemoryStorage._storage[hostKey] = {};
        }
        var cKey = LZ.compress(key),cValue = null;
        if(key && val){ //表示塞数据
          cValue = LZ.compress(val);
          MemoryStorage._storage[hostKey][cKey] = cValue;
        }else if(key){ //没有val默认删除数据
          delete MemoryStorage._storage[hostKey][cKey];
        }
        try{
          //搞成单个处理，不搞全量
          window.name = "@@##" + JSON.stringify(MemoryStorage._storage) + "##@@";
        }catch(e){
          console.log("绑定window.name 失败！！");
        }
      }
    }
  };


})(window.LizardLite);