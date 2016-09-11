define(['cPageView', 'cUIBase'],
  function (CPageView, cUIBase) {
    "use strict";
/**
 * ListView提供了列表的分次加载功能
 * @class
 * @extends cPageView
 * @name cPageList
 * @example
 * defined('cPageList',function(PageList){
 *   var View = PageList.extend({
 *     //底部刷新
 *     onBottomPull:function(){
 *     },
 *     //顶部刷新
 *     onTopPull:function(){
 *       //用法1:使用默认loading
 *       var self = this;
 *       //显示loading
 *       this.showTopLoading();
 *       setTimeout(function(){
 *         self.hideRefreshLoading();
 *       },500);
 *       //用法2:不使用默认loading的时候调用
 *       //this.endPull();
 *     }
 *   });
 * });
 */
  var PageView = CPageView.extend(/** @lends cPageList.prototype */{
    _onWidnowScroll: null,
    __isComplete__: false,
    __isLoading__: false,
    refreshLoading: null,
    /**
     * 增加页面滚动事件
     */
    addScrollListener: function() {
      this.__isComplete__ = false;
      this.__isLoading__ = false;
      if(this._onWidnowScroll){
        $(window).bind('scroll', this._onWidnowScroll);
      }
      var self = this;
      /**
       * 当滚动条位于顶部时, 下拉操作时出发
       * @method cPageList#onTopPull
       */
      if (this.onTopPull) {
        _.flip(this.$el, 'down', function () {
          var pos = cUIBase.getPageScrollPos();
          if (pos.top <= 10 && !self.__isLoading__) {
            self.__isLoading__ = true;
            self.onTopPull();
          }
        }, function (dir) {
          var pos = cUIBase.getPageScrollPos();
          return  dir != 'down'||  pos.top >=10 ;
        }, 0, 5);
      }
    },
    /**
     * 移除页面滚动事件
     */
    removeScrollListener: function() {
      $(window).unbind('scroll', this._onWidnowScroll);
      if (this.refreshLoading) {
        this.refreshLoading.remove();
        this.refreshLoading = null;
      }
      _.flipDestroy(this.$el);
    },
    /**
     * 当滚动条位于底部时, 上拉操作时出发
     * @method cPageList#onBottomPull
     */
    onWidnowScroll: function() {
      var pos = cUIBase.getPageScrollPos();
      if (pos.top == '0') {return;}
      var h = pos.pageHeight - (pos.top + pos.height);
      //fix ios 不容易加载更多数据问题 shbzhang 2014/1/6
      if (h <= 81 && !this.__isComplete__ && !this.__isLoading__) {
        this.__isLoading__ = true;
        if(this.onBottomPull){
          this.onBottomPull();
        }
      }
    },
    /**
     * 通知本次下拉操作完成,在不使用默认的showLoading是,需调用endPull
     */
    endPull: function() {
      this.__isLoading__ = false;
    },
    /**
     * 关闭下拉通知功能
     */
    closePull: function() {
      this.__isComplete__ = false;
    },
    /**
     * 打开下拉通知功能
     */
    openPull: function() {
      this.__isComplete__ = true;
    },
    /**
     * 在当前list顶部显示loading
     * @param {dom} [listRoot] list的根节点,如果不指定,默认会选当前页面的第一个select 元素
     */
    showTopLoading: function() {
      var listRoot = listRoot || this.$el.find('section');
      if (listRoot.length > 0) {
        listRoot.before(this.getLoading());
        this.refreshLoading.show();
      }
    },
    /**
     * 在当前list底部显示loading
     */
    showBottomLoading: function() {
      //保证每次bottomload在最下面
      this.$el.append(this.getLoading());
      this.refreshLoading.show();
    },
    /**
     * 隐藏loading图标,建议使用hideRefreshLoading代替
     * @deprecated
     */
    hideBottomLoading: function() {
      this.hideRefreshLoading();
    },
    /**
     * 隐藏loading图标
     */
    hideRefreshLoading: function() {
      if (this.refreshLoading) {
        this.refreshLoading.hide();
      }
      this.__isLoading__ = false;
    },
    /**
     * 活动默认的loading图标
     * @returns {null|*}
     */
    getLoading: function() {
      if (!this.refreshLoading) {
        this.refreshLoading = $('<div class="cui-zl-load" id="zlLoading"> <div class="cui-i cui-b-loading"></div><div class="cui-i  cui-mb-logo"></div> <p>加载中</p></div>');
      }
      return this.refreshLoading;
    }
  });
  return PageView;
});