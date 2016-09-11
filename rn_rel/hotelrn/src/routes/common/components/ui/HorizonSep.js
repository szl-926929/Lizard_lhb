import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  PixelRatio
} from 'react-native';

export default class HorizonSep extends Component {
  render() {
    const { style } = this.props;
    return <View style={[defaultStyle.sep, style]} />;
  }
}

const defaultStyle = StyleSheet.create({
  sep:{
    height: 1 / PixelRatio.get(),
    backgroundColor: '#ddd',
    flex: 1
  }
})
