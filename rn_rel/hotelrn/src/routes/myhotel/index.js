import React, {Component} from 'react';
import {
  Text
} from 'react-native';

import {Page} from '@ctrip/crn'

import MainContainer from './containers';

export default class MyHotel extends Component {
  componentWillMount(){
    const InlandPageId = '600002275';
    const OverseaPageId = '600002276';
    const urlQuery = this.props.app && this.props.app.props && this.props.app.props.urlQuery;
    const isOversea = urlQuery && urlQuery.isoversea == '1';
    this.pageId = isOversea ? OverseaPageId : InlandPageId;
  }
  render() {

    return <Page pageId={this.pageId}><MainContainer/></Page>
  }
}
