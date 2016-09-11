
'use strict';

import React, { Component } from 'react';
import { StyleSheet,
  Text,
  View,
  ListView,
  ScrollView,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  PixelRatio,
  Alert, } from 'react-native';

import {
    User,
    Log,
    fetchSOA2,
    URL,
    PhotoBrowser,
    Toast,
    Bridge,
    Navigation,
    Page,
    Loading
} from '@ctrip/crn'

import api from '../../apis';

//React native call Native
import HotelUtil from "./hotelUtil.js"
import Dimensions from 'Dimensions';
import ImageList from './myhotelImageList';
import styles from './style/styles.js'

var ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2});

var SUCCESS_STATUS= 200;
var requestUrl = 'http://m.ctrip.com/restapi/soa2/10933/hotel/product/picturelist';

var defaultImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA6CAMAAADMWVqUAAAASFBMVEUAAADCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsIqDCANAAAAF3RSTlMAqpc/BPRKiBJYCtNuHWLH6TK5KXvd/EIx6Y0AAAJNSURBVEjHjZbZuqsgDIUVZB4Ugeb93/So7FOUqa4ry8dvwgpJnUZacNg3OBQRXaaXcghuIvoVhFcotPOfkN+h1vojUcmgKT0OFaEtMgonys3Ce7rBKdynqgTdqgQ3Hzhku6WaSwoxMHNIb1MsCH7zgKJ1A6JmXTt4LE3LPXXxB3H2gb4QuzaGvCJTYQkM5RTMmt82+WzcQBt2GEd4RvPwUs+z7fBOKyTFVDuADdmw/cQUFYEF66akcNEyvognmndjrMhcgfw+otKmRn75ifzU0Tyg5qknMwzWxfQIY11M9ZBhk3EYyfTHQKUdi/9PU0+ohD40u+u72Fq2islFEVNXpEWZ7EdHmchpLWcKBA8o3jJ8PqAgp9fYmhYdLo23iijbxfDQ7nAbqXUwXlEOknhtSTZ87l3b3bev5OUCRW0suk63qbRQFxmfBeVmBlC07psUBlyzJYUhd9d8xkL6zZtVkizbdmp71prC0sK2rwnluEuYBdkqgJriE/PPJG2jNS3A+s2q8hKltqWt2TYvUGDuUQAMqGkkzjepCHd5KGFr3EgiWTXLzMMTBbSeNlZ+6ttu71lqiI8S0Gs4s+qrJqd5xeGPoSrDeR6Js9s3yVTLFIflDyyjyemw/LpGnkXlWz4wJwBskXpXJ0OQy7O0Ko6JueXoGVcsEgtLzVGgffBPwtf8Pg1XGIG9o0HdxvUyVVr+zNKJa2hOVCm6pXea45HUlP715crMxFkB7X40NhlJm6znIWbosHOshc6QFNe/qqyaD4BMOo0S8ok7oyXzD1nghsS/IAJTAAAAAElFTkSuQmCC'
var base64IconUU = 'http://pic.c-ctrip.com/h5/hotel/hotel-emotion-icon5.png'
var moreImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowZDQzNTgyNC0wNjg4LTFlNDUtOGNjYy1lYjZiMTMyOGFjODAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzUwNkM2NTgzNjk2MTFFNkIyOERCNTkxQjM3M0U4NDMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzUwNkM2NTczNjk2MTFFNkIyOERCNTkxQjM3M0U4NDMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTgwZDNlOGEtZWU3OS03MDQxLWI4ZDQtODA3MGViYWE1ZmRiIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6NThkN2U1OTMtMTM1NS0xMWU2LThhNDMtZmJjY2I0NzM0ZDM2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Fu8eMQAABB1JREFUeNrMWWtIk2EUPvtm7tqFYOCfFAoEA5sRQuFcBF0g6EpFWNJ+JQVBOByZ9iOyFqONICjsT8bKsqxVQtDlT9NhIKFLSAjqR/4RjMCYulnb1znv9+6i7fY553bgfLx+775znve8533PRYUoivAfNR+CjOTylONzO3I9shFZiVzDZ0eQw8h+5H7kDyjzB2RLLk9sqJAF0OUx4PMM8i5kE8ijAeR3yHdQ/mS2AEtkrMqBz0bkMv7mF0QibyES9sJcyA+iGIZXXX42s99iBIVCCaUqIwhKMwjCbr4gE1ugy+NGkLZs1Ga2oMtzBJ8XkLewvyORlzAX7ISLJ97Lst+1hzuhVN2EYA/wN5+Qr6Ou3sVvscvTic/TbCyKQxCctkJb40fIha66t4Ja50QL1/I3d1FfkzyAAAKyG7mBOfvfPzawHbsFS0mOJ+egZIWDHy7SZUGgkYUAhRSfR8FNQWj24JKDIyKZJBsgwH3bncpSC6kzBi4wZYbWhjeQLyLZgak6pot0Si6V9pDQgXjKtpVWl09wiWTv3gMqzQu+3UeRe1MB/IxcjT5nzcu2ZvZJJ45GkTcl22I7AyeKvmUHF/VJ0k0YJCzzABrYKSIKzrRDoSiu28IxxQC2sAhBl3DbSV/BAJJuwiBFq5ZEgFJcDc04odAUx2CKHpJqdjhEcRyshzdAMZDz+TeMNOvosAgx64niaygWimMxCTyfwyQg7CsagHEs9QSwStr72bGiARjHUkX5YAUb/pwYzyJlMuONb+dCWjHl8uY8l4wIi24VjSoIoJ69/P4lkBGgWvsglrBK4/Kc55IRYamopJFekOm8kaTjXOYykMDTHYD1G/UZfz0XpMRygrE0zn0uGcWxBOgeHGbV2PTvWrh0yl8Uh+TKfSP64BBVh2TBr+xlqbqyaE6xSlPFR2MCr1sxEysxFw1AQVnHR/0CK6pZ0FPsLRqAcSwDAk8QB1nso4qr0EQYpDg8SNiEhKof915rLbz/xTAMJKb8Bp7ul8Hs9I6C5YRkPY3ey68kSvsnoxakXkkXv+k7CmY9tc6eUPZOpiuazmONcHuZi6azWDTdTFc0MSNLLSWsrqiXslxEuqSKLo4hBcAe1iuh+lStfQSX7+X/8iYdpEuqialP05Ops0Cxsht5Naxc482rJUk26SBdpHNhEylNb8bCrbkWV9fH/CMfPkeySYekyyK/Pzi//ebDK8gG7Y1DOQHrcNeCRufAy7gum/Zb+nxQ+vA4O1kkUKv3wY1njxcVcegb+pZkSOBGmewk25q9BeevysnbZAZu0XHkPixw/BAKYpomhmPpGqVLoFCCSk0tYGoH7+PhK3rnUgs4ddTKoYlOaXszL1W3ybThIA9fLpQ/kfaXWXRYs6EaDnQzpP83xDAHNrIYJf8EGAAoGbQJVAWOYAAAAABJRU5ErkJggg=='
export default class detail extends Component {
    /*
    *初始化数据
    */
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isNext: false,
      isMore: true,
      //创建数据源
      dataSource: ds,
      isShowToTop: false,
      isError: false,
      isLogin: false,
      isFetching: true,
      MessageList: []

    }
    this.idx = 1;
      }

  /*
   *准备加载组建
   */
  componentDidMount() {
    var self = this;
    self.getLoginStatus();
  }

  componentWillMount(){
    const InlandPageId = '600002283';
    const OverseaPageId = '600002284';
    const urlQuery = this.props.app && this.props.app.props && this.props.app.props.urlQuery;
    const isOversea = urlQuery && urlQuery.isoversea == '1';
    this.pageId = isOversea ? OverseaPageId : InlandPageId;
  }


  getLoginStatus() {
    var self = this;
    User.getUserInfo(function userLoginAction(status, userinfo) {
      if (userinfo && userinfo.data && userinfo.data.Auth) {
        self.setState({
          isLogin: true,
        })
        self.Auth = userinfo.data.Auth;
        self.fetchData();
      } else {
        self.setState({
          isLogin: false,
          isLoading: true,
        })
      }
    });

  }

