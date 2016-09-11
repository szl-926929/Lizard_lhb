/**
 * 统一日历组件
 * @class
 * @extends UIView
 * @name UICalendarCommon
 * @see http://conf.ctripcorp.com/pages/viewpage.action?pageId=58574731
 * @example
 * var calendar = new UICalendarCommon({
*   datamodel: {
*     startTime: new Date(),//开始可选日期
*     endTime: new Date(2015, 3, 20),//结束日期
*     displayMonthNum: 15//一共显示多少个月
*   },
*   wrapper: this.$('.js-calendar'),//日历包裹层
*    //点击日历项触发的事件
*   onItemClick: function (date, el, e) {
*     
*   },
*   //lh_wang add: 定制日历每一项的函数，一切定制在此跳舞；满足各种定制需求
*   //在demo中做了全面的定制需求，各BU只需要按照demo重写dayItemAction即可
*   dayItemAction: function(dayObj, year, month, day, dateObj, difftime)(){} 
*   onShow: function() {},
*   onHide: function() {}
*   ...  
* });
 * calendar.show();
 */
define(['UIView', getAppUITemplatePath('ui.calendar.common')], function (UIView, template) {

  return _.inherit(UIView, /** @lends UICalendarCommon.prototype */{
    propertys: function ($super) {
      $super();
      //html模板
      this.template = template;

      //默认由服务器读出当前日期，考虑依赖没有做
      this.dateObj = new Date();

      //阳历节日
      this.solarHoliday = {
        '0101': '元旦',
        '0214': '情人节',
        '0501': '劳动节',
        '0601': '儿童节',
        '0910': '教师节',
        '1001': '国庆',
        '1225': '圣诞'
      };

      //阴历节日
      this.lunarHoliday = {
        '20150219': '春节',
        '20150305': '元宵',
        '20150405': '清明',
        '20150620': '端午',
        '20150927': '中秋',

        '20160208': '春节',
        '20160222': '元宵',
        '20160404': '清明',
        '20160609': '端午',
        '20160915': '中秋',

        '20170128': '春节',
        '20170211': '元宵',
        '20170404': '清明',
        '20170530': '端午',
        '20171004': '中秋',

        '20180216': '春节',
        '20180302': '元宵',
        '20180405': '清明',
        '20180618': '端午',
        '20180924': '中秋'

      };
      //调休_休
      this.rest = {
        '20150101': '元旦',
        '20150102': '元旦',
        '20150103': '元旦',

        '20150218': '春节',
        '20150219': '春节',
        '20150220': '春节',
        '20150221': '春节',
        '20150222': '春节',
        '20150223': '春节',
        '20150224': '春节',

        '20150404': '清明',
        '20150405': '清明',
        '20150406': '清明',

        '20150501': '劳动节',
        '20150502': '劳动节',
        '20150503': '劳动节',

        '20150620': '端午节',
        '20150621': '端午节',
        '20150622': '端午节',

        '20150926': '中秋节',
        '20150927': '中秋节',

        '20151001': '国庆',
        '20151002': '国庆',
        '20151003': '国庆',
        '20151004': '国庆',
        '20151005': '国庆',
        '20151006': '国庆',
        '20151007': '国庆'
      };

      //调休_班
      this.work = {
        '20150104': '元旦_班',
        '20150215': '除夕班',
        '20150228': '春节班',
        '20151010': '国庆_班'
      };
      //底部快捷导航日期
      this.footDate = {
        '中秋': new Date(2015, 8, 27),
        '国庆': new Date(2015, 9, 1),
        '元旦': new Date(2016, 0, 1),
        '除夕': new Date(2016, 0, 27)
      };

      //用户自定义日期
      this.defineHoliday = '';

      /**
       * 时区时差问题，用于跨城市，这里记录的是相对于北京东八区差距多少秒，计算时候需要*1000
       * 默认处于中国，以北京时间为准
       * @name UICalendarCommon#jetLag
       * @type {number}
       */
      this.jetLag = 0;

      //特殊时刻
      this.specialDates = false;

      //处理日期项的函数
      this.dealDateItem = function (year, month, day, dateObj, difftime) {
        var dayObj = {
          day: day
        };
        var dayStrArr = [];
        var _solarHoliday = _.dateUtil.formatNum(month + 1) + _.dateUtil.formatNum(day);
        var _lunarHoliday = year.toString() + _.dateUtil.formatNum(month + 1) + _.dateUtil.formatNum(day);
        var _deffHour = parseInt(-1 * difftime / 3600000 * 100) / 100;
        var _defineHoliday = year.toString() + _.dateUtil.formatNum(month + 1) + _.dateUtil.formatNum(day);

        //lh_wang add
        //vzly最新需求
        if(this.datamodel.show2Day){
          //处理日
          if (_deffHour >= 0 && _deffHour < 24) {
            dayObj.day1 = '今天';
          } else if (_deffHour >= -24 && _deffHour < 0) {
            dayObj.day1 = '明天';
          } else if (_deffHour >= -48 && _deffHour < -24) {
            dayObj.day1 = '后天';
          }
        }else{
          if (_deffHour >= 0 && _deffHour < 24) {
            dayObj.day1 = '今天';
          }
        }


        //处理节日
        if (this.solarHoliday[_solarHoliday]) {
          dayObj.solarHoliday = this.solarHoliday[_solarHoliday];
        }

        //阴历节日
        if (this.lunarHoliday[_lunarHoliday]) {
          dayObj.lunarHoliday = this.lunarHoliday[_lunarHoliday];
        }

        //处理特殊标志
        if (this.specialDates) {
          //默认不处理特殊标志，但是阴历需要处理
        }

        var str = '';
        str = '<div class="cm-field-title">' + (dayObj.day1 || dayObj.day) + '</div>';
        //dayStrArr[0] = '<div class="cm-field-title">' + (dayObj.day1 || dayObj.day) + '</div>';

        if (dayObj.solarHoliday || dayObj.lunarHoliday) {
          // 修复节日样式bug
          str = '<div class="cm-field-title cm-field-title--festival">' + (dayObj.lunarHoliday || dayObj.solarHoliday) + '</div>';
          //dayStrArr[0] = '<div class="cm-field-title cm-field-title--festival">' + (dayObj.lunarHoliday || dayObj.solarHoliday) + '</div>';
        }

        //公共调休
        if(this.datamodel.showRestIcon){
          if(this.rest[_lunarHoliday]) {
            str += '<i class="icon-calendar-holiday">休</i>';
          }
          if(this.work[_lunarHoliday]){
            str += '<i class="icon-calendar-work">班</i>';
          }
        }

        dayStrArr[0] = str;
        return {
          str: dayStrArr.join(''),
          dayObj: dayObj
        };
      };


      //要求必须要传入日期对象
      /**
       * 默认的数据
       * @name UICalendarCommon#datamodel
       * @type {object}
       * @example
       * // 默认数据
       * calendar.datamodel = {
       *   startTime: new Date(),    // 开始时间 {date}
       *   endTime: null             // 结束时间 {date}
       *   displayMonthNum: 5        // 显示月份的数量 {number}
       *   selectDate: null          // 当前选择的日期 {date}
       *   MonthClapFn: function(year, month) {}  //分割月之间的显示
       *   dayItemFn: function(year, month, day, dateObj, difftime) {} //具体显示项目定制化
       * }
       */
      this.datamodel = {
        scope: this,
        startTime: null,
        endTime: null,
        weekDayArr: ['日', '一', '二', '三', '四', '五', '六'],
        displayMonthNum: 5,
        tips: '',  //默认tips
        selfTips: '', //自定义tips
        footDate: '', //自定义底部节假日定位栏
        showNav: false,
        curTime: this.dateObj.getTime(),//包含时分秒的详细时间戳
        MonthClapFn: function (year, month) { //分割月之间的显示
          month = month + 1;
          return year + '年' + (month) + '月';
        },
        defineLi:false,
        showRestIcon:true, /*6.7起修改为默认开启调休*/
        show2Day: false,  /*6.7新增需求默认去掉明天和后天的显示，改成可以通过参数定制*/
        //包裹的Li定制化
        dayWrapperItemFn: function(year, month, day, dateObj, difftime, otherData){
          var obj = this.dealDateItem(year, month, day, dateObj, difftime);
          if (this.dayWrapperAction) {
            return this.dayWrapperAction.call(this, obj.dayObj, year, month, day, dateObj, difftime, otherData);
          }else{
            return obj.str;
          }

        },
        //具体显示项目定制化
        dayItemFn: function (year, month, day, dateObj, difftime) {
          var obj = this.dealDateItem(year, month, day, dateObj, difftime);
          if (this.dayItemAction) {
            return this.dayItemAction.call(this, obj.dayObj, year, month, day, dateObj, difftime);
          }
          else {
            return obj.str;
          }
        }
      };

      this.dayItemAction = null;
      this.dayWrapperAction = null;

      this.events = {
        'click .js_calendar_item ': 'itemAction',
        'click .w_date_nav_click' : 'navClick'
      };

      /**
       * 每一项点击的回调函数
       * @method UICalendarCommon#onItemClick
       * @param {object} date 当前日期对象
       * @param {object} el jQuery对象
       * @param {object} e 事件对象
       */
      this.onItemClick = function (date, el, e) {
        console.log(arguments);
      };
    },

    //要求唯一标识，根据id确定index
    resetPropery: function ($super) {
      $super();
      this.datamodel.deffTimezone = this.jetLag * 1000;

      //这里处理时区差问题，并且根据时区重置当前时间
      //存储由于时区导致的时间偏移
      //重置当前时间
      this.datamodel.curTime = this.dateObj.getTime() + this.datamodel.deffTimezone;

      //如果设置了startTime的话，需要由startTime开始计算
      if (!this.datamodel.startTime) {
        this.datamodel.startTime = this.dateObj;
      }

      //以startTime为标识取开始月份
      var dateObj = new Date(this.datamodel.startTime.getTime() + this.datamodel.deffTimezone);

      //当不开启时区功能的时候，略去这些逻辑
      if (this.datamodel.deffTimezone == '0') {
        dateObj = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
      }

      this.datamodel.startTime = dateObj;

      this.datamodel.year = dateObj.getFullYear();
      this.datamodel.month = dateObj.getMonth();

      //结束日期
      this.datamodel.endDate = new Date(this.datamodel.year, this.datamodel.month + this.datamodel.displayMonthNum, 0);

      //处理底部导航日期
      if(!this.datamodel.footNavDate){
        var newArr = {
          '今天': new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate()
        };
        for(var i in this.footDate){
          var date = this.footDate[i];
          if(date.getTime() > new Date().getTime()){
            var newTime = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
            newArr[i] = newTime;
          }
        }
        this.datamodel.footNavDate = newArr;
      }
      //用户自定义添加节日
      if(this.datamodel.defineHoliday){
        this.defineHoliday = this.datamodel.defineHoliday;
      }

    },

    //设置时区相差秒
    setJetLag: function (v) {
      this.jetLag = parseInt(v);
      this.refresh();
    },

    addDisplayMonth: function (num) {
      this.datamodel.displayMonthNum = this.datamodel.displayMonthNum + num;
      this.refresh();
    },

    /**
     * 处理某一天，中国操作习惯，月份以1开始
     * @param {object|string} selectorDay
     * @param {function} callback 回调函数
     */
    handleCnDay: function (selectorDay, callback) {
      var dayStr = selectorDay, dayArr = [], el;
      if (_.isDate(selectorDay)) {
        dayStr = selectorDay.getFullYear() + '-' + selectorDay.getMonth() + '-' + selectorDay.getDate();
      } else if (_.isString(selectorDay)) {
        dayArr = selectorDay.split('-');
        dayStr = dayArr[0] + '-' + (parseInt(dayArr[1]) - 1) + '-' + dayArr[2];
      }
      this.handleDay(dayStr, callback);
    },

    //sTime和eTime是2015-5-18格式
    dateDiff: function (sTime,  eTime){
      var aDate = 0, oDate1 = 0, oDate2 = 0, days = 0;
      aDate = sTime.split('-');
      aDate = eTime.split('-');
      //转换为5-18-2015格式
      oDate1 = new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);
      oDate2 = new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);
      //把相差的毫秒数转换为天数
      days = parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24);
      return  days;
    },

    /**
     * 处理某一天
     * @param {object|string} selectorDay
     * @param {function} callback 回调函数
     */
    handleDay: function (selectorDay, callback) {
      var dayStr = selectorDay, dayArr = [], el;

      if (_.isDate(selectorDay)) {
        dayStr = selectorDay.getFullYear() + '-' + selectorDay.getMonth() + '-' + selectorDay.getDate();
      }

      el = this.$('li[data-date="' + dayStr + '"]');
      if (el[0] && _.isFunction(callback)) {
        callback.call(this, el);
      }
    },

    /**
     * 开启调休
     * */
    openRestWork: function(w, r){
      var work = w || this.work;
      var rest = r || this.rest;
      var dayList = $('.cm-day-list li');

      for(var i = 0; i < dayList.length; i++){
        var li = $(dayList[i]);
        var time = li.attr('data-cndate') || '';
        if(time){
          var strArr = time.split('-');
          //格式化成“20150508”的格式
          var year = strArr[0];
          var month = strArr[1] >= 10 ? strArr[1] : ('0' + strArr[1]);
          var day = strArr[2] >= 10 ? strArr[2] : ('0' + strArr[2]);
          var str = year + month + day;
          //班
          if(work[str]){
            li.append('<i class="icon-calendar-work">班</i>');
          }
          //休
          if(rest[str]){
            li.append('<i class="icon-calendar-holiday">休</i>');
          }
        }
      }

    },

    itemAction: function (e) {
      var el = $(e.currentTarget);
      if (el.hasClass('cm-item--disabled')) {
        return;
      }
      var date = el.attr('data-date');
      date = date.split('-');
      if (date.length != 3) {
        return false;
      }
      date = new Date(date[0], date[1], date[2]);
      if (this.onItemClick) {
        this.onItemClick.call(this, date, el, e);
      }

      //循环所有气泡隐藏
      $('.cm-calendar').find('section').hide();
      //弹出气泡
      var p = el.find('p');
      if(p.next()[0]){
        p.next().show();
      }
    },

    navClick: function(e){
      //样式改变
      var el = $(e.currentTarget);
      var oldActive = $('.cm-calendar-quick-nav .active');
      var oldHightLight = $('.cm-day-list .js_calendar_item .lh_canlendar_color_hightlight');
      oldActive.removeClass('active');
      oldHightLight.removeClass('lh_canlendar_color_hightlight');
      el.addClass('active');
      el.css('transform', 'scale(0.8, 0.8)');
      el.animate({
        'transform': 'scale(1, 1)'
      }, 300);

      //定位改变
      var eDate = el.attr('data-date');
      var scrollEl = null;
      scrollEl = $('.js_calendar_item[data-date="' + eDate + '"]');

      //滚动动画
      var dis = 0;
      var handle = setInterval(function(){
        if(dis > 150){
          clearInterval(handle);
          //字体颜色动画
          var count = 0;
          var hightEl = $('.js_calendar_item[data-date="' + eDate + '"] .cm-field-title');
          hightEl.addClass('lh_canlendar_color_hightlight');
          var hightHandle = setInterval(function(){
            if(count > 2){
              clearInterval(hightHandle);
            }
            if(count % 2 === 0){
              hightEl.addClass('lh_canlendar_color_hightlight');
            }else{
              hightEl.removeClass('lh_canlendar_color_hightlight');
            }
            count ++;
          }, 400);
        }
        window.scrollTo(0, parseInt(scrollEl.offset().top) - dis);
        dis += 50;
      }, 60);

    },

    initElement: function () {
      var styleRoot = $('#js_style_root');
      this.weekDay = this.$('.js_weekend');

      this.calendarStyle = this.$('.js_ui_calendar_v1');

      if(!styleRoot[0]) {
        styleRoot = $('<div id="js_style_root"></div>');
        styleRoot.insertBefore($('#main'));
      }

      if(!styleRoot.find('.js_ui_calendar_v1')[0]){
        styleRoot.append(this.calendarStyle);
      }
    },

    initialize: function ($super, opts) {
      //设置23个月以内
      if(opts.datamodel.displayMonthNum > 23){
        opts.datamodel.displayMonthNum = 23;
      }
      $super(opts);
      // 修复hybrid没有h5头部bug
      if ($('#headerview').css('display') === 'none') {
        this.$('.js_weekend').css('top', 0);
      }
    }

  });

});
