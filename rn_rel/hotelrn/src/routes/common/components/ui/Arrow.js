import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  PixelRatio
} from 'react-native';

export default class Arrow extends Component {
  render() {
    const { style } = this.props;
    return <View style={[defaultStyle.arrow, style]} />;
  }
}

const defaultStyle = StyleSheet.create({
  arrow:{
    width: 8,
    height:8,
    borderTopWidth: 4 / PixelRatio.get(),
    borderRightWidth: 4 / PixelRatio.get(),
    borderColor: '#ddd',
    transform: [{rotate:'45deg'}]
  }
})
