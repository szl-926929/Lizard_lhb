
   var Calendar=React.createClass({
       //一堆日期
        solarHoliday:{
            '0101': '元旦',
            '0214': '情人节',
            '0501': '劳动节',
            '0601': '儿童节',
            '0910': '教师节',
            '1001': '国庆',
            '1225': '圣诞'
        },
        lunarHoliday:{
            '20150219': '初一',
            '20150305': '元宵',
            '20150405': '清明',
            '20150620': '端午',
            '20150927': '中秋',

            '20160208': '初一',
            '20160222': '元宵',
            '20160404': '清明',
            '20160609': '端午',
            '20160809': '七夕',
            '20160915': '中秋',
            '20161009': '重阳',

            '20170128': '初一',
            '20170211': '元宵',
            '20170404': '清明',
            '20170530': '端午',
            '20171004': '中秋',

            '20180216': '初一',
            '20180302': '元宵',
            '20180405': '清明',
            '20180618': '端午',
            '20180924': '中秋'

        },
        rest: {
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
            '20151007': '国庆',

            '20160101': '元旦',
            '20160102': '元旦',
            '20160103': '元旦',

            '20160207': '春节',
            '20160208': '春节',
            '20160209': '春节',
            '20160210': '春节',
            '20160211': '春节',
            '20160212': '春节',
            '20160213': '春节',

            '20160402': '清明',
            '20160403': '清明',
            '20160404': '清明',

            '20160430': '劳动节',
            '20160501': '劳动节',
            '20160502': '劳动节',

            '20160609': '端午',
            '20160610': '端午',
            '20160611': '端午',

            '20160915': '中秋',
            '20160916': '中秋',
            '20160917': '中秋',

            '20161001': '国庆',
            '20161002': '国庆',
            '20161003': '国庆',
            '20161004': '国庆',
            '20161005': '国庆',
            '20161006': '国庆',
            '20161007': '国庆'
        },
        work: {
            '20150104': '元旦_班',
            '20150215': '除夕班',
            '20150228': '春节班',
            '20151010': '国庆_班',

            '20160206': '除夕班',
            '20160214': '春节班',
            '20160612': '端午班',
            '20160918': '中秋班',
            '20161008': '国庆_班',
            '20161009': '国庆_班'
        },
        footDate : {
           '今天': new Date(),
           '元旦': new Date(2016, 0, 1),
           '初一': new Date(2016, 1,8),
           '中秋': new Date(2016, 8, 15)
       },
        //处理日历中的每一个日期单元细节
        dealUnit:function(changedYear, changedMonth,day){
            var dayToShow=day;
            var len = changedMonth.toString().length;
            while(len < 2) {
                changedMonth = "0" + changedMonth;
                len++;
            }

            var len = day.toString().length;
            while(len < 2) {
                day = "0" + day;
                len++;
            }
            var fullNumber=changedYear+""+changedMonth+""+day;
            var Number=changedMonth+""+day;
            var ret=[];
            ret.push(<em>{dayToShow}</em>);
            var now=new Date();
            if((changedYear==now.getFullYear())&&(changedMonth==now.getMonth()+1))
            {
                    if(day==now.getDate()&&(!this.isSolarHoliday(changedMonth,day))&&(!this.isLunarHoliday(changedYear, changedMonth,day)))
                    {
                        ret.push(<i>今天</i>);
                    }
                    if(day==now.getDate()+1&&(!this.isSolarHoliday(changedMonth,day))&&(!this.isLunarHoliday(changedYear, changedMonth,day)))
                    {
                        ret.push(<i>明天</i>);
                    }
                    if(day==now.getDate()+2&&(!this.isSolarHoliday(changedMonth,day))&&(!this.isLunarHoliday(changedYear, changedMonth,day)))
                    {
                        ret.push(<i>后天</i>);
                    }
            }
            if(this.solarHoliday[Number]) ret.push(<i>{this.solarHoliday[Number]}</i>);
            if(this.lunarHoliday[fullNumber]) ret.push(<i>{this.lunarHoliday[fullNumber]}</i>);
            if(this.props.showRestIcon)
            {
                if(this.rest[fullNumber]) ret.push(<i className="icon-calendar-holiday">休</i>);
                if(this.work[fullNumber]) ret.push(<i className="icon-calendar-work">班</i>);
            }
            return ret;
        },
        //判断是否是阳历节日
        isSolarHoliday:function(changedMonth,day){
            var len = changedMonth.toString().length;
            //这两个while分别将月和日期转换成两位数的结构比如2016-01-01
            while(len < 2) {
                changedMonth = "0" + changedMonth;
                len++;
            }
            var len = day.toString().length;
            while(len < 2) {
                day = "0" + day;
                len++;
            }
            var Number=changedMonth+""+day;
            if(this.solarHoliday[Number]) return true;
            else return false;
        },
        //判断是否为阴历节日
        isLunarHoliday:function(changedYear, changedMonth,day){
            var len = changedMonth.toString().length;
            //这两个while分别将月和日期转换成两位数的结构比如2016-01-01
            while(len < 2) {
                changedMonth = "0" + changedMonth;
                len++;
            }
            var len = day.toString().length;
            while(len < 2) {
                day = "0" + day;
                len++;
            }
            var fullNumber=changedYear+""+changedMonth+""+day;
            if(this.lunarHoliday[fullNumber]) return true;
            else return false;
        },
       //判断是否是瑞年
        isLeapYear:function(e){
            if(e instanceof Object)
            {
                e= e.getFullYear()
            }
            return e % 4 === 0 && e % 100 !== 0 || e % 400 === 0 ? !0 : !1;
        },
        getDaysOfMonth:function(e,t){
            if(e instanceof Object)
            {
                t = e.getMonth();
                e = e.getFullYear()
            }
            else t--;
            return [31, this.isLeapYear(e) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][t];
        },
        getBeginDayOfMouth:function(e,t){
            if(e instanceof Object)
            {
                t = e.getMonth();
                e = e.getFullYear()
            }
            else t--;
            var i = new Date(e,t,1);
            return i.getDay();
        },
        //生成周日到周一
        generateWeekDays:function(){
            var i=0;
            var tmpp=[];
            var ret=[];
            var week=["日","一","二","三","四","五","六"];
            for(i=0;i<7;i++)
            {
                tmpp.push(<li>{week[i]}</li>);
            }
            ret.push(<ul className="cui_cldweek">{tmpp}</ul>);
            return ret;
            },
       //MonthClapFn对月份为0(上一年的12月份)的特殊情况作出反应
        MonthClapFn:function(changedYear, changedMonth){
                if(!changedMonth)
                {
                changedYear=changedYear-1;
                changedMonth=12;
                }
            return changedYear+"年"+changedMonth+"月";
            },
       //调用generateDays
        generateUnits:function(){
                var YM=[],everyDay=[];
                var changedYear;
                for(var j = 0; j < this.props.displayMonthNum; j++) {

                var changedMonth = this.props.startTime.getMonth()+1 + j;
                var yyy =  parseInt(( this.props.startTime.getMonth()+1 + j ) / 12);
                if(changedMonth > 11)
                {
                changedMonth = changedMonth - 12 * yyy;
                }
            changedYear = this.props.startTime.getFullYear() + yyy;
            var d = new Date(changedYear, changedMonth-1);
            var days = this.getDaysOfMonth(d);
            var beginWeek = this.getBeginDayOfMouth(d);
            var str_month = this.MonthClapFn(changedYear, changedMonth);
            if(str_month.length > 0 )
            {
                    YM.push(<h1 className="cui_cldmonth">{str_month}</h1>);
            }
            everyDay.push(
                <ul className="cui_cld_daybox" >
                 {this.generateDays(beginWeek,days,changedYear, changedMonth)}
                </ul>);
            }
            return({YM:YM,everyDay:everyDay});
            },
       //生成每一天并调用dealUnit处理细节
        generateDays:function(beginWeek,days,changedYear, changedMonth){
            var tmp=[];
            for(i = 0; i < beginWeek; i++)
            {
              tmp.push(<li className="cui_invalid"></li>);
            }
            for(i = 0; i < days; i++)
          {
            var day = i + 1;
            var dateObj = new Date(changedYear, changedMonth, day);//没用到
            var calendar_time = dateObj.getTime();
            var p=new Date();
            curTime=p.getTime();
            var difftime = calendar_time -curTime;
            var _difftime =  -1 * difftime;
            var diffHour =  parseInt(_difftime / 3600000 * 100) / 100;//data-curtime={diffHour}
                if(!changedMonth)
                {
                    changedYear=changedYear-1;
                    changedMonth=12;
                }
                var tmpchangedMonth=changedMonth-1;
                var x=changedYear+"-"+tmpchangedMonth+"-"+day;
                var y=changedYear+"-"+changedMonth+"-"+day;
                var z="js_calendar_item cui_calendar_item cui_cld_day_havetxt";
                if(this.isSolarHoliday(changedMonth,day))
                {
                    z="js_calendar_item cui_calendar_item cui_cld_day_havetxt cui_cld_day_hint";
                }
                if(this.isLunarHoliday(changedYear,changedMonth,day))
                {
                    z="js_calendar_item cui_calendar_item cui_cld_day_havetxt cui_cld_day_hint";
                }
                var a=new Date(changedYear,changedMonth-1,day);
                var b=new Date();
                if((a.getTime()-b.getTime())<0)
                {
                    if((a.getFullYear()-b.getFullYear()==0)&&(a.getMonth()-b.getMonth()==0)&&(a.getDate()-b.getDate()==0)){}
                    else
                     {
                         z=z+" cui_cld_invalid cui_cld_daypass js_invalid";
                     }

                }
                //已经过完的天数不绑定事件
                if(z.indexOf("daypass")>=0)
                {
                    tmp.push(
                        <li
                        data-curtime={diffHour}
                        className={z}
                        data-cndate={y}
                        data-date={x}
                        ref={y}
                        id={y}>
                            {this.dealUnit(changedYear, changedMonth,day)}
                        </li>);
                }
                else
                {
                    tmp.push(
                        <li
                        data-curtime={diffHour}
                        className={z}
                        data-cndate={y}
                        data-date={x}
                        ref={y}
                        id={y}
                        onClick={this.handleDay.bind(this,y,this.props.onItemClick)}>
                            {this.dealUnit(changedYear, changedMonth,day)}
                        </li>);
                }
          }
            return tmp;
        },
       //生成底部
       generateFoot:function(){
           var footTmp=[];
           for(i in this.footDate){
               var Y=this.footDate[i].getFullYear();
               var M=this.footDate[i].getMonth()+1;
               var D=this.footDate[i].getDate();
               var str=Y+"-"+M+"-"+D;
               var id="foot"+"-"+str;
               if(i=="今天")
               {
                   footTmp.push(<li className="w_date_nav_click active" ref={i} data-data={str} onClick={this.footClick.bind(this,i,str)}>{i}</li>);
               }
               else
               {
                   footTmp.push(<li className="w_date_nav_click" ref={i} data-data={str} onClick={this.footClick.bind(this,i,str)}>{i}</li>);
               }
           };
           var ret=[];
           ret.push(<ul className="cm-calendar-quick-nav">{footTmp}</ul>);
           return ret;
       },
       //当日期被点击时的回调函数(通过click属性传入)执行
        handleDay:function(selectorDay,callback){
              callback(selectorDay);
        },
        footClick:function(i,str){
            for(p in this.footDate)
            {
                tmp=this.refs[i].getDOMNode();
                tmp2=this.refs[p].getDOMNode()
                if(p==i)
                {
                    tmp.className="w_date_nav_click active";
                    tmp.style["transform"]="scale(0.8, 0.8)";
                    var an=window.setTimeout(function(){tmp.style["transform"]="scale(1, 1)";},200);
                }
                else
                {
                    tmp2.className="w_date_nav_click";
                }
            }
            if(this.refs[str])
            {
                tmp3=this.refs[str].getDOMNode();
                this.refs[str].getDOMNode().style["animation"]="myfirst 0.8s";
                this.refs[str].getDOMNode().style["animation-iteration-count"]="2";
                window.scrollTo(0, parseInt(this.refs[str].getDOMNode().offsetTop) - 80);
                window.setTimeout(function(){tmp3.style["animation"]="";},2000);
            }
        },
        getInitialState:function(){
            var tmp="";
            return ({displayStyle:tmp});
        },
        componentDidMount:function(){
            var style = document.createElement("style");
            var cssString ="*{padding:0;margin:0;}.cui_cldweek {position:fixed;z-index:2;left:0;height:auto;overflow:hidden;font:400 12px/24px verdana;border-bottom:1px solid #c8c8c8;background:#f7f7f7;padding-left:0px;right:0;top:0;}.cui_cldweek li {float:left;width:14%;text-align:center;list-style-type:none}.cui_cldweek li:first-child, .cui_cldweek li:last-child {width:15%;color:#ff902d}.cui_cldmonth {height:40px;text-align:center;font:400 16px/50px verdana;background:#fff}.cui_cldunit{margin-bottom:14px}.cui_cld_daybox{overflow:hidden;background:#fff;padding-left:0px;}.cui_cld_daybox li {float:left;width:14%;height:40px;padding:4px0;font:400 14px/normal verdana;overflow:hidden;text-align:center;position:relative;}.cui_cld_daybox li.cui_cld_day_hint {color:#06a2d0}.cui_cld_daybox li:nth-of-type(7n), .cui_cld_daybox li:nth-of-type(7n+1) {width:15%;color:#ff902d;}.icon-calendar-holiday, .icon-calendar-work {position:absolute;right:0;top:0;border:1px solid #ff902d;line-height:14px;height:16px;width:16px;background:#fff;text-align:center;font-size:12px;-webkit-transform:scale(0.7);-ms-transform:scale(0.7);transform:scale(0.7);-webkit-transform-origin:right top;-ms-transform-origin: right top; transform-origin: right top; box-sizing:border-box;color:#52bce8;border-color:#52bce8;}.cui_cld_dayfuture{background:#fff}.cui_cld_day_nocrtmonth{visibility:hidden}.cui_cld_day_havetxt em, .cui_cld_nopro em, .cui_cld_haspro em, .cui_cld_daycrt em {display:block;line-height:20px;font-size:12px}.cui_cld_day_havetxt i, .cui_cld_nopro i, .cui_cld_haspro i, .cui_cld_daycrt i {display:block;line-height:15px;font-size:11px;font-style:normal;}.cui_cld_daycrt.cui_cld_daycrt_sl em {line-height:inherit}.cui_cld_daybox li.cui_cld_daypass {color:#cfcfcf!important}.cui_cld_daycrt{background:#06a2d0;color:#fff !important}.cm-calendar-ft {border-top:1px solid #dbdbdb; background-color:#efefef;position:fixed;left:0;right:0;bottom:0;padding:5px 0;overflow-x:auto;}.cm-calendar-ft li {display: inline-block; line-height:30px;padding: 0 10px;border-radius:4px;text-align:center;background-color:#ccc;margin:0 5px;} .cm-calendar-quick-nav {white-space:nowrap;margin:0;padding:0;}.cm-calendar {padding-top:0;padding-bottom:70px;background:#fff;}.cm-calendar .cm-calendar-ft li.active {background-color:#099fde;color:#fff;}@keyframes myfirst{ from {background:#fff;} to {background:#099fde;color:white;}}"
            style.setAttribute("type", "text/css");
            var cssText = document.createTextNode(cssString);
            style.appendChild(cssText);
            this.refs["view"].getDOMNode().appendChild(style);
        },
        hide:function(){
           this.setState({displayStyle:"none"});
        },
        render:function(){
                var weekDays=this.generateWeekDays();
                var DDays=this.generateUnits();
                var foot=this.props.showNav?this.generateFoot():[];
                return(
                   <div className="view" ref="view">
                   <div className="cm-calendar" style={{display:this.state.displayStyle}}>
                    {
                        weekDays
                    }
                    <section className="cui_cldunit" style={{marginTop:"30px"}} >
                     {
                        DDays.YM.map(function(value,index){
                            return ([
                                 value,
                                 DDays.everyDay[index]
                                 ]);
                             })
                     }
                    </section>
                    <div className="cm-calendar-ft" >
                    {
                        foot
                        }
                    </div>
                </div>
                </div>
            );
        }
      });
   var props={
            startTime: new Date(),
            displayMonthNum: 5,
            showNav: true,
            showRestIcon:true,
            onItemClick:function(p){console.log(p);}
   };
   var a=React.render(<Calendar {...props} displayMonthNum={10}/>,document.body);