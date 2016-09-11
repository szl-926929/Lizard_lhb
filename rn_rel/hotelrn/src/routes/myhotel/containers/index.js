import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
  ScrollView,
  Text,
  View
} from 'react-native';

import {
    User,
    Log,
    fetchSOA2,
    URL,
    PhotoBrowser,
    Toast,
    Bridge,
    Navigation,
    Page,
    Loading
} from '@ctrip/crn'

import TopMenuView from './TopMenuView';
import ToCommentView from './ToCommentView';
import ToAnswerView from './ToAnswerView';
import BottomListView from './BottomListView';
import TipBannerView from './TipBannerView';
import FreeNightView from './FreeNightView';

import {
  getUserInfo,
  getAbTestResult,
  fetchMyFavoriteHotels,
  fetchMyCoupons,
  fetchUsefulCommentCount,
  fetchPicStatusData,
  fetchAskBriefData,
  fetchCommentBriefData,
  fetchMyRewards,
} from '../../../actions'

//import {getUserInfo} from '../../../libs/user';

class MainContainer extends Component {
  render() {
    return <ScrollView style={{backgroundColor:'#f5f5f5'}}>
             <TipBannerView />
             <TopMenuView loadData={()=>this.loadData()} />
             <ToCommentView />
             <ToAnswerView />
             <BottomListView />
             <FreeNightView />
             <View style={{height:33}} />

           </ScrollView>;
  }
  componentWillMount(){
    this.props.getAbTestResult('160429_hod_dpjl');
    this.props.getAbTestResult('160603_hod_dpjl2');
    this.props.getAbTestResult('160603_hod_zssy');
  }
  componentDidMount(){
    this.props.getUserInfo().catch(()=>{});
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.uid && nextProps.uid != this.props.uid){
      this.loadData();
    }
  }

  async loadData() {
    try {
      return await Promise.all([
        this.props.fetchMyFavoriteHotels(),
        this.props.fetchMyCoupons(),
        this.props.fetchUsefulCommentCount(),
        this.props.fetchPicStatusData(),
        this.props.fetchAskBriefData(),
        this.props.fetchCommentBriefData(),
        this.props.fetchMyRewards()
      ])
    } catch(e) {
      console.log(e);
    }
  }
}

const select = (state) => ({
  uid: state.userinfo.data.UserID,
  abtestresult:state.abtest
})

const actions = {
  getUserInfo,
  getAbTestResult,
  fetchMyFavoriteHotels,
  fetchMyCoupons,
  fetchUsefulCommentCount,
  fetchPicStatusData,
  fetchAskBriefData,
  fetchCommentBriefData,
  fetchMyRewards,
}

export default connect(select, actions)(MainContainer);
