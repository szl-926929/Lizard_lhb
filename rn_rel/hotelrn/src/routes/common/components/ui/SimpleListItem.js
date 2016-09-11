import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  PixelRatio
} from 'react-native';

export default class SimpleListItem extends Component {
  render() {
    const { onPress, children, style, textStyle, leftContent, rightContent, beforeTitle, afterTitle } = this.props;

    return <TouchableHighlight onPress={onPress}>
              <View style={[defaultStyle.container, style]}>
                { leftContent }
                <View style={defaultStyle.textContainer}>
                { beforeTitle }
                <Text style={[defaultStyle.text, textStyle]}>{children}</Text>
                { afterTitle }
                </View>
                { rightContent }
              </View>
           </TouchableHighlight>;
  }
}

const defaultStyle = StyleSheet.create({
  container:{
    backgroundColor:"#fff",
    padding:10,
    flexDirection: 'row',
    alignItems:'center'
  },
  text:{
    fontSize:14,
    color:'#333',
  },
  textContainer:{
    flex:1,
    flexDirection: 'row'
  }
})
