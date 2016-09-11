import React, {Component} from 'react';
import {connect} from 'react-redux';
import ToAnswerCard from '../components/ToAnswerCard';

import {
  gotoAskId,
  gotoAllMyAsks,
  gotoAllMyPendingAsks,
} from '../../../actions';

class ToAnwserView extends Component {
  render() {
    const {
      ask: {hotelName, questionCount, askTitle, askId},
      gotoAskId,
      gotoAllMyPendingAsks,
    } = this.props;
    if (!questionCount) {
      return null;
    }
    return <ToAnswerCard
              hotelName={hotelName}
              count={questionCount}
              onTitlePress={gotoAllMyPendingAsks}
              onButtonPress={gotoAskId.bind(null, askId)}>{askTitle}</ToAnswerCard>;
  }
}

const select = state => ({
  ask: state.myhotel.askBrief
});

const actions = {
  gotoAskId,
  gotoAllMyAsks,
  gotoAllMyPendingAsks
}

export default connect(select, actions)(ToAnwserView);
