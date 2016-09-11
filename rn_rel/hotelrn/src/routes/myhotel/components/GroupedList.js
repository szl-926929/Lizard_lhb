import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  PixelRatio
} from 'react-native';

import SimpleListItem from '../../common/components/ui/SimpleListItem'
import Arrow from '../../common/components/ui/Arrow'
import Badge from '../../common/components/ui/Badge'
import HorizonSep from '../../common/components/ui/HorizonSep'

export default class GroupedList extends Component {
  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
    this.renderGroup = this.renderGroup.bind(this);
  }
  render() {
    const { children, style, groups } = this.props;

    return <View style={defaultStyle.container}>
             { groups && groups.length ? groups.map(this.renderGroup) : null}
           </View>;
  }

  renderItem(item) {
    const { title, count, badge, action } = item;
    const afterTitle = badge ? <Badge content={badge} style={defaultStyle.newBadge}></Badge> : null;
    return [
      <HorizonSep />,
      <SimpleListItem rightContent={<Arrow />} afterTitle={afterTitle} onPress={action}>
        {count ? `${title} (${count})` : title}<Text> </Text>
      </SimpleListItem>
    ];
  }

  renderGroup(group) {

    if (!group || !group.length) {
      return null;
    }

    return [
      group.map(this.renderItem),
      <HorizonSep style={defaultStyle.groupSeperator} />
    ];
  }
}

const defaultStyle = StyleSheet.create({
  container:{
    //marginTop:10
  },
  groupSeperator:{
    marginBottom:10
  },
  newBadge: {
    width: 35,
    height: 16,
    backgroundColor: '#ff4311',
    borderWidth: 0,
    marginLeft: 5
  }
})
