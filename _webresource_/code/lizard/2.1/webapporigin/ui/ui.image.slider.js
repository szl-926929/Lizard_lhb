define(['UISlider'], function (UISlider) {
  return _.inherit(UISlider, {
    propertys: function ($super) {
      $super();

      this.momentum = false;
      this.autoPlay = false;
      this.timerSrc = null;
      this.delaySec = 3000;
      this.playTime = 500;
      this.sliderNav = null;
      this.displayNum = 1;
      this.needLoop = true;

      // 6.7团购新增需求，上下滑动图片，阻止触发刷新
      this.isPreventPullDown = false;
    },

    //循环播放
    play: function (e) {
      if (!this.autoPlay){
        return;
      }
      this.stop();
      this.timerSrc = setInterval($.proxy(function () {
        var index = this.datamodel.index;
        index++;

        if (this.needLoop) {
          if (index > this.itemNum){
            index = 0;
          }
        } else {
          if (index == this.itemNum) {
            this.autoPlay = false;
            return;
          }
        }

        this.setIndex(index, null, null, this.playTime);
      }, this), this.delaySec);
    },

    stop: function (e) {
      if(e && this.isPreventPullDown) {
        e.stopImmediatePropagation();
      }
      if (this.timerSrc) {
        clearInterval(this.timerSrc);
        this.timerSrc = null;
      }
    },

    //导航条
    createNav: function () {
      if (this.sliderNav){
        return;
      }
      var nav = '<div class="cui-navContainer" style="color: rgb(20, 145, 197); position: absolute;">';
      for (var i = 0; i < this.itemNum; i++) {
        nav += '<span class="cui-slide-nav-item" data-index="' + i + '"></span>';
      }
      nav += '</div>';
      this.sliderNav = $(nav);
      this.$el.append(this.sliderNav);
      this._setNavPos();

      //防止遮盖头部
      //      this.setzIndexTop(this.sliderNav);
      this.sliderNav.css('z-index', '500');
      this._setNavIndex(this.datamodel.index);
    },

    //父级元素resize事件重写
    resizeRefresh: function ($super) {
      $super();
      this._setNavPos();
    },

    _setNavPos: function () {
      var left = (parseInt(this.wrapper.width()) - 2 * (this.itemNum * 10)) / 2; //居中计算LEFT值
      if(this.sliderNav){
        this.sliderNav.css({ "left": left, 'bottom': '10px' });
      }
    },

    _addTouchEvent: function () {
      var scope = this;
      this._removeTouchEvent();

      var _handlerStop = function (e) {
        scope.stop(e);
      };

      var _handlerPlay = function (e) {
        scope.play(e);
      };

      this.$el.on('touchstart.imageslidertouchmove' + this.id, _handlerStop);
      this.$el.on('touchmove.imageslidertouchmove' + this.id, _handlerStop);
      this.$el.on('touchend.imageslidertouchmove' + this.id, _handlerPlay);

      this.$el.on('mousedown.imageslidertouchmove' + this.id, _handlerStop);
      this.$el.on('mousemove.imageslidertouchmove' + this.id, _handlerStop);
      this.$el.on('mouseup.imageslidertouchmove' + this.id, _handlerPlay);

    },

    _removeTouchEvent: function () {
      this.$el.off('.imageslidertouchmove' + this.id);
    },

    _setNavIndex: function (index) {
      this.$('.cui-navContainer').find('span').removeClass('cui-slide-nav-item-current');
      this.$('.cui-navContainer').find('span[data-index="' + index + '"]').addClass('cui-slide-nav-item-current');
    },

    changedAction: function (item) {
      this._setNavIndex(this.datamodel.index);
    },

    addEvent: function ($super) {
      $super();
      this.on('onRefresh', function () {
        this.sliderNav = null;
        this.createNav();

      });

      this.on('onCreate', function () {
        this.$el.addClass('cm-slide--full-img');
      });

      this.on('onShow', function () {
        this.createNav();
        this.play();
        this._addTouchEvent();
      });

      this.on('onHide', function () {
        this.stop();
        this._removeTouchEvent();
      });
    }

  });
});
