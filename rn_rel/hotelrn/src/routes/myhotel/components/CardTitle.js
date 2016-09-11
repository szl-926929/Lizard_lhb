import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  PixelRatio
} from 'react-native';

import Arrow from '../../common/components/ui/Arrow';

export default class CardTitle extends Component {
  render() {
    const { onPress, count, children, style } = this.props;
    const countText = count ? `(${count})` : '';

    return <TouchableHighlight onPress={onPress}>
              <View style={[defaultStyle.container, style]}>
                  <Text style={defaultStyle.text}>{children}{countText}</Text>
                  <Text style={defaultStyle.hotel_arr_spec}>全部</Text>
                  <Arrow />
              </View>
           </TouchableHighlight>;
  }
}

const defaultStyle = StyleSheet.create({
  container:{
    backgroundColor:"#fff",
    borderColor: '#ddd',
    padding:10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  text:{
    fontSize:14,
    color:'#333',
    fontWeight:'bold',
    flex:1
  },
  hotel_arr_spec:{
    color:'#099fde',
    fontSize:14,
    paddingRight:5
  }
})
