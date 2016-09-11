/**
 * @file c.shell
 * @desc 
 * 提供跨平台的底层应用程序接口。
 *
 * @namespace cShell
 * @author jiangjing@ctrip.com
 *
 * @dependon $ zepto.js
 * @dependon _ underscore.js
 */
define([], function() {

	// 每个功能函数可以有三个可选的关联方法（注意，不是强制的）：
	// pre  = 当功能被调用时执行，可以处理参数
	// post = 当功能调用成功时执行
	// fail = 当功能调用失败后执行
	var _METHOD = [
	/**
	 * @method detectDevice
	 * @memberof cShell
	 *
	 * @param {Function}        onsuccess             调用成功回调函数
	 * @param {Function}        onerror               调用失败回调函数
	 *
	 * @return {Promise}
	 *
	 * @example
	 * --ONSUCCESS PARAMS--
	 *   {Object}               device
	 *   {String}               device.networkType    网络类别：2g, 3g, 4g, wifi
	 *
	 * --ERROR STRING--
	 *   canceled
	 */
		'detectDevice',

	/**
	 * @method scanBarcode
	 * @memberof cShell
	 *
	 * @param {Function}        onsuccess             调用成功回调函数
	 * @param {Function}        onerror               调用失败回调函数
	 *
	 * @return {Promise}
	 *
	 * @example
	 * --ONSUCCESS PARAMS--
	 *   {String}               barcode               扫描得到的条形码编号
	 *
	 * --ERROR STRING--
	 *   canceled
	 */
		'scanBarcode',

	/**
	 * @method scanQrcode
	 * @memberof cShell
	 *
	 * @param {Function}        onsuccess             调用成功回调函数
	 * @param {Function}        onerror               调用失败回调函数
	 *
	 * @return {Promise}
	 *
	 * @example
	 * --ONSUCCESS PARAMS--
	 *   {String}               qrcode                扫描得到的二维码编号
	 *
	 * --ERROR STRING--
	 *   canceled
	 */
		'scanQrcode',

	/**
	 * @method share
	 * @memberof cShell
	 *
	 * @param {Function}        onsuccess             调用成功回调函数
	 * @param {Function}        onerror               调用失败回调函数
	 * @param {Object}          options
	 * @param {String}          options.title         标题
	 * @param {String}          options.desc          描述
	 * @param {String}          options.href          链接地址
	 * @param {String}         [options.icon   ]      分享图标
	 * @param {String}         [options.type   ]      分享类型
	 * @param {String}         [options.src    ]      分享资源地址
	 *
	 * @return {Promise}
	 *
	 * @example
	 * --ONSUCCESS PARAMS--
	 *   <NIL>
	 *
	 * --ERROR STRING--
	 *   canceled
	 */
		{
			name : 'share',

			pre  : function() {
				return arguments;
			},

			post : function(res) {
				return res;
			},

			fail : function(err) {
			}
		},

	/**
	 * @method voice2text
	 * @memberof cShell
	 *
	 * @param {Function}        onsuccess             调用成功回调函数
	 * @param {Function}        onerror               调用失败回调函数
	 *
	 * @return {Promise}
	 *
	 * @example
	 * --ONSUCCESS PARAMS--
	 *   {String}               text                  文本
	 *
	 * --ERROR STRING--
	 *   canceled
	 */
		'voice2text',
		'uploadimage'

	];

	var _SUPPORTED_APP = {
		CTRIP_MASTER  : 1,
		TECENT_WEIXIN : 1
	};

	var _ERR_UNAVAILABLE = new Error('unavailable');



	// @class _Deferred
	// @desc 简化版 Deferred 对象，参考 http://Api.jquery.com/category/deferred-object/
	function _Deferred(promiseTo) {
		var
			I = this,
			handlers = {},
			status,
			response,
			DONE = 1,
			FAIL = 0;

		var doFire = function(eventName, args) {
			status = eventName;
			response = args;
			doExec(eventName);
		};

		var doExec = function(eventName) {
			if (eventName == status) {
				var handler = handlers[eventName];
				if (handler) handler.apply(null, response);
			}
		};

		I.done = function(handler) {
			handlers[DONE] = handler;
			doExec(DONE);

			// 注意：因为本方法可能被其他对象（通常是 Deferred 对象的宿主）代理，
			// 为保持代理者的链式传承，此处必须返回 this 而不是 I。
			return this;
		};

		I.fail = function(handler) {
			handlers[FAIL] = handler;
			doExec(FAIL);

			// 注意：因为本方法可能被其他对象（通常是 Deferred 对象的宿主）代理，
			// 为保持代理者的链式传承，此处必须返回 this 而不是 I。
			return this;
		};

		I.resolve = function() {
			doFire.call(null, DONE, arguments);
			return I;
		};

		I.reject = function() {
			doFire.call(null, FAIL, arguments);
			return I;
		};

		// 由指定对象代理定义响应函数的方法
		if (promiseTo) {
			promiseTo.done = I.done;
			promiseTo.fail = I.fail;
		}
	};

	// 创建一个方法函数。
	function _Fn(method){

		// 方法主体函数
		function Fn() {
			args = method.pre? method.pre.apply(null, arguments) : arguments;
			return _ME.doCall(method.name, 'run', args);
		};

		// 附属可用性判别函数，支持链式表达式。
		Fn.ping = function() {
			return _ME.doCall(method.name, 'ping', arguments);
		};

		return Fn;
	}

	var _ME = {

		// 指向实体 API 方法集
		// methods: undefined,

		// 标志实体 API 是否就绪
		// ready: false,

		// 标志实体 API 装载错误
		// error: undefined

		// 调用栈，用于在实体 API 未就绪前保存所有调用信息
		calls: [],

		doCall: function(name, type, args) {
			var onsuccess, onerror, options;
			// args 支持如下八种排列组合：
			// {Object  } options  , {Function} onsuccess, {Function} onerror
			// {Object  } options  , {Function} onsuccess
			// {Object  } options
			// {Function} onsuccess, {Function} onerror  , {Object  } options
			// {Function} onsuccess, {Function} onerror
			// {Function} onsuccess, {Object  } options
			// {Function} onsuccess
			// （空）

			if (typeof args[0] == 'object') {
				options   = args[0];
				onsuccess = args[1];
				onerror	  = args[2];
			}
			else {
				onsuccess = args[0];
				if (typeof args[1] == 'object') {
					options = args[1];
					onerror = args[2];
				}
				else {
					onerror = args[1];
					options = args[2];
				}
			}

			var
				P = {},

				D = new _Deferred(P),

				ondone = function(ret) {
					onsuccess && onsuccess(ret);
					D.resolve(ret);
				},

				onfail = function(err) {
					onerror && onerror(err);
					D.reject(err);
				},

				args = [ ondone, onfail, options ];

			// 如果 API 已就绪，直接执行相关方法。
			if (_ME.ready) _ME.doExec(name, type, args);

			// 如果 API 初始化已失败，则直接执行失败回调。
			else if (_ME.error) onfail(_ME.error);

			// 否则将调用信息放入队列。
			else _ME.calls.push({
					name : name ,
					type : type ,
					args : args
				});

			return P;
		},

		// 在确保平台相关 API 已加载成功的前提下，执行功能调用。
		// 该前提有两个标志：
		// ⑴ _ME.ready == true
		// ⑵ _ME.methods == <VENDOR>.METHOD
		doExec: function(name, type, args) {
			var
				method = _ME.methods[name],

			// args 是已经过规范化处理的参数序列，依次为：onsuccess, onerror, options
				ondone = args[0], onfail = args[1],

				err, func;

			// 平台 API 功能定义规范化
			// ......
			// 一般情况下，平台 API 应提供如下格式的功能定义：
			//     <functionName> : { run: Function, ping: Function }
			// 其中，ping 可选。
			// 如果未按上述格式提供，而是直接提供一个函数作为功能定义：
			//  　  <functionName> : Function
			// 则此处作规范化处理。
			if (typeof method == 'function') method = { run: method };

			// 无功能定义，或有功能定义却无执行方法（run）的情形：
			if (!method || !method.run) onfail && onfail(new Error('unavailable'));

			else (func = method[type])
				? func.apply(null, args)
				// 试图执行 ping 却未定义 ping 方法时，默认执行成功回调。
				// 如果没有定义成功回调函数，那么这事就算完了！
				: ondone && ondone();
		}
	};

	// 对各平台提供的 API 进行封装的类
	// 命名格式为 cShell_<VENDOR_NAME>
	var fullname = [ Lizard.app.vendor, Lizard.app.code ].join('_');
	var exports = {};

	if (_SUPPORTED_APP[fullname]) require(['cShell_' + fullname], function(vendor) {
		vendor
			// 注册初始化成功时的回调函数
			.ready(function() {
				// 变更状态
				_ME.ready = true;
				delete _ME.error;

				_ME.methods = vendor.METHOD;

				var call;
				while (call = _ME.calls.shift()) {
					_ME.doExec(call.name, call.type, call.args);
				}
			})
			// 注册发生错误（包括当不限于初始化错误）时的回调函数
			.error(function(err) {
				// @todo
				// 变更状态
				_ME.ready = false;
				_ME.error = _ERR_UNAVAILABLE;

				var call;
				while (call = _ME.calls.shift()) {
					// 执行失败回调函数
					call.args[1](_ME.error);
				}
			})
			// 执行初始化
			.init();
	});
	// 不支持当前 APP 平台的处理策略
	else {
		// 变更状态
		_ME.ready = false;
		_ME.error = _ERR_UNAVAILABLE;
	}

	exports["weixin"] = function (apicallback) {
		if (_SUPPORTED_APP[fullname]) {
			require(['cShell_' + fullname], function (vendor) {
				vendor.init(apicallback);
			});
		} else {
			return;
		}
	};

	// 初始化方法集
	_METHOD.forEach(function(method) {
		if (typeof method == 'string') method = { name: method };
		exports[method.name] = _Fn(method);
	});

	return exports;
});

