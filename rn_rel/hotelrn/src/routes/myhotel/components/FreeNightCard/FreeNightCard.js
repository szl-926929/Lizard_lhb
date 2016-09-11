import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PixelRatio,
  Platform
} from 'react-native';

import SimpleListItem from '../../../common/components/ui/SimpleListItem'
import Arrow from '../../../common/components/ui/Arrow'
import HorizonSep from '../../../common/components/ui/HorizonSep'
import FreeNightItem from './FreeNightItem'

const {hotelgift:hotel_gift,sendroom_market} = require('./icons');
class FreeNightItemGroup extends Component{
  renderItem(num,row){
    let itemIndex = num % 10;
    let items=[];
    for(let i=0;i<5;i++){
      if((i+((row-1)*5))>=itemIndex){
        items.push(<FreeNightItem key={'FreeNightItem_'+row+i} style={defaultStyle.sr_star_item} styleBox={defaultStyle.sr_star_itembox} type={1} />);
      }else{
        items.push(<FreeNightItem key={'FreeNightItem_'+row+i} style={defaultStyle.sr_star_item} styleBox={[defaultStyle.sr_star_itembox,defaultStyle.sr_star_itemboxCur]} type={2} />)
      }
    }
    return items
  }
  render(){
    const {canum} = this.props;
    return(
      <View style={[defaultStyle.sr_star]}>
        <View style={{flexDirection:'row'}}>
          {this.renderItem(canum,1)}
        </View>
        <View style={{flexDirection:'row'}}>
          {this.renderItem(canum,2)}
        </View>
      </View>
    )
  }

}

class FreeNightItemList extends Component{
  render(){
    const {
      nights,
    } = this.props;
    var listitems=[];
    if(nights){
      for(let i=0;i<nights.length;i++){

        let item=nights[i];

        if(item.status==1){
          listitems.push(
            <View key={"FreeNightListItem_"+i}>
            <HorizonSep/>
            <View style={defaultStyle.freenightlistItem}>
              <Text style={{flex:1}}>可抵扣<Text style={{fontSize:14,color:'#ff9a14'}}> ¥{item.amount} </Text>
              <Text style={{color:'#808080'}}>有效期至{item.expdate}(可使用)</Text>
              </Text>
            </View>
            </View>
          );
        }else{
          listitems.push(
            <View key={"FreeNightListItem_"+i}>
            <HorizonSep/>
            <View style={defaultStyle.freenightlistItem}>
              <Text style={{flex:1,color:'#b2b2b2'}}>可抵扣<Text style={{fontSize:14,color:'#ff9a14'}}> ¥{item.amount} </Text>
              有效期至{item.expdate}({item.status==3?"已过期":"已使用"})
              </Text>
            </View>
            </View>
          );
        }

      }
    }else{
      return null;
    }
    return <View>{listitems}</View>;
  }
}

