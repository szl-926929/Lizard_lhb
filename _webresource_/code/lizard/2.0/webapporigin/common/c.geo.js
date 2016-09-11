/**
 * @file c.service.map
 * @desc 
 * 提供定位与地理信息查询服务。
 *
 * @namespace Service.cGeo
 * @author jiangjing@ctrip.com
 *
 * @dependon $ zepto.js
 * @dependon _ underscore.js
 */
define(['cHybridShell', '_', '$'], function(Hish) {
	'use strict';

	// 地图供应商
	var _VENDOR = {

		// 高德地图
		AMAP: {

			// 授权密钥
			KEY: '0b895f63ca21c9e82eb158f46fe7f502'
		},

		// 谷歌地图
		GOOGLE: {
			KEY: undefined
		}
	};

	var _ME = {
		Array: function(something) {
			var ret = [];

			if (something instanceof _Set)
				something.forEach(function(item) { ret.push(item); });

			if (something instanceof Array)  
				ret = something;

			if (typeof something == 'string' && something.length)
				ret = something.split(/[,;]/);

			return ret;
		},

		// 克隆对象
		clone: function foo(something, deep) {
			var copy = new something.constructor;
			_.each(something, function(value, key) {
				if (deep && !_ME.isScalar(value)) 
					copy[key] = foo(value, deep);
				else 
					copy[key] = value;
			})
			return copy;
		},

		// 创建并返回类的实例。
		// 键值对将被扩展至该实例。
		create: function(klass, params) {
			return _.extend(new klass(), params);
		},

		// 创建一个私有成员变量寄存器。
		// @return Function
		// @example
		// var _P = createPrivateRegister();
		// function klass() {
		//     _P(this).privateMember
		// }
		//
		// 提供读写私有成员的途径。
		// ......
		// 如何实现对象成员的私有化，一直是我们试图在 JavaScript 中实践面向对象编程时的一大障碍。
		// Douglas Crockford 曾把 JavaScript 中广义的对象成员归纳为三类：
		//     public / private / priviliged
		// 其中 private / privileged 都是依据闭包原理实现的。最违和的一点是，prototype 成员方法无法访问这些“私有”或“特权”成员。
		// ......
		// 本方法参考了 Philip Walton 的实现，但是不能确定系其原创。
		createPrivateRegister: function() {
			// WeakMap 系 ECMAScript 6.0 中提出的概念，实际上就是支持以矢量为索引的 Key-Value 存储结构。
			// 虽然现代浏览器均已支持 WeakMap，但为了保险起见，我们还是决定用传统的方法来实现。
			// | var map = new WeakMap();
			// | return function(handler) {
			// | 	if (!map.has(handler)) map.set(handler, {});
			// | 	return map.get(handler);
			// | }

			var handlers = [], privates = [];
			return function(handler) {
				var index = handlers.indexOf(handler);
				if (index < 0) {
					handlers.push(handler);
					privates.push({});
					index = handlers.length - 1;
				}
				return privates[index];
			}
		},

		// 生成一个唯一编号。
		// @question UID or UUID ?
		genUid: (function() {
			var init = (new Date).getTime();
			
			return function() {
				// 一个特立独行的前缀，极力了避免与其他渠道生成的 ID 冲突。
				return '_$^$_' + init++;
			}
		})(),

		// 返回第一个非假的参数值，如均非真，则返回最后一个参数值（比如 0 或 ''）。
		// 辅助方法，仅供本模块内部为简化代码使用。
		// 
		// @defect 如果以表达式为参数，则必须先运行表达式。牺牲性能简化代码，牺牲微不足道，简化亦微不足道，孰是孰非？
		ifEmpty: function() {
			for (var i = 0, args = arguments; i < args.length - 1; i++) if (args[i]) return args[i];
			return args[i];
		},

		// 返回第一个有值（!== undefined）的参数值，如均无值，则返回最后一个参数值（比如 0 或 ''）。
		// 辅助方法，仅供本模块内部为简化代码使用。
		ifUndefined: function() {
			for (var i = 0, args = arguments; i < args.length - 1; i++) if (args[i] !== undefined) return args[i];
			return args[i];
		},

		// IF judger(a)
		//     RETURN a 
		// ELSE
		//     RETURN b
		// 辅助方法，仅供本模块内部为简化代码使用。
		ifElse: function(a, b, judger) {
			return judger(a) ? a : b;
		},

		// 对 _.invoke() 的补强，使其能支持 _Set 对象。
		invoke: function() {
			arguments[0] = _ME.Array(arguments[0]);
			return _.invoke.apply(_, arguments);
		},

		// 判断是否标量
		isScalar: function(n) {
			// return ['undefined', 'string', 'number', 'boolean'].indexOf(typeof n) >= 0;
			return ['object', 'function'].indexOf(typeof n) < 0;
		},

		// 加载第三方脚本
		loadJS: (function() {
			var scripts = {};

			return function(/*String*/ src, /*OPTIONAL Function*/ callback) {
				var script = scripts[src];
				
				if (!script) {
					script = { loaded: 0, callbacks: [] };

					document.write = _Agent.documentWrite;
					document.write('<script src="' + src + '"><\/script>');
					document.write('', null, function() {
						script.loaded = 1;
						script.callbacks.forEach(function(callback) {
							callback();
						});
					});
				}

				if (callback) 
					if (script.loaded) callback();
					else script.callbacks.push(callback);
			}
		})(),

		// 执行错误回调的快捷方法
		onerror: function(callback, msg) {
			callback && callback(new _Error(msg));
		},

		// hash: {
		//     put: function(/*object*/ hash, /*Array*/ keys, value) {
		//         var key = keys.pop(), item;
		//         while (item = keys.shift()) {
		//             if (!hash[item]) hash[item] = {};
		//             hash = hash[item];
		//         }
		//         hash[key] = value;
		//     },

		//     get: function(/*object*/ hash, /*Array*/ keys) {
		//         var key = keys.pop(), item;
		//         while (item = keys.shift()) {
		//             if (!hash) return;
		//             hash = hash[item];
		//         }
		//         return hash[key];
		//     }
		// },

		// 根据实参查找匹配的方法，并执行之。
		// 这是函数（类）多态的一个轻量级实现，不支持参数可选、特殊参数（如 undefined）等功能。
		// @example
		// overload([
		//     [
		//         Number,
		//         function(n) { // ...
		//         }		
		//     ],
		//     [
		//         String,
		//         function(s) { // ...
		//         }
		//     ],
		//     [
		//         Array,
		//         function(arr) { // ... 
		//         }
		//     ],
		//     function() { // 缺省函数放末尾 
		//         }
		// ], args, scope)
		overload: (function() {
			var Type = function(judger) {
				if (!(this instanceof Type)) return new Type(judger);
				this.match = function(value) { return judger(value); };
			};

			var ERR = new Error('Incorrect overload defintion.');

			function test(type, arg) {
				// 如果形式参数表中该位置是 Type 实例，则执行判别方法。
				if (type instanceof Type) 
					try { return type.match(arg); } catch(ex) { return false; }

				// 如果形参为一个构造函数，则比较实参的构造函数是否与其相同
				else if (type.constructor == Function) 
					return (arg && arg.constructor == type);

				// for UC ONLY, in UC:
				// HTMLElement.constructor != Function
				// HTMLElement.constructor == Object
				else if (typeof type == 'function')
					return (arg instanceof type);

				// 如果形参为一个数组，则比较实参是否与数组中的任意一个形参匹配。
				else if (type instanceof Array) {
					var found = false;
					_.find(type, function(type) {
						return found = test(type, arg);
					});
					return found;
				}
				
				// 如果形参为一个标量，则比较实参的值与形参是否相同
				else if (_ME.isScalar(type))
					return arg === type;
				
				else 
					throw ERR;
			}
			
			var overload = function(/*Array[Array]*/ definitions, /*Object ARGUMENTS*/ args, /*Object POINTER*/ scope) {
				var ret;
				_.find(definitions, function(def) {
					var fn, match = true;

					// 允许定义缺省函数，该函数应当放在定义的末尾。
					if (_.isFunction(def)) fn = def;

					// 普通的方法定义应当是一个数组
					else if (_.isArray(def)) {

						fn = _.last(def);

						var l = def.length - 1;
						
						// 参数表长度检查
						if (args.length != l) return false;

						// 参数类型核对
						for (var i = 0; i < l && match; i++) match = test(def[i], args[i]);
					}

					else throw ERR;

					// 如果实参与形参全部匹配，则执行该函数，并返回 true 以终止后续的匹配操作。
					if (match) return ret = fn.apply(scope, args), true;
				});

				// @todo 若没有匹配的多态方法，这里应抛出一个异常。

				return ret;
			};

			_.extend(overload, {
				Type: Type,

				Function:  function(definitions) {
					if (arguments.length > 1) definitions = arguments;
					return function() {
						return overload(definitions, arguments);
					};
				}
			});

			return overload;
		})(),

		time: function() {
			return (new Date).getTime();
		},

		// 时间参数归一化：将代表时间的字符串转换成单位为毫秒的数值
		time2ms: function foo(time, defaultValue) {
			if (typeof time == 'string' && time.match(/^(\d+(\.\d+)?)([a-z]+)$/)) {
				var times = {
					ms : 1    ,    // 毫秒  MicroSecond
					s  : 1e3  ,    // 秒    Second
					m  : 6e4  ,    // 分钟  Minute
					h  : 36e4 ,    // 小时  Hour
					d  : 864e5     // 天    Day
				};

				time = window.parseFloat(RegExp.$1) * _ME.ifEmpty(times[RegExp.$3], 1);
			}
			
			if (time != window.Infinity) time = window.parseInt(time);

			if (window.isNaN(time)) return defaultValue ? foo(defaultValue) : 0;
			else return time;
		},

		// 时间参数归一化（可同时处理多个值）
		times2ms: function(options, defaults) {
			options = _ME.ifEmpty(options, {});

			// 仅处理参数组（options）中
			_.each(defaults, function(value, name) {
				options[name] = _ME.time2ms(options[name], value);
			});

			return options;
		},

		end: 1
	};

	// 本对象中所有方法均供借代，不得直接调用！
	var _Agent = {

		// @lends 仅供借代
		documentWrite: (function() {
			
			// 阅读本节注释和代码时，务必区分“节点”与“元素”。对任意节点：
			// children 仅包含子元素；
			// childNodes 包含元素节点和文本节点。

			var 
				// 状态，标志当前是否有写入操作在执行。
				/*Boolean*/ dwstatus, 
				
				// 待写入堆，由子队列组列，每个子队列由若干对象组成。
				/*Array[ [{ html: String, scritp: Element }] ]*/ heap = [], 
				
				// 执行上一个写入操作的脚本标签
				/*Element(Script)*/ lastScript,
				
				// 将节点的子节点全部移除，并按原顺序保存至一个独立数组中。	
				extractNodes = /*Array(Node)*/ function(/*Element*/ node) {
					var arr = [], subnode;

					while (subnode = node.childNodes[0]) {

						// 移除子节点

						// UC-浏览器不支持 HTMLScriptElement.remove()
						// subnode.remove(1);
						node.removeChild(subnode);

						// 保存至数组
						arr.push(subnode);
					}

					// 返回提取到的子节点数组。
					// 注意：这是一个数组（Array）对象，而非节点列表（NodeList）对象。
					return arr;
				},

				// 实现同步写入操作
				syncWrite = function foo(/*Element*/ container, /*Array*/ nodes, /*OPTIONAL Function*/ callback) {			
					var node, suspend = false, subnodes;
					
					// 将节点从数组中依 FIFO 顺序移出。
					while (node = nodes.shift()) {

						if (node.children && node.children.length) {
							
							// 如果存在子元素，则须递归以确保内部的脚本标签按正确的方式加载。
							suspend = true;

							// 移除所有子节点，保存至独立数组备用。
							subnodes = extractNodes(node);			
						}

						// <script></script> 节点如果直接加载，包含或引用的脚本将不会被执行，
						// 故必须通过 document.createElement 方法单独创建。
						else if (node.nodeName == 'SCRIPT') {

							// 创建一个新的 SCRIPT 对象，以使标签加载时能动态执行脚本。
							var script = document.createElement('SCRIPT');

							// 该属性不适用于内联脚本。			
							// script.async = false;

							// 判断 SCRIPT 标签是否引用了脚本文件。
							// src 属性优先级高于 textContent 属性，如果标签指定了 src 属性，则标签内的内联脚本（即使有也）将被忽略。
							if (node.src) {

								// 脚本加载完成之前，后续的加载操作将暂时挂起。				
								suspend = true;

								// 脚本加载完成时，触发后续的加载操作。
								script.onload = function() {
									foo(container, nodes, callback);
								};
								
								script.src = node.src;
							}

							// 对于内联脚本，直接复制其内容。
							else script.textContent = node.textContent;

							// 将变量指向新创建的脚本元素，以备加载。
							node = script;
						}

						// 加载节点
						container.appendChild(node);

						// 如果当前节点包含子元素，则执行递归调用，逐个加载子节点。
						if (subnodes)
							foo(node, subnodes, function() {
								foo(container, nodes, callback);
							});

						// 挂起意味着本次方法执行结束
						if (suspend) return;
					}

					callback && callback();
				};

			return function foo(/*String*/ html, /*OPTIONAL Element*/ container, /*OPTIONAL Function*/ callback) {

				// 如果有写入操作尚未完成，则放入队列。
				if (dwstatus) {
					
					var 
						currentScript = document.currentScript,
						snippet = { html: html, callback: callback };

					// 如果堆为空，或者当前脚本元素（也即执行本次 document.write 语句的脚本元素）有变化，创建一个空的子队列，并将放入堆中。
					// 当前脚本执行完毕后，随即实施由当前脚本中的 document.write 语句提交的内容的写入操作。
					// 采用堆（FILO）的目的是为了在多层 document.write 嵌套的情形下，生成的 DOM 结构及脚本的执行顺序仍能符合预期。
					if (!heap.length || currentScript != lastScript) heap.unshift([]);
					
					// 记录当前脚本元素，供下次比对。
					lastScript = currentScript;

					// 脚本元素本身不能作为容器，取其父元素作为容器。
					if (currentScript) snippet.container = currentScript.parentNode;

					// 由同一脚本写入的内容，以队列（FIFO）的形式存放。
					heap[0].push(snippet);
				}

				// 执行写入操作
				else {

					// 指示当前正在执行写入操作
					dwstatus = 1;

					// 将 HTML 转化为节点树
					var box = document.createElement('div');
					box.innerHTML = html;

					syncWrite(
						// 确定容器
						container || (document.currentScript && document.currentScript.parentNode) || document.body, 
						
						// 获取待写入节点数组
						extractNodes(box), 

						// 本次写入完成回调，接力执行后续写入操作。
						function() {
							dwstatus = 0;

							callback && callback();

							if (heap[0]) {

								// 子队队首出队
								var snippet = heap[0].shift();

								// 堆首出堆
								if (!heap[0].length) heap.shift();

								// 递归执行下一个 document.write 操作。
								foo(snippet.html, snippet.container, snippet.callback);
							}
						}
					);
				}
			};
		})(),

		// @lends 仅供借代
		// | queryCity: function(onsuccess, onerror, options) {
		// | 	var params;
		// | 
		// | 	options = _ME.ifEmpty(options, {});
		// | 
		// | 	// 超时设置
		// | 	options.timeout = _ME.time2ms(options.timeout, window.Infinity);
		// | 
		// | 	if (this instanceof Coordinate) 
		// | 		params = {
		// | 			Longitude : this.longitude,
		// | 			Latitude  : this.latitude
		// | 		};
		// | 
		// | 	// 除了依坐标查询规范化城市信息外，还有其他查询需求吗？
		// | 
		// | 	var ajaxOnsuccess = function (data) {
		// | 		if (data && data.CityEntities) {
		// | 			var city, entity;
		// | 			while (entity = data.CityEntities.pop()) {
		// | 				city = _ME.create(City, { 
		// | 					id     : entity.CityID, 
		// | 					name   : entity.CityName,
		// | 					parent : city
		// | 				});
		// | 			}
		// | 			onsuccess(city);
		// | 		}
		// | 	};
		// | 
		// | 	var ajaxOptions = {
		// | 		type     : 'POST',
		// | 		data     : params,
		// | 		url      : 'http://m.ctrip.com/restApi/soa2/10398/json/LBSLocateCity',
		// | 		success  : ajaxOnsuccess,
		// | 		error    : function(xhr, errorType) { _ME.onerror(onerror, errorType); }
		// | 	};
		// | 	if (Number.isFinite(options.timeout)) {
		// | 		ajaxOptions.timeout = options.timeout;
		// | 	}
		// | 	var xhr = $.ajax(ajaxOptions);
		// | 
		// | 	return {
		// | 		abort: function() { xhr.abort(); }
		// | 	};
		// | },

		// @lends 仅供借代
		setting: function(name, /*OPTIONAL*/ value) {

		}
	};

	// @class _Deferred 
	// @desc 简化版 Deferred 对象，参考 http://Api.jqueryc.om/category/deferred-object/
	var _Deferred = function(promiseTo) {
		var I = this, handlers = {};

		var fire = function(eventName, args) {
			var handler = handlers[eventName];

			if (handler) 
				handler.apply(null, args); 
			
			return this;
		};

		I.done = function(handler) {
			handlers['done'] = handler;

			// 注意：因为本方法可能被其他对象（通常是 Deferred 对象的宿主）代理，
			// 为保持代理者的链式传承，此处必须返回 this 而不是 I。
			return this;
		};

		I.fail = function(handler) {
			handlers['fail'] = handler;

			// 注意：因为本方法可能被其他对象（通常是 Deferred 对象的宿主）代理，
			// 为保持代理者的链式传承，此处必须返回 this 而不是 I。
			return this;
		};

		I.resolve = function() {
			fire.call(null, 'done', arguments);
			return I;
		};

		I.reject = function() {
			fire.call(null, 'fail', arguments);
			return I;
		};

		// 由指定对象代理定义响应函数的方法
		if (promiseTo) {
			promiseTo.done = I.done;
			promiseTo.fail = I.fail;
		}
	};

	// 对 DOM 操作的简易封装
	var _DOM = {
		remove: function(element) {
			// Why NOT invoke element.remove() directly?
			// Because UC does not support such operation.
			element.parentNode.removeChild(element);
		}
	};

	var _Error = (function() {
		var ERRORS = {
			0: 'unknown',

			// 1: PositionError.PERMISSION_DENIED
			1: 'denied',

			// 2: PositionError.POSITION_UNAVAILABLE
			2: 'unavailable',

			// 3: PositionError.TIMEOUT
			3: 'timeout',

			// 自定义异常
			4: 'abort'
		};

		// 根据代码生成错误对象
		var ret = function(code) {
			if (code instanceof Error) return code;

			if (_.isNumber(code)) return new Error(ERRORS[code]);

			return new Error(code);
		};

		_.extend(ret, {

			// 将高德的错误信息转换为相应的错误对象
			Ajax: function(err) {
				switch (err) {
					case 'error':
						return ret(2);

					case 'timeout':
						return ret(3);

					default:
						return ret(0);
				}
			},

			// 将 PositionError 对象转换为相应的错误对象
			Position: function(err) {
				return new ret(ERRORS[err.code]);
			},

			// 将 APP 定位错误信息转换为相应的错误对象
			AppLocate: function(err) {
				console.log('Error.AppLocate', err);
			}
		});

		return ret;
	})();

	// 通用浏览器
	var _HOST_UA = {
		coordinate: function(onsuccess, onerror, options) {
			// 参数初始化
			options = _ME.times2ms(options, {
				timeout: '35s',
				maximumAge: '10m'
			});
			options.enableHighAccuracy = _ME.ifUndefined(options.enableHighAccuracy, true);

			try {
				var 
					geo = window.navigator.geolocation,

					cancel = function() {
						geo.clearWatch(watchId);
					},

					abort = function() {
						cancel();

						// Error 4 means abort.
						_ME.onerror(onerror, 4);
					},

					// 使用 watchPosition() 代替 getCurrrentPosition() 是为了支持中止功能
					// P.S. 事实上，clearWatch() 并不能中断已经开始的定位动作，这一作法是无效的。
					watchId = geo.watchPosition(
						// on success
						function(position) {
							cancel();
							onsuccess && onsuccess(new Coordinate(position));
						},

						// on error
						function(err) {
							cancel();
							_ME.onerror(onerror, _Error.Position(err));
						},

						// options
						options
					);

				return { abort: abort };
			}
			catch (ex) {
				// 当前运行环境不支持 window.navigator.geolocation 对象。

				// Error 2 means unavailable.
				_ME.onerror(onerror, _Error(2));

				//--No.1--
				// 作 Error 为返回值时，表明这是一个预料之中的结果，是可控的，应由程序进行后续处理,
				// 故其信息应极简略，具备区分度足矣，细节可用文档形式加以说明。
				// 与之相反的情形，参见注释 No.2

				return { abort: function() {} };
			}
		},

		address: function(onsuccess, onerror, options) {
			// 参数初始化
			options = _ME.times2ms(options, { 
				timeout: '35s',
				maximumAge: '10m'
			});

			// 创建计时器
			var T = new _Timer(options.timeout);

			// S-1 取得坐标
			var _RUNNER_ = this.coordinate(function(coordinate) {

				// S-2 根据坐标逆编码，取得地址
				_RUNNER_ = _MapWS('REVERT_GEOCODING', { coordinate: coordinate }, onsuccess, onerror, { timeout: T.ttl });

			}, onerror, options);

			return { abort: function() { _RUNNER_.abort(); } };
		},

		city: function(onsuccess, onerror, options) {
			// 参数初始化
			options = _ME.times2ms(options, { 
				timeout: '35s',
				maximumAge: '10m'
			});

			// 创建计时器
			var T = new _Timer(options.timeout);

			// S-1 取得坐标
			var _RUNNER_ = this.coordinate(function(coordinate) {

				// S-2 根据坐标反查得到所在城市
				_RUNNER_ = coordinate.queryCity(onsuccess, onerror, { timeout: T.ttl });

			}, onerror, options);

			return { abort: function() { _RUNNER_.abort(); } };	
		}
	};

	// APP
	var _HOST_APP = {
		coordinate: function(onsuccess, onerror, options) {
			options = _ME.ifEmpty(options, {});
			options.timeout = _ME.time2ms(options.timeout, '35s');
			options.maximumAge = _ME.time2ms(options.maximumAge, '10m');

			/*--
				http://jimzhao2012.github.io/api/classes/CtripMap.html#method_app_locate
			    设置timeout<=1或者timeout>=60,都会默认设置为15s
			--*/
			// 为了避免误解，如果使用者试图设置不被接受的超时参数，我们强制抛出异常。
			if (options.timeout <= 1e3 || options.timeout > 6e4)
				throw 'Service.cGeo._.coordinate failed: timeout exceeds (1 ~ 59 seconds allowed)';

			Hish.Fn('locate').once(function(params, err) {

				/*--
					http://jimzhao2012.github.io/Api/classes/CtripMap.html
					a.(-201)定位未开启
					b.(-202)获取经纬度失败
					c.(-203)定位超时
					d.(-204)逆地址解析失败
					e.(-205)获取Ctrip城市信息失败
				--*/
				// Hish 已经将错误信息封装为规范的 Error 对象，形为 { message: '', number: code }。
				if (err) 
					_ME.onerror(onerror, err);

				else if (['geo', 'address'].indexOf(params.type) >= 0)
					onsuccess(
						new Coordinate(
							parseFloat(params.value.lng), 
							parseFloat(params.value.lat)
						)
					);

			}).run(
				// timeout（单位：秒）
				options.timeout / 1e3,

				// isNeedCtripCity
				false,

				// isForceLocate
				options.maximumAge == 0

				// sequenceId
			);
		},

		address: function(onsuccess, onerror, options) {
			options = _ME.ifEmpty(options, {});
			options.timeout = _ME.time2ms(options.timeout, '35s');
			options.maximumAge = _ME.time2ms(options.maximumAge, '10m');
			
			if (options.timeout <= 1e3 || options.timeout > 6e4)
				throw 'Service.cGeo._.address failed: timeout exceeds (1 ~ 59 seconds allowed)';

			// 由于 Native 层提供的 locate 方法会不定次回调，故此处须用 on 而不是 once 定义监听函数。
			Hish.Fn('locate').on(function foo(params, err) {

				if (err)
					_ME.onerror(onerror, err);

				else if (params.type == 'address') {
					var info = {};
					info[ Address.SCALE.PROVINCE ] = params.value.province;
					info[ Address.SCALE.CITY     ] = params.value.city;
					info[ Address.SCALE.DISTRICT ] = params.value.district;
					info[ Address.SCALE.UNKNOWN  ] = params.value.addrs.replace();
					onsuccess(new Address(info));
				}

			}).run(
				// timeout（单位：秒）
				options.timeout / 1e3,

				// isNeedCtripCity
				false,

				// isForceLocate
				options.maximumAge == 0

				// sequenceId
			);
		},

		// @todo
		city: function(onsuccess, onerror, options) {

		}
	};

	// 判断当前宿主
	var _HOST = (Lizard.app.code.is('MASTER') || Lizard.app.code.is('YOUTH')) ? _HOST_APP : _HOST_UA;
	
	// 类定义工具，提供“先定义，先使用，后实现”的类模式。
	var _Klass = (function() {
		var 
			// 按 klassName: [ instance, ... ] 的形式保存所有的实例相关信息（不仅是实例句柄）。
			instances = {},

			// 按 klassName: constructor 的形式保存所有的类骨骼。
			defines = {}, 

			// 按 klassName: constructor 的形式保存所有的填充类。
			klasses = {},

			// @replacedby _ME.genUid()
			// nameIndex = 0,
			// getUname = function() {
			// 	return nameIndex++;
			// },

			// 创建一个类实例
			// 该方法的原始作者是 Matthew Crumley
			construct = function(/*Function*/ constructor, /*Array*/ args) {
			    function F() {
			        return constructor.apply(this, args);
			    }
			    F.prototype = constructor.prototype;
			    return new F();
			},

			ret;

		return ret = {

			construct: construct,

			// 所谓类骨骼，它有两层含义：
			// ⑴ 它不是传统意义上的接口，因为它是一个真正的类，可以被实例化；
			// ⑵ 它不是传统意义上的类，因为在被实现之前，对其实例的所有成员方法的调用均不产生实际效果。
			// 由于类的填充是异步完成的，因此类骨骼成员仅支持异步方法，不支持包括同步方法在内的其他形式的成员变量。
			// ......
			// 搭建类骨骼（类似但不等同于“接口定义”）
			scaffold: /*Function*/ function(/*String*/ klassName, /*OPTIONAL Array(String)*/ methodNames, /*OPTIONAL Function*/ onTact) {

				// 标记该类骨骼是否被使用
				var used = false;

				// 创建一个新类的同时，创建一个新的数组作为实例信息容器。
				instances[klassName] = [];

				return defines[klassName] = function() {

					// 初次使用时，触发指定方法。
					if (!used) {
						used = true;
						onTact && onTact(klassName);
					}

					// 如果类填充已经完成，则直接引用填充类。
					if (klasses[klassName]) return construct(klasses[klassName], arguments);

					var 
						I = this,

						// 实例信息对象，包括实例句柄及成员方法有序调用队列。
						instance = {
							// 填充完成后的实例句柄
							handler: undefined,

							// 构造函数参数组
							args: arguments,

							// 成员方法（包括构造函数）有序调用队列。
							invokes: []
						};

					_.each(methodNames, function(name) {
						I[name] = function() {

							// 如果该类已经完成填充，则会创建一个相应的实例。
							var fn = instance.handler && instance.handler[name];

							// 调用填充完成后的实例的对应方法。
							if (fn) instance.handler[name].apply(instance.handler, arguments)

							// 将调用信息附加至队列。								
							else instance.invokes.push({ name: name, args: arguments });

							return this;
						};
					});

					// 将实例信息添加到容器中。
					instances[klassName].push(instance);

					return I;
				};
			},

			// 填充类骨骼（类似但不等同于“类的实现”）
			flesh: function(/*String*/ klassName, /*OPTIONAL Function*/ constructor, /*OPTIONAL Object*/ methods) {

				// 必须先定义（创建类骨骼），而后才能填充。
				if (!defines[klassName]) 
					throw new Error('Klass should be SCAFFOLD-ed before be FLESH-ed.');

				// 不允许重复填充。
				if (klasses[klassName]) 
					throw new Error('Klass should NOT be FLESH-ed repeatedly.');
				
				klasses[klassName] = constructor;

				// 如果在填充时额外指定了成员方法（methods），则将其扩充其构造函数的原型上。
				// 对于类骨骼模式而言，这种设计并非必要，完全可以在填充后再扩充成员方法。
				// 在填充类骨骼时支持这一参数，只是为了书写方便而已。
				// if (methods) for ( var i in methods ) {
				// 	constructor.prototype[i] = methods[i];
				// }
				_.extend(constructor.prototype, methods);
				
				// 遍历该类骨骼的所有实例的相关信息
				instances[klassName].forEach(function(instance) {					
					// 创建实例
					var handler = construct(constructor, instance.args);

					// 执行调用队列
					instance.invokes.forEach(function(invoke) {

						var name = invoke.name;

						// 如果填充类骨骼时没有实现方法，应如何处理？暂时不作响应，亦不抛出异常。
						if (handler[name]) handler[name].apply(handler, invoke.args);
					});

					// 通过传递新的实例句柄，接管原实例。
					instance.handler = handler;
				});
			},

			// 创建一个依赖于特定资源的类。
			// 目前仅支持依赖单一脚本资源，因为解决对多项多种资源的依赖问题，需要一个额外的加载器。
			// 依赖参数（dependence）也可以是一个接受一个回调函数作为参数的函数。
			create: /*Function*/ function(/*String|Function*/ dependence, /*Function*/ constructor, /*OPTIONAL Array(String)*/ methods) {

				if (!methods) methods = [];

				_.extend(methods, constructor.prototype);

				var 
					klassName = _ME.genUid(),

					onTact = function() {
						var onDependenceReady = function() {
							// 执行类填充
							ret.flesh(klassName, constructor);
						};

						if (typeof dependence == 'function') {
							dependence(onDependenceReady);
						}
						else {
							// 加载资源
							_ME.loadJS(dependence, onDependenceReady);
						}
					};

				return ret.scaffold(klassName, methods, onTact);
			}
		};
	})();

	// P = Private / Protected
	var _P = _ME.createPrivateRegister();

	/**
	 * 对第三方 web service 进行简易封装。
	 * @access private 
	 * @param {String  }  type       服务类型
	 * @param {Object  }  params     查询条件参数组
	 * @param {Function}  onsuccess  查询成功的回调函数
	 * @param {Function} [onerror  ] 查询失败的回调函数
	 * @param {Object  } [options  ] 配置参数组
	 */ 
	// WS means Web-Service
	var _MapWS = function foo(type, params, onsuccess, onerror, options) {
		
		var VENDOR_EX, method;

		// 自动检测供应商
		_.find(foo._VENDOR_EX, function(EX) {
			VENDOR_EX = EX;
			return method = VENDOR_EX.method ? VENDOR_EX.method(type, params, options) : VENDOR_EX.METHODS[type];
		});

		// 如方法未实现，则反馈失败信息。
		if (!method) {
			// Error 2 means unavailable.
			onerror(_Error(2));
			return;
		}

		var 
			// RESTful Api 执行成功回调函数
			ajaxOnsuccess = function(data, status, xhr) {
				try {
					return onsuccess(method.parser.call(VENDOR_EX, data));
				}
				catch (ex) {
					// 如反馈结果不符合预期，均视为服务不可用（unavailable）。
					// Error 2 means unavailable.
					_ME.onerror(onerror, 2);
				}
			},

			// RESTful Api 执行失败回调函数
			ajaxOnerror = function(xhr, errorType) {				
				onerror && onerror(_Error.Ajax(errorType));
			};

		// 查询条件处理
		{
			// 初始化参数组
			var data = _.extend({}, VENDOR_EX.PARAMS, method.params);
			
			_.each(params, function(value, name) {
				var fn = VENDOR_EX.convert[name];

				// Find-and-Execute
				if (fn) _.extend(data, fn.call(VENDOR_EX, value))

				// 如未指定函数，则保留原始名值。
				else data[name] = value;
			});
		};

		// 配置参数处理
		{
			options = _ME.ifEmpty(options, {});
			options.timeout = _ME.time2ms(options.timeout, '8s');
		};

		// 如果超时时间已经为 0（在间接调用时，前一个操作可能已经耗尽了时间）
		// Error 3 means timeout.
		if (!options.timeout) onerror(_Error(3));
		else {
			// @see http://zeptojs.com/#$.ajax
			var ajaxOptions = {
				url      : VENDOR_EX.BASE + method.path,
				type     : VENDOR_EX.TYPE,
				data     : data,
				dataType : VENDOR_EX.DATATYPE,
				success  : ajaxOnsuccess,
				error    : ajaxOnerror,
				timeout  : options.timeout
			};
			
			// 执行查询
			var xhr = $.ajax(ajaxOptions);
		}

		return { 
			abort: function() { 
				if (xhr) {
					xhr.abort();

					// 强制退出时须执行回调
					// Error 4 means abort.
					_ME.onerror(onerror, 4);
				}
			} 
		};
	};

	_MapWS._VENDOR_EX = {

		// 携程自建服务（SOA）
		CTRIP: {

			BASE: 'http://m.ctrip.com/restapi/soa2/',

			DATATYPE: 'json',

			TYPE: 'POST',
			
			METHODS: {
				CITYCODING: {
					path   : '10398/json/LBSLocateCity',
					params : {},
					parser : function(data) {
						return this.revert.city(data);
					}
				}
			},

			// 转换函数集：本地 - 携程.SOA
			// 转换结果将作为 POST 参数，故：
			// ⑴ 返回值为哈希对象；
			// ⑵ 函数命名依本地；
			convert: {
				coordinate: function(coordinate, /*OPTIONAL*/ path) {
					return {
						Longitude : coordinate.longitude,
						Latitude  : coordinate.latitude
					};
				}
			},

			// 转换函数集：携程.SOA - 本地
			revert: {

				// 将<携程.SOA>返回的数据对象转换成本地 City 实例
				city : function(data) {
					var city, entity;
					if (data && data.CityEntities) {
						while (entity = data.CityEntities.pop()) {
							city = new City({ 
								id     : entity.CityID, 
								name   : entity.CityName,
								parent : city
							});
						}
					}
					if (!city) throw '.';
					return city;
				}
			}
		},

		// 高德提供的 web service 数据服务称为“云检索”。
		// @see http://lbs.amap.com/yuntu/reference/cloudsearch/
		AMAP: {

			// 高德 WS 根路径
			// 注意：这里使用的地址继承自 c.web.geolocation.js，这些方法在高德的官方公开文档中并无记录（或者是我们没有找到？）
			BASE: 'http://restapi.amap.com/v3/',

			DATATYPE: 'jsonp',

			PARAMS: {
				// 授权密钥
				key: _VENDOR.AMAP.KEY
			},
			
			METHODS: {
				REVERT_GEOCODING: {
					path   : 'geocode/regeo',
					params : { radius: 0, extensions: 'all' },
					parser : function(data) {
						return this.revert.regeocode2address(data.regeocode);
					}
				},

				COORDINATE_TRANSFORM: {
					path   : 'assistant/coordinate/convert',
					parser : function(data) {
						if (data.status == 1) throw '.';
						var coordinate = new Coordinate(data.locations);
						coordinate.system = Coordinate.SYSTEM.MARS;
						return coordinate;
					}
				},

				// 
				// 高德提供的“周边检索”与谷歌地图提供的“地方检索”类似。
				// 此外，高德还提供在指定城市行政区划范围的名称检索，称为“本地检索”。
				// 上述两种检索方式依赖不同的关键参数指示检索范围。
				// 
				//                  │ 供应商       
				//  方法名称        │ 术语         
				// ─────────────────┼────────────────
				//  place/text      │ 本地检索     
				//  place/around    │ 周边检索     
				//
				// 这些方法支持如下参数：
				//     page        ::= <Number>
				//     offset      ::= <Number>
				//     extensions  ::= "all"
				//     keyword
				//
				// place/around 的关键参数是：
				//     location    ::= <Number,Number>  
				//     raidus      ::= <Number>
				// 
				// place/text 的关键参数是：
				//     city		   ::= <Text>
				//     keywords    ::= <Text>	
				// 
				POIS_SEARCH_AROUND: {
					path   : 'place/around',
					params : { offset: 10, page: 1, radius: 500, extensions: 'all' },
					parser : function(data) {
						var pois = [], raw, i = 0;
						while (raw = data.pois[i++]) pois.push(this.revert.poi(raw));
						return pois;
					}
				},

				// 见前 ↑↑↑
				POIS_SEARCH_LOCAL: {
					path   : 'place/text',
					params : { offset: 10, page: 1, extensions: 'all' },
					parser : function(data) {
						return this.METHODS.POIS_SEARCH_AROUND.parser.call(this, data);
					}
				}
			},

			// 根据环境参数自动判断适用方法
			method: function(type, params, options) {
				if (type == 'POIS_SEARCH') {
					if (params.city) type = 'POIS_SEARCH_LOCAL';					
					if (params.coordinate) type = 'POIS_SEARCH_AROUND';
				}				
				return this.METHODS[type];
			},

			// 转换函数集：本地 - 高德
			// 转换结果将作为 GET 参数，故：
			// ⑴ 返回值为哈希对象；
			// ⑵ 函数命名依本地；
			convert: {
				coordinate: function(coordinate, /*OPTIONAL*/ path) {
					var system = {};
					system[Coordinate.SYSTEM.EARTH] = 'gps';

					// ... 
					// 是否支持其他坐标系的转换？

					return {
						// 在不同方法中，参数名未统一
						location  : coordinate.toString(),
						locations : coordinate.toString(),
						coordsys  : system[coordinate.system]
					};
				},

				name: function(name, /*OPTIONAL*/ path) {
					return { keywords: name };
				}
			},

			// 转换函数集：高德 - 本地
			revert: {

				// 将高德 POI 数据对象转换成本地 POI 实例
				poi: function(raw) {
					var 
						poiInfo = {},
						addressInfo = {};

					// 键值必须与 Address.SCALE 的枚举值严格对应				
					addressInfo[ Address.SCALE.UNKNOWN  ] = _ME.ifElse(raw.address  , '', _.isString);
					addressInfo[ Address.SCALE.DISTRICT ] = _ME.ifElse(raw.adname   , '', _.isString);
					addressInfo[ Address.SCALE.CITY     ] = _ME.ifElse(raw.cityname , '', _.isString);
					addressInfo[ Address.SCALE.PROVINCE ] = _ME.ifElse(raw.pname    , '', _.isString);
					var address = new Address(addressInfo); 
					if (address.valid) poiInfo.address = address;

					// 坐标
					if (raw.location) poiInfo.coordinate = new Coordinate(raw.location);

					// 其他信息
					_.extend(poiInfo, {
						name       : raw.name,
						phones     : raw.tel.length ? raw.tel.split(';') : [],
						tags       : raw.type.split(';')
					});
					return new POI(poiInfo);
				},

				// 将高德 regeocode 数据对象转换成本地 POI 实例
				regeocode2poi: function(geocode) {
					if (geocode.pois && geocode.pois.length) return this.poi(geocode.pois[0]);
				},

				// 将高德 regeocode 数据对象转换成本地 Address 实例
				regeocode2address : function(geocode) {
					var info = {};
					// 键值必须与 Address.SCALE 的枚举值严格对应					
					info[ Address.SCALE.PROVINCE ] = _ME.ifElse(geocode.addressComponent.province            , '', _.isString);
					info[ Address.SCALE.CITY     ] = _ME.ifElse(geocode.addressComponent.city                , '', _.isString);
					info[ Address.SCALE.DISTRICT ] = _ME.ifElse(geocode.addressComponent.district            , '', _.isString);
					info[ Address.SCALE.TOWN     ] = _ME.ifElse(geocode.addressComponent.township            , '', _.isString);
					info[ Address.SCALE.STREET   ] = _ME.ifElse(geocode.addressComponent.streetNumber.street , '', _.isString);
					info[ Address.SCALE.HOUSE    ] = _.isString(geocode.addressComponent.streetNumber.number) ? geocode.addressComponent.streetNumber.number + '号' : '';
					return new Address(info);
				}
			}
		},

		// GOOGLE: {
		// 	// 谷歌地图 WS 根路径
		// 	BASE: 'https://maps.googleapis.com/maps/api/',

		// 	DATATYPE: 'json',a

		// 	PARAMS: {
		// 		// 谷歌地图授权密钥
		// 		key: 'AIzaSyCGAuVCZqeUFSi7NzTTCSIoCHVF_vKHU0I'
		// 	},

		// 	// 方法配置信息
		// 	METHODS: {

		// 		REVERT_GEOCODING: {

		// 			// 方法路径
		// 			path   : 'geocode/json',

		// 			// 方法缺省参数组
		// 			// 根据 Google Maps API Web Service, Google Geocoding API (V3) 官方文档，支持的参数包括：
		// 			//     <address>
		// 			//     <latlng>       ::= <Number>,<Number>
		// 			//     <components>
		// 			//     <sensor>       ::= "true" | "false"
		// 			//     <bounds>
		// 			//     <language>     ::"= "en" | "zh-CN"
		// 			//     <region>
		// 			// @see https://developers.google.com/maps/documentation/geocoding/#GeocodingRequests				
		// 			params : { sensor: 'true', language: 'zh-CN' },

		// 			// 返回值解析
		// 			// 如果返回值不符合预期，则抛出异常，内部调用者会处理这个异常。
		// 			parser : function(data) {
		// 				if (data && data.status == 'OK') {
		// 					return this.revert.address(data.results);
		// 				}
		// 				else throw '.';
		// 			}
		// 		},

		// 		// 很遗憾，Google Place API 不支持跨域请求，所以，除非借助服务端转发机制，否则本方法无法使用！
		// 		// 
		// 		// 谷歌地图地方搜索提供多种搜索方式：
		// 		// 
		// 		//                 │ 每次请求   │ 每次请求   │ 
		// 		//  方法名称       │ 消耗配额数 │ 返回结果数 │ 返回内容
		// 		// ────────────────┼────────────┼────────────┼────────────
		// 		//  search         │ 　　　　   │     　     │ 
		// 		//  nearbysearch   │ 　　　　 1 │     　  20 │ 详情
		// 		//  textsearch     │ 　　　　10 │         20 │ 详情
		// 		//  radarsearch    │ 　　　　 5 │        200 │ 坐标和摘要
		// 		//
		// 		// @see https://developers.google.com/places/documentation/search
		// 		POIS_SEARCH: {

		// 			// 方法路径
		// 			path   : 'place/nearbysearch/json',

		// 			// 方法缺省参数组
		// 			// 根据 Google Places API 官方文档，支持的参数包括：
		// 			// 
		// 			//     <location>  ::= <Number>,<Number>
		// 			//
		// 			//     <radius>    ::=                     
		// 			//     // unit: Meter, upper: 50,000
		// 			//
		// 			//     <rankby>    ::= "distance"
		// 			//     <sensor>    ::= "true" | "false"
		// 			//     <language>  ::= "en" | "zh-CN"
		// 			//     <keyword>   ::= <Text>
		// 			//     <name>      ::= <Text>
		// 			//
		// 			//     <types>     ::= <Text>              
		// 			//     // @see https://developers.google.com/places/documentation/supported_types
		// 			// 
		// 			// --OR--
		// 			//     <pagetoken> ::= <Text>
		// 			params : {
		// 				sensor    : 'true',
		// 				radius    : 500, 
		// 				language  : 'zh-CN' 
		// 			},

		// 			// 返回值解析
		// 			// 如果返回值不符合预期，则抛出异常，内部调用者会处理这个异常。
		// 			parser : function(data) {
		// 				if (data && data.status == 'OK') {
		// 					var pois = [], result, i = 0;
		// 					while (result = data.results[i++]) pois.push(this.revert.poi(result));
		// 					return pois;
		// 				}
		// 				else throw '.';
		// 			}
		// 		}
		// 	},

		// 	// 转换函数集：本地 - 谷歌地图
		// 	// 转换结果将作为 GET 参数，故：
		// 	// ⑴ 返回值为哈希对象；
		// 	// ⑵ 函数命名从本地对象名。
		// 	convert: {
		// 		coordinate: function(coordinate) {
		// 			return {
		// 				latlng   : coordinate.toString('en_US'),
		// 				location : coordinate.toString('en_US')
		// 			};
		// 		}

		// 		// name 参数毋须转换，保留原始名值。
		// 		// name: function(value) { return { name: value }; },
		// 	},

		// 	// 转换函数集：谷歌地图 - 本地
		// 	// 函数命名从本地对象名。
		// 	revert: {

		// 		// 将地址数据转换成本地地址对象。参数实际上是逆地理编码（Reverse Geocoding）的结果。
		// 		// @return {Service.cGeo.Address}
		// 		address: function(results) {
		// 			var SCALES = {
		// 				street_number               : Address.SCALE.HOUSE    ,
		// 				route                       : Address.SCALE.STREET   ,
		// 				sublocality_level_1         : Address.SCALE.DISTRICT ,
		// 				locality                    : Address.SCALE.CITY     ,
		// 				administrative_area_level_1 : Address.SCALE.PROVINCE ,
		// 				country                     : Address.SCALE.COUNTRY  
		// 			};

		// 			var 
		// 				i = 0,
		// 				components = results[0].address_components,
		// 				ac,
		// 				scale,
		// 				info = {};

		// 			while (ac = components[i++]) {
						
		// 				// 抛弃不能识别的行政区域或其他信息（如 postal_code）
		// 				if (scale = SCALES[ac.types[0]]) {
		// 					info[scale] = ac.long_name;
		// 				}
		// 			}

		// 			return new Address(info);
		// 		},

		// 		// 将信息点数据转换为本地信息点对象，参数为谷歌地方查询的结果。
		// 		// 谷歌地图中将信息点称为 Place（官方译为“地方”）
		// 		// @return Service.cGeo.POI
		// 		poi: function(result) {
		// 			var poi = new POI();

		// 			// 名称
		// 			poi.name = result.vicinity;

		// 			// 坐标
		// 			poi.coordinate = new Coordinate(result.geometry.location);

		// 			// 谷歌地图对地方的类别有详细的分类，由于我们没有与其相应的规范化数据，无法进行精确转换，故简单将其转换为标签信息。
		// 			// @see https://developers.google.com/places/documentation/supported_types
		// 			poi.tags = result.types;

		// 			return poi;
		// 		}
		// 	}
		// }	
	};

	// ES6 Set（在携程 APP 主版内置浏览器内核中尚未实现）
	var _Set = window.Set ? window.Set : function() {
		var I = this, storage = [];

		I.add = function(item) {
			if (storage.indexOf(item) < 0) storage.push(item);
			return I;
		};

		I.delete = function(item) {
			storage = _.without(storage, item);
			return I;
		};

		I.forEach = function(fn) {
			storage.forEach(function(item) {
				fn(item, item, I);
			});
			return I;
		};

		Object.defineProperty(I, 'size', {
			get: function() { return storage.length; }
		});
	};

	// @class
	// @desc 计时器
	var _Timer = function(TTL) {
		
		// 起始时间点
		this.origin = _ME.time();

		// 剩余寿命（初始）
		this.TTL = _ME.time2ms(TTL, window.Infinity);
	};

	Object.defineProperties(_Timer.prototype, {

		// 获取计时器的迄今寿命
		age: {
			get: function() {
				return _ME.time() - this.origin;
			}
		},

		// 获取计时器的剩余寿命
		ttl: {
			get: function() {
				return Math.max(0, this.TTL - this.age);
			}
		}
	});

	// ES6 WeakMap（在携程 APP 主版内置浏览器内核中尚未实现）
	// 仿真实现做不到自动垃圾回收，存在内存泄漏的风险。
	var _WeakMap = window.WeakMap ? window.WeakMap : function() {
		var I = this, keys = [], values = [];

		this.get = function(key) {
			return values[keys.indexOf(key)];
		};

		this.set = function(key, value) {
			var index = keys.indexOf(key);
			if (index < 0) index = keys.length;
			keys[index] = key;
			values[index] = value;
			return I;
		};
	};

	/**
	 * 通讯地址 / 行政区划
	 * @constructor Service.cGeo.Address
	 */
	var Address = function(I) {
		if (I instanceof Address) return I;

		/**
		 * @var {String} Service.cGeo.Address.name 长地址名称
		 */

		/**
		 * @var {Number} Service.cGeo.Address.scale 地址类别值
		 * @see Service.cGeo.Address.SCALE
		 */		

		/**
		 * @var {Service.cGeo.Address} Service.cGeo.Address.parent 上一级地址
		 */

		// 构造函数重载定义
		var DEFs = [
			// 重载定义一
			[
				// 形式参数定义
				String,

				// 构造函数 
				function(name) {
					this.name = name;
				}
			],

			// 依次类推……
			[
				Number,
				String,

				// 构造函数 
				function(scale, name) {
					this.scale = scale;
					this.name = name;
				}
			],

			[
				Object,

				function(info) {
					var addresses = [];
					
					// 将哈希形式（scale:name）的地址信息转换成地址类
					_.each(info, function(name, scale) {
						if (name) addresses.push(new Address(window.parseInt(scale), name));
					});

					// 地址类排序
					addresses.sort(function(a, b) { return a.comprise(b); });

					// 建立地址类之间的从属关系
					for (var i = addresses.length - 1; i > 0; i--) addresses[i-1].parent = addresses[i];

					// 将最底层地址作为当前类
					return addresses[0];
				}
			]
		];

		// 执行构造函数重载
		return  _ME.overload(DEFs, arguments, this);
	};

	Address.SCALE = Address.prototype.SCALE = {
		UNKNOWN  : 0,

		ROOM     : 1,
		HOUSE    : 2,
		STREET   : 3,
		VILLIAGE : 4,
		TOWN     : 5,
		COUNTY   : 6.1,
		DISTRICT : 6.2,
		CITY     : 7,
		PROVINCE : 8,
		COUNTRY  : 9
	};

	_.extend(Address.prototype, {
		/**
		 * 转换成完整的地址
		 * @method toString
		 * @memberof Service.cGeo.Address		 
		 * @instance
		 * @returns {String}
		 */
		toString: function() {
			var names = [], address = this;
			while (address) {
				names.unshift(address.name);
				address = address.parent;
			}

				// 用特殊间隔符连接
			return names.join('…') 

				// 如果前后两个地址单元名称的衔接字符均为英文字符，则以空格取代特殊间隔符。
				.replace(/(\w)…(\w)/g, '$1 $2')

				// 特殊间隔符的使命已完成，删除其余。
				.replace(/…/g, '');
		},

		/**
		 * 获取地址的局部信息
		 * @method get
		 * @memberof Service.cGeo.Address
		 * @instance
		 * @returns {String|Service.cGeo.Address}
		 *
		 * @example
		 * // 取得地址中的城市（仍然是一个地址对象）
		 * address.get('city')
		 *
		 * address
		 */
		 get: function(what) {
			var 
				// 默认返回一个地址对象
				returns = 0,

				// 递归因子
				address = this;

			// 参数判别
			if (typeof what == 'number') {
				// DO NOTHING				
			}
			else if (typeof what == 'string') {
				if (what.match(/name$/i)) {
					returns = 1;
					what = RegExp.leftContext;
				}
				what = Address.SCALE[what.toUpperCase()];
			}

			do {				
				if (address.scale == what) return returns ? address.name : address;
			} while (address = address.parent)

			// return undefined;
		},

		/**
		 * 判断是否包含另一地址
		 * e.g. “江苏省”包含“南京市”
		 * @method comprise
		 * @memberof Service.cGeo.Address		 
		 * @instance
		 * @returns {Boolean}
		 */
		comprise: function(address) {
			return this.scale && this.scale > address.scale;
		},

		/**
		 * 补充地址信息
		 * e.g. 补充“江苏省”至“南京市”
		 * @method add
		 * @memberof Service.cGeo.Address		 
		 * @instance
		 * @returns {String} 
		 */
		add: function(address) {
			// @todo
			return this;
		},

		/**
		 * 判断两个地址的精确程度，精确程度相同的则进一步比较其详细程度。
		 * e.g.
		 *     “南京市”较“江苏省”精确
		 *     “江苏省南京市”较“南京市”更精确
		 *     “江苏省南京市”与“中国南京市”同等精确
		 * @method accurateThan
		 * @memberof Service.cGeo.Address		 
		 * @instance
		 * @returns {Boolean}
		 */
		accurateThan: function(address) {
			var I = this, U = address;

			if (!I.valid) return false;

			if (!U) return true;
			
			// 先判断精确程度（前提是双方都定义了标尺）
			if (I.scale && U.scale && I.scale < U.scale) return true;

			// 如精度相同，则比较地址深度。
			return I.depth > U.depth;
		}
	});

	Object.defineProperties(Address.prototype, {
		// 返回该地址对应的行政区域名称（有些不是严格意义）
		scaleName: {
			get: function() { 
				for (var i in Address.SCALE) {
					if (Address.SCALE[i] == this.scale) return i;
				}
			}
		},
		
		// 地址深度，即该地址的组成部分的数目
		depth: {
			get: function() {
				var i = 1, address = this;
				while (address = address.parent) i++
				return i;
			}
		},

		valid: {
			get: function() {
				return !!this.name;
			}
		}
	});

	/**
	 * 城市
	 * @constructor Service.cGeo.City
	 */
	function City(options) {
		if (options instanceof City) return options;

		if (!options) options = {};

		/**
		 * @var {String} id 城市ID
		 * @memberof Service.cGeo.City
		 * @instance
		 */
		if (_ME.isScalar(options.id))
			this.id = options.id + '';
		
		/**
		 * @var {String} name 城市名
		 * @memberof Service.cGeo.City
		 * @instance
		 */
		if (_.isString(options.name))
			this.name = options.name;

		/**
		 * @var {Service.cGeo.City} parent 所属上级城市
		 * @memberof Service.cGeo.City
		 * @instance
		 */
		if (options.parent instanceof City)
			this.parent = options.parent;

		/**
		 * @var {Service.cGeo.Coordinate} coordinate 城市中心坐标
		 * @memberof Service.cGeo.City
		 * @instance
		 */
		var _coordinate;
		
		if (options.coordinate instanceof Coordinate)
			_coordinate = options.coordinate;
	};

	/**
	 * 地理坐标（目前仅限于经纬度）
	 * @constructor Service.cGeo.Coordinate
	 */
	function Coordinate(I) {
		if (I instanceof Coordinate) return I;
		if (!(this instanceof Coordinate)) return _Klass.construct(Coordinate, arguments);

		// 缺省坐标系
		this.system = Coordinate.SYSTEM.EARTH;					

		// 构造函数重载定义
		var DEFs = [
			// 重载定义一
			[
				// 形式参数定义
				Number, 
				Number,

				// 构造函数 
				function(longitude, latitude) {
					this.longitude = longitude ;
					this.latitude  = latitude  ;
				}
			],

			[
				Array,

				function(params) {
					this.longitude = params[0];
					this.latitude  = params[1];
				}
			],

			[
				[ POI, MapMark ],

				function(host) {
					return _ME.clone(host.coordinate);
				}
			],

			[
				String,

				function(lnglat) {
					if (lnglat.match(/^([\d.]+),([\d.]+)$/)) {
						this.longitude = RegExp.$1;
						this.latitude  = RegExp.$2;
					}
				}
			],

			[	
				_ME.overload.Type(function(coord) {
					return coord && typeof coord.lat == 'number' && typeof coord.lng == 'number';
				}),

				function(coord) {
					this.longitude = coord.lng;
					this.latitude  = coord.lat;
				}
			],

			// 依次类推……
			[
				// Position
				_ME.overload.Type(function(position) { 
					
					// 此判别法并不可靠。
					// return 
					//     [
					//         '[object Geoposition]',
					//         '[object Position]'
					//     ]
					//     .indexOf(position.toString()) >= 0;

					return position && position.coords;
				}),

				function(position) {
					_.extend(this, _.pick(position.coords, 'longitude', 'latitude'));
				}
			]
		];

		// 执行构造函数重载
		return _ME.overload(DEFs, arguments, this);
	};

	// 地理坐标系
	// 为方便记忆，我们采用其通俗称谓来命名常量，尽管这并不“科学”。
	// 用户并不需要了解有关坐标系的理论知识，只需知道不同地图系统使用不同坐标系，仅此而已。
	Coordinate.SYSTEM = {
		// WGS84（World Geodetic System 1984）
		// 因为 GPS 采用该标准，因此依据该标准生成的坐标也常被称为 GPS 坐标。
		EARTH  : 1,

		// GCJ02（国测局 2002，国测局系国家测绘地理信息局的简称）
		// 有人将 WGS84 - GCJ02 转换称为“GPS 加偏”，反之则称为“GPS 纠偏”。虽然这种说法并不完全正确，并通俗易懂。
		MARS   : 2

		// 谷歌地图、腾讯地图、高德地图均使用 GCJ02 坐标。

		// GOOGLE : 2,
		// TECENT : 2,
		// Amap   : 2,

		// --以上均为球面坐标系--
		// 与之相对的，是基于某种平面投影法生成的平面坐标系，最为典型是墨卡托投影法（Mercato Projection）。

		// 百度地图使用私有的坐标系
		// BD09ll（BaiDu 2009 LngLat）是经纬度坐标系，系由 GCJ02 加偏形成。
		// BD09（BaiDu 2009）是墨卡托坐标系
		
		// BAIDU       : 3,
		// BAIDU_PLANE : 4,		
	};

	/**
	 * 将地理坐标转换成字符串形式
	 * @method toString
	 * @memberof Service.cGeo.Coordinate
	 * @instance
	 *
	 * @param {String} region 
	 * 国家或地区代码，参考 <IETF language tag>。
	 * 地理坐标的字符串表示法事实上与该标准无关，但依中外语言上的差异而有所不同：
	 * 我们习惯上称“经纬度”，故经度在前、纬度在后；而在英语中按字母顺序，latitude 在前、longitude 在后。
	 * 为了便于代码阅读，我们以国家代码为区分不同表示法的标志。
	 *
	 * @returns {String}
	 */
	Coordinate.prototype.toString = function(language) {
		switch (language) {
			case 'en_US':				
				return this.latitude + ',' + this.longitude;

			case 'zh_CN':
			default:
				return this.longitude + ',' + this.latitude;
		}
	};

	// 暂不实现
	Coordinate.prototype.transform = function(system) {
		throw 'Unable to transform coordinate system.';
	};
	
	/**
	 * 根据地理坐标查询所在城市信息
	 * @method queryCity
	 * @memberof Service.cGeo.Coordinate
	 * @instance
	 *
	 * @param {Function } onsuccess
	 * @param {Function } onerror
	 * @param {Object   } options   
	 * @param {Number   } options.timeout
	 */ 
	Coordinate.prototype.queryCity = function(onsuccess, onerror, options) {
		_MapWS('CITYCODING', { coordinate: this }, onsuccess, onerror, options);
	};

	/**
	 * 实现定位功能的类。
	 * @class Service.cGeo.Geolocation
	 */ 
	function Geolocation(requestType) {
		var 
			I = this, 

			// 创建一个 Deferred 对象，用于接受和执行监听方法。
			// 将当前对象句柄传给 Deferred 构造函数，是为了获得其 promise 类方法（done / fail）的代理权。
			D = new _Deferred(this),

			_RUNNER_;

		// 以下两个方法系代理 Deferred 对象相关方法所得。

		/** 
		 * 注册定位成功回调函数
		 * @method done
		 * @memberof Service.cGeo.Geolocation
	 	 * @instance
		 * @param {function} handler
		 */

		/** 
		 * 注册定位失败回调函数
		 * @method fail
		 * @memberof Service.cGeo.Geolocation
	 	 * @instance
		 * @param {function} handler
		 */

		/** 
		 * 执行定位操作
		 * @method Service.cGeo.Geolocation.run
		 *
		 * @param {Object} options 选项组
		 *	
		 * @param {Number|String} options.timeout = 35000
		 * 超时设置（默认单位：毫秒）
	     * 由于任何事务执行均需时间，所以如果超时时间为 0 或负数，将视为无限制。
	     *
	     * @param {Number|String} options.maximumAge = 600
	     * 最长寿命（默认单位：毫秒） 
		 * 如果在缓存中找到时效短于“最长寿命”的信息，则不必重新发起定位操作。
		 * 如果不希望使用任何缓存信息，将该值设为 0 即可。
		 * 注意，maximumAge 与 timeout 是完全不同的。
		 */
		I.run = function(options) {
			options = _ME.times2ms(options, {
				// 超时设置
				timeout: '35s',

				// 最长寿命
				maximumAge: '10m'
			});

			_RUNNER_ = _HOST[requestType](D.resolve, D.reject, options);
			
			return I;
		};

		 /** 
		 * 终止定位操作
		 * @method Service.cGeo.Geolocation.abort
		 */
		I.abort = function() {
			if (_RUNNER_) _RUNNER_.abort();
			return I;
		};

		return I;
	};

	function locate(type, onsuccess, onerror, options) {
		(new Geolocation(type)).done(onsuccess).fail(onerror).run(options);
	};

	// @interface MapApi
	// 这是一个抽象类，我们封装各地图工具提供的 Api 时，应合乎本类的抽象定义。
	// 
	// 构造函数应有一个“方法名称”参数，支持：
	//     ADDRESS_BY_COORDINATE 根据坐标查询地址
	//     COORDINATE_TRANSFORM  坐标转换
	//     POIS_BY_COORDINATE    根据坐标查询兴趣点
	//     POIS_BY_NAME          根据名称（关键字）查询兴趣点

	var _Map_METHOD_NAMES = [ 
		/** 
		 * 将视口中心点移至指定坐标。
		 * @method moveTo
		 * @memberof Service.cGeo.Map
	 	 * @instance
		 * @param {Service.cGeo.Coordinate} coordinate
		 */
		'moveTo', 

		/** 
		 * 将放大级别调整到指定水平。
		 * @method zoomTo
		 * @memberof Service.cGeo.Map
	 	 * @instance
		 * @param {Number} level
		 */
		'zoomTo', 

		/** 
		 * 粘附标记。
		 * @method attach
		 * @memberof Service.cGeo.Map
	 	 * @instance
		 * @param {Service.cGeo.POI} POI
		 */
		'attach',

		/** 
		 * 剥离标记。
		 * @method detach
		 * @memberof Service.cGeo.Map
	 	 * @instance
		 * @param {Service.cGeo.POI} POI
		 */
		'detach',

		/** 
		 * 销毁地图。
		 * @method destroy
		 * @memberof Service.cGeo.Map
	 	 * @instance
		 */
		'destroy',

		'autoFit'
	];

	var _Map_CTRIP = function(options) {

		var marks = [];

		if (options.marks) {
			_.each(options.marks, function(mark) {
				marks.push({
					latitude  : mark.coordinate.latitude  ,
					longitude : mark.coordinate.longitude ,
					title     : mark.title
				});
			});
		}

		Hish.Fn('show_map_with_POI_list').run(marks);
	};

	// 高德地图类
	// @see http://lbs.amap.com/api/javascript-api/reference/
	var _Map_AMAP = (function() {

		var 
			// 按 cGeo.Map.Mark : AMap.Marker 的格式存放所有标记。
			_markers = new _WeakMap(),

			// 转换函数集：本地 - 谷歌地图
			_convert = {
				LngLat: function(coordinate) {
					return new AMap.LngLat(coordinate.longitude, coordinate.latitude);
				},

				// @see http://lbs.amap.com/api/javascript-api/reference/overlay/#Marker
				Marker: function(mark) {
					var marker = _markers.get(mark);
					if (!marker) {
						marker = new AMap.Marker({
							position  : _convert.LngLat(mark.coordinate),
							title     : mark.title,
							draggable : true
						//	animation : 'AMAP_ANIMATION_BOUNCE'
						});

						if (mark.href) {
							marker.setClickable(true);
							AMap.event.addListener(marker, 'click', function() {
								window.location.href = mark.href;
							});
						}

						if (mark.icon) marker.setContent(mark.icon);

						_markers.set(mark, marker);
					}
					return marker;
				}
			};

		return _Klass.create(

			// 高德地图的加载器
			// 'http://webapi.amap.com/maps?v=1.3&key=' + _VENDOR.AMAP.KEY,
			function(callback) {
				var funcname = _ME.genUid();
				window[funcname] = callback;
				_ME.loadJS('http://webapi.amap.com/maps?v=1.3&key=' + _VENDOR.AMAP.KEY + '&callback=' + funcname);
			},

			function(options) {
				var 
					I = this,

					// 本地图上所有覆盖物集合
					elements = new _Set(),

					view = new AMap.View2D({
						 center : _convert.LngLat(options.center), 
						 zoom   : options.zoom
					}),

					// @see http://lbs.amap.com/api/javascript-api/reference/map/
					_aMap = new AMap.Map(
						options.container, 
						{
							// @deprecated since v=1.3, replaced by view
							// center : _convert.LngLat(options.center),
							// level  : options.zoom,
							view: view,
							
							dragEnable   : true           ,
							rotateEnable : true           ,
							zoomEnable   : true							
						}
					);

				// 添加成员方法
				_.extend(I, {

					autoFit: function() {
						_aMap.setFitView();
					},

					moveTo: function(coordinate) {
						_aMap.setCenter(_convert.LngLat(coordinate));
					},

					zoomTo: function(level) {
						_aMap.setZoom(level);
					},

					// @see http://lbs.amap.com/api/javascript-api/reference/overlay/#Marker
					attach: function(mark) {
						var marker = _convert.Marker(mark);
						marker.setMap(_aMap);
						elements.add(marker);
						return I;
					},

					// @see http://lbs.amap.com/api/javascript-api/reference/overlay/#Marker
					detach: function(mark) {
						var marker = _convert.Marker(mark);
						if (marker.getMap() === _aMap) {
							marker.setMap(null);
							elements.delete(marker);							
						}
						return I;
					},

					// @see http://lbs.amap.com/api/javascript-api/reference/map/
					destroy: function() {
						_aMap.destroy();
					}
				});
			},

			_Map_METHOD_NAMES
		);

	})();

	// 谷歌地图类
	// var _Map_GOOGLE = (function() {

	// 	var 
	// 		// 按 cGeo.Map.Mark : google.maps.Marker 的格式存放所有标记。
	// 		_markers = new _WeakMap(),

	// 		// 转换函数集：本地 - 谷歌地图
	// 		_convert = {
	// 			LatLng: function(coordinate) {
	// 				return new google.maps.LatLng(coordinate.latitude, coordinate.longitude);
	// 			},

	// 			Marker: function(mark) {
	// 				var marker = _markers.get(mark);
	// 				if (!marker) {
	// 					marker = new google.maps.Marker({
	// 						map       : _gMap,
	// 						position  : _convert.LatLng(mark.poi.coordinate),
	// 						title     : mark.title
	// 					//	animation : google.maps.Animation.BOUNCE
	// 					});
	// 					_markers.set(mark, marker);
	// 				}
	// 				return marker;
	// 			}
	// 		};

	// 	return _Klass.create(

	// 		// 谷哥地图的加载器
	// 		'https://maps.googleapis.com/maps/api/js?v=3&region=zh-CN',

	// 		function(options) {

	// 			var 
	// 				I = this,
				
	// 				_gMap = new google.maps.Map(
	// 					options.container,

	// 					// 此处并未列举全部可用选项。
	// 					// @see https://developers.google.com/maps/documentation/javascript/reference#MapOptions
	// 					{
	// 					//	backgroundColor          : ''            ,
	// 						center                   : _convert.LatLng(options.center),
	// 					//	disableDoubleClickZoom   : false         ,
	// 					//	draggable                : true          ,					
	// 					//	mapTypeId                : google.maps.MapTypeId.ROADMAP, 
	// 						zoom                     : options.zoom  ,

	// 					//  以下是界面控制选项：
	// 					//	panControl               : false         ,
	// 					//	rotateControl            : false         ,
	// 					//	scaleControl             : false         ,
	// 					//	typeControl              : false         ,
	// 						zoomControl              : false         
	// 					//	zoomControlOptions       : { position: google.maps.ControlPosition.LEFT_BOTTOM },
	// 					}
	// 				);
					

	// 			// 添加成员方法
	// 			_.extend(I, {

	// 				moveTo: function(coordinate) {
	// 					_gMap.panTo(_convert.LatLng(coordinate));
	// 					return I;
	// 				},

	// 				zoomTo: function(level) {
	// 					gMap.setZoom(level);
	// 					return I;
	// 				},

	// 				// @see https://developers.google.com/maps/documentation/javascript/reference#Marker							
	// 				attach: function(mark) {
	// 					_convert.Marker(mark).setVisible(true);
	// 					return I;
	// 				},

	// 				// @see https://developers.google.com/maps/documentation/javascript/reference#Marker
	// 				detach: function(mark) {						
	// 					_convert.Marker(mark).setVisible(false);
	// 					return I;
	// 				}
	// 			});
	// 		},

	// 		_Map_METHOD_NAMES
	// 	);
	// })();

	/**
	 * 地图
	 * @class Service.cGeo.Map
	 *
	 * @param {Object }                   options                  参数组
	 * @param {HTMLElement|String}       [options.container     ]  地图容器（支持 Zepto selector）
	 * @param {Service.cGeo.Coordinate}   options.center           地图中心点位置
	 * @param {Number}                   [options.zoom      = 8 ]  放大级别
	 */	
	// 事实上我是 _Map_{VENDOR} 的代理，负责预处理参数（包括调用成员函数时）并选择合适的执行者。
	var Map = function(options) {

		var 
			I = this, _PI = _P(I), 

			// 面向具体地图供应商的地图封装类
			klass, 

			// 面向具体地图供应商的地图封装对象（klass 的实例）
			map, 

			// 地图是否已经触碰过（移动或缩放）
			// 此变量用于阻止地图初始化过程中的自动定位进程。
			touched = false;

		// 地图内胆（直接容器）
		_PI.element = $('<div style="width:100%;height:100%;"/>').get(0);

		// 全部子对象（图层或标记）
		I.children = new _Set();

		// 初始化参数组
		options = _.extend({

			// 地图放大级别
			zoom : 15

		}, options);

		// 装入外壳中。
		I.appendTo(options.container);

		// 用内胆作为直接容器，取代外壳。
		options.container = _PI.element;

		// 缺省情况下，调整地图中心和放大级别设置，使地图大致显示中国大部。
		// 同时，尝试定位当前用户。成功获取坐标后，将地图中心移至该坐标，并将放大级别恢复至原来。
		if (!options.center) {

			// 暂存当前地图放大级别。
			var _zoom = options.zoom;

			// 调整地图放大级别，可在当前普通的手机屏幕上显示中国大部分地区。
			options.zoom = 4;

			// 重新设置地图中心，取九省通衢武汉市中心坐标。
			options.center = [113.5, 29.6];

			// 尝试定位当前用户。
			locate('coordinate', function(coordinate) {
				if (!touched) map.moveTo(coordinate).zoomTo(_zoom);
			});
		}

		// 数据规范化
		options.center = new Coordinate(options.center);

		// @todo 确定地图供应商mapmapmap
		klass = _Map_AMAP;

		map = new klass(options);		

		// 成员方法预处理及参数归一化处理方法集
		var norms = {
			destroy: function() {
				// _PI.element.remove();
				_DOM.remove(_PI.element);
			},

			moveTo: function() {
				touched = true;
				return [ _Klass.construct(Coordinate, arguments) ];
			},

			zoomTo: function() {
				touched = true;
				return arguments;
			}
		};

		// 遍历 map 的每一个成员方法，为当前实例（即代理人）添加同名方法，并代理该方法。
		_.each(_Map_METHOD_NAMES, function(name) {

			I[name] = function() {				
				var args = arguments, norm = norms[name];

				// 若指定了参数归一化处理方法，则以其返回值取代原始参数组。
				if (norm) args = norm.apply(I, arguments);

				// 调用内置地图对象的相应方法。
				map[name].apply(map, args);
				
				return I;
			};
		});
	};

	_.extend(Map.prototype, {

		/**
		 * 添加地图对象到 DOM 元素中。
		 * @method appendTo
		 * @memberof Service.cGeo.Map
		 * @instance
		 * @param {HTMLElement|String} htmlElement 容器
		 */
		appendTo: function(htmlElement) {
			var mapcase, mapbox = _P(this).element, absent = !htmlElement, css = {};

			if (absent) {
				// 缺省情况下，以 document.body 作为外壳。
				mapcase = document.body;

				// 内胆样式为绝对定位、置顶。
				css = { position: 'absolute', top: 0 };				
			}
			else {
				mapcase = $(htmlElement).get(0);
				css = { position: '' };
			}

			$(mapbox).css(css);
			mapcase.appendChild(mapbox);
		},

		/**
		 * 添加元素（图层或标记）。
		 * @method append
		 * @memberof Service.cGeo.Map
		 * @instance
		 * @param {MapLayer|MapMark} element 待添加的元素
		 */
		// 方法实体由 Map.prototype 和 MapLayer.prototype 共享。
		append: function foo() {
			var DEFs = [
				[
					[ MapLayer, MapMark ],
					function(element) {
						
						// 禁止递归附加：
						// 如果附加对象是当前对象自已，则忽略该操作。
						if (element === this) return;

						// 禁止重复附加：
						// 如果附加对象已经是当前对象的子对象，则忽略该操作。
						if (element.parent === this) return;

						// 从一原则：一个子元素只能归属于一个父元素。
						// 故子元素附加到一个新的父元素之前，须先执行卸载操作。
						element.remove();

						// 建立相互之间的从属关系。
						element.parent = this;
						this.children.add(element);

						// 如果当前对象是地图或已粘附至地图的图层，则须对当前附加的子对象执行粘附操作。
						var map = this instanceof Map ? this : this.map;
						if (map) _P(element).attachTo(map);
					}
				],

				[
					[ Array, _Set ],
					function(elements) {
						_.each(_ME.Array(elements), foo, this);
					}
				]
			];

			 _ME.overload(DEFs, arguments, this);
			return this;
		},

		/**
		 * 移除元素（图层或标记）。
		 * @method remove
		 * @memberof Service.cGeo.MapLayer
		 * @instance
		 * @param {MapLayer|MapMark|Array} [element] 待移除的元素。如该项参数缺省，则表示移除当前对象自已。
		 */
		// 方法实体由 Map.prototype 和 MapLayer.prototype 共享。
		remove: function foo() {
			var DEFs = [
				[	
					function() {
						if (this instanceof MapLayer) if (this.parent) this.parent.remove(this);
						// if (this instanceof Map) _P(this).element.remove();
						if (this instanceof Map) _DOM.remove(_P(this).element);
					}
				],

				[
					[ MapLayer, MapMark ],
					function(element) {
						if (element.parent != this) return;
						
						// 解除相互之间的从属关系。
						this.children.delete(element);
						delete element.parent;

						// 将被移出的元素从地图上剥离。
						_P(element).detach();
					}
				],

				[
					[ Array, _Set ],
					function(elements) {
						_.each(_ME.Array(elements), foo, this);
					}
				]
			];

			 _ME.overload(DEFs, arguments, this);
			return this;
		}
	});

	/**
	 * 地图图层
	 * @constructor Service.cGeo.Map.Layer
	 */
	// 在地图上，图层是一个虚拟的概念，其实质是若干标记的集合。
	function MapLayer() {
		var I = this, _PI = _P(I);

		// 当前所属的上一级元素（图层或地图）
		// this.parent = undefined;

		// 当前所粘附的地图对象
		// this.map = undefined;
		
		// 全部子对象（子图层或标记）
		I.children = new _Set();

		// @protected
		// 粘附至地图。
		_PI.attachTo = function(map) {
			// 建立与地图对象的从属关系。
			I.map = map;

			// 对于虚拟的“层”而言，只需要将“粘附”信息向下传递即可。
			I.children.forEach(function(element) { _P(element).attachTo(map); });
		};

		// @protected
		// 从地图上剥离。
		_PI.detach = function() {
			// 如果尚未粘附于地图对象，则忽略该操作。
			if (!I.map) return;

			// 对于虚拟的“层”而言，只需要将“剥离”信息向下传递即可。
			I.children.forEach(function(element) { _P(element).detach(); });

			// 删除与地图对象的从属关系。
			delete this.map;
		};
	}

	_.extend(MapLayer.prototype, {

		/**
		 * 添加到指定地图或另一图层中。
		 * @method append
		 * @memberof Service.cGeo.MapLayer
		 * @instance
		 * @param {Map|MapLayer} element 目标容器
		 */
		appendTo: function(element) {
			element.append(this);
			return this;
		},

		/**
		 * 添加元素（图层或标记）。
		 * @method append
		 * @memberof Service.cGeo.MapLayer
		 * @instance
		 * @param {MapLayer|MapMark} element 待添加的元素
		 */
		append: Map.prototype.append,

		/**
		 * 移除元素（图层或标记）。
		 * @method remove
		 * @memberof Service.cGeo.MapLayer
		 * @instance
		 * @param {MapLayer|MapMark|Array} [element] 待移除的元素。如该项参数缺省，则表示移除当前图层自已。
		 */
		remove: Map.prototype.remove
	});

	/**
	 * 地图标记
	 * @constructor Service.cGeo.Map.Mark
	 */
	function MapMark() {
		var I = this, _PI = _P(I);

		var DEFs = [
			[
				POI,

				function(poi) {
					this.coordinate = poi.coordinate;
					this.title = poi.name;
				}
			],

			[
				Object,

				function(options) {
					if (options.poi) {
						this.coordinate = poi.coordinate;
						this.title = poi.name;
					}

					if (options.coordinate) {
						this.coordinate = new Coordinate(options.coordinate);
					}

					if (options.icon) {
						// @todo
						this.icon = MapIcon(options.icon);
					}

					_.extend(this, _.pick(options, ['title', 'href']));
				}
			]
		];

		_ME.overload(DEFs, arguments, I);

		/**
		 * @var {Srevice.cGeo.Coordinate} coordinate 标记坐标
		 * @memberof Service.cGeo.Map.Mark
		 * @instance
		 */
		// this.coordinate = undefined;

		/**
		 * @var {String} coordinate 标记坐标
		 * @memberof Service.cGeo.Map.Mark
		 * @instance
		 */
		// this.coordinate = undefined;

		/**
		 * @var {String} icon 标记图标
		 * @memberof Service.cGeo.Map.Mark
		 * @instance
		 */
		// this.icon = undefined;

		// 当前所属的上一级元素（图层或地图）
		// this.parent = undefined;

		// 当前所粘附的地图对象
		// this.map = undefined;

		// @private
		// 粘附至地图。
		_PI.attachTo = function(map) {
			// 建立与地图对象的从属关系。
			I.map = map;

			map.attach(I);
		};

		// @private
		// 从地图上剥离。
		_PI.detach = function() {
			// 如果尚未粘附于地图对象，则忽略该操作。
			if (!I.map) return;

			map.detach(I);

			// 删除与地图对象的从属关系。
			delete I.map;
		};

		/**
		 * 添加到指定地图或另一图层中。
		 * @method append
		 * @memberof Service.cGeo.MapMark
		 * @instance
		 * @param {Map|MapLayer} element 目标容器
		 */
		I.appendTo = function(element) {
			element.append(I);
		};

		/**
		 * 从当前所属的图层
		 * @method remove
		 * @memberof Service.cGeo.MapLayer
		 * @instance
		 */
		I.remove = function() {
			if (I.parent) I.parent.remove(I);
		};
	}

	// 地图图标
	// @todo 究竟是作为一个类，还是一个函数？
	function MapIcon() {
		var DEFs = [
			/**
			 * 地图图标
			 * @constructor Service.cGeo.Map.Icon
			 * @param {String} HTML
			 * @return {HTMLElement}
			 */
			[
				_ME.overload.Type(function(html) {
					return /^</.text(html);
				}),

				function(html) {
					return $(html).get(0);					
				}
			],

			/**
			 * 地图图标
			 * @constructor Service.cGeo.Map.Icon
			 * @param {String} URL
			 * @return {Sring}
			 */
			/**
			 * 地图图标
			 * @constructor Service.cGeo.Map.Icon
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 */
			[
				[ String, HTMLElement ],

				function(icon) {
					return icon;
				}
			],

			/**
			 * 地图图标
			 * @constructor Service.cGeo.Map.Icon
			 * @param {Object}  options
			 * @param {Array } [options.size        ] 图标尺寸（默认单位：像素，可以使用的 CSS 尺寸字符串）
			 * @param {String} [options.image       ] 图标图片地址
			 * @param {String} [options.image.url   ] 图标图片地址
			 * @param {String} [options.image.size  ] 图标图片尺寸
			 * @param {String} [options.image.offset] 图标图片偏移量
			 * @return {HTMLElement}
			 *
			 * @example
			 * new cGeo.Map.Icon({
			 *     size: [27, 33.5],
			 *     image: {
			 *         url: 'http://pic.c-ctrip.com/h5/tuan/spr_index_3.4.png',
			 *         size: [250, 250],
			 *         offset: [-105, -125]
			 *     }
			 * }
			 */
			[
				Object,

				function(options) {
					var 
						formatXY = function(xy) {

							if (_.isString(xy)) xy = xy.split(/\s|,/);

							else if (xy.constructor == Object) xy = [ xy.x || xy.width, xy.y || xy.height ];

							return [ parseFloat(xy[0]) + 'px', parseFloat(xy[1]) + 'px' ];
						},

						css = '', 
						size = options.size, 
						image = options.image, 
						url = _.isString(image) ? image : image.url,
						xy;

					// 必须提供图片信息
					if (!image) return null;
					
					if (size) {
						xy = formatXY(size);
						css += '; width:' + xy[0];
						css += '; height:' + xy[1];
					}

					if (url)          css += ';-image:url(' + url + ')';
					if (image.size)   css += ';-size:' + formatXY(image.size).join(' ');
					if (image.offset) css += ';-position:' + formatXY(image.offset).join(' ');

					return $('<div style="' + css.replace(/;-/g, ';background-') + '"/>').get(0);
				}
			]
		];

		return _ME.overload(DEFs, arguments);
	}

	Map.Layer = MapLayer;
	Map.Mark = MapMark;

	/**
	 * 简化版地图，可适配的地图供应商更多，但是支持的功能较少。
	 * S = Simplified
	 * @class Service.cGeo.MapS
	 *
	 * @param {Object }   options                       参数组
	 * @param {Array  }  [options.marks]                展示的地图标记组
	 * @param {Object }  [options.marks[0]]             展示的地图标记
	 * @param {Object }  [options.marks[0].title]       展示的地图标记
	 * @param {Object }  [options.marks[0].coordinate]  展示的地图标记
	 */	
	function SMap(options) {
		options = _.extend({}, options);

		var 
			klass, 
			map,
			marks = options.marks;

		if (marks) for (var i = 0; i < marks.length; i++)  marks[i] = new MapMark(marks[i]);

		if ( Lizard.app.vendor.is('CTRIP') && Lizard.app.code.is('MASTER') ) map = new _Map_CTRIP(options);
		
		else {
			delete options.marks;
			map = new Map(options);
			if (marks) {
				_.each(marks, function(mark) { mark.appendTo(map); });
				// @todo
				window.setTimeout(function() { map.autoFit(); }, 10 * marks.length);
			}
		}
	};

	/**
	 * 具体地点，也称为兴趣点（Point of Interest）
	 * @constructor Service.cGeo.POI
	 */
	function POI(params) {
		if (params instanceof POI) return params;

		if (!params) params = {};

		/**
		 * @var {Srevice.cMap.Address} address 地址信息
		 * @memberof Service.cGeo.POI
		 * @instance
		 */
		if (params.address)
			this.address = new Address(params.address);

		/**
		 * @var {Srevice.cMap.Coordinate} coordinate 坐标信息
		 * @memberof Service.cGeo.POI
		 * @instance
		 */
		if (params.coordinate)
			this.coordinate = new Coordinate(params.coordinate);

		/**
		 * @var {String} name 名称
		 * @memberof Service.cGeo.POI
		 * @instance
		 */

		/**
		 * @var {String} desc 描述信息
		 * @memberof Service.cGeo.POI
		 * @instance
		 */
		_.extend(this, _.pick(params, ['name', 'desc']));

		/**
		 * @var {Array} phones 电话号码
		 * @memberof Service.cGeo.POI
		 * @instance
		 */
		this.phones = _ME.Array(params.phones);

		/**
		 * @var {Array} tags 分类标签
		 * @memberof Service.cGeo.POI
		 * @instance
		 */
		this.tags = _ME.Array(params.tags);
	};

	/**
	 * 实现地点（POI）查询功能的类，支持多种查询方式，目前已实现的有：
	 * ⑴ 根据经纬度查询附近地点；
	 * ⑵ 根据关键词查询相关地点。
	 * @class Service.cGeo.POIQuery
	 */ 
	var POIQuery = function() {
		var 
			I = this,
			D = new _Deferred(this),
			_RUNNER_;

		// 以下两个方法系代理 Deferred 对象相关方法所得。

		/** 
		 * 注册定位成功回调函数
		 * @method done
		 * @memberof Service.cGeo.Geolocation
	 	 * @instance
		 * @param {function} handler
		 */

		/** 
		 * 注册定位失败回调函数
		 * @method fail
		 * @memberof Service.cGeo.Geolocation
	 	 * @instance
		 * @param {function} handler
		 */

		// 保存查询条件
		var params = {};

		/**
		 * 添加查询条件
		 * @method where
		 * @memberof Service.cGeo.POIQuery
		 * @instance
		 * @param {string} name
		 * @param value
		 *
		 * @example
		 *
		 * // 关键词查询的条件设置
		 * poiquery
		 *    .where('city', '上海')
		 *    .where('name', '东方明珠');
		 *
		 * // 周边查询的条件设置
		 * poiquery
		 *    // 指定搜索半径（单位：米）
		 *    .where('radius', 500) 
		 *    // 指定坐标
		 *    .where('coordinate', new cMap.Coordinate(<longitude>, <latitude>));
		 */
		this.where = function(name, value) {
			params[name] = value;
			return I;
		};

		/** 
		 * 执行查询操作
		 * @method run
		 * @memberof Service.cGeo.POIQuery
		 * @instance 
		 * @param {Object}        options                 选项组
		 * @param {Number|String} options.timeout = 8000  超时设置（默认单位：毫秒）
	     */
		this.run = function(options) {
			options = _ME.time2ms(options, {
				// 超时设置
				timeout: '8s'
			});

			// MapWS 中已将相关方法合并
			// | var queryType;
			// | 
			// | 根据参数情况自动判断查询方式
			// | if (params['name']) {
			// | 	queryType = 'POIS_BY_NAME';
			// | }
			// | else if (params['coordinate']) {
			// | 	queryType = 'POIS_BY_COORDINATE';
			// | }
			// | 
			// | if (!queryType) {
			// | 	//--No.2--
			// | 	// Error 被直接抛出，表明对于程序设计者而言这是一个真正的意外，
			// | 	// 其信息主要供调试时阅读，故须详尽明白，不得吝啬字节。
			// | 	// 与之相反的情形，参见注释 No.1
			// | 	// 如区分开发版和生产版，生产版中建议省略。                
			// | 	throw 'Service.cGeo.POIQuery failed: No pertinent conditions defined.';
			// | }

			_RUNNER_ = _MapWS('POIS_SEARCH', params, D.resolve, D.reject, options)
			return this;
		};

		this.abort = function() {
			if (_RUNNER_) _RUNNER_.abort();
		};
	};

	return window.geo = {
		Address        : Address        ,
		City           : City           ,
		Coordinate     : Coordinate     ,
		Geolocation    : Geolocation    ,
		locate         : locate         ,
		Map            : Map            ,
		POI            : POI            ,
		POIQuery       : POIQuery       ,
		SMap           : SMap
	};
});
