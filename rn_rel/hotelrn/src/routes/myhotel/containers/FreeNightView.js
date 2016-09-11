import React, {Component} from 'react';
import {connect} from 'react-redux';
import FreeNightCard from '../components/FreeNightCard/FreeNightCard.js';

import {
  //getUserInfo,
  gotoMyRewardsDetail,
  fetchMyRewards,
} from '../../../actions';

class FreeNightView extends Component {
  // componentWillMount() {
  //   //this.props.getUserInfo().catch(()=>{});
  // }
  //
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.uid && nextProps.uid != this.props.uid){
  //     //this.props.fetchMyRewards();
  //   }
  // }
  render() {
    const {
      freenight,
      abtestresult
    } = this.props;

    var newVersion='A';
    if(abtestresult['160603_hod_zssy']){
      newVersion=abtestresult['160603_hod_zssy'].result;
    };
    if(newVersion=='B'){
      return <FreeNightCard onRewardDetail={gotoMyRewardsDetail} freenight={freenight}></FreeNightCard>;
    }else{
      return null;
    }
  }
}

const select = state => ({
  freenight: state.myhotel.myRewards,
  abtestresult:state.abtest,
  //uid: state.userinfo.data.UserID
});

const actions = {
  gotoMyRewardsDetail,
  fetchMyRewards,
  //getUserInfo,
}

export default connect(select, actions)(FreeNightView);
