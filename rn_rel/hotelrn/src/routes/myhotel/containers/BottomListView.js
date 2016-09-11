import React, {Component} from 'react';
import {connect} from 'react-redux';
import GroupedList from '../components/GroupedList';
import {Text} from 'react-native'
import {
  gotoMyFavoriteHotels,
  gotoMyBrowsedHistory,
  gotoAllMyCoupons,
  gotoMyCredit,
} from '../../../actions';

class BottomListView extends Component {
  render() {
    const {
      favorite: { count: favCount },
      coupon: { count: couponCount, hasNew },
      uid,
      gotoMyFavoriteHotels,
      gotoMyBrowsedHistory,
      gotoAllMyCoupons,
      gotoMyCredit,
    } = this.props;

    const couponNewBadge = hasNew ? 'new' : null;
    const groups = [
            [
              {title: '酒店收藏', count: favCount, action: gotoMyFavoriteHotels},
              {title: '浏览历史', action: gotoMyBrowsedHistory}
            ],
            [{title: '我的优惠券', count: couponCount, badge: couponNewBadge, action: gotoAllMyCoupons}],

          ];

    uid && groups.push([{title: '我的游信用', action: gotoMyCredit}]);

    return <GroupedList groups={groups}/>;

  }
}

const select = state => ({
  favorite: state.myhotel.myfavorite,
  coupon: state.myhotel.mycoupon,
  uid: state.userinfo.data.UserID
});

const actions = {
  gotoMyFavoriteHotels,
  gotoMyBrowsedHistory,
  gotoAllMyCoupons,
  gotoMyCredit,
}

export default connect(select, actions)(BottomListView);
