/**
 * Created by jp_wang on 2015/9/28.
 */
define(['UIPhotoBrowser'], function(UIPhotoBrowser) {
    return _.inherit(UIPhotoBrowser, {
        propertys: function ($super) {
            $super();

            //数据模型
            this.datamodel = {
                page_id: "",
                duid: "",
                url: "",
                thumbnailFn: function(item) {
                    return "";
                }
            };

        },
        getUbtData: function() {
            var array = ["page_id=" + this.datamodel.page_id, "duid=" + this.datamodel.duid, "businessCode=" + this.datamodel.meta.businessCode];
            return array.join("&");
        },
        initialize: function($super, opts) {
            $super(opts);
            // 多图页面展示的次数，用户数
            window.__bfi.push(["_asynRefresh",{page_id: this.datamodel.page_id, url: this.datamodel.url, businessCode: this.datamodel.meta.businessCode, isThumbnail: true}]);
        },
        showSingle: function($super, e) {
            $super(e);
            // 统计单图浏览的次数用户数
            window.__bfi.push(["_asynRefresh",{page_id: this.datamodel.page_id, url: this.datamodel.url,  businessCode: this.datamodel.meta.businessCode, isThumbnail: false}]);
        },
        showNotice: function($super, e) {
            $super(e);
            // 保存按钮点击的用户数、次数
            window['__bfi'].push(['_tracklog', "h5_pb_click_save", this.getUbtData()]);
        },
        initSize: function($super, $root) {
            $super($root);
            var that = this,
                img = $root.find('img'),
                d1 = new Date().getTime();
            $.each(img, function(index, item) {
                $(item).on('load', function() {
                    var d2 = new Date().getTime(),
                        value = ["loadingTime=" + (d2 - d1), "businessCode=" + that.datamodel.meta.businessCode];
                    if($root === that.datamodel.thumbnailRoot) {
                        window['__bfi'].push(['_tracklog', "h5_pb_load_thumbnail", value.join("&")]);
                    }else {
                        window['__bfi'].push(['_tracklog', "h5_pb_load_single", value.join("&")]);
                    }

                });
            });
        }
    });
});