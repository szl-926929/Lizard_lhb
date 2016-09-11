import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  PixelRatio
} from 'react-native';

import HorizonSep from '../../common/components/ui/HorizonSep';
import Card from '../../common/components/ui/Card';
import CardTitle from './CardTitle';
import CardBody from './CardBody';
import TextButton from './TextButton';

export default class ToAnswerCard extends Component {
  render() {
    const { count, hotelName, children, style, onTitlePress, onButtonPress } = this.props;

    return <Card>
              <CardTitle count={count} onPress={onTitlePress}>待回答</CardTitle>
              <HorizonSep />
              <CardBody>
                <View style={defaultStyle.primaryBox}><Text style={defaultStyle.primary}>{hotelName}</Text></View>
                <View style={defaultStyle.buttonTextArea}>
                  <View style={defaultStyle.description}>
                  <Text style={[defaultStyle.primarySub, defaultStyle.description]}>{children}</Text>
                  </View>
                  <TextButton onPress={onButtonPress}>回答</TextButton>
                </View>
              </CardBody>
           </Card>;
  }
}

const defaultStyle = StyleSheet.create({
  primaryBox:{
    height:18,
    justifyContent:'center',
  },
  primary:{
    color:"#666",
    fontSize:12,
  },
  primarySub:{
    color:'#333',
    fontSize:14,
    lineHeight:18,
    textAlignVertical: 'center',
  },
  description:{
    flex:1
  },
  buttonTextArea:{
    flexDirection: 'row',
    alignItems: 'flex-start',
  }
})
