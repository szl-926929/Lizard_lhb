import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  PixelRatio
} from 'react-native';

import Arrow from '../../../common/components/ui/Arrow';
const ICON_YOUYOU = require('./youicon.json');

export default class TipBanner extends Component {
  render() {
    const { onPress, children, style, showArrow } = this.props;
    const content = <View style={[defaultStyle.container, style]}>
                        <Image style={[defaultStyle.img]} source={ICON_YOUYOU} resizeMode='stretch' />
                        <Text style={defaultStyle.text}>{children}</Text>
                        {showArrow ? <Arrow style={defaultStyle.arrow} /> : null}
                    </View>;

    if (onPress) {
      return <TouchableOpacity onPress={onPress}>
                {content}
             </TouchableOpacity>;
    }

    return content;
  }

  renderContent() {

  }
}

const defaultStyle = StyleSheet.create({
  container:{
    backgroundColor:"#5dc1f0",
    height: 44,
    padding:10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    overflow: 'hidden',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  img:{
    alignSelf: 'flex-start',
    marginTop: -10,
    marginRight: 5,
    height: 70,
    width: 61,
  },
  text:{
    fontSize:14,
    color:'#fff',
    fontWeight:'bold',
    flex:1
  },
  arrow: {
    borderColor: '#fff',
  }
})
