import * as C from '../../constants';
import {log} from '../../libs/log';
import {HotelURL} from '../../libs/url';

function createDataView(data){
  //alert(JSON.stringify(data));
  if (data && data.freenight) {
      return data.freenight
  } else {
      return {}
  }
}

export function fetchMyRewards() {
  const payload = {"type":1}
  return async (dispatch, getState, {api}) => {
    try{
      log('loading rewards hotel');
      const response = await api.getUserRewards(payload);
      return dispatch({
        type: C.MY_REWARDS_HOTELS_SUCCESS,
        payload: createDataView(response),
        meta: {
          request: payload,
          response
        },
      })
    } catch (e){
      log('fail to load rewards hotel', e);
    }
  }
}

export function gotoMyRewardsDetail() {
  HotelURL.openURL('http://m.ctrip.com/webapp/hotel/rewardinstruction?isfromrn=1');
  return {
    type: C.GOTO_MY_REWARDSDETAIL_HOTELS,
  }
}
