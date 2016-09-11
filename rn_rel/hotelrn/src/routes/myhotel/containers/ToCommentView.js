import React, {Component} from 'react';
import {connect} from 'react-redux';
import ToCommentCard from '../components/ToCommentCard';

import {
  gotoCommentId,
  gotoAllMyComments,
  gotoAllMyPendingComments,
  gotoIntegralRule,
} from '../../../actions';

class ToCommentView extends Component {
  render() {
    const {
      comment: { hotelId, hotelName, hotelCount, description, hotelType, orderId,limitIn,limitOut },
      abtestresult,
      gotoCommentId,
      gotoAllMyComments,
      gotoAllMyPendingComments,
    } = this.props;

    if (!hotelCount) {
      return null;
    }
    var [newVersion, oldVersion]= ['A','A'];
    if(abtestresult['160429_hod_dpjl']){
      oldVersion=abtestresult['160429_hod_dpjl'].result;
    };
    if(abtestresult['160603_hod_dpjl2']){
      newVersion=abtestresult['160603_hod_dpjl2'].result;
    };
    //newVersion='B';
    var newVersionRemark='';
    if(newVersion === "B" && limitIn >= 0 && limitIn < 3) {     //从入住，到离店后3天
        newVersionRemark = "3天内点评积分+50，传图还可抽奖！";
    } else if(newVersion === "B") {
        newVersionRemark = "写点评赚积分换免房券！传图还可抽奖！";
    }
    return <ToCommentCard
              hotelName={hotelName}
              count={hotelCount}
              newVersionRemark={newVersionRemark}
              oldVersion={oldVersion}
              newVersion={newVersion}
              onTitlePress={()=>gotoAllMyComments(oldVersion,newVersionRemark)}
              onButtonPress={gotoCommentId.bind(null, orderId, hotelId, hotelName, 600002275)}
              onIntegralRulePress={gotoIntegralRule}
              >{description}</ToCommentCard>;
  }
}
const select = state => ({
  comment: state.myhotel.commentBrief,
  abtestresult:state.abtest
});

const actions = {
  gotoCommentId,
  gotoAllMyComments,
  gotoAllMyPendingComments,
  gotoIntegralRule,
}

export default connect(select, actions)(ToCommentView);
