import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  PixelRatio
} from 'react-native';

const icons = require('./icons.json');

export default class FreeNightItem extends Component {
  getScurce(type){

    switch (type) {
      case 1:
        return icons.night;
      case 2:
        return icons.nightcolor;
      default:
        return null;
    }
  }
  render(){
    const {size,type,style,styleBox} = this.props;
    return(
      <View style={styleBox}>
        <Image style={[defaultStyle.img, style]} source={this.getScurce(type)} resizeMode='contain' />
      </View>
    );
  }
}
const defaultStyle = StyleSheet.create({
  img: {
    width: 22,
    height: 22
  }
});
