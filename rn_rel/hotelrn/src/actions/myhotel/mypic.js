import * as C from '../../constants';
import {log} from '../../libs/log';

function createDataView(data){
  if (data && data.count) {
      return {
        count: data.count
      }
  } else {
      return {};
  }
}

export function fetchPicStatusData() {
  const payload = {"alliance":{"ishybrid":0}}

  return async (dispatch, getState, {api}) => {
    try{
      log('loading pic status');
      const response = await api.getUserPicStatus(payload);
      return dispatch({
        type: C.USER_PIC_STATUS_SUCCESS,
        payload: createDataView(response),
        meta: {
          request: payload,
          response
        },
      })
    } catch (e){
      log('fail to load pic status', e);
    }
  }
}

export function gotoMyPics() {
  alert('goto my pics');
  return {
    type: C.GOTO_MY_PICS,
  }
}