userLoginWithCallBack(){
  var self = this;
        User.userLogin(function userLoginAction(status) {
            //获取登陆态信息
            self.props.loadData();
            self.getLoginStatus();
                //设置loading

        });
}

  fetchData() {

    //TODO 若无网络，则Alert 暂无网络信息提示
    var self = this;

    function _successCallback(responseJsonText) {
      var responseData = responseJsonText;
      var result = responseData.rc;
      var totalCount = responseData.htc;
      var resultMessage = responseData.rmsg;
      //ACK = 0 success 1 :fail
      var respnseStatusACK = responseData.ResponseStatus.Ack;
      //TODO ???
      if ( result === SUCCESS_STATUS) {
        // 成功返回的酒店数据
        var hotels = responseData.hotels;
        var hotelName = "";
        for (var index = 0; index < hotels.length; index++) {
          var myHotelInfo = hotels[index];
          var hotelInfo = myHotelInfo.htl;
          var myImages = myHotelInfo.himglist;
          hotelName += hotelInfo.hname + "type : " + hotelInfo.htype;
        }
        var data = self.state.MessageList.concat(hotels);
        self.setState({
          dataSource: self.state.dataSource.cloneWithRows(data),
          MessageList: data,
          isLoading: true,
          isFetching: false,
        })
        self.state.isMore = totalCount > self.state.MessageList.length;
      } else {
        //TODO 响应成功，但是有其他的错误 错误信息，并展示刷新
        self.setState({
          isError: true,
          isFetching: false,

        })
      }

    };

    function _errCallback(err) {
      self.setState({
        isError: true,
        isFetching: false,

      })
    };

     api.getPictureList({
     "bitmap":2,
     "sort":{
        "idx":self.idx,
        "size":10
    },
    "alliance":{
        "ishybrid":0
    },
    'hid':null,
     })
       .then((res) => {
        _successCallback(res)
            })
       .catch((error) => {
         _errCallback(error)
       });
  }
      /*
    *渲染头部和content内容
    */
    render() {

        //判断是否有数据，渲染不一样的content
        var content = this.renderDetailList();
        return (
          <Page pageId={this.pageId} ref="page">
           <View style = {{flex:1 ,backgroundColor:'#efefef',}}>
           {content}
            </View>
            </Page>

        )

    }

    /*
    *渲染listview数据
    */
    renderDetailList(){

        var self = this;
        //未登录
       if (!this.state.isLogin){
                return(
                    <View style={styles.loginContainer}>
                        <View style = {{alignItems: 'center', justifyContent: 'flex-start',marginLeft:10,}}>
                            <Text style={styles.loginTip}>登录后可查看已上传图片</Text>
                        </View>
                        <TouchableHighlight style={styles.loginTouch} underlayColor='#fd8713' onPress={() => this.userLoginWithCallBack()}>
                            <View style= {styles.loginButton}>
                            <Text style={{alignSelf:'center',justifyContent: 'flex-end',backgroundColor:'#fd8713',color:'#ffffff'}}>登录</Text>
                            </View>
                            </TouchableHighlight>

                    </View>);
        }
         if (this.state.isLogin && !this.state.isFetching && this.state.MessageList.length == 0){
            return(
                <View style={styles.noDataStyle}>
                <Image style={styles.noDataImageStyle}
                       source={{uri:base64IconUU}}>
                </Image>
                    <Text style={styles.noDataMainTipStyle} >您还未上传过图片</Text>
                    <Text style={styles.noDataTipStyle} >您可以在浏览酒店图片时，</Text>
                    <Text style={styles.noDataTipStyle} >点击“上传”来分享您入住时拍摄的图片</Text>

                </View>);
            }

            return (
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderSection.bind(self)}
                    renderFooter={this.refresh.bind(self)}
                    onEndReachedThreshold = {10}
                    onEndReached={this.Refresh.bind(self)}
                    ref="listview"
                    onScroll={(e)=>this.onScroll(e)}
                    style={styles.listView}
                    renderScrollComponent={(props)=>{
                        return <ScrollView style={styles.scrollView}
                                scrollEventThrottle={16}
                                {...props}/>
                    }} />

            );


    }
    refresh(){
        var refresh =  (<View></View>)
        const logo ={uri:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAaBAMAAABfkYHAAAAAJFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACmWAJHAAAADHRSTlMzAC4gJikUBh0MGhA7i3O4AAAA1UlEQVQY0z3PsUoDYQzA8b/f9TuvOEWqR6/LB4KIU+98gSuKs3Zzs5Or1cG1CoJr38C+QekTNkk/mim/kIQEsah/Ca3IAVMgZOyAOQtHY/Xr9LJk3JEU8bvnlFc8whyGXs7e8Hae88K2ZTyK4TA0EMdTbnJYek/pGFt5QntE+3Grx64dQSy2laOqF4p+INQwbNb2RlcgiZORtf1PQVaKpbX1infORjpTx6RoKJqZyEVFRPSer1IuU0eJ1nhe3T38JWbY0vhJgCgKbbn5sUcdMungSjfuASTxHjtAEOWeAAAAAElFTkSuQmCC"}
        if(this.state.isMore){
            refresh =  (<View style={styles.MoreView}>
              <View style={styles.MoreLogoBox}>
                <Image source={logo} style={{height:13,width:12}} resizeMode="contain" />
              </View>
              <Text style = {styles.MoreText}>正在加载中...</Text>
            </View>);
        }
        return refresh;


    }
    Refresh() {
        var self = this;
         if (self.state.isMore) {
          self.idx++;
            self.setState({
                isNext:true,
            })
            self.fetchData();
         }
    }

    renderSection(detail) {
      const width = Dimensions.get('window').width
      const colInRow =  width > 480 ? 3 : 2;
       var imgCotent =  [];
        for (var i = 0; i < detail.himglist.length; i++){
            imgCotent[i] = this.renderImage(detail.himglist,i,detail.htl);
          if (i >= 4){
              imgCotent[i] = <View key = {'key' + i}></View>;
            }
        }

       return (
        <View style = {{marginTop : 10}}>
        <TouchableHighlight onPress={() => this.jumpToHotel(detail.htl)} >
          <View style={[styles.hotel_g_list,styles.hotel_b_border]}>
              <Text style={[styles.hotel_g_text]}>{detail.htl.hname}</Text>
              <View style={styles.arr} />
          </View>
        </TouchableHighlight>

            <View style={styles.imagWrapper}>
            {imgCotent}
                </View>
        </View>
       );
   }
    renderImage(imageList,index,htl){
      var imageurl = imageList[index].siu
      var status = imageList[index].status
      var hotelid = htl.id
      var hotelName = htl.hname
      var pass = status ==2 ?
          <View style={styles.positionBottom}><Text style={styles.bottomText}>审核通过</Text></View>:
          <View></View>
      var img = imageurl.length > 0 ? <Image
               style={styles.image}
              resizeMode={"stretch"}
             source={{uri:imageurl}}
               />: <View style={styles.image}></View>

     const width = Dimensions.get('window').width
     const colInRow =  width > 480 ? 3 : 2;
      var mask =  index == 3
      ? <View style = {styles.mask}>
              <View style = {styles.more}></View>
              <Image
               style={styles.moreImg}
              resizeMode={"stretch"}
             source={{uri:moreImg}}
               />
              <Text style = {styles.maskText}>更多图片</Text>
            </View>
       : <View></View>

          return(
       <View key = {'key' + index}>
      <TouchableHighlight onPress={() => this.jumpToDetail(imageList,index,hotelid,hotelName)} style={styles.Touch} underlayColor='#fff'>
          <View >
          <View style = {styles.defaultMask}>
              <Image
               style={styles.defaultImage}
              resizeMode={"stretch"}
             source={{uri:defaultImg}}
               />
            </View>
            {img}
            {pass}
            {mask}
           </View>
         </TouchableHighlight>
         </View>
       )
    }

  //酒店详情
   jumpToHotel(e){
      HotelUtil.goToHotel(e)
    }

    //大图详情
    jumpToDetail(e,index,hotelid,hotelName){
       const width = Dimensions.get('window').width
       const colInRow =  width > 480 ? 3 : 2;
       const last = 3
       if (index == last) {
        this.jumpToImgList(hotelid,hotelName)
       }
       else{
        HotelUtil.goToImgDetail(e,index)
       }
    }


    //跳转图片列表页
    jumpToImgList(hotelid,hotelName){
         this.props.navigation.push(
            '/mypictureList',
           {passProps:{'id':hotelid,'name':hotelName} }
        );
    }

    onScroll(e){

    }
}
