/**
 * @project lizard2.0
 * @author:       shbzhang@Ctrip.com
 * @description:  组件Header
 * @date 2014/05/05
 */
define(['cBase', 'cUIAbstractView', 'cUtility', 'cHybridFacade', 'cUISidebar'], function (cBase, cAbstractView, cUtlity, Facade, cUISidebar) {
  "use strict";

  var options = options || {};
  var isWinInCtripApp = Lizard.isInCtripApp && window.Internal.isWinOS;
  /**
   * header Html 模板
   * @type {{home: string, tel: string, customtitle: string, title: string, back: string, btn: string, custom: string}}
   */
  options.htmlMap = {
    home : '<i class="icon_home i_bef" id="c-ui-header-home"></i>',
    moreMenus: '<i class="icon-list"></i>',
    tel : '<a href="tel:<%=tel.number||4000086666 %>" class="icon_phone i_bef __hreftel__" id="c-ui-header-tel"></a>',
    customtitle : '<div><%=customtitle %></div>',
    title : '<h1><%=title %></h1>',
    back : '<%if (obj.backtext) {%><i id="c-ui-header-return" class="header_r" style="left:0;width:44px;"><%=obj.backtext%></i><%} else {%><i id="c-ui-header-return" class="returnico i_bef"></i><%}%>',
    btn : '<i id="<%=btn.id%>" class="<%=btn.classname%> c-ui-header-btn"><%=btn.title %></i>'
  };

  /**
   * header属性
   * @private
   */
  options.__propertys__ = function () {
    this.headerData = {
      'back' : true
    };
    this.STATE_NOTCREATE = 'notCreate';
    this.STATE_ONCREATE = 'onCreate';
    this.isInApp = cUtlity.isInApp() && !isWinInCtripApp;
  };

  /**
   * Header初始化，主要是配置rootBox、绑定按钮事件
   */
  options.initialize = function ($super, opts) {
    this.rootBox = this.root = opts.root || $('body');
    this.parseHeader();
    this.bindEvent();
    this.__show = $super.show;
    $super(opts);
  };

  /**
   * 绑定事件
   */
  options.bindEvent = function () {
    this.addEvent('onShow', this.onShow);
    this.addEvent('onHide', this.onHide);
  };

  /**
   * 解析Header的Dom结构,生成
   */
  options.parseHeader = function () {
    var rootBox = this.rootBox;
    if (rootBox && rootBox.size()) {
      this.rootBox = rootBox;
      this.backBtn = rootBox.find('#c-ui-header-return');
      this.homeBtn = rootBox.find('#c-ui-header-home');
      this.telBtn = rootBox.find('#c-ui-header-tel');
      //标题
      //this.title
      this.titleDom = rootBox.find('h1');
      //Html定制化标题,优先级>title
      //this.customtitle;
      //城市选择
      //this.citybtn;
      //定制按钮
      this.searchBtn = this.commitBtn = rootBox.find('.c-ui-header-btn');

      var events = this.headerData.events;
      var view = this.headerData.view;
      this.headerData.back = true
        this.headerData.home = this.homeBtn.size();
      this.headerData.tel = !!this.telBtn.size();
      if (events) {
        this.headerData.events = events;
      }
      if (view) {
        this.headerData.view = view;
      }
    }
  },

  /**
   * 在JS中设置header中的值,在view的子类中调用
   * @param:        [optional]{data.title} String 设置HeaderView的显示的栏目标题
   * @param:        [optional]{data.customtitle} String 需要设置的自定义html,优先级> title
   * @param:        [optional]{data.tel} JSON 设置电话链接按钮 tel:{number: 56973183}
   * @param:        [optional]{data.home} boolean 是否需要显示Home按钮
   * @param:        [optional]{data.btn} JSON {title: "完成", id: 'confirmBtn', classname: 'bluebtn'}
   * @param:        [optional]{data.back} boolean 是否需要显示返回按钮
   * @param:        [optional]{data.events} JSON 设置需要的按钮点击回调事件 { homeHandler: function, returnHandler: function}
   *
   * 举例来说 data{title: "选择出发地", home: 'true', back: true, events: {homeHandler: function(){console.log('click home')}}};
   */
  options.set = function (data) {
    //调用伪删除方法,保证每次set可以重新生成html结构
    this.puppetDestory();
    if (data) {
      //复制头部数据
      _.extend(this.headerData, data);
    }
    //保留父类方法,并重写show方法
    this.__show = this.show;
    this.show = function () {};
    if (this.isInApp) {
      var home = this.headerData.home,
      tel = this.headerData.tel;
      this.rootBox.hide();
      this.parseHeader();
      //保存与Navtve 的通信
      this.headerData.home = home;
      this.headerData.tel = tel;
      this.saveHead(this.headerData);
      this.onShow();
    } else {
      this.rootBox.html(this.createHtml()); //modefied by byl 此处应该判断是否是初始化
      this.__show();
      /*add by wxj 20140527 22:12 start*/
      this.parseHeader();
      /*add by wxj 20140527 22:12 end*/
    }
    this.delegateEvents(this.headerData.events);
    this.headerData.moreMenus && this.rootBox.find('.icon-list').on('click', _.bind(function(e){
      if (!this.sidebar) this.sidebar = new cUISidebar({moreMenus: this.headerData.moreMenus});
      this.sidebar.show();
    }, this));
  },
  /**
   * 复写基类create方法,没有root节点,直接在rootbox节点上增加html
   */
  options.create = function () {
    if (!this.isInApp && !this.isCreate && this.status !== this.STATE_ONCREATE) {
      this.rootBox = this.root = this.rootBox || $('body');
      this.rootBox.html(this.createHtml());
      //this.root.html();
      this.trigger('onCreate');
      this.status = cAbstractView.STATE_ONCREATE;
      this.isCreate = true;
    }
  },

  /**
   * 覆写基类,生成html
   */
  options.createHtml = function () {
    var tpl = this._setTemplate(this.headerData);
    return _.template(tpl, this.headerData);
  },

  /**
   * 绑定事件
   */
  options.delegateEvents = function (events) {

    //    this.rootBox.find('header').append(this.rootBox.find('#c-ui-header-return'));
    this.rootBox.off('click');
    var self = this;
    if (events) {
      //return 事件
      if (events.returnHandler) {
        //app 环境
           /* if (this.isInApp) {
              var returnCb = function () {
                events.returnHandler.call(self);
              }
              Facade.register({
                tagname : Facade.METHOD_BACK,
                callback : returnCb
              });
            } else {
              //web环境
              this.backBtn.off('click');
              this.backBtn.on('click', _.bind(events.returnHandler, self.headerData.view || self));
          }*/
          if (this.isInApp) {
              var returnCb = function () {
                  events.returnHandler.call(self);
              }
              Facade.register({
                  tagname: Facade.METHOD_BACK,
                  callback: returnCb
              });
          } else if (isWinInCtripApp) {
              var returnCb = function () {
                  events.returnHandler.call(self);
              }
              Facade.register({
                  tagname: Facade.METHOD_BACK,
                  callback: returnCb
              });
              //web环境
              this.backBtn.off('click');
              this.backBtn.on('click', _.bind(events.returnHandler, self.headerData.view || self));
          } else {
              //web环境
              this.backBtn.off('click');
              this.backBtn.on('click', _.bind(events.returnHandler, self.headerData.view || self));
          }
      } else {
        //ToDo: 默认回退动作
      }
      //home事件
      if (events.homeHandler) {
        //web环境
        if (!this.isInApp) {
          this.homeBtn.off('click');
          this.homeBtn.on('click', _.bind(events.homeHandler, self.headerData.view || self));
        }
      }

      //title点击事件
      if (events.citybtnHandler) {
        if (this.isInApp) {
          var cityBtnCb = function () {
            events.citybtnHandler.call(self);
          }
          Facade.register({
            tagname : Facade.METHOD_CITY_CHOOSE,
            callback : cityBtnCb
          });
        }
      }

      //commit 事件
      if (_.isFunction(events.commitHandler)) {
        if (this.isInApp) {
          var commitCb = function () {
            events.commitHandler.call(self);
          }
          Facade.register({
            tagname : Facade.METHOD_COMMIT,
            callback : commitCb
          });
        } else {
          this.commitBtn.off('click');
          this.commitBtn.on('click', _.bind(events.commitHandler, self.headerData.view || self));
          //          this.commitBtn.insertAfter(this.rootBox.find('h1'));
        }
      }
      //search 事件
      if (_.isFunction(events.searchHandler)) {
        if (this.isInApp) {
          var searchCb = function () {
            events.searchHandler.call(self);
          }
          Facade.register({
            tagname : Facade.METHOD_SEARCH,
            callback : searchCb
          });
        } else {
          this.searchBtn.removeClass('c-ui-header-btn').addClass('icon_search_w i_bef');
          this.searchBtn.off('click');
          this.searchBtn.on('click', _.bind(events.searchHandler, self.headerData.view || self));
          //          this.searchBtn.insertAfter(this.rootBox.find('h1'));
        }
      }
      //自定义事件
      if (this.headerData && this.headerData.btn && _.isFunction(events.customHandler)) {
        this.custBtn = this.rootBox.find('#' + this.headerData.btn.id);
        this.custBtn.off('click');
        this.custBtn.on('click', _.bind(events.customHandler, self.headerData.view || self));
      }
    }
  },

  /**
   * 保存数据到Localstorg,供APP使用
   */
  options.saveHead = function (headData) {
    var events = headData.events;
    var head = {
      'left' : [],
      'center' : [],
      'centerButtons' : [],
      'right' : []
    };

    if (headData.back) {
      head.left.push({
        'tagname' : 'back'
      });
    }
    if (headData.title) {
      head.center.push({
        'tagname' : 'title',
        'value' : headData.title
      });
    }
    if (headData.subtitle) {
      head.center.push({
        'tagname' : 'subtitle',
        'value' : headData.subtitle
      });
    }
    if (headData.btn) {
      if (_.isFunction(events.commitHandler))
        head.right.push({
          'tagname' : 'commit',
          'value' : headData.btn.title
        });
      if (_.isFunction(events.searchHandler))
        head.right.push({
          'tagname' : 'search',
          'value' : headData.btn.title
        });
    }
    if (headData.tel) {
      //add by byl 在此处添加businessCode以及pageId
      var telObj = {
        'tagname' : 'call'
      };
      if(Lizard && Lizard.instance && Lizard.instance.curView){
        var curView = Lizard.instance.curView;
          if(curView.businessCode){
            telObj.businessCode = curView.businessCode;
            telObj.pageId = curView.hpageid;
          }
      }
      head.right.push(telObj);
    }
    if (headData.home) {
      head.right.push({
        'tagname' : 'home'
      });
    }
    if (headData.citybtn) {
      var cityBynobj = {
        "tagname" : "cityChoose",
        "value" : headData.citybtn
      }
      if (headData.citybtnImagePath) {
        cityBynobj.imagePath = headData.citybtnImagePath;
        if (headData.citybtnPressedImagePath) {
          cityBynobj.pressedImagePath = headData.citybtnPressedImagePath;
        } else {
          cityBynobj.pressedImagePath = cityBynobj.imagePath;
        }
      }
      if (headData.citybtnIcon) {
        cityBynobj.a_icon = cityBynobj.i_icon = headData.citybtnIcon;
      }
      if (!cityBynobj.imagePath) {
        cityBynobj['a_icon'] = "icon_arrowx";
        cityBynobj['i_icon'] = "icon_arrowx.png";
      }
      head.centerButtons.push(cityBynobj);
    }
    if (headData.share) {
      head.right.push({
        'tagname' : 'share'
      });
    }
    if (headData.favorite) {
      head.right.push({
        'tagname' : 'favorite'
      });
    }
    if (headData.favorited) {
      head.right.push({
        'tagname' : 'favorited'
      });
    }
    if (headData.phone) {
      head.right.push({
        'tagname' : 'phone'
      });
    }
    if (headData.moreMenus) {
      head.moreMenus = headData.moreMenus;
      head.right.push({
        'tagname' : 'more'
      });
      _.each(headData.moreMenus, function (menuItem) {
        Facade['METHOD_' + menuItem.tagname.toUpperCase()] = 'METHOD_' + menuItem.tagname.toUpperCase();
        Facade.registerOne(Facade['METHOD_' + menuItem.tagname.toUpperCase()], menuItem.tagname);
        menuItem.callback && Facade.register({tagname: 'METHOD_' + menuItem.tagname.toUpperCase(), callback: menuItem.callback});
      });
    }
    if (headData.moreRightMenus) {
      head.moreRightMenus = headData.moreRightMenus;
      head.right = head.right.concat(headData.moreRightMenus)
        _.each(head.moreRightMenus, function (menuItem) {
          Facade['METHOD_' + menuItem.tagname.toUpperCase()] = 'METHOD_' + menuItem.tagname.toUpperCase();
          Facade.registerOne(Facade['METHOD_' + menuItem.tagname.toUpperCase()], menuItem.tagname);
          menuItem.callback && Facade.register({tagname: 'METHOD_' + menuItem.tagname.toUpperCase(), callback: menuItem.callback});
        });
    }

    try {
      var headInfo = JSON.stringify(head);
      Facade.request({
        name : Facade.METHOD_REFRESH_NAV_BAR,
        config : headInfo
      });
    } catch (e) {}
  };

  /**
   * @destription: 更新HeaderView
   */
  options.updateHeader = function (name, val) {
    if (!this.headerData.hasOwnProperty(name) || !this.headerData[name]) {
      return;
    }
    if (name == 'events') {
      this.delegateEvents(val);
    } else {
      this.headerData[name] = val;
      if (this.isInApp) {
        try {
          var headInfo = JSON.stringify(_.omit(this.headerData, 'view'));
          Facade.request({
            name : Facade.METHOD_REFRESH_NAV_BAR,
            config : headInfo
          });
        } catch (e) {}
      } else {
        //modified by byl 此处修改，直接执行this.set
        //        var node = $(_.template(this.htmlMap[name], this.headerData));
        //        var tagname = node.get(0).tagName;
        //        this.rootBox.find(tagname).replaceWith(node);
        this.set(this.headerData);
      }
    }
  };

  /**
   * 根据Header的数据,生成Html
   * @param headerData
   * @private
   */
  options._setTemplate = function (headerData) {
    this.htmlTpl = '';
    var tempHtmlMap = {
      home : "",
      moreMenus: "",
      tel : "",
      customtitle : "",
      title : "",
      back : "",
      btn : ""
    }
    var ingnoreTitle = false;
    if (headerData) {
      //当customtitle与 title同设时,忽略title
      if (headerData.customtitle && this.htmlMap.title) {
        ingnoreTitle = true;
      }
      for (var key in this.htmlMap) {
        if (key == 'title' && ingnoreTitle) {
          continue;
        }
        if (headerData[key]) {
          tempHtmlMap[key] = this.htmlMap[key];
        }
      }
      var style = '',
      cstyle = headerData['style'];
      if (cstyle) {
        style = ' style="' + cstyle + '"';
      }
      //按顺序拼接this.htmlTP1
      //this.htmlTpl += tempHtmlMap.home +tempHtmlMap.tel+tempHtmlMap.customtitle + tempHtmlMap.title + tempHtmlMap.back + tempHtmlMap.btn;
      var htmlArr = [tempHtmlMap.home, tempHtmlMap.moreMenus, tempHtmlMap.tel, tempHtmlMap.customtitle, tempHtmlMap.title, tempHtmlMap.back, tempHtmlMap.btn];
      this.htmlTpl += htmlArr.join("");
      return this.htmlTpl = '<header' + style + ' class="old-header" >' + this.htmlTpl + '</header>';
    }
  };

  /**
   * onShow方法
   */
  options.onShow = function (callback) {
    if (this.isInApp) {
      this.rootBox.hide();
      //      if (this.isHidden) {
      Facade.request({
        name : Facade.METHOD_SET_NAVBAR_HIDDEN,
        isNeedHidden : false
      });
      //        this.isHidden = false;
      //      }
    } else {
      this.rootBox.show();
    }
    callback && callback();
  };

  /**
   * onHide方法
   */
  options.onHide = function () {
    if (this.isInApp) {
      // if (!this.isHidden) {
      Facade.request({
        name : Facade.METHOD_SET_NAVBAR_HIDDEN,
        isNeedHidden : true
      });
      //
    } else {
      this.rootBox.hide();
    }
  };

  /**
   * 伪删除
   */
  options.puppetDestory = function () {
    this.status = this.STATE_NOTCREATE;
    this.isCreate = false;
  }

  var Header = new cBase.Class(cAbstractView, options);

  return Header;

});
