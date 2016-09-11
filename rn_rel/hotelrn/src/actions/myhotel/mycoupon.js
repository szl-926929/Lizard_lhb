import * as C from '../../constants';
import {HotelURL} from '../../libs/url';
import {log,warn} from '../../libs/log';
import * as User from '../user';

function createDataView(data){
  if (data && data.total) {
      return { count: data.total, hasNew:true };
  } else {
      return {};
  }
}

export function fetchMyCoupons() {
  const payload = {"flag":2,"sort":{"idx":1,"size":2,"status":0,"order":0},"alliance":{"ishybrid":0}}
  return async (dispatch, getState, {api}) => {
    try{
      log('loading my coupon brief');
      const response = await api.getHotelUserCoupon(payload);
      return dispatch({
        type: C.MY_COUPON_SUCCESS,
        payload: createDataView(response),
        meta: {
          request: payload,
          response
        },
      })
    } catch (e){
      log('fail to load my coupon brief', e);
    }
  }
}

export function gotoAllMyCoupons() {
  return async (dispatch) =>{
    try{
      await dispatch(User.getUserInfo(true));
      HotelURL.openURL('http://m.ctrip.com/webapp/hotel/faketab?tab=3&isfromrn=1','我的优惠券');
      return {
        type: C.GOTO_MY_COUPON,
      }
    } catch(e){
      warn(e);
    }
  }
}
