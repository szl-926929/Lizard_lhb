import * as C from '../../constants';
import {HotelURL} from '../../libs/url';
import {log,warn} from '../../libs/log';
import * as User from '../user';


function createDataView(data){
  if (data && data.AskList && data.AskList.length) {
      const total = data.AskList.length;
      if (total) {
          const ask = data.AskList && data.AskList[0];
          if (ask) {
              return {
                  hotelName: ask.HotelName,
                  questionCount: total,
                  askTitle: ask.Title,
                  askId: ask.AskId
              }
          }
      }
  } else {
      return {};
  }
}

export function fetchAskBriefData() {
  const payload = {"setInfo":{"cityId":0,"membertype":"","start":1},"alliance":{"ishybrid":0}}

  return async (dispatch, getState, {api}) => {
    try{
      log('loading ask brief');
      const response = await api.getRecommendHotelAskList(payload);
      return dispatch({
        type: C.ASK_BRIEF_SUCCESS,
        payload: createDataView(response),
        meta: {
          request: payload
        },
      })
    } catch (e){
      log('fail to load ask brief', e);
    }
  }
}

export function gotoAskId(id) {
  //alert('goto ask id: ' + id);
  HotelURL.openURL(`http://m.ctrip.com/webapp/you/hotelasks/answer/${id}.html?isfromrn=1`);
  return {
    type: C.GOTO_ASK,
    id: id,
  }
}

export function gotoAllMyAsks() {
  //alert('goto all my ask');
  return async (dispatch) =>{
    try{
      await dispatch(User.getUserInfo(true));
      HotelURL.openURL('http://m.ctrip.com/webapp/you/hotelasks/myasks.html');
      return {
        type: C.GOTO_MY_ALL_ASKS,
      }
    } catch(e){
      warn(e);
    }
  }
}

export function gotoAllMyPendingAsks() {
  HotelURL.openURL('http://m.ctrip.com/webapp/you/hotelasks/myasks.html?tab=3&isfromrn=1');
  return {
    type: C.GOTO_MY_PENDING_ASKS,
  }
}
