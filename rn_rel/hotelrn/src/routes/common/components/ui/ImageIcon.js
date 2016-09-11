import React, { Component } from 'react';
import {
  Image,
  StyleSheet
} from 'react-native';

export default class ImageIcon extends Component {
  render() {
    const { source, size } = this.props;
    const style = {};
    if (size) {
      style.width = style.height = size;
    }

    return <Image style={[defaultStyle.img, style]} source={source} resizeMode='contain' />;
  }
}

const defaultStyle = StyleSheet.create({
  img: {
    width: 22,
    height: 22
  }
})
