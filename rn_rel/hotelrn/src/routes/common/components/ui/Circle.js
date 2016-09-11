import React, { Component } from 'react';
import {
  View,
  StyleSheet
} from 'react-native';

export default class Circle extends Component {
  render() {
    const { radius, children, style } = this.props;
    const circleStyle = {};

    if (radius > 0){
      circleStyle.borderRadius = radius;
      circleStyle.width = circleStyle.height = radius * 2;
    }

    return <View style={[defaultStyle.container, defaultStyle.circle, circleStyle, style]}>
             {children}
           </View>;
  }
}

const defaultStyle = StyleSheet.create({
  container:{
      alignItems:'center',
      justifyContent: 'center',
      overflow:"visible"
  },
  circle:{
    borderRadius: 19,
    width: 38,
    height: 38,
    backgroundColor: '#fff'
  }
})
