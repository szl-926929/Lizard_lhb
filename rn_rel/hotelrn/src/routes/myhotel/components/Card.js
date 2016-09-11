import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  PixelRatio
} from 'react-native';

import CardTitle from './CardTitle';
import CardBody from './CardBody';

export default class Card extends Component {
  render() {
    const { onPress, count, titleText, disableArrow, children, style } = this.props;

    return <View style={[defaultStyle.container, style]}>
             <CardTitle count={count} onPress={onPress}>{titleText}</CardTitle>
             <CardBody>{children}</CardBody>
           </View>;
  }
}

const defaultStyle = StyleSheet.create({
  container:{
    shadowColor:'#000',
    shadowOffset:{
      height:2,
      width: 0
    },
    shadowOpacity:0.15,
    shadowRadius:2,
    backgroundColor:'#fff',
    borderRadius:1,
    margin:10,
    marginTop:0
  }
})
