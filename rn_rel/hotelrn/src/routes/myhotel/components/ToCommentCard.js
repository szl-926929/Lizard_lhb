import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  PixelRatio,
  Platform,
} from 'react-native';

import HorizonSep from '../../common/components/ui/HorizonSep';
import Card from '../../common/components/ui/Card';
import CardTitle from './CardTitle';
import CardBody from './CardBody';
import TextButton from './TextButton';

export default class ToCommentCard extends Component {
  constructor(props) {
    super(props);
    this.renderRemarkOld = this.renderRemarkOld.bind(this);
    this.renderRemarkNew = this.renderRemarkNew.bind(this);
  }

  renderRemarkOld(){
    const { newVersionRemark,oldVersion,newVersion } = this.props;
    if(oldVersion=='B'){
      return(<View><Text style={defaultStyle.lottery}>写点评参与抽奖，1000元免房券等着你！</Text></View>)
    }else{
      return null;
    }
  }
  renderRemarkNew(){
    const { newVersionRemark,oldVersion,newVersion, onIntegralRulePress } = this.props;
    if(newVersion=='B'){
      return(
          <View style={defaultStyle.lotteryBox}>
            <Text style={defaultStyle.lottery}>{newVersionRemark}</Text>
            <TouchableOpacity onPress={()=>onIntegralRulePress(oldVersion)}>
              <View style={defaultStyle.bottomTextContainer}>
                <Text style={defaultStyle.textBlue}>积分规则&nbsp;</Text>
                <Text style={[defaultStyle.textBlue,defaultStyle.fn16]}>ⓘ</Text>
              </View>
            </TouchableOpacity>
          </View>)
    }else{
      return null;
    }
  }
  renderTipImage(){
    const { newVersionRemark,oldVersion,newVersion } = this.props;
    const tipImage ='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAApCAMAAAB0iUvHAAAAqFBMVEUAAAD/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/dgf/////0r3/+PX/i0P/sYn/8er/lVj/n2r/wqT/yrH/gSv/6eD/4tX/qHr/2sn/upfjmQkMAAAAJ3RSTlMABNj58u7lwINRTDkZEQsB9erf0Mi6oY9yaEUvJyCzrqmYeW1hXFbhC5CBAAABSklEQVQ4y43T6Y6CMBSG4U9Hx2X2XWffeywtLYh6/3c2rcZUeoa0b0LCjyenBwJAb34sUg1GUwCTvshqDHyKzKbALJOOAHyJjmrT2heueQfdUCEOgu/7f2pIiSKi+OFu5S6ypawiit+jSBak3chSyjKmmMRWadKVl4xiemjVwq+wJKnW1lZVRPF4GeiCnPWnG0lEyzqizFb+9EKVklOcDITPFjvrWGMMib1Fyw63z04OO7vWjSRNxlTU7Ci3DVFjrSQytdXk0iWneLoSHleafAt/b0wR3gC3PkULb0OIe97/E5ZE26LTKiraFryXa+ErSQlnFafc6qWf3ZrKO+3vNlhtCafcal1zyu2N/7Q2ORRnzkah094ymm/R3fkoSYO9YzRt0xS91yQN9i1Jg30PNGnvGU1bpLv4CDRpH7wcItvOkNdY9HvItRP8Ae14j9rDSH5jAAAAAElFTkSuQmCC';
    if(oldVersion == "B" || newVersion == "B") {
      return (<Image style={[defaultStyle.tip]} source={{uri:tipImage}} resizeMode='stretch' />)
    }else{
      return null;
    }
  }
  render() {
    const { count, hotelName, children, style, onTitlePress, onButtonPress,newVersionRemark,oldVersion,newVersion } = this.props;

    return <Card>
              <CardTitle count={count} onPress={onTitlePress}>待点评</CardTitle>
              <HorizonSep />
              <CardBody>
                <Text style={defaultStyle.primary}>{hotelName}</Text>
                <View style={defaultStyle.buttonTextArea}>
                  <View style={defaultStyle.descriptionBox}><Text style={defaultStyle.description}>{children}</Text></View>
                  <View style={defaultStyle.tipPlane}>
                    <TextButton onPress={onButtonPress}>点评</TextButton>
                    {this.renderTipImage()}
                  </View>
                </View>
                {this.renderRemarkOld()}
                {this.renderRemarkNew()}
              </CardBody>
           </Card>;
  }
}

const defaultStyle = StyleSheet.create({
  primary:{
    color:"#333",
    fontSize:14,
  },
  descriptionBox:{
    flex:1,
    justifyContent:'center',
  },
  description:{
    color:'#666',
    fontSize:12,
    textAlignVertical :"center",
  },
  buttonTextArea:{
    flexDirection: 'row',
    justifyContent:'center',
  },
  lotteryBox:{
    flexDirection:'row',
    paddingTop:5,
    paddingBottom:5,
    alignItems:'center',
  },
  textBlue:{
    color:'#099FDE',
    fontSize:12,
  },
  fn16:{
    fontSize:16,
  },
  lottery:{
    fontSize:12,
    color:'#ff7607',
    flex:1
  },
  tipPlane:{

  },
  tip:{
    position:"absolute",
    right:0,
    top:0,
    height:19,
    width:19
  },
  bottomTextContainer:{
    flexDirection: 'row',
    alignItems: 'center',
  }
})