export default class FreeNightCard extends Component {
  render() {
    const {
      onRewardDetail,
      freenight,
    } = this.props;

    const {canum,anum,ncount,crnum} = freenight
    if(crnum || crnum==0){
      return(
        <View>
          <HorizonSep/>
          <View style={[defaultStyle.container]}>
              <View><Text style={defaultStyle.text}>携程酒店满10送1</Text></View>
              <View style={{flex:1,paddingTop:5}}><Image style={[{height:40,width:54}]} source={sendroom_market} resizeMode='contain' /></View>
              <TouchableOpacity onPress={onRewardDetail}>
                <View style={defaultStyle.hotel_arr_spec}><Text style={defaultStyle.hotel_arr_spec_text}>详细规则</Text></View>
              </TouchableOpacity>
          </View>
          <HorizonSep/>
            <View style={defaultStyle.freenightcard}>
              <View style={defaultStyle.sendroom}>
                <FreeNightItemGroup {...freenight}/>
                <View style={defaultStyle.sr_middle}>
                  <Text style={{fontSize:14}}>=</Text>
                </View>
                <View style={[defaultStyle.sr_end,defaultStyle.sr_end_cur]}>
                  <View>
                    <FreeNightItem style={{height:30,width:30,marginBottom:6}} styleBox={{alignItems:'center'}} type={2} />
                    <Text style={[defaultStyle.sr_end_text,defaultStyle.sr_end_text_cur]}>免费住一晚</Text>
                  </View>
                </View>
              </View>
              <View style={defaultStyle.sendroom_tips}><Text style={defaultStyle.sendroom_tips_text}>再积累{crnum}晚即可获赠1晚住宿！</Text></View>
              <HorizonSep/>
            </View>
            <View style={{overflow:'hidden'}}>
              <View style={defaultStyle.freenightlist}>
                <View style={defaultStyle.freenightlistItem}>
                  <Image style={[{height:24,width:27}]} source={hotel_gift} resizeMode='contain' />
                  <Text style={{flex:1}}> 您已累积 <Text style={{fontSize:17,color:'#ff6913'}}>{anum}晚</Text>，共获赠{ncount}晚免费住宿</Text>
                </View>
                <FreeNightItemList {...freenight}/>
                <HorizonSep/>
                <View style={defaultStyle.freenightlistItem}>
                  <Text style={{flex:1,color:'#808080'}}>可抵扣金额为相关的10晚房价动态算出</Text>
                </View>
              </View>
              <View style={defaultStyle.freenightlistShadow}></View>
          </View>
        </View>
      )
    }else{
      return null;
    }

  }
}
var {height, width} = Dimensions.get('window');
const defaultStyle = StyleSheet.create({
  container:{
    backgroundColor:"#ff7b56",
    paddingLeft:10,
    paddingRight:10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  text:{
    fontSize:14,
    color:'#fff'
  },
  hotel_arr_spec:{
    height:20,
    borderRadius:10,
    marginRight:7,
    paddingRight:5,
    paddingLeft:5,
    borderColor: '#fff',
    borderWidth:1,
    justifyContent:'center',
  },
  hotel_arr_spec_text:{
    color:'#fff',
    fontSize:12,
  },
  freenightlist:{
    marginRight:8,
    marginLeft:8,
    marginBottom:10,
    shadowColor:'#000',
    shadowOffset:{
      height:2,
      width: 0
    },
    shadowOpacity:0.15,
    shadowRadius:2,
    ...Platform.select({
      android: {
        borderWidth :1,
        borderColor:"#ddd",
        borderTopWidth:0,
      }
    })
  },
  freenightlistItem:{
    paddingRight:10,
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:10,
    flexDirection:'row',
    alignItems:'center'
  },
  freenightlistShadow:{
    position:'absolute',
    top:-20,
    width:width,
    shadowColor:'#000',
    shadowOffset:{
      height:5,
      width: 0
    },
    shadowOpacity:0.15,
    shadowRadius:3,
    height:20,

  },
  freenightcard:{
  },
  sendroom:{
    alignItems:'center',
    flexDirection:'row',
    paddingRight:18,
    paddingLeft:13,
    backgroundColor:'#fff7f5'
  },
  sr_star:{
    flex:1,
    paddingTop:5,
    paddingBottom:5,

  },
  sr_star_item:{
    height:18,
    width:18
  },
  sr_star_itemboxCur:{
    borderColor:'#ff9a14',
    borderStyle:'solid'
  },
  sr_star_itembox:{
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#fff',
    borderColor:'#ddd',
    borderRadius:5,
    borderWidth:1 ,
    height:35,
    flex:1,
    marginTop:5,
    marginRight:5,
    marginBottom:5,
    marginLeft:5,
    borderStyle:'dashed'
  },
  sendroom_tips:{
    backgroundColor:'#fff7f5',
    paddingTop:0,
    paddingBottom:10,
    paddingLeft:18
  },
  sendroom_tips_text:{
    color:'#ff6913',
    fontSize:14,
  },
  sr_middle:{
    paddingRight:15,
    paddingLeft:10,
  },
  sr_end_cur:{
    borderColor:'#ff9a14',
    borderStyle:'solid'
  },
  sr_end:{
    paddingLeft:5,
    paddingRight:5,
    paddingTop:9,
    paddingBottom:9,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#fff',
    borderColor:'#ddd',
    borderStyle:'dashed',
    borderRadius:5,
    borderWidth:1 ,
    width:62,
    height:80,
  },
  sr_end_text_cur:{
    color:'#ff6913',
  },
  sr_end_text:{
    color:'#808080',
    fontSize:10,
  }
})
