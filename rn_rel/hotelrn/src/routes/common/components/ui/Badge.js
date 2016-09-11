import React, { Component} from 'react';
import { Platform } from 'react-native';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';

export default class Badge extends Component {
  render() {
    const { content, style, textStyle, dotOnly } = this.props;
    return <View style={[defaultStyle.container, dotOnly && defaultStyle.dotOnly, style]}>
              { dotOnly ? null : <Text style={[defaultStyle.text, textStyle]}>{content}</Text> }
           </View>;
  }
}

const defaultStyle = StyleSheet.create({
  container:{
    backgroundColor:"#ff7d13",
    borderColor: "#fff",
    borderWidth: 1,
    height:16,
    borderRadius:8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 4,
    paddingRight: 4,
  },
  text:{
    color:"#fff",
    fontSize:10,
    ...Platform.select({
      ios: {
        lineHeight:10,
      },
      android: {
        textAlignVertical :"center",
      },
    }),
  },
  dotOnly: {
    height:10,
    width: 10,
    borderRadius:5,
    paddingLeft: 0,
    paddingRight: 0,
  }
})
