// @see http://mp.weixin.qq.com/wiki/home/
// @see http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html

define(['//res.wx.qq.com/open/js/jweixin-1.0.0.js'], function(jWeixin) {
	var

	//	_WEIXIN_APP_ID = 'wxc518c18033e13d7c', // <@储诚栋>提供的测试账号
	//	_WEIXIN_APP_ID = 'wx683e0101b5487dac', // FAT 测试账号
	//	_WEIXIN_APP_ID = 'wxd10191c3d182f2c2', // UAT 测试账号
		_WEIXIN_APP_ID = 'wx0a4845e45aaf634a', // 生产账号
		_WEIXIN_METHODS = [
			'onMenuShareTimeline'     ,
			'onMenuShareAppMessage'   ,
			'onMenuShareQQ'           ,
			'onMenuShareWeibo'        ,
			'startRecord'             ,
			'stopRecord'              ,
			'onVoiceRecordEnd'        ,
			'playVoice'               ,
			'pauseVoice'              ,
			'stopVoice'               ,
			'onVoicePlayEnd'          ,
			'uploadVoice'             ,
			'downloadVoice'           ,
			'chooseImage'             ,
			'previewImage'            ,
			'uploadImage'             ,
			'downloadImage'           ,
			'translateVoice'          ,
			'getNetworkType'          ,
			'openLocation'            ,
			'getLocation'             ,
			'hideOptionMenu'          ,
			'showOptionMenu'          ,
			'hideMenuItems'           ,
			'showMenuItems'           ,
			'hideAllNonBaseMenuItem'  ,
			'showAllNonBaseMenuItem'  ,
			'closeWindow'             ,
			'scanQRCode'              ,
			'chooseWXPay'             ,
			'openProductSpecificView' ,
			'addCard'                 ,
			'chooseCard'              ,
			'openCard'

		],
		_WEIXIN_THD_METHODS=[
			'getInstallState'			,
			'launch3rdApp'
		],
		_WEIXIN_All_METHODS=_WEIXIN_METHODS.concat(_WEIXIN_THD_METHODS);

	// 获取自定义公众号
	var _AUTONOMOUS_APP_ID = $('meta[name=weixinAppId]').attr('content');
	if (_AUTONOMOUS_APP_ID) _WEIXIN_APP_ID = _AUTONOMOUS_APP_ID;

	var _ME = {
		// 是否就绪
		// ready: false,

		// 是否在初始化过程中
		// 模块只有两种状态，即“初始化”或“初始化结束”，不存在“等待初始化”的状态。
		// loading: false,

		// 模块全局错误
		// 该错误可用于标志初始化失败
		// error: undefined,

		calls: { ready: [], error: [] },

		applyAll: function(fns, scope, args) {
			for (var i = 0, fn; fn = fns[i++]; ) {
				fn.apply(scope, args);
			}
		},

		Array: function(something) {
			var ret = [];

			if (something instanceof Array)
				ret = something;

			else
				for (var i = 0; i < something.length; i++) ret[i] = something[i];

			return ret;
		},

		load: function(apicallback) {
			if(	_ME.iniready){
				if(apicallback && typeof(apicallback)=="function") {
					apicallback(jWeixin);
				}
				return;
			}

			_ME.ready   = false ;
			_ME.loading = true  ;
			// 获取当前 URL
			var data = {
				AppID      : _WEIXIN_APP_ID,
				CurrentURL : window.location.href.replace(/#.*$/, '')
			};

			var callback = function(res) {
				// config 参数注释首行来自微信官方文档
				// @see http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html#.E6.AD.A5.E9.AA.A4.E4.B8.89.EF.BC.9A.E9.80.9A.E8.BF.87config.E6.8E.A5.E5.8F.A3.E6.B3.A8.E5.85.A5.E6.9D.83.E9.99.90.E9.AA.8C.E8.AF.81.E9.85.8D.E7.BD.AE
				jWeixin.config({
					//开启JSBridge模式，由于市场的特殊接口这个beta必须为true
					beta: true,

					// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					debug: false,

					// 必填，公众号的唯一标识
					appId: data.AppID,

					// 必填，生成签名的时间戳
					timestamp: res.Timestamp,

					// 必填，生成签名的随机串
					nonceStr: res.Noncestr,

					// 必填，签名，见附录1
					// @see http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html#.E9.99.84.E5.BD.951-JS-SDK.E4.BD.BF.E7.94.A8.E6.9D.83.E9.99.90.E7.AD.BE.E5.90.8D.E7.AE.97.E6.B3.95
					signature: res.Signature,

					// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
					// @see http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html#.E9.99.84.E5.BD.952-.E6.89.80.E6.9C.89JS.E6.8E.A5.E5.8F.A3.E5.88.97.E8.A1.A8
					jsApiList: _WEIXIN_All_METHODS
				});
				_ME.iniready   = true;
				if(apicallback && typeof(apicallback)=="function") {
					apicallback(jWeixin);
				}
			};

			$.ajax({
				// FAT 接口地址
				//	url      : 'http://ws.mobile.fat19.qa.nt.ctripcorp.com/WeiXinJSAccessToken/json/WeChatJSTicket',

				// UAT 接口地址
				//	url      : 'http://ws.mobile.uat.qa.nt.ctripcorp.com/WeiXinJSAccessToken/json/WeChatJSTicket',

				// 生产环境接口地址
				url      : '//m.ctrip.com/restapi/soa2/10645/WeChatJSTicket',

				dataType : 'jsonp',
				data     : data,
				success  : callback
			});
		},

		// 功能可用性判断函数集
		available: (function() {
			// 功能可用性信息，按 <fnName>: Boolean 的格式保存。		
			var availables;

			// 微信 6.0.2（不含）以下版本，不支持异步回调的 checkJsApi 方法。
			if (Lizard.app.code.is('WEIXIN') && Lizard.app.version.lt('6.0.2')) availables = {};

			// @param {Boolean }   all        是否要求全部可用
			// @param {Function}  [onsuccess] 可用性满足时的回调函数 
			// @param {Function}  [onerror  ] 可用性不满足时的回调函数（onerror 依赖 onsuccess）
			// @param {String  }  [fnName   ] 功能名称，可以有多个
			// @param {Array   }  [fnNames  ] 功能名称数组（fnName 与 fnNames 互斥）
			var judge = function(all /*, OPTIONAL Function onsuccess, OPTIONAL Function onerror, String fnName_1, OPTIONAL String fnName_2, ...*/) {
				var
					ret = all,
					i = 1,
					onsuccess,
					onerror,
					fns;

				if (_.isFunction(arguments[i])) {
					onsuccess = arguments[i++];
					if (_.isFunction(arguments[i])) onerror = arguments[i++];
				}

				if (_.isArray(arguments[i])) i = 0, fns = arguments[i];
				else fns = arguments;

				init(function() {
					for (; i < fns.length; i++)
						if (!!availables[fns[i]] != all) {
							ret = !all;
							break;
						}

					if (ret && onsuccess) onsuccess();
					if (!ret && onerror) onerror(_ERR_UNAVAILABLE);
				});

				return ret;
			};

			// 检查所有方法的可用性			
			var init = function(callback) {
				if (availables) callback && callback();

				else jWeixin.checkJsApi({
					jsApiList: _WEIXIN_METHODS,
					success: function(res) {
						availables = res.checkResult;
						callback && callback();
					}
				});
			};
			init();

			return {
				init: init,

				// 判断是否其中有任一功能可用
				some: function() {
					var args = _ME.Array(arguments);
					args.unshift(false);
					judge.apply(null, args);
				},

				// 判断是否全部功能均可用
				all: function() {
					var args = _ME.Array(arguments);
					args.unshift(true);
					judge.apply(null, args);
				}
			};
		})(),

		end: 0
	};

	var _ERR_UNAVAILABLE = new Error('unavailable');

	// 注册配置响应函数
	// 注意：配置失败也会触发回调。
	jWeixin.ready(function(res) {

		_ME.ready = true;
		delete _ME.error;

		_ME.applyAll(_ME.calls.ready);
		_ME.calls.ready = [];

		return exports;
	});

	// 注册错误监控函数
	// 注意：该方法与 ready 并非对等关系！任何错误（包括功能调用中的错误）都会触发回调。
	jWeixin.error(function(res) {
		_ME.ready = false;
		_ME.error = new Error(res.errMsg);

		// 如果错误系因签名过期导致，则重新初始化（验证）
		// @todo 待匹配的错误信息格式未知
		if (_ME.error == 'config:invalid signature') {
			_ME.load();
		}

		// 否则，执行 cShell 的 error 调用。
		else {
			_ME.applyAll(_ME.calls.error, [ _ME.error ]);
			_ME.calls.error = [];
		}

		return exports;
	});

	var exports = {

		ready: function(callback) {
			if (_ME.ready) callback();
			else _ME.calls.ready.push(callback);

			return exports;
		},

		error: function(callback) {
			if (_ME.error) callback(_ME.error);
			else _ME.calls.error.push(callback);

			return exports;
		},

		init: function(callback) {
			_ME.load(callback);

			return exports;
		},
		// 每个方法名下辖两个函数：
		// run  = 执行函数
		// ping = 可用性判别函数
		// 有关方法参数注释仅供参考，以 c.shell.js 中的注释为准。				 
		METHOD: {

			detectDevice: {
				run: function(onsuccess, onerror, options) {
					jWeixin.getNetworkType({
						success: function(res) {
							// 2g, 3g, 4g, wifi
							onsuccess({
								networkType: res.networkType.toUpperCase()
							});
						}
					})
				},

				ping: function() {
					_ME.available.all(onsuccess, onerror, 'getNetworkType');
				}
			},

			scanBarcode: {
				run: function(onsuccess, onerror, options) {
					jWeixin.scanQRCode({
						needResult : 1,
						scanType   : ['barCode'],
						success    : function(res) { onsuccess(res.resultStr); }
					});
				},

				ping: function() {
					_ME.available.all(onsuccess, onerror, 'scanQRCode');
				}
			},

			scanQrcode: {
				run: function(onsuccess, onerror, options) {
					jWeixin.scanQRCode({
						needResult : 1,
						scanType   : ['qrCode'],
						success    : function(res) { onsuccess(res.resultStr); }
					});
				},

				ping: function() {
					_ME.available.all(onsuccess, onerror, 'scanQRCode');
				}
			},

			share: {
				/**
				 * @param {Object}          options
				 * @param {String}          options.title         标题
				 * @param {String}          options.desc          描述
				 * @param {String}          options.href          链接地址
				 * @param {String}         [options.icon   ]      分享图标
				 * @param {String}         [options.type   ]      分享类型
				 * @param {String}         [options.src    ]      分享资源地址
				 * @param {String|Number}  [options.timeout]      超时限制
				 */
				run: function(onsuccess, onerror, options) {
					var oncancel = function() { onerror(new Error('canceled')); }

					// @todo 调用参数合并优化

					// 注册“分享到朋友圈”的内容及菜单按钮点击事件响应函数
					jWeixin.onMenuShareTimeline({
						title   : options.title ,
						link    : options.href  ,
						imgUrl  : options.icon  ,
						success : onsuccess     ,
						cancel  : oncancel
					});

					// 注册“分享给朋友”的内容及菜单按钮点击事件响应函数
					jWeixin.onMenuShareAppMessage({
						title   : options.title ,
						desc    : options.desc  ,
						link    : options.href  ,
						imgUrl  : options.icon  ,
						type    : options.type  ,
						dataUrl : options.src   ,
						success : onsuccess     ,
						cancel  : oncancel
					});

					// 注册“分享到QQ”的内容及菜单按钮点击事件响应函数
					jWeixin.onMenuShareQQ({
						title   : options.title ,
						desc    : options.desc  ,
						link    : options.href  ,
						imgUrl  : options.icon  ,
						success : onsuccess     ,
						cancel  : oncancel
					});

					// 注册“分享到腾讯微博”的内容及菜单按钮点击事件响应函数
					jWeixin.onMenuShareWeibo({
						title   : options.title ,
						desc    : options.desc  ,
						link    : options.href  ,
						imgUrl  : options.icon  ,
						success : onsuccess     ,
						cancel  : oncancel
					});
				},

				ping: function(onsuccess, onerror) {
					_ME.available.some(
						onsuccess              ,
						onerror                ,
						'onMenuShareTimeline'  ,
						'onMenuShareAppMessage',
						'onMenuShareQQ'        ,
						'onMenuShareWeibo'
					);
				}
			},

			voice2text: {
				run: function(onsuccess, onerror, options) {
					options = _.extend({

						// 录音时长（单位：毫秒）
						duration: 5000,

						// 录音结束后是否重播
						replay: true

					}, options);

					// 开始录音
					jWeixin.startRecord();

					// 规定时间后停止录音
					var autoStop = function() {
						// 停止录音
						jWeixin.stopRecord({
							success: function(res) {
								// 重播可以帮助用户判断录音结果是否准确
								if (options.replay) jWeixin.playVoice({ localId: res.localId });

								// 启动语音识别
								jWeixin.translateVoice({
									localId: res.localId,
									isShowProgressTips: 1,
									success: function(res) {
										// 文本格式化处理
										onsuccess(res.translateResult.replace('。', ''));
									}
								})
							}
						})
					};
					window.setTimeout(autoStop, options.duration);
				},

				ping: function(onsuccess, onerror, options) {
					_ME.available.all(
						onsuccess        ,
						onerror          ,
						'startRecord'    ,
						'stopRecord'     ,
						'playVoice'      ,
						'translateVoice'
					);
				}
			},

			uploadimage:{
				run:function(onsuccess, onerror, options){
					jWeixin.chooseImage({
						success: function (res) {
							var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
							var i= 0, imglength =localIds.length;
							if (localIds.length == 0) {
								return;
							}

							if (options.imgNumCheck && typeof(options.imgNumCheck) == "function") {
								var imgChecked = options.imgNumCheck(imglength);
								if (!imgChecked) {
									return;
								}
							}

							function upload(onsuccess,onerror) {
								jWeixin.uploadImage({
									localId:localIds[i],
									success: function(res){
										onsuccess({res:res,localid:localIds[i]});
										i++;
										if (i < imglength) {
											setTimeout(function(){
												upload(onsuccess,onerror)
											},100);
										}
									},
									fail: function(err){
										onerror(err);
									}
								});
							};
							setTimeout(function(){upload(onsuccess,onerror)},100);
						}
					});
				},
				ping:function(onsuccess,onerror){
					_ME.available.some(
						onsuccess              ,
						onerror                ,
						'chooseImage'             ,
						'previewImage'            ,
						'uploadImage'
					);
				}
			}
		}
	};

	return exports;
})