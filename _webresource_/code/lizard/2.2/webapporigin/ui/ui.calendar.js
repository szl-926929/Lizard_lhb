define(['UIView', getAppUITemplatePath('ui.calendar')], function (UIView, template) {

  return _.inherit(UIView, {
    propertys: function ($super) {
      $super();
      //html模板
      this.template = template;


      //默认由服务器读出当前日期，考虑依赖没有做......******
      //单纯用以标识今天，请勿对他做任何操作
      this.dateObj = new Date();

        //阳历节日
        this.solarHoliday = {
            '0101': '元旦',
            '0214': '情人节',
            '0501': '劳动',
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


        //时区时差问题，用于跨城市，这里记录的是相对于北京东八区差距多少秒，计算时候需要*1000
      //默认处于中国，以北京时间为准
      this.jetLag = 0;

      //特殊时刻
      this.specialDates = false;

      //要求必须要传入日期对象
      this.datamodel = {
        scope: this,
        startTime: null,
        endTime: null,
        weekDayArr: ['日', '一', '二', '三', '四', '五', '六'],
        displayMonthNum: 5,

        //今天的日期，包含时分秒的详细时间戳，默认取dateObj，设置了startTime便取其
        curTime: this.dateObj.getTime(),

        //当前选择的日期
        selectDate: null,
        //分割月之间的显示
        MonthClapFn: function (year, month) {
          month = month + 1;
          return year + '年' + (month) + '月';
        },
        //具体显示项目定制化
        dayItemFn: function (year, month, day, dateObj, difftime) {

          var dayObj = {
            day: day
          };
          var dayStrArr = [];
          var _solarHoliday = _.dateUtil.formatNum(month + 1) + _.dateUtil.formatNum(day);
          var _lunarHoliday = year.toString() + _.dateUtil.formatNum(month + 1) + _.dateUtil.formatNum(day);
          var _deffHour = parseInt(-1 * difftime / 3600000 * 100) / 100;

          //处理日
          if (_deffHour >= 0 && _deffHour < 24) {
            dayObj.day1 = '今天';
          } else if (_deffHour >= -24 && _deffHour < 0) {
            dayObj.day1 = '明天';
          } else if (_deffHour >= -48 && _deffHour < -24) {
            dayObj.day1 = '后天';
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

          dayStrArr[0] = '<em>' + (dayObj.day1 || dayObj.day) + '</em>';

          if (dayObj.solarHoliday || dayObj.lunarHoliday) {
            dayStrArr[1] = '<i>' + (dayObj.lunarHoliday || dayObj.solarHoliday) + '</i>';
          }

          if (this.dayItemAction) {
            return this.dayItemAction.call(this, dayObj, year, month, day, dateObj, difftime);
          }
          else{
          	return dayStrArr.join('');
          }
        }
      };

      this.dayItemAction = null;

      this.events = {
        'click .cui_calendar_item ': 'itemAction'
      };

      this.onItemClick = function (date, el, e) {
        console.log(arguments);
      };

    },

    //要求唯一标识，根据id确定index
    resetPropery: function () {

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
      if (this.datamodel.deffTimezone == '0'){
        dateObj = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());	
      }
      this.datamodel.startTime = dateObj;

      this.datamodel.year = dateObj.getFullYear();
      this.datamodel.month = dateObj.getMonth();

      //结束日期
      this.datamodel.endDate = new Date(this.datamodel.year, this.datamodel.month + this.datamodel.displayMonthNum, 0);

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

    //中国操作习惯，月份以1开始
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

    //操作某一日期
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

    itemAction: function (e) {
      var el = $(e.currentTarget);
      if (el.hasClass('cui_cld_daypass')){
      	return;
      }
      var date = el.attr('data-date');
      date = date.split('-');
      if (date.length != 3){
      	return false;
      }

      date = new Date(date[0], date[1], date[2]);

      if (this.onItemClick){
      	this.onItemClick.call(this, date, el, e);
      }
    },

    initElement: function () {
      this.weekDay = this.$('.cui_cldweek');
    },

    initialize: function ($super, opts) {
      $super(opts);
    }

  });

});
