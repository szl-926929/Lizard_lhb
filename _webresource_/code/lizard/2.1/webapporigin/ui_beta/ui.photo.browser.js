define(['UIView', 'UIPinchZoom', getAppUITemplatePath('ui.photo.browser')], function (UIView, UIPinchZoom, template) {

    return _.inherit(UIView, {
        propertys: function ($super) {
            $super();

            //数据模型
            this.datamodel = {
                data: [],
                showPhotoIndex: 0,
                meta:{
                    isThumbnailModel: true,
                    businessCode: ''
                },
                thumbnailFn: function(item) {
                    return "";
                }
            };

            this.template = template;

            this.events = {
                'click .type_list a': 'setCategory',
                'click .picture_list a': 'showSingle',
                'click .back': 'goBack',
                'click .download': 'showNotice',

            };
        },
        showNotice: function() {
            if(!this.datamodel.isThumbnail && !this.datamodel.isImmerse) {
                Lizard.showToast('请长按屏幕保存图片');
            }
        },
        setCategory: function(e) {
            var el = $(e.currentTarget);
            this.$('.type_list a').removeClass('current');
            el.addClass('current');
            this.datamodel.isThumbnail = !!1;
            if(this.datamodel.isThumbnail) {
                this.toggleModel();
            }
            var currentCategory = this.getCategory(),
                imgs = this.datamodel.thumbnailRoot.find('a');
            if(currentCategory === '全部') {
                imgs.css('display', 'block');
            }else {
                $.map(imgs, function(item) {
                    if($(item).attr('data-target') === currentCategory) {
                        $(item).css('display', 'block');
                    }else {
                        $(item).css('display', 'none');
                    }
                });
            }
        },
        goBack: function() {
            if(this.datamodel.isThumbnail) {
                Lizard.goBack();
            }else {
                this.datamodel.isThumbnail = !this.datamodel.isThumbnail;
                this.toggleModel();
            }
        },

        attachEvents: function(dom) {
            var self = this,
                length = null,
                el = null,
                lis = null,
                data = self.getImgs(self.getCategory());

            var event = {
                    x: 0,
                    y: 0
                },
                firstTouch = 0,
                index = 0;
            dom.on('touchstart', function(e) {
                //e.preventDefault();
                el = $(e.currentTarget);
                length = self.getImgs(self.getCategory()).length;
                event = {
                    x: e.x || e.touches[0].pageX,
                    y: e.y || e.touches[0].pageY
                };
                firstTouch = e.timeStamp;
                index = self.getCategory() === '全部' ? parseInt(dom.attr('data-index')) : parseInt(dom.attr('data-category-index'));
            });
            dom.on('touchmove', function(e) {
                e.preventDefault();
            });
            dom.on('touchend', function(e) {

                if(e.changedTouches.length === 2 || e.touches.length === 1) {
                    return false;
                }
                if(e.touches.length === 0 && (e.x || e.changedTouches[0].pageX) === event.x && (e.y || e.changedTouches[0].pageY) === event.y) {
                    self.handleTap(e);
                }
                else if (e.touches.length === 0 && (e.x || e.changedTouches[0].pageX ) - event.x > 30 && index > 1) {
                    // 右滑
                    if(index > 1) {
                        self.insertPage('right', data[parseInt(index)-2], parseInt(index)-2, -1, length);
                    }
                    lis = self.datamodel.sliderRoot.find('li');
                    $.map(lis, function(item, index) {
                        self.updateStyle($(item), index);
                    });
                    setTimeout(function() {
                        $(lis[1]).remove();
                    }, 500);
                }else if(e.touches.length === 0 && event.x - (e.x || e.changedTouches[0].pageX) > 30 && index < length) {
                    // 左滑
                    if(index < length) {
                        self.insertPage('left',data[parseInt(index)], parseInt(index), 1, length);
                    }

                    lis = self.datamodel.sliderRoot.find('li');
                    $.map(lis, function(item, index) {
                        self.updateStyle($(item), index - 1);
                    });
                    setTimeout(function() {
                        $(lis[0]).remove();
                    }, 500);

                }
            });
            new UIPinchZoom(dom.find('.show_box'));
        },
        updateStyle: function (el, diff) {
            var width = document.body.offsetWidth;
            el.css({
                '-webkit-transform': 'translate3d('+ diff * width +'px, 0, 0)',
                '-webkit-transition-duration': '400ms'
            });
        },
        handleTap: function(e) {
            this.datamodel.isImmerse = !this.datamodel.isImmerse;

            var self = this,
                el = $(e.currentTarget),
                detail = el.find('.detail'),
                footer = this.$('.type_list'),
                header = this.$('.header'),
                isImmerse = this.datamodel.isImmerse ? 'none' : 'block';

            $.map([detail, header, footer], function(item) {
                if(item.length > 0) {
                    if(item === footer && Object.getOwnPropertyNames(self.datamodel.tabs).length === 1){
                        return;
                    }
                    item.css('display', isImmerse);
                }
            });
        },
        initSize: function($root) {
            var imgs = $root.find('img');
            $.each(imgs, function(index, item) {
                $(item).on('load', function() {
                    var image = {
                        height: item.naturalHeight,
                        width: item.naturalWidth
                    };
                    var parent = {
                        height: $(item).parent().attr('clientHeight'),
                        width: $(item).parent().attr('clientWidth')
                    };
                    if(image.height > image.width) {
                        $(item).css({
                            'height': '100%',
                            'margin-left': (parent.width - image.width * parent.height / image.height)/2 + 'px'
                        });
                    }else {
                        $(item).css({
                            'width': '100%',
                            'margin-top': (parent.height - image.height * parent.width / image.width)/2 + 'px'
                        });
                    }
                });
            });
        },
        formatData: function(data) {
            var counts = {}, origin = JSON.parse(JSON.stringify(data));

            counts['全部'] = 1;

            for(var i = 0; i < origin.length; i++) {
                if(origin[i].category !== "") {
                    if(!counts[origin[i].category]) {
                        counts[origin[i].category] = 1;
                    }
                    else {
                        counts[origin[i].category] ++;
                    }
                }
                origin[i].index = parseInt(i) + 1;
                origin[i].category_index = counts[origin[i].category];
            }

            return {
                origin: origin,
                tabs: counts
            };
        },
        getCategory: function() {
            return this.$('.type_list .current').attr('data-filter');
        },
        getImgs: function(category) {
            var imgs = [];
            if(category === '全部'){
                imgs = this.datamodel.list;
            } else {
                $.map(this.datamodel.list, function(item) {
                    if(item.category === category) {
                        imgs.push(item);
                    }
                });
            }
            return imgs;
        },
        getIndex: function(category, el) {
            return (category === '全部')? el.attr('data-index') : el.attr('data-category-index');
        },
        appendPage: function(cindex, data) {
            var $root = this.$('#pb_slider_group'),
                width = document.body.offsetWidth,
                height = document.body.offsetHeight;

            $root.css({
                'width': width + 'px',
                'height': height + 'px'
            });

            for(var i = 1; i <= data.length; i++) {
                if(i === parseInt(cindex) ) {
                    var $li = $("<li data-index='" +  data[i-1].index + "' data-category-index='" + data[i-1].category_index + "' class='picture_show' style='width: " + width + "px'>" +
                        "<div class='show_box'><img src='" + data[i-1].imageUrl + "'></div>" +
                        "<div class='detail'><h3 class='tit'>" + data[i-1].imageTitle + "</h3><p>" + data[i-1].imageDescription + "</p><span class='picture_number'>" + cindex + "/" + data.length + "</span></div></li>");

                    this.initSize($li);
                    this.updateStyle($li, 0);
                    this.attachEvents($li);
                    $root.append($li);
                }
            }
        },
        insertPage: function(dir, data, index, diff, length) {
            var $root = this.$('#pb_slider_group'),
                width = document.body.offsetWidth,
                $dom = $("<li data-index='" +  data.index + "' data-category-index='" + data.category_index + "' class='picture_show' style='width: " + width + "px'>" +
                    "<div class='show_box'><img src='" + data.imageUrl + "'></div>" +
                    "<div class='detail'><h3 class='tit'>" + data.imageTitle + "</h3><p>" + data.imageDescription + "</p><span class='picture_number'>" + (index + 1) + "/" + length + "</span></div></li>");

            this.initSize($dom);
            this.updateStyle($dom, diff);
            this.attachEvents($dom);
            if(dir === 'left') {
                $root.append($dom);
            }else {
                $root.prepend($dom);
            }
        },
        showSingle: function(e) {
            var el = $(e.currentTarget),
                currentCategory = this.getCategory(),
                currentIndex = this.getIndex(currentCategory, el),
                imgs = this.getImgs(currentCategory);

            this.datamodel.isThumbnail = !this.datamodel.isThumbnail;
            this.toggleModel();
            this.appendPage(currentIndex, imgs);
        },
        toggleModel: function() {
            if(this.datamodel.isThumbnail) {
                this.$('.header').addClass('picture_view_title');
                this.$('.download').css('display', 'none');
            }else{
                this.$('.header').removeClass('picture_view_title');
                this.$('.download').css('display', 'block');
            }
            this.datamodel.sliderRoot.find('li').remove();
            this.datamodel.sliderRoot.css('display', this.datamodel.isThumbnail ? 'none': 'block');
            this.datamodel.thumbnailRoot.css('display', this.datamodel.isThumbnail ? 'block': 'none');
        },
        handleMove: function() {
            var el = this.$('.type_list .type_box'),
                event = {
                    x: 0
                },
                originX = 0,
                moveX = 0,
                translate = 0,
                elWidth = document.body.offsetWidth;
            el.on('touchstart', function(e) {
                e.preventDefault();
                originX = $(this).offset().left;
                event.x = e.touches[0].pageX;
            });
            el.on('touchmove', function(e) {
                e.preventDefault();
                moveX = e.changedTouches[0].pageX - event.x;
                translate = moveX + originX;

                if(translate <= 10 && translate >= parseInt(el.css('width')) - elWidth) {
                    $(this).css({
                        '-webkit-transform': 'translate3d('+ translate +'px, 0, 0)',
                        '-webkit-transition-duration': '400ms',
                        'transform': 'translate3d('+ translate  +'px, 0, 0)'
                    });
                }
            });
        },
        initialize: function($super, opts) {
            var origin = JSON.parse(JSON.stringify(opts.datamodel.data)),
                newData = this.formatData(origin),
                data = {
                    datamodel: {
                        list: newData.origin,
                        tabs: newData.tabs,
                        isThumbnail: true,
                        isImmerse: false
                    }
                };

            $.extend(opts.datamodel, data.datamodel);

            $super(opts);

            this.datamodel = $.extend(opts.datamodel, {
                thumbnailRoot: this.$('.picture_wrap'),
                sliderRoot: this.$('.slider-wheel')
            });
        },
        addEvent: function($super) {
            $super();
            this.on('onShow', function() {
                this.handleMove();
                if(this.datamodel.meta.isThumbnailModel) {
                    this.initSize(this.$(this.datamodel.thumbnailRoot));
                }else{
                    // 直接进入大图
                    this.datamodel.isThumbnail = false;
                    this.toggleModel();
                    this.appendPage(this.datamodel.showPhotoIndex, this.datamodel.list);
                }
                setTimeout(function () {
                    this.$('.pb_amount_notice').css('display', 'none');
                }, 1000);
            });
        }
    });

});