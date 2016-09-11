import * as C from '../../constants';
import {log,warn} from '../../libs/log';
import * as User from '../user';
import {HotelURL} from '../../libs/url';

function createDataView(data){
  if (data && data.totalcount) {
      return { count: data.totalcount }
  } else {
      return {};
  }
}

export function fetchMyFavoriteHotels() {
  const payload = {"alliance":{"ishybrid":0}}

  return async (dispatch, getState, {api}) => {
    try{
      log('loading favorite hotel');
      const response = await api.getFavoriteHotels(payload);
      return dispatch({
        type: C.MY_FAVORITE_HOTELS_SUCCESS,
        payload: createDataView(response),
        meta: {
          request: payload,
          response
        },
      })
    } catch (e){
      log('fail to load favorite hotel', e);
    }
  }
}

export function gotoMyFavoriteHotels() {
  return async (dispatch) =>{
    try{
      await dispatch(User.getUserInfo(true));
      HotelURL.openURL('http://m.ctrip.com/webapp/hotel/faketab?tab=0&isfromrn=1');
      return {
        type: C.GOTO_MY_FAVORITE_HOTELS,
      }
    } catch(e){
      warn(e);
    }
  }
}
