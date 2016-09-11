import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  PixelRatio,
  Dimensions
} from 'react-native';

import IconButton from './IconButton';
import VerticalSep from '../../common/components/ui/VerticalSep';

export default class TopButtonMenu extends Component {
	render() {
    const { items } = this.props;
		return <View style={[style.flexRow,style.box]}>
              {this.renderItems(items)}
            </View>
	}

  renderItems(items) {
    if (!items || !items.length) {
      return null;
    }

    const result = [];
    for (let i = 0; i<items.length; i++) {
      let item = items[i];
      result.push(<IconButton imgSource={item.iconImage}
                    circleBgColor={item.iconColor}
                    badgeContent={item.notifCount}
                    badgeDot={ !!item.notifCount && item.showDot }
                    onPress={item.action}
                    key={item.title}>{item.title}</IconButton>);
      if (i<items.length-1) {
        result.push(<VerticalSep key={i} style={style.buttonSeprator}/>);
      }
    }

    return result;
  }
}

const style = StyleSheet.create({
    box: {
        borderTopWidth: 1 / PixelRatio.get(),
        borderBottomWidth: 1 / PixelRatio.get(),
        borderColor: '#ddd',
        backgroundColor: '#fff',
        marginTop:10,
        marginBottom:10
    },
    flexCol:{
        flex:1,
        alignItems: 'center',
        paddingTop:5,
        paddingBottom:5
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonSeprator:{
      marginTop: 5,
      marginBottom: 5,
    },
});
