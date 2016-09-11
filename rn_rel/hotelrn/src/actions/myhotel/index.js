import * as C from '../../constants';
import {HotelURL} from '../../libs/url';

export * from './mycomment';
export * from './myask';
export * from './mypic';
export * from './myfavorite';
export * from './mycoupon';
export * from './usefulcomment';
export * from './myrewards';

export function gotoMyBrowsedHistory() {

  HotelURL.openURL('ctrip://wireless/hotel_history','浏览历史');

  return {
    type: C.GOTO_MY_BROWSED_HISTORY,
  }
}

export function gotoMyCredit() {
  HotelURL.openURL('http://m.ctrip.com/webapp/tourcredit/index');
  return {
    type: C.GOTO_MY_CREDIT,
  }
}
