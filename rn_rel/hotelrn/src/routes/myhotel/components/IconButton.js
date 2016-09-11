import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  StyleSheet
} from 'react-native';
import Circle from '../../common/components/ui/Circle';
import ImageIcon from '../../common/components/ui/ImageIcon'
import Badge from '../../common/components/ui/Badge'

export default class IconButton extends Component {
  render() {
    const { circleBgColor, radius, imgSource, imgSize, children, badgeContent, badgeDot, onPress, bgColor, style } = this.props;

    return <TouchableHighlight onPress={onPress} underlayColor={bgColor||"#f5f5f5"} style={[defaultStyle.touch, style]}>
            <View style={defaultStyle.container}>
              <View style={defaultStyle.icon}>
                <Circle radius={radius} style={defaultStyle.circle, {backgroundColor:circleBgColor}}>
                  <ImageIcon source={imgSource} size={imgSize}/>
                </Circle>
                { badgeContent ? <Badge style={defaultStyle.badge} content={badgeContent} dotOnly={badgeDot}/> : null }
              </View>
              <Text style={defaultStyle.text}>{children}</Text>
            </View>
          </TouchableHighlight>;
  }
}

const defaultStyle = StyleSheet.create({
  container:{
      flex:1,
      alignItems:'center',
      justifyContent: 'center',
      paddingTop:5,
      paddingBottom:5,
  },
  icon: {
    width: 40,
    marginBottom: 5
  },
  circle:{
  },
  text:{
      fontSize:14,
      color:'#333'
  },
  badge:{
    position:'absolute',
    top: 0,
    left: 28
  },
  touch:{
    paddingTop:3,
    paddingBottom:3,
    flex:1
  }
})
