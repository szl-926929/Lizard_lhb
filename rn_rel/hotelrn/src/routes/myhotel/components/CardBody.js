import React, {Component} from 'react';
import {
  View,
  TouchableHighlight,
  StyleSheet,
  PixelRatio
} from 'react-native';

export default class CardBody extends Component {
  render() {
    const { children, style } = this.props;

    return <View style={[defaultStyle.container, style]}>
             {children}
           </View>;
  }
}

const defaultStyle = StyleSheet.create({
  container:{
    padding:10
  },
})
