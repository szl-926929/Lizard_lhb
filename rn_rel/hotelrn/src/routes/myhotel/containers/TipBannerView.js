import React, {Component} from 'react';
import {connect} from 'react-redux';
import TipBanner from '../components/TipBanner';

import {
  gotoMyUsefulComment
} from '../../../actions';

class TipBannerView extends Component {
  render() {
    const {
      usefulCount, approvalPicCount,
      gotoMyUsefulComment
    } = this.props;

    if (usefulCount) {
      return <TipBanner showArrow={true} onPress={gotoMyUsefulComment}>{usefulCount}位用户认可了您的点评</TipBanner>;
    }

    if (approvalPicCount) {
      return <TipBanner>您有{approvalPicCount}张图片已通过审核，可以在酒店相册中查看啦</TipBanner>;
    }

    return null;
  }
}

const select = state => ({
  usefulCount: state.myhotel.commentBrief.usefulCount,
  approvalPicCount: state.myhotel.mypic.count,
});

const actions = {
  gotoMyUsefulComment
}

export default connect(select, actions)(TipBannerView);
