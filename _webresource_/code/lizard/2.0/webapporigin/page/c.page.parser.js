define(['cBase', 'cStore', 'CommonStore'], function (cBase, cStore, CommonStore) {
    var pageDocNode = null;
    var uuid = 0;
    function getID(url) {
        var id = "client_id_viewport_" + (++uuid) + "_" + (new Date().getTime());
        return id;
    }
    function _containFunc(obj, expr) {
        var ret = false;
        for (var p in obj) {
            if (ret) {
                return true;
            }
            if (_.isFunction(obj[p]) && obj[p].toString().indexOf(expr.trim()) > -1) {
                obj[p] = obj[p].toString().trim();
                return true;
            }
            else if (_.isObject(obj[p]) || _.isArray(obj[p])) {
                ret = _containFunc(obj[p], expr);
            }
        }
        return ret;
    }

    function reString(str) {
        var h = {
            '\r': '\\r',
            '\n': '\\n',
            '\t': '\\t'
        };
        var re1 = /([\.\\\/\+\*\?\[\]\{\}\(\)\^\$\|])/g;
        var re2 = /[\r\t\n]/g;
        return str.replace(re1, "\\$1").replace(re2, function (a) {
            return h[a];
        });
    }

    function fixReString(str) {
        var chars = str.split('');
        var isInCharDict = false; // []
        var t = '';
        var ret = [];
        while (t = chars.shift()) {
            ret.push(t);
            if (t == '\\') {
                ret.push(chars.shift());
            } else if (t == '[' && !isInCharDict) {
                isInCharDict = true;
            } else if (t == ']' && isInCharDict) {
                isInCharDict = false;
            } else if (t == '(' && !isInCharDict) {

                if (chars[0] == '?') {
                    if (chars[1] == '!') {

                    } else if (chars[1] == ':' || chars[1] == '=') {
                        chars.shift();
                        chars.shift();
                        ret.push('?');
                        ret.push(':');
                    } else {
                        ret.push('?');
                        ret.push(':');    
                    }
                }
            }
        }
        return ret.join('');
    }

    function urlParse(urlSchema, url) {
        var paraArr = [], tArr = [], params = {};
        var reStr = urlSchema.replace(/\{\{(.+?)\}\}/g, function (a, b) {
            tArr.push(b);
            return '{@' + (tArr.length - 1) + '}';
        }).replace(/\{(@?)(.+?)\}|[^\{\}]+/g, function (a, b, c) {
            var ret = '';
            if (c) {
                if (b) {
                    var pArr = tArr[c].match(/^(?:(?:\((\w+)\))?([^!=]+?)|([^!=]+?)=(.*))$/);
                    if (pArr) {
                        if (pArr[2]) {
                            switch (pArr[1]) {
                                case 'number':
                                    ret = '(\\d+(?:\\.\\d*)?|\\.\\d+)';
                                    break;
                                case 'int':
                                    ret = '(\\d+)';
                                    break;
                                case 'letter':
                                    ret = '([a-z _\\-\\$]+)';
                                    break;
                                default:
                                    ret = '([^\\\/]*)';
                                    break;
                            }
                            paraArr.push(pArr[2]);
                        } else {
                            paraArr.push(pArr[3]);
                            if (/^\/.*\/$/.test(pArr[4])) {
                                ret = '(' + fixReString(pArr[4].slice(1, -1)) + ')';
                            } else {
                                var arr = pArr[4].split('||');
                                for (var j = 0; j < arr.length; j++) {
                                    arr[j] = reString(arr[j]);
                                }
                                ret = '(' + arr.join('|') + ')';
                            }
                        }
                    } else {
                        ret = '';
                    }
                } else {
                    paraArr.push(c);
                    ret = '([^\\\/]*)';
                }
            } else {
                ret = reString(a);
            }
            return ret;
        });

        url = url.replace(/[#\?].*$/g, '');
        var matches = url.match(new RegExp(reStr, 'i')), pathRe = '/([^\/]*)';
        if (reStr[reStr.length - 1] != '\\') {
            pathRe = '\\/([^\/]*)'
        }
        var morePathmatches = url.match(new RegExp(reStr + pathRe, 'i'));
        if (matches && !morePathmatches) {
            for (var i = 0; i < paraArr.length; i++) {
                params[paraArr[i]] = matches[i + 1] || null;
            }
            return { reStr: reStr, param: params, index: matches.index };
        }
        return {};
    }


    /*
    获取传过来的参数
    */
    function getPageParams(url, urlschema) {
        url = decodeURIComponent(url);
        var ret = {};
        if (typeof urlschema == 'string') {
            urlschema = [urlschema];
        }
        _.each(urlschema, function (item) {
            var paraArr = [], paraHash = {};
            var parseRet = Lizard.schema2re(item, url);
            if (parseRet.reStr && parseRet.param) {
                ret = parseRet.param;
            }
        });
        // parseQuery: here cant replace hash to blank coz someone use querystring "from" which contain hash to show where the page come from  
        var queryStr = url.replace(/^[^\?#]*\??/g, '').replace(/#DIALOG_.*$/g, '').replace(/#\|cui-.*$/g, '');
        var searchReg = /([^&=?]+)=([^&]+)/g;
        var urlReg = /\/+.*\?/;
        var arrayReg = /(.+)\[\]$/;
        var match, name, value, isArray;
        while (match = searchReg.exec(queryStr)) {
            name = match[1].toLowerCase();
            value = match[2];
            isArray = name.match(arrayReg);
            //处理参数为url这种情况
            if (urlReg.test(value)) {
                ret[name] = queryStr.substr(queryStr.indexOf(value));
                break;
            } else {
                if (isArray) {
                    name = isArray[1];
                    ret[name] = ret[name] || [];
                    ret[name].push(value);
                } else {
                    ret[name] = value;
                }
            }
        }

        return ret;
    }

    function getPageUrlschema() {
        var configStr = getPageConfigStr(), ret = '';
        var arr = configStr.match(/([\'\"])?url_schema\1\s*:\s*([\'\"])(.*?)\2/) || configStr.match(/([\'\"])?url_schema\1\s*:\s*\[\s*([\'\"])((.|\s)*?)\2(\s*|,)]/);
        if (arr) {
            eval('ret = {' + arr[0] + '}[\'url_schema\']');
            return ret;
        }
        else {
            return '';
        }
    }

    function getPageConfigStr() {
        var configStr = pageDocNode.find('script[type="text/lizard-config"]').text();
        if (!configStr) {
            configStr = '{"url_schema": "","model": {"apis": []},"view":{}}';
        }
        return configStr;
    }
    /*
    获取页面配置项
    */
    function getPageConfig() {
        var configStr = getPageConfigStr();
        var ajaxDataMatch = configStr.match(/Lizard.D\(([\'\"])(.*?)([\'\"])\)(.*?)(,|\s)/g), dataexpr = [];
        if (ajaxDataMatch) {
            _.each(ajaxDataMatch, function (match) {
                var dataexprStr = match.split(',').join('').split('}').join('');
                dataexpr.push(dataexprStr);
            })
        }
        eval('var ret = ' + configStr);
        ret.dataexpr = dataexpr;
        return ret;
    }
    /*
    获取页面templates
    */
    function getPageTemplates() {
        var ret = {}, templates = pageDocNode.find('script[type="text/lizard-template"]');
        _.each(templates, function (template) {
            var tmplNode = $(template);
            if (tmplNode.attr('id')) {
                ret[tmplNode.attr('id')] = {
                    'runat': tmplNode.attr('runat') || 'all',
                    'text': removeTags(tmplNode.text(), 'client')
                };
            }
        });
        return ret;
    }
    function removeTags(html, runat) {
        var pageNode = $('<SCRIPT>' + html + '</SCRIPT>');
        pageNode.find('[runat=' + runat + ']').remove();
        return pageNode.text();
    }

    Lizard._initParser = function (url, html) {
        pageDocNode = $('<DIV>' + html + '</DIV>');
        Lizard.T.lizTmpl = getPageTemplates();
        Lizard.P.lizParam = getPageParams(url, getPageUrlschema());
        var pageConfig = getPageConfig();
        pageConfig.pageUrl = url;
        return pageConfig;
    }

    function _runUnderscore(tmpl, datas) {
        if (!datas) {
            datas = {};
        }
        var ret = '';
        if (tmpl) {
            var compiled = _.template(tmpl);
            var handler = Lizard.T;
            ret = compiled(datas, {
                Lizard: Lizard
            }).trim();
        }
        return ret;
    }

    Lizard.getModels = function (pageConfig) {
        if (!pageConfig.model) pageConfig.model = {};
        var apis = pageConfig.model.apis || [], ret = [], dataexpr = pageConfig.dataexpr;
        _.each(apis, function (api) {
            api.runat = api.runat || "all";
            if ((api.runat == 'client' && api.runat == Lizard.renderAt) || api.runat == "all") {
                ret.push(api);
            }
            if ('suspend' in api) {
                api.suspend = api.suspend.toString();
            }
            else {
                api.suspend = false;
            }
            _.each(dataexpr, function (p) {
                var postdataStr = JSON.stringify(api.postdata);
                if (JSON.stringify(postdataStr).indexOf(p) > -1 || _containFunc(api.postdata, p) || (api.suspend && api.suspend.indexOf(p) > -1)) {
                    if (!api.depends) {
                        api.depends = [];
                        api.expressionMap = {};
                    }
                    api.depends.push(eval(p.match(/Lizard.D\(([\'\"])(.*?)([\'\"])\)/g)[0].split('Lizard.D').join('')));
                    api.expressionMap[p] = dataexpr[p];
                }
            });
        });
        if (_.isFunction(pageConfig.errorBack)) {
            Lizard.errorBack = pageConfig.errorBack;
        }
        else {
            Lizard.errorBack = null;
        }
        return apis;
    }

    Lizard.S = function (stroename, key, defaultvalue) {
        if (!this.loacaStores) {
            this.loacaStores = {};
        }
        if (!this.loacaStores[stroename]) {
            if (stroename == 'SALES') {
                this.loacaStores[stroename] = CommonStore.SalesStore;
            }
            else if (stroename == 'SALES_OBJECT') {
                this.loacaStores[stroename] = CommonStore.SalesObjectStore;
            }
            else if (stroename == 'UNION') {
                this.loacaStores[stroename] = CommonStore.UnionStore;
            }
            else {
                this.loacaStores[stroename] = new cBase.Class(cStore, {
                    __propertys__: function () {
                        this.key = stroename;
                    }
                });
            }
        }
        if (!key) {
            return this.loacaStores[stroename].getInstance().get();
        }
        if (!this.loacaStores[stroename].getInstance().get()) {
            return defaultvalue;
        }
        return this.loacaStores[stroename].getInstance().get().hasOwnProperty(key) ? this.loacaStores[stroename].getInstance().get()[key] : defaultvalue;
    }

    Lizard.T = Lizard._T = function (tmplId, datas) {
        if (arguments.length == 1) {
            var ret = "";
            var t = Lizard.T.lizTmpl[tmplId];
            if (t && t.runat != ('server')) {
                ret = t.text;
            }
            return ret;
        }
        else {
            return _runUnderscore(Lizard._T(tmplId), datas);
        }
    }

    Lizard.P = function (key, val) {
        var ret = null;
        if (_.isUndefined(val)) {
            ret = Lizard.P.lizParam[key] || Lizard.P.lizParam[key.toLowerCase()];
        } else {
            ret = Lizard.P.lizParam[key] = val;
        }
        return ret;
    }

    Lizard.D = function (apiName) {
        if (this.ajaxDatas && this.ajaxDatas[apiName]) {
            return this.ajaxDatas[apiName];
        }
        return null;
    }

    Lizard.schema2re = urlParse;

    function _setTDKInfo(datas, pageConfig) {
        var TDKStr = [];
        var TDK = pageConfig.model.setTDK ? pageConfig.model.setTDK(datas) : {};
        var title = pageDocNode.find('title');
        if (TDK.title) {
            if (title) title.remove();
            TDKStr.push('<title>' + TDK.title + '</title>');
        }
        _.each(TDK, function (val, key) {
            if (!val) {
                return;
            }
            var metaNode = pageDocNode.find('meta[name="' + key + '"]');
            if (metaNode) metaNode.remove();
            TDKStr.push('<meta name="' + key + '" content="' + val + '" />');
        });

        return { TDK: TDK, TDKStr: TDKStr.join('') };
    }

    function _setUBTInfo() {
        var varNames = ['page_id', 'bf_ubt_orderid', 'ab_testing_tracker'];
        _.each(varNames, function (varName) {
            var values = '';
            var node = pageDocNode.find('#' + varName);
            if (node.get(0)) {
                values = node.val();
            }
            eval(varName + ' = \'' + values + '\'')
        });
        if (_.isArray(ab_testing_tracker)) {
            var ret = [];
            _.each(ab_testing_tracker, function (val, key) {
                _.each(val.attr("value").split(";"), function (val1, key1) {
                    if (val1) {
                        ret.push(val1);
                    }
                });
            });
            ab_testing_tracker = ret.join(";");
        }
    }

    Lizard.render = function (pageConfig, datas, dialogInfo) {
        var ret = {
            header: '',
            viewport: ''
        };
        if (arguments.length == 2) {
            _setUBTInfo();
        }
        var validateRet = true;
        if (_.isFunction(pageConfig.validate)) {
            validateRet = pageConfig.validate(datas);            
        }
        if (!validateRet && _.isFunction(pageConfig.modelOnError)) {
            ret = pageConfig.modelOnError(datas);
        }
        else {
            var result = _setTDKInfo(datas, pageConfig);            
            if (pageConfig.model.filter) {
                datas = pageConfig.model.filter.call(this, datas, result.TDK);
            }
        }

        for (var tmplName in pageConfig.view) {
            if (pageConfig.view.hasOwnProperty(tmplName)) {
                ret[tmplName] = _runUnderscore(pageConfig.view[tmplName], datas);
            }
        }

        var id = dialogInfo ? dialogInfo.pageID + "$" + dialogInfo.dialogName : getID(pageConfig.pageUrl);

        ret.viewport = ['<div id="', id, '" page-url="', pageConfig.pageUrl, '">', ret.viewport, '</div>'].join('').trim();
        ret.id = id;
        ret.controller = pageConfig.controller;
        ret.config = pageConfig;
        ret.datas = datas;
        ret.lizTmpl = Lizard.T.lizTmpl;
        ret.lizParam = Lizard.P.lizParam;
        ret.TDK = result?result.TDKStr:'';
        ret.validateRet = validateRet;
        if (dialogInfo) {
            ret = _.extend(ret, dialogInfo.ubtInfo)
        }
        else {
            ret.page_id = page_id;
            ret.ab_testing_tracker = ab_testing_tracker;
            ret.bf_ubt_orderid = bf_ubt_orderid;
        }
        return ret;
    }

    Lizard.getController = function (pageConfig) {
        return pageConfig.controller
    }
});