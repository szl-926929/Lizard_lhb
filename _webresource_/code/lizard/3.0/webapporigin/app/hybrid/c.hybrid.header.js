define(['cHybridShell'], function (cHybridShell) { 
  var specialtags = ['home', 'share', 'favorite', 'favorited', 'phone', 'call'];

  function Header(opt) {
    this.root = this.rootBox = $('#headerview');
    //当前header所属的view对象
    this.parent = opt.parent;
    this.root.hide();
  }

  Header.prototype = {
    set: function (headData) {
      this.headerData = headData;
      var events = this.headerData.events || {};
      var head = {
        'left'         : [],
        'center'       : [],
        'centerButtons': [],
        'right'        : []
      }, self = headData.view || this;

      //Handle left buttons
      if (headData.back) {
        if (headData.back === true) {
          headData.back = {callback: events.returnHandler};
        }
        var backObj = {
          'tagname' : 'back',
          'callback': headData.back.callback
        };
        if (_.isString(headData.backtext)) {
          backObj.value = headData.backtext;
        }
        head.left.push(backObj);
      }
      if (headData.left && head.left.length === 0) {
        head.left.push(headData.left[0]);
      }

      //Handle center text
      if (_.isObject(headData.center) || _.isObject(headData.title)) {
        var titleObj = headData.center || headData.title;
        if (titleObj.tagname == 'title') {
          if (_.isString(titleObj.value)) {
            head.center.push({'tagname': 'title', 'value': titleObj.value});
          } else if (_.isArray(titleObj.value)) {
            _.each(titleObj.value, function (value, index) {
              if (index === 0) {
                head.center.push({'tagname': 'title', 'value': value});
              } else if (index === 1) {
                head.center.push({'tagname': 'subtitle', 'value': value});
              }
            });
          } 
        } else if (titleObj.tagname == 'select' || titleObj.tagname == 'citybtn') {
          headData.citybtn = _.isFunction(titleObj.itemFn)? $(titleObj.itemFn.apply(self)).text(): titleObj.value;
          if (headData.center.imagePath) {
            headData.imagePath = headData.center.imagePath;
          }
          if (headData.center.citybtnImagePath) {
            headData.citybtnImagePath = headData.center.citybtnImagePath;
          }
          events.citybtnHandler = titleObj.callback;
        }
      } else {
        if (headData.title) {
          head.center.push({'tagname': 'title', 'value': headData.title});
        }
        if (headData.subtitle) {
          head.center.push({'tagname': 'subtitle', 'value': headData.subtitle});
        }
      }

      //Handle center buttons
      if (headData.citybtn) {
        var cityBynobj = {
          "tagname" : "cityChoose",
          "value"   : headData.citybtn,
          "a_icon"  : "icon_arrowx",
          "i_icon"  : "icon_arrowx.png",
          "callback": events.citybtnHandler
        };
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
        if (cityBynobj.imagePath) {
          delete cityBynobj.a_icon;
          delete cityBynobj.i_icon;
        }
        head.centerButtons.push(cityBynobj);
      }

      //Handle right buttons
      var rightCallBack = events.commitHandler || events.searchHandler;
      if (rightCallBack) {
        var btnObj = {
          'tagname' : events.commitHandler ? 'commit' : 'search',
          'callback': rightCallBack
        };
        if (events.commitHandler) {
          btnObj.value = headData.btn.title;
        }
        head.right.push(btnObj);
      }

      if (headData.tel) {
        var telObj = {
          'tagname': 'call'
        };
        if (Lizard && Lizard.instance && Lizard.instance.curView) {
          var curView = Lizard.instance.curView;
          if (curView.businessCode) {
            telObj.businessCode = curView.businessCode;
            telObj.pageId = curView.hpageid;
          }
        }
        head.right.push(telObj);
      }
      _.each(specialtags, function (item) {
        if (headData[item]) {
          var temp_obj = {'tagname': item};
          if (_.isObject(headData[item]) && _.isFunction(headData[item].callback)) {
            temp_obj.callback = headData[item].callback;
          }
          head.right.push(temp_obj);
        }
      });

      if (headData.moreMenus) {
        head.moreMenus = headData.moreMenus;
        head.right.push({ 'tagname': 'more'});
      }
      head.right = _.union(head.right, headData.right || [], headData.moreRightMenus || []);
      var pickupMoremenu = _.groupBy(head.right, function (item) {
        if (item.tagname == 'list') {
          return 'a';
        } else {
          return 'b';
        }
      });
      head.right = pickupMoremenu.b || [];
      if (pickupMoremenu.a && pickupMoremenu.a[0]) {
        head.right.push({ 'tagname': 'more'});
        head.moreMenus = pickupMoremenu.a[0].data;
      } else {
        pickupMoremenu = _.groupBy(head.right, function (item) {
          if (item.tagname == 'more') {
            return 'a';
          } else {
            return 'b';
          }
        });
        head.right = _.union(pickupMoremenu.b || [], pickupMoremenu.a || []);
      }

      this.registerEvents(_.union(head.left, head.centerButtons, head.right, head.moreMenus || []), self);

      try {
        var headInfo = JSON.stringify(head);
        var fn = new cHybridShell.Fn('refresh_nav_bar');
        fn.run(headInfo);
      } catch (e) {
      }
    },

    registerEvents: function (buttons, scope) {
      _.each(buttons, function (button) {
        if (button.callback) {
          cHybridShell.off(button.tagname).on(button.tagname, function () {
            if (button.tagname == 'back') {
              if (Lizard) {
                if (Lizard.instance._alert.status == 'show') {
                  Lizard.hideMessage();
                  return;
                }
                if (Lizard.instance._confirm.status == 'show') {
                  Lizard.hideConfirm();
                  return;
                }
                if (Lizard.instance._toast.status == 'show') {
                  Lizard.hideToast();
                  return;
                }
              }
              if (_.size(this._stateCallbacks)) {
                this._callObserveBack();
                return;
              }
            }
            button.callback.call(scope);
          });
        }
      });
    },

    updateHeader: function (name, val) {
      if (val) {
        this.headerData[name] = val;
      } else if (_.isObject(name)) {
        if (name.right && _.some(name.right, function (item) {
          return item.tagname == 'favorite' || item.tagname == 'favorited';
        })) {
          delete this.headerData.favorite;
          delete this.headerData.favorited;
        }
        _.extend(this.headerData, name);
      }
      this.set(this.headerData);
    },

    show: function () {
      var fn = new cHybridShell.Fn('set_navbar_hidden');
      fn.run(false);
    },

    hide: function () {
      var fn = new cHybridShell.Fn('set_navbar_hidden');
      fn.run(true);
    }
  };

  return Header;
});