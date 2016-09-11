define(['cHybridShell'], function (Hish) {
    var exports = {
        ready: function (callback) {
            // @todo
            callback();
            return exports;
        },

        error: function (callback) {
            // @todo
            return exports;
        },

        init: function () {
            // @todo
            return exports;
        },

        // 每个方法名下辖两个函数：
        // run  = 执行函数
        // ping = 可用性判别函数
        METHOD: {
            share: {
                /**
                 * 此处注释仅供参考，以 c.shell.js 中的注释为准。
                 *
                 * @param {Object}          options
                 * @param {String}          options.title         标题
                 * @param {String}          options.desc          描述
                 * @param {String}          options.href          链接地址
                 * @param {String}         [options.icon   ]      分享图标
                 * @param {String}         [options.type   ]      分享类型
                 * @param {String}         [options.src    ]      分享资源地址
                 * @param {String|Number}  [options.timeout]      超时限制
                 */
                run: function (onsuccess, onerror, options) {
                    var callback = function (params, err) {
                        var MSGS = {
                            201: '',
                            202: 'canceled',
                            203: 'params_unsupported'
                        };
                        if (err) {
                            onerror(new Error(MSGS[-err.number]));
                        }
                        else {
                            onsuccess();
                        }
                    };

                    var info = {
                        shareType: 'Default',
                        title: options.title,
                        text: options.desc,
                        imageUrl: options.icon,
                        linkUrl: options.href
                    };

                    Hish.fn('call_custom_share', callback).run([info]);
                },

                ping: function (onsuccess, onerror, options) {
                    if (Hish.fn('call_custom_share')) {
                        onsuccess();
                    } else {
                        onerror();
                    }
                }
            }
        }
    };
    return exports;
});