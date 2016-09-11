
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


import HotelUtil from "./hotelUtil.js"
import Dimensions from 'Dimensions';
import styles from './style/styles.js'

var ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2  });
var requestUrl = 'http://m.ctrip.com/restapi/soa2/10933/hotel/product/picturelist';
var SUCCESS_STATUS= 200;
var maxPageSize = 50;
var defaultImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA6CAMAAADMWVqUAAAASFBMVEUAAADCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsIqDCANAAAAF3RSTlMAqpc/BPRKiBJYCtNuHWLH6TK5KXvd/EIx6Y0AAAJNSURBVEjHjZbZuqsgDIUVZB4Ugeb93/So7FOUqa4ry8dvwgpJnUZacNg3OBQRXaaXcghuIvoVhFcotPOfkN+h1vojUcmgKT0OFaEtMgonys3Ce7rBKdynqgTdqgQ3Hzhku6WaSwoxMHNIb1MsCH7zgKJ1A6JmXTt4LE3LPXXxB3H2gb4QuzaGvCJTYQkM5RTMmt82+WzcQBt2GEd4RvPwUs+z7fBOKyTFVDuADdmw/cQUFYEF66akcNEyvognmndjrMhcgfw+otKmRn75ifzU0Tyg5qknMwzWxfQIY11M9ZBhk3EYyfTHQKUdi/9PU0+ohD40u+u72Fq2islFEVNXpEWZ7EdHmchpLWcKBA8o3jJ8PqAgp9fYmhYdLo23iijbxfDQ7nAbqXUwXlEOknhtSTZ87l3b3bev5OUCRW0suk63qbRQFxmfBeVmBlC07psUBlyzJYUhd9d8xkL6zZtVkizbdmp71prC0sK2rwnluEuYBdkqgJriE/PPJG2jNS3A+s2q8hKltqWt2TYvUGDuUQAMqGkkzjepCHd5KGFr3EgiWTXLzMMTBbSeNlZ+6ttu71lqiI8S0Gs4s+qrJqd5xeGPoSrDeR6Js9s3yVTLFIflDyyjyemw/LpGnkXlWz4wJwBskXpXJ0OQy7O0Ko6JueXoGVcsEgtLzVGgffBPwtf8Pg1XGIG9o0HdxvUyVVr+zNKJa2hOVCm6pXea45HUlP715crMxFkB7X40NhlJm6znIWbosHOshc6QFNe/qqyaD4BMOo0S8ok7oyXzD1nghsS/IAJTAAAAAElFTkSuQmCC'

export default class imageList extends Component {

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
      MessageList: [],
      isShowToTop: false,
      isError: false,
    }
     this.props.page.title = this.props.passProps.name;


  }

  /*
   *准备加载组建
   */
  componentDidMount() {
    var self = this;
    // 判断是否登陆
    User.userLogin(function userLoginAction(status) {
      //获取登陆态信息
      self.getLoginStatus();
      //设置loading
    });

  }



  getLoginStatus() {
    var self = this;
    //获取登陆信息
    User.getUserInfo(function userLoginAction(status, userinfo) {
      if (userinfo && userinfo.data && userinfo.data.Auth) {
        HotelUtil.getenv(function(env) {
          self.Auth = userinfo.data.Auth;
          self.env = env;
          // 设置请求数据
          self.fetchData();
        })
      } else {}
    });
  }


    fetchData(){

    var self = this;

    function _successCallback(responseJsonText) {
      var responseData = responseJsonText;
      var result = responseData.rc;
      var respnseStatusACK = responseData.ResponseStatus.Ack;

      if (result === SUCCESS_STATUS && responseData && responseData.hotels && responseData.hotels.length > 0) {
        // 成功返回的酒店数据
        //是否有分页数据
        var hotels = responseData.hotels;
        var data = self.state.MessageList.concat(hotels);
        var more = false;
        if (hotels && hotels.length > 0) {
          var himglist = hotels[0].himglist;
          more = himglist.length >= maxPageSize;
        }
        self.setState({
          dataSource: self.state.dataSource.cloneWithRows(data),
          MessageList: data,
          isMore: more
        })
      } else {
        //TODO 响应成功，但是有其他的错误 错误信息，并展示刷新
      }

    };

    function _errCallback(err) {};
    api.getPictureList({
    "bitmap":4,
    "sort":{
       "idx":self.idx,
       "size":maxPageSize
   },
   "alliance":{
       "ishybrid":0
   },
   'hid':self.props.passProps.id,
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
      <Page ref="page">
      < View style = {
      {flex: 1}
    } >{content}
     < /View>
     </Page>

  )
  }

    /*
    *渲染listview数据
    */
    renderDetailList(){
        var self = this;
            return (
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderSection.bind(this)}
                    renderFooter={this.refresh.bind(this)}
                    onEndReachedThreshold = {10}
                    onEndReached={this.Refresh.bind(self)}
                    style={styles.listView}
                    renderScrollComponent={(props)=>{
                        return <ScrollView
                                {...props}/>
                    }
                  }
                  />
            );
    }
    refresh(){

        var refresh =  (<View></View>)
        const logo ={uri:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAaBAMAAABfkYHAAAAAJFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACmWAJHAAAADHRSTlMzAC4gJikUBh0MGhA7i3O4AAAA1UlEQVQY0z3PsUoDYQzA8b/f9TuvOEWqR6/LB4KIU+98gSuKs3Zzs5Or1cG1CoJr38C+QekTNkk/mim/kIQEsah/Ca3IAVMgZOyAOQtHY/Xr9LJk3JEU8bvnlFc8whyGXs7e8Hae88K2ZTyK4TA0EMdTbnJYek/pGFt5QntE+3Grx64dQSy2laOqF4p+INQwbNb2RlcgiZORtf1PQVaKpbX1infORjpTx6RoKJqZyEVFRPSer1IuU0eJ1nhe3T38JWbY0vhJgCgKbbn5sUcdMungSjfuASTxHjtAEOWeAAAAAElFTkSuQmCC"}
        if(this.state.isMore){
            refresh =  (
            <View style={styles.MoreView}>
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
            self.setState({
                isNext:true,
                isLoading:true,
            })}
    }

    renderSection(detail) {

      var imgCotent =  new Array(detail.himglist.length);
      for (var i = 0; i < detail.himglist.length; i++){
            imgCotent[i] = this.renderImage(detail.himglist[i],i);
        }

        return (
        <View>
            <View style={styles.imagWrapper}>
            {imgCotent}
                </View>
        </View>
       );
   }

    renderImage(image,index){
      var imageurl =  image.siu
      var status = image.status
      var pass = status ==2 ?
          <View style={styles.positionBottom}><Text style={styles.bottomText}>审核通过</Text></View>:
          <View></View>
     var img = imageurl.length > 0 ? <Image
               style={styles.image}
              resizeMode={"stretch"}
             source={{uri:imageurl}}
               />: <View style={styles.image}></View>
          return(
       <View key = {'key' + index}>
      <TouchableHighlight onPress={() => this.jumpToDetail(imageurl,index)} style={styles.Touch} underlayColor='#fff'>
          <View >
           <View style = {styles.defaultMask}>
              <Image
               style={styles.defaultImage}
              resizeMode={"contain"}
             source={{uri:defaultImg}}
               />
            </View>
             {img}
            {pass}
           </View>

         </TouchableHighlight>
         </View>
       )
    }



    jumpToDetail(e,index){
      var self = this;
        HotelUtil.goToImgDetail(self.state.MessageList[0].himglist,index)
    }


    onScroll(e) {
           }


}
