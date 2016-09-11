﻿define(['libs', 'cMessageCenter'], function (libs, MessageCenter) {
  "use strict";

  var ImgLazyload = _.inherit({
    __propertys__: function () {
      this.isError = false;
      this.uuid = _.uniqueId() + new Date().getTime();
    },

    initialize: function (opts) {
      this.__propertys__();
      this.handleOpts(opts);
      if(this.isNoTop){
        this.checkWrapperDisplay();
      }else{
        this.init();
      }
    },

    //用以解决父容器不显示导致高度失效问题
    checkWrapperDisplay: function () {
      //如果容器高度为0，一定是父容器高度不显示导致
      if (this.isError) {
        return;
      }
      if (this.TIMERRES) {
        clearInterval(this.TIMERRES);
      }
      if ($(this.imgs[0]).offset().width === 0) {
        this.isError = true;
        var maxTimes = 0;
        this.TIMERRES = setInterval($.proxy(function () {
          maxTimes ++ ;
          console.log('检测img offset.....');
          if ($(this.imgs[0]).offset().width > 0 || maxTimes >= 10 ) {
            if (this.TIMERRES) {
              clearInterval(this.TIMERRES);
            }
            console.log('检测img offset结束，重设高度');
            this.isError = false;
            this.refresh();
          }
        }, this), 100);
      }
    },

    handleOpts: function (opts) {
      this.isError = false;
      if (!opts || !opts.imgs || !opts.imgs.length) { this.isError = true; return; }
      this.imgs = opts.imgs;
      this.container = opts.container || $(window);
      this.width = opts.width;
      this.height = opts.height;

      this.loadingImg = opts.loadingImg || (((typeof Lizard != 'undefined') && Lizard.isHybrid)?"https:":"") +'//pic.c-ctrip.com/vacation_v2/h5/group_travel/no_product_pic.png';
      this.loadingBg = opts.loadingBg || '#ebebeb';

      this.needWrapper = false;
      if (this.width || this.height) {
        this.needWrapper = true;
      }

      this.wrapper = opts.wrapper || '<div class="cui_lazyload_wrapper" style="text-align: center; vertical-align: middle; "></div>';
      this.imgContainer = {};
      this.isNoTop = $(this.imgs[0]).offset().width === 0;
    },

    init: function () {
      if (this.isError) {
        return;
      }
      this.initImgContainer();
      this.lazyLoad();
      this.bindEvents();
    },

    refresh: function (opts) {
      if (opts) {
        this.handleOpts(opts);
      }
      this.init();
    },

    bindEvents: function () {
      if (this.isError) {
        return;
      }

      this.destroy();

      //为container绑定事件
      var scrollTimeout;
      this.container.on('scroll.imglazyload' + this.uuid, $.proxy(function () {
        if(scrollTimeout){
          clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout($.proxy(function(){
          if(scrollTimeout){
            clearTimeout(scrollTimeout);
          }
          this.lazyLoad();
        },this),300);
      }, this));

      $(window).on('resize.imglazyload' + this.uuid, $.proxy(function () {
        this.initImgContainer();
      }, this));

      //图片加载失败相关逻辑
      MessageCenter.subscribe('image.lazyloaded', this.fixOffset, this);
    },

    initImgContainer: function () {
      if (this.isError) {
        return;
      }

      var el, i, len, offset;
      for (i = 0, len = this.imgs.length; i < len; i++) {
        el = $(this.imgs[i]);
        if (!el.attr('data-src') || el.attr('data-load') == '1') {
          continue;
        }

        offset = el.offset();


        if (!this.imgContainer[offset.top]) {
          this.imgContainer[offset.top] = [];
        }
        this.imgContainer[offset.top].push(el);
      }
    },

    //实际操作图片处
    _handleImg: function (tmpImg) {
      var sysImg, wrapper, scope = this;
      if (tmpImg.attr('data-src')) {
        if (this.needWrapper) {
          wrapper = $(this.wrapper);
          wrapper.css({
            width: this.width + 'px',
            height: this.height + 'px',
            'background-color': this.loadingBg
          });
          wrapper.insertBefore(tmpImg);
          wrapper.append(tmpImg);
        }

        sysImg = $(new Image());

        if (!tmpImg.attr('src')) {
          tmpImg.attr('src', this.loadingImg);
        }

        sysImg.on('error', function () {
          tmpImg.attr('src', scope.loadingImg);
          MessageCenter.publish('image.lazyloaded', [scope.uuid]);
        }).on('load', function () {
          tmpImg.attr('src', tmpImg.attr('data-src'));
          tmpImg.attr('data-load', '1');

          setTimeout(function () {
            if (wrapper && wrapper[0]) {
              tmpImg.insertBefore(wrapper);
              wrapper.remove();
            }
            MessageCenter.publish('image.lazyloaded', [scope.uuid]);
          }, 1);
        }).attr('src', tmpImg.attr('data-src'));

      }
    },

    lazyLoad: function () {
      if (this.isError) {
        return;
      }

      var height;
      if (this.container[0] === window) {
        height = this.container.height();
      } else {
        var offset = this.container.offset();
        height = offset.top + offset.height;
      }

      var srollHeight = this.container.scrollTop();
      var k, _imgs, tmpImg, i, len;

      for (k in this.imgContainer) {
        if (parseInt(k, 10) >= srollHeight && parseInt(k, 10) < srollHeight + height) {
          _imgs = this.imgContainer[k];
          for (i = 0, len = _imgs.length; i < len; i++) {
            tmpImg = $(_imgs[i]);
            this._handleImg(tmpImg);
          }
          delete this.imgContainer[k];
        }
      } // for
    },

    destroy: function () {
      if (this.isError) {
        return;
      }
      if (this.TIMERRES) {
        clearInterval(this.TIMERRES);
      }
      //为container绑定事件
      this.container.off('.imglazyload' + this.uuid);

      $(window).off('.imglazyload' + this.uuid);
    },

    fixOffset: function(uuid) {
      if (this.uuid != uuid && _.size(this.imgContainer) > 0) {              
        var poses = _.keys(this.imgContainer).join('|');
        this.imgContainer = {};
        this.initImgContainer();
        if (poses != _.keys(this.imgContainer).join('|')) {
          console.warn('fiexed', poses, '---to---', _.keys(this.imgContainer).join('|'));  
          this.lazyLoad();
        }
      }
    }
  });

  //  ImgLazyload.lazyload = function (opts) {
  //    return new ImgLazyload(opts);
  //  };

  return ImgLazyload;

});
