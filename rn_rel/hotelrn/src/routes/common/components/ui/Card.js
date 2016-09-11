import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  PixelRatio
} from 'react-native';

export default class Card extends Component {
  render() {
    const { children, style } = this.props;

    return <View style={[defaultStyle.container, style]}>
             {children}
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
    marginTop:0,
    elevation: 2,
    //translationZ:20,
  }
})
