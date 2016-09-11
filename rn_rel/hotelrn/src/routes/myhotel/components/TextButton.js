import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  PixelRatio
} from 'react-native';

export default class TextButton extends Component {
  render() {
    const { onPress, children } = this.props;

    return <TouchableHighlight style={defaultStyle.container} underlayColor="#f5f5f5" onPress={onPress}>
              <Text style={defaultStyle.text}>{children}</Text>
           </TouchableHighlight>;
  }
}

const defaultStyle = StyleSheet.create({
  container:{
    borderColor:"#099fde",
    borderWidth:1,
    borderRadius:3,
    overflow:'hidden',
    alignItems:'center',
    justifyContent:'center',
    height:28,
    paddingLeft:15,
    paddingRight:15,
  },
  text:{
    color:"#099fde",
    fontSize:14,
  }
})
