'use strict';

import React,{
	NativeModules
} from 'react-native';

var caller = NativeModules.CRNNativeCall;
// import {CRNNativeCall as caller} from 'NativeModules'

export var CRNBridge = {
	callNativeWithCallback : function(moduleName, functionName, parameters, callback) {
		caller.callNativeWithCallback(moduleName, functionName, parameters, callback);
	},
	
	callNative : function(moduleName, functionName, parameters) {
		caller.callNative(moduleName, functionName, parameters);
	}
};
