import React, {Component} from 'react';
import {connect} from 'react-redux';
import TopButtonMenu from '../components/TopButtonMenu';
import Icons from './icons'
import {
  gotoAllMyComments,
  gotoAllMyAsks,
  gotoMyPics,
} from '../../../actions';

class TopMenuView extends Component {
  static contextTypes = {
    navigation: React.PropTypes.func
  }

  render() {
    const {
      myAskCount, myPicCount,
      gotoAllMyComments,
      gotoAllMyAsks,
      abtestresult,
      gotoMyPics,
      comment: { hotelId, hotelName, hotelCount:myCommentCount, description, hotelType, orderId,limitIn,limitOut },

    } = this.props;
    var oldVersion= 'A';
    var newVersion='A';
    if(abtestresult['160429_hod_dpjl']){
      oldVersion=abtestresult['160429_hod_dpjl'].result;
    };
    if(abtestresult['160603_hod_dpjl2']){
      newVersion=abtestresult['160603_hod_dpjl2'].result;
    };
    var newVersionRemark='';
    if(newVersion === "B" && limitIn >= 0 && limitIn < 3) {     //从入住，到离店后3天
        newVersionRemark = "3天内点评积分+50，传图还可抽奖！";
    } else if(newVersion === "B") {
        newVersionRemark = "写点评赚积分换免房券！传图还可抽奖！";
    }
    const items = [
      { title: '我的点评', iconImage: Icons.MY_COMMENT, iconColor: '#96d276', notifCount: myCommentCount, action: ()=>gotoAllMyComments(oldVersion,newVersionRemark) },
      { title: '我的问题', iconImage: Icons.MY_ASK, iconColor: '#bca8ff', notifCount: myAskCount, action: gotoAllMyAsks },
      { title: '我的图片', iconImage: Icons.MY_PIC, iconColor: '#ffa8bc', notifCount: myPicCount, showDot: true, action: this.gotoMyPics.bind(this) },
    ];
    return <TopButtonMenu items={items} />;
  }

  gotoMyPics(){

    this.context.navigation().push('/mypicture', { passProps:'test',loadData:()=>this.props.loadData() });
  }
}



const select = state => ({
  comment: state.myhotel.commentBrief,
  myAskCount: state.myhotel.askBrief.questionCount,
  myPicCount: state.myhotel.mypic.count,
  abtestresult:state.abtest,
});

const actions = {
  gotoAllMyComments,
  gotoAllMyAsks,
  gotoMyPics,
}

export default connect(select, actions)(TopMenuView);
